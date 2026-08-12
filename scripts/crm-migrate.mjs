#!/usr/bin/env node
/**
 * Apply src/lib/crm/schema.sql to the CRM database.
 *
 *   npm run crm:migrate
 *
 * The schema file is idempotent (everything guards with IF NOT EXISTS), so
 * this is safe to re-run after any schema edit. Reads DATABASE_URL from the
 * environment or .env.local.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { neon } from '@neondatabase/serverless';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env.local reader — this script runs outside Next's env loading.
function loadEnv() {
  const file = join(root, '.env.local');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key]) continue;
    process.env[key] = raw.trim().replace(/^["']|["']$/g, '');
  }
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    'DATABASE_URL is not set.\n\n' +
      'Provision the database first:\n' +
      '  npx vercel integration add neon\n' +
      'then pull the variable it created:\n' +
      '  npx vercel env pull .env.local\n\n' +
      'See docs/13-crm-setup.md.',
  );
  process.exit(1);
}

const schemaPath = join(root, 'src/lib/crm/schema.sql');
const schema = readFileSync(schemaPath, 'utf8');

/**
 * Split on semicolons that end a statement, keeping $$-quoted function bodies
 * intact — the trigger function contains semicolons of its own.
 */
function splitStatements(text) {
  const out = [];
  let buf = '';
  let inDollar = false;

  for (const line of text.split('\n')) {
    // Every `$$` on the line flips in/out of the quoted body.
    const markers = (line.match(/\$\$/g) ?? []).length;
    if (markers % 2 === 1) inDollar = !inDollar;

    buf += line + '\n';

    if (!inDollar && line.trimEnd().endsWith(';')) {
      out.push(buf);
      buf = '';
    }
  }
  if (buf.trim()) out.push(buf);

  // Drop chunks that are only comments or blank lines.
  return out
    .map((s) => s.trim())
    .filter((s) => s && s.split('\n').some((l) => l.trim() && !l.trim().startsWith('--')));
}

const sql = neon(url);
const statements = splitStatements(schema);

console.log(`Applying ${statements.length} statements from src/lib/crm/schema.sql …`);

let applied = 0;
for (const statement of statements) {
  const label = statement.split('\n').find((l) => l.trim() && !l.trim().startsWith('--')) ?? '';
  try {
    await sql.query(statement);
    applied += 1;
    console.log(`  ok  ${label.trim().slice(0, 72)}`);
  } catch (error) {
    console.error(`\nFailed on:\n${statement}\n\n${error.message}`);
    process.exit(1);
  }
}

const [{ n }] = await sql.query('SELECT count(*)::int AS n FROM leads', []);
console.log(`\nDone — ${applied} statements applied. leads table holds ${n} row(s).`);
