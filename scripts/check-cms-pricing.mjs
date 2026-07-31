#!/usr/bin/env node
/**
 * CMS pricing drift check — sibling of the package check-sync.sh scripts.
 *
 * Compares the published `teamBlock` documents in Sanity against the
 * canonical block in business-plan/PRICING.md. Prices live ONLY on
 * teamBlock documents (docs/10-sanity-content-plan.md §5 rule 3); if this
 * fails, either the CMS was edited without a pricing decision or PRICING.md
 * changed without the CMS following.
 *
 * Local-only: PRICING.md lives outside the repo (../business-plan/ relative
 * to the repo checkout), so this cannot run in GitHub CI. Run it after any
 * teamBlock edit and before ending any content session:
 *
 *   npm run check:pricing
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// The repo may be the main checkout (business-plan is ../business-plan from
// the repo root) or a worktree under .claude/worktrees/, so walk upward
// until a sibling business-plan/PRICING.md appears.
let pricingPath = null;
let dir = resolve(here, '..');
for (let i = 0; i < 8; i++) {
  const candidate = resolve(dir, '../business-plan/PRICING.md');
  if (existsSync(candidate)) {
    pricingPath = candidate;
    break;
  }
  dir = resolve(dir, '..');
}
if (!pricingPath) {
  console.error('Cannot locate business-plan/PRICING.md relative to this repo — run on the machine that has the full project tree.');
  process.exit(1);
}

const canonical = {};
const md = readFileSync(pricingPath, 'utf8');
const block = md.split('BEGIN CANONICAL')[1]?.split('END CANONICAL')[0] ?? '';
for (const line of block.split('\n')) {
  const m = line.match(/^\s*([a-z0-9_]+)\s*=\s*(.+?)\s*$/);
  if (m) canonical[m[1]] = m[2];
}
const usd = (v) => Number(String(v).replace(/[$,]/g, ''));

// Stable seeded document IDs → canonical keys.
const mapping = {
  'teamBlock-3wk': { baseFee: 'team_3wk_base', perAthleteRate: 'team_3wk_athlete' },
  'teamBlock-1wk': { baseFee: 'team_1wk_base', perAthleteRate: 'team_1wk_athlete' },
};

const url =
  'https://yvqe54iq.api.sanity.io/v2024-01-01/data/query/production?query=' +
  encodeURIComponent('*[_type == "teamBlock"]{_id, name, baseFee, perAthleteRate}');

const res = await fetch(url, {
  headers: process.env.SANITY_API_READ_TOKEN
    ? { Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}` }
    : {},
});
if (!res.ok) {
  console.error(`Sanity query failed (${res.status}). If the dataset is private, set SANITY_API_READ_TOKEN.`);
  process.exit(1);
}
const { result: docs } = await res.json();

console.log(`Checking published teamBlock documents against ${pricingPath}\n`);
let drift = 0;
let checked = 0;
for (const [id, fields] of Object.entries(mapping)) {
  const doc = (docs ?? []).find((d) => d._id === id);
  if (!doc) {
    console.log(`  DRIFT ${id.padEnd(16)} document missing from the dataset`);
    drift++;
    continue;
  }
  for (const [field, key] of Object.entries(fields)) {
    checked++;
    const want = usd(canonical[key]);
    const got = doc[field];
    if (got === want) {
      console.log(`  ok    ${key.padEnd(20)} $${want.toLocaleString('en-US').padEnd(10)} ${id}.${field}`);
    } else {
      console.log(`  DRIFT ${key.padEnd(20)} canonical $${want.toLocaleString('en-US')} but ${id}.${field} = ${got}`);
      drift++;
    }
  }
}
const extras = (docs ?? []).filter((d) => !mapping[d._id]);
for (const d of extras) {
  console.log(`  WARN  unmapped teamBlock "${d.name}" (${d._id}) carries prices this check does not protect — add it to the mapping`);
}

console.log('');
if (drift) {
  console.log(`SYNC CHECK FAILED — ${checked} figures checked, drift found.`);
  console.log('A price change is a business decision: PRICING.md first, CHANGELOG entry, then the CMS.');
  process.exit(1);
}
console.log(`Sync check passed — ${checked} CMS figures match canonical pricing.`);
