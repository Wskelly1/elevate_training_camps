#!/usr/bin/env node
/**
 * Manual newsletter send — THE way an issue gets emailed to subscribers
 * (owner decision 2026-08-11: manual trigger only; no webhook, no cron,
 * nothing sends on its own — publishing an issue in the Studio only puts
 * it on the site).
 *
 *   npm run newsletter:send -- <slug>
 *   npm run newsletter:send -- <slug> --recipients a@b.com,c@d.com
 *   npm run newsletter:send -- <slug> --base http://localhost:3000 --yes
 *
 * The script is a safety wrapper around POST /api/newsletter/send: it
 * looks the issue up first, shows what is about to happen, and requires
 * you to type the slug back before anything is sent. The endpoint itself
 * pulls the issue body from Sanity and the recipient list from the CRM
 * (leads with newsletter_subscribed = true, archived ones excluded) unless
 * --recipients is given, and refuses to re-send an already-sent issue.
 *
 * Auth: NEWSLETTER_SEND_SECRET, from the environment or .env.local in the
 * repo root. Monthly procedure: docs/04-email-setup.md.
 */

import { createInterface } from 'node:readline/promises';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : undefined;
};
const slug = args.find((a) => !a.startsWith('--') && a !== flag('recipients') && a !== flag('base'));
const recipients = flag('recipients')?.split(',').map((r) => r.trim()).filter(Boolean);
const base = flag('base') ?? 'https://elevatetrainingcamps.com';
const skipConfirm = args.includes('--yes');

if (!slug) {
  console.error('Usage: npm run newsletter:send -- <issue-slug> [--recipients a@b.com,c@d.com] [--base URL] [--yes]');
  process.exit(1);
}

// ——— Secret: env first, then .env.local in the repo root ————————————
let secret = process.env.NEWSLETTER_SEND_SECRET;
if (!secret) {
  try {
    const envFile = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local'), 'utf8');
    secret = envFile.match(/^NEWSLETTER_SEND_SECRET\s*=\s*"?([^"\n]+)"?/m)?.[1];
  } catch {
    // no .env.local — handled below
  }
}
if (!secret) {
  console.error(
    'NEWSLETTER_SEND_SECRET is not set (checked the environment and .env.local).\n' +
      'Generate one and store it in BOTH places:\n' +
      '  openssl rand -hex 32 | vercel env add NEWSLETTER_SEND_SECRET production\n' +
      '  …and add the same value as NEWSLETTER_SEND_SECRET=<value> to .env.local'
  );
  process.exit(1);
}

// ——— Preflight: show what is about to be sent ———————————————————————
const SANITY = 'https://yvqe54iq.api.sanity.io/v2024-01-01/data/query/production?query=';
const groq = `*[_type == "newsletterIssue" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0]{title, issueDate, sentAt}`;
const issue = (await (await fetch(SANITY + encodeURIComponent(groq))).json()).result;

if (!issue) {
  console.error(`No PUBLISHED issue with slug "${slug}". Publish it in the Studio first — drafts are never sent.`);
  process.exit(1);
}
console.log(`Issue:      ${issue.title}`);
console.log(`Month:      ${issue.issueDate ?? '(no issue date)'}`);
console.log(`Sent:       ${issue.sentAt ? `ALREADY SENT ${issue.sentAt}` : 'not yet'}`);
console.log(`Recipients: ${recipients ? `${recipients.length} explicit address(es)` : 'CRM newsletter subscribers'}`);
console.log(`Target:     ${base}/api/newsletter/send\n`);

if (!skipConfirm) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`This EMAILS REAL PEOPLE. Type the slug ("${slug}") to confirm: `);
  rl.close();
  if (answer.trim() !== slug) {
    console.log('Slug mismatch — nothing sent.');
    process.exit(1);
  }
}

// ——— Send ———————————————————————————————————————————————————————————
const res = await fetch(`${base}/api/newsletter/send`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ slug, ...(recipients ? { recipients } : {}) }),
});
const result = await res.json();

console.log(`\nHTTP ${res.status}`);
console.log(JSON.stringify(result, null, 2));
process.exit(res.ok && result.success ? 0 : 1);
