/**
 * Elevate CRM — lead repository.
 *
 * Server-only. Every query is parameterised; no value is ever interpolated
 * into SQL text. The only dynamic SQL built here is the WHERE clause in
 * `listLeads`, and it appends placeholders (`$1`, `$2`…) rather than values.
 */

import { sql } from './db';
import type {
  Lead,
  LeadNote,
  LeadSegment,
  LeadSource,
  LeadStatus,
  LeadTouch,
  TouchKind,
} from './types';

/* -------------------------------------------------------------------------
 * Row mapping
 * ---------------------------------------------------------------------- */

type Row = Record<string, unknown>;

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : String(v));
const isoOrNull = (v: unknown): string | null =>
  v === null || v === undefined ? null : iso(v);

function toLead(r: Row): Lead {
  return {
    id: String(r.id),
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
    firstName: String(r.first_name ?? ''),
    lastName: String(r.last_name ?? ''),
    email: String(r.email ?? ''),
    phone: String(r.phone ?? ''),
    segment: String(r.segment ?? 'other') as LeadSegment,
    organization: String(r.organization ?? ''),
    city: String(r.city ?? ''),
    state: String(r.state ?? ''),
    website: String(r.website ?? ''),
    status: String(r.status ?? 'new') as LeadStatus,
    owner: String(r.owner ?? ''),
    squadSize: String(r.squad_size ?? ''),
    preferredWeeks: String(r.preferred_weeks ?? ''),
    gradYear: String(r.grad_year ?? ''),
    interest: String(r.interest ?? ''),
    affiliation: String(r.affiliation ?? ''),
    connectionType: String(r.connection_type ?? ''),
    businessType: String(r.business_type ?? ''),
    subject: String(r.subject ?? ''),
    school: String(r.school ?? ''),
    collegeDestination: String(r.college_destination ?? ''),
    source: String(r.source ?? 'manual') as LeadSource,
    newsletterSubscribed: Boolean(r.newsletter_subscribed),
    callbackAt: isoOrNull(r.callback_at),
    lastContactedAt: isoOrNull(r.last_contacted_at),
    lastCheckinAt: isoOrNull(r.last_checkin_at),
    archived: Boolean(r.archived),
  };
}

function toNote(r: Row): LeadNote {
  return {
    id: String(r.id),
    leadId: String(r.lead_id),
    createdAt: iso(r.created_at),
    author: String(r.author ?? ''),
    body: String(r.body ?? ''),
    resolvedAt: isoOrNull(r.resolved_at),
  };
}

function toTouch(r: Row): LeadTouch {
  return {
    id: String(r.id),
    leadId: String(r.lead_id),
    createdAt: iso(r.created_at),
    actor: String(r.actor ?? ''),
    kind: String(r.kind) as TouchKind,
    outcome: String(r.outcome ?? ''),
    detail: String(r.detail ?? ''),
  };
}

/** Columns a lead is written from — kept in one place so upsert and update agree. */
const WRITABLE = [
  'first_name', 'last_name', 'email', 'phone',
  'segment', 'organization', 'city', 'state', 'website',
  'status', 'owner',
  'squad_size', 'preferred_weeks', 'grad_year', 'interest',
  'affiliation', 'connection_type', 'business_type', 'subject',
  'school', 'college_destination',
  'source', 'newsletter_subscribed',
  'callback_at', 'last_contacted_at', 'last_checkin_at', 'archived',
] as const;

type WritableColumn = (typeof WRITABLE)[number];

/* -------------------------------------------------------------------------
 * Reads
 * ---------------------------------------------------------------------- */

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | 'all';
  segment?: LeadSegment | 'all';
  owner?: string | 'all';
  state?: string | 'all';
  /** Only leads with a callback scheduled. */
  callbacksOnly?: boolean;
  includeArchived?: boolean;
  limit?: number;
  offset?: number;
}

export async function listLeads(f: LeadFilters = {}): Promise<Lead[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => `$${params.push(v)}`;

  if (!f.includeArchived) where.push('NOT archived');
  if (f.status && f.status !== 'all') where.push(`status = ${p(f.status)}`);
  if (f.segment && f.segment !== 'all') where.push(`segment = ${p(f.segment)}`);
  if (f.state && f.state !== 'all') where.push(`state = ${p(f.state)}`);
  if (f.callbacksOnly) where.push('callback_at IS NOT NULL');

  // owner '' is meaningful (unassigned), so only 'all' skips the filter.
  if (f.owner !== undefined && f.owner !== 'all') where.push(`owner = ${p(f.owner)}`);

  if (f.search?.trim()) {
    const q = `%${f.search.trim().toLowerCase()}%`;
    where.push(
      `(lower(first_name) LIKE ${p(q)} OR lower(last_name) LIKE ${p(q)}
        OR lower(email) LIKE ${p(q)} OR lower(organization) LIKE ${p(q)}
        OR lower(city) LIKE ${p(q)} OR lower(phone) LIKE ${p(q)})`,
    );
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const limit = Math.min(f.limit ?? 500, 2000);

  const rows = (await sql().query(
    `SELECT * FROM leads ${clause}
     ORDER BY created_at DESC
     LIMIT ${p(limit)} OFFSET ${p(f.offset ?? 0)}`,
    params,
  )) as Row[];

  return rows.map(toLead);
}

export async function getLead(id: string): Promise<Lead | null> {
  const rows = (await sql().query('SELECT * FROM leads WHERE id = $1', [id])) as Row[];
  return rows[0] ? toLead(rows[0]) : null;
}

export async function findLeadByEmail(email: string): Promise<Lead | null> {
  const rows = (await sql().query(
    'SELECT * FROM leads WHERE lower(email) = lower($1) AND NOT archived',
    [email],
  )) as Row[];
  return rows[0] ? toLead(rows[0]) : null;
}

/** Distinct states present, for the Leads tab filter. */
export async function listStates(): Promise<string[]> {
  const rows = (await sql().query(
    `SELECT DISTINCT state FROM leads WHERE state <> '' AND NOT archived ORDER BY state`,
    [],
  )) as Row[];
  return rows.map((r) => String(r.state));
}

export interface LeadCounts {
  total: number;
  byStatus: Record<LeadStatus, number>;
  callbacks: number;
  unassigned: number;
}

export async function leadCounts(): Promise<LeadCounts> {
  const rows = (await sql().query(
    `SELECT status, count(*)::int AS n,
            count(*) FILTER (WHERE callback_at IS NOT NULL)::int AS cb,
            count(*) FILTER (WHERE owner = '')::int AS un
     FROM leads WHERE NOT archived GROUP BY status`,
    [],
  )) as Row[];

  const byStatus = {
    new: 0, contacted: 0, callback: 0, interested: 0, booked: 0, no_interest: 0,
  } as Record<LeadStatus, number>;

  let total = 0;
  let callbacks = 0;
  let unassigned = 0;

  for (const r of rows) {
    const n = Number(r.n);
    byStatus[String(r.status) as LeadStatus] = n;
    total += n;
    callbacks += Number(r.cb);
    unassigned += Number(r.un);
  }

  return { total, byStatus, callbacks, unassigned };
}

/* -------------------------------------------------------------------------
 * Writes
 * ---------------------------------------------------------------------- */

export type LeadInput = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>> & {
  email: string;
};

/** camelCase field name → column name, for the writable set only. */
const COLUMN_OF: Record<string, WritableColumn> = {
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  phone: 'phone',
  segment: 'segment',
  organization: 'organization',
  city: 'city',
  state: 'state',
  website: 'website',
  status: 'status',
  owner: 'owner',
  squadSize: 'squad_size',
  preferredWeeks: 'preferred_weeks',
  gradYear: 'grad_year',
  interest: 'interest',
  affiliation: 'affiliation',
  connectionType: 'connection_type',
  businessType: 'business_type',
  subject: 'subject',
  school: 'school',
  collegeDestination: 'college_destination',
  source: 'source',
  newsletterSubscribed: 'newsletter_subscribed',
  callbackAt: 'callback_at',
  lastContactedAt: 'last_contacted_at',
  lastCheckinAt: 'last_checkin_at',
  archived: 'archived',
};

/**
 * Insert a lead, or enrich the existing one with the same email.
 *
 * This is what the contact form calls, and the dedupe rule the source CRM
 * lacked: a coach who submits the form three times is one lead with three
 * touches. On conflict, a field is overwritten **only when the incoming value
 * is non-empty and the stored one is empty** — so a second submission can add
 * a phone number it previously omitted, but a blank field can never erase
 * data someone typed into the CRM by hand.
 *
 * Two exceptions, both deliberate:
 *   - `status` and `owner` are never touched by an upsert. Pipeline position
 *     is the operator's judgement, not the form's.
 *   - `newsletter_subscribed` latches true and is never unset here.
 */
export async function upsertLead(input: LeadInput): Promise<Lead> {
  const cols: WritableColumn[] = [];
  const params: unknown[] = [];

  for (const [key, value] of Object.entries(input)) {
    const col = COLUMN_OF[key];
    if (!col || value === undefined) continue;
    // Never let an upsert set pipeline position.
    if (col === 'status' || col === 'owner') continue;
    cols.push(col);
    params.push(value);
  }

  if (!cols.includes('email')) throw new Error('upsertLead requires an email');

  const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

  // COALESCE(NULLIF(existing,''), incoming) keeps whatever is already there
  // and only fills genuine blanks.
  const updates = cols
    .filter((c) => c !== 'email')
    .map((c) =>
      c === 'newsletter_subscribed'
        ? `${c} = leads.${c} OR EXCLUDED.${c}`
        : c === 'callback_at' || c === 'last_contacted_at' || c === 'last_checkin_at'
          ? `${c} = COALESCE(EXCLUDED.${c}, leads.${c})`
          : c === 'archived'
            ? `${c} = leads.${c}`
            : `${c} = CASE WHEN leads.${c} = '' THEN EXCLUDED.${c} ELSE leads.${c} END`,
    );

  const rows = (await sql().query(
    `INSERT INTO leads (${cols.join(', ')}) VALUES (${placeholders})
     ON CONFLICT (lower(email)) WHERE NOT archived
     DO UPDATE SET ${updates.join(', ')}
     RETURNING *`,
    params,
  )) as Row[];

  return toLead(rows[0]);
}

/** Direct field update from the CRM UI. Unlike upsert, this overwrites. */
export async function updateLead(
  id: string,
  patch: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Lead | null> {
  const sets: string[] = [];
  const params: unknown[] = [];

  for (const [key, value] of Object.entries(patch)) {
    const col = COLUMN_OF[key];
    if (!col || value === undefined) continue;
    params.push(value);
    sets.push(`${col} = $${params.length}`);
  }

  if (!sets.length) return getLead(id);

  params.push(id);
  const rows = (await sql().query(
    `UPDATE leads SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params,
  )) as Row[];

  return rows[0] ? toLead(rows[0]) : null;
}

/**
 * Move a lead through the funnel, recording the transition.
 *
 * Status changes go through here rather than `updateLead` so the activity log
 * always has the before/after pair — the funnel report is computed from
 * touches, and a silent status edit would leave a hole in it.
 */
export async function setLeadStatus(
  id: string,
  status: LeadStatus,
  actor: string,
): Promise<Lead | null> {
  const before = await getLead(id);
  if (!before) return null;
  if (before.status === status) return before;

  const after = await updateLead(id, {
    status,
    lastContactedAt: new Date().toISOString(),
    // Leaving the callback state clears any pending callback.
    ...(status !== 'callback' ? { callbackAt: null } : {}),
  });

  await recordTouch(id, {
    kind: 'status_change',
    actor,
    outcome: status,
    detail: `${before.status} → ${status}`,
  });

  return after;
}

/** Reset the 30-day check-in clock. */
export async function markCheckedIn(id: string, actor: string): Promise<Lead | null> {
  const now = new Date().toISOString();
  const lead = await updateLead(id, { lastCheckinAt: now, lastContactedAt: now });
  if (lead) await recordTouch(id, { kind: 'checkin', actor, outcome: 'done' });
  return lead;
}

export async function archiveLead(id: string): Promise<void> {
  await sql().query('UPDATE leads SET archived = true WHERE id = $1', [id]);
}

/* -------------------------------------------------------------------------
 * Notes and touches
 * ---------------------------------------------------------------------- */

export async function listNotes(leadId: string): Promise<LeadNote[]> {
  const rows = (await sql().query(
    'SELECT * FROM lead_notes WHERE lead_id = $1 ORDER BY created_at DESC',
    [leadId],
  )) as Row[];
  return rows.map(toNote);
}

export async function addNote(
  leadId: string,
  body: string,
  author: string,
): Promise<LeadNote> {
  const rows = (await sql().query(
    'INSERT INTO lead_notes (lead_id, body, author) VALUES ($1, $2, $3) RETURNING *',
    [leadId, body, author],
  )) as Row[];
  await recordTouch(leadId, { kind: 'note', actor: author, detail: body.slice(0, 200) });
  return toNote(rows[0]);
}

export async function setNoteResolved(id: string, resolved: boolean): Promise<void> {
  await sql().query('UPDATE lead_notes SET resolved_at = $2 WHERE id = $1', [
    id,
    resolved ? new Date().toISOString() : null,
  ]);
}

export async function deleteNote(id: string): Promise<void> {
  await sql().query('DELETE FROM lead_notes WHERE id = $1', [id]);
}

export async function listTouches(leadId: string, limit = 50): Promise<LeadTouch[]> {
  const rows = (await sql().query(
    'SELECT * FROM lead_touches WHERE lead_id = $1 ORDER BY created_at DESC LIMIT $2',
    [leadId, limit],
  )) as Row[];
  return rows.map(toTouch);
}

export async function recordTouch(
  leadId: string,
  t: { kind: TouchKind; actor?: string; outcome?: string; detail?: string },
): Promise<void> {
  await sql().query(
    `INSERT INTO lead_touches (lead_id, kind, actor, outcome, detail)
     VALUES ($1, $2, $3, $4, $5)`,
    [leadId, t.kind, t.actor ?? 'system', t.outcome ?? '', t.detail ?? ''],
  );
}

/* -------------------------------------------------------------------------
 * Access log
 * ---------------------------------------------------------------------- */

export async function recordAuthEvent(e: {
  email: string;
  event: 'signin_success' | 'signin_denied' | 'signout';
  ip?: string;
  userAgent?: string;
}): Promise<void> {
  await sql().query(
    `INSERT INTO auth_events (email, event, ip, user_agent) VALUES ($1, $2, $3, $4)`,
    [e.email, e.event, e.ip ?? '', e.userAgent ?? ''],
  );
}
