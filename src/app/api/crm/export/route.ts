import { NextResponse } from 'next/server';
import { currentOperator } from '../../../../auth';
import { isCrmConfigured, sql } from '../../../../lib/crm/db';

/**
 * GET /api/crm/export — the whole CRM as JSON.
 *
 * The escape hatch the source tool had, kept deliberately: the data must
 * never be trapped inside this app. Unlike the original, it is behind the
 * same auth as every other CRM surface — an export endpoint is the single
 * most attractive URL here, since one unauthenticated request would hand over
 * every record at once.
 *
 * Note this route lives under /api, which middleware does not match, so the
 * operator check below is the only thing standing in front of it. Do not
 * remove it.
 */
export async function GET() {
  const operator = await currentOperator();
  if (!operator) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 });
  }

  if (!isCrmConfigured()) {
    return NextResponse.json({ error: 'CRM is not configured' }, { status: 503 });
  }

  const db = sql();
  const [leads, notes, touches] = await Promise.all([
    db.query('SELECT * FROM leads ORDER BY created_at', []),
    db.query('SELECT * FROM lead_notes ORDER BY created_at', []),
    db.query('SELECT * FROM lead_touches ORDER BY created_at', []),
  ]);

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(
    JSON.stringify({ version: 1, exported: new Date().toISOString(), leads, notes, touches }, null, 2),
    {
      headers: {
        'content-type': 'application/json',
        'content-disposition': `attachment; filename="elevate-crm-${stamp}.json"`,
        // Never let a proxy or the browser keep a copy of a full PII dump.
        'cache-control': 'no-store, private',
      },
    },
  );
}
