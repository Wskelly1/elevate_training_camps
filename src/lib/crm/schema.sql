-- Elevate CRM — schema
--
-- Applied with `npm run crm:migrate` (scripts/crm-migrate.mjs). Idempotent:
-- safe to re-run. Every statement guards with IF NOT EXISTS so this file is
-- the single description of the shape, not a pile of ordered migrations —
-- appropriate at this size, and revisit if the CRM outgrows it.
--
-- Lives in Neon Postgres, NOT Sanity: the Sanity `production` dataset is
-- aclMode:public and would serve every lead to anyone who asked. See
-- docs/12-crm-plan.md §6.

-- ---------------------------------------------------------------------------
-- leads — one row per person, whatever stage they are at.
--
-- The central idea inherited from the source CRM: a lead and a booked account
-- are the same object at different `status` values, not different tables. Ten
-- screens are ten filters over this one table.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS leads (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),

  -- Identity. email is the dedupe key: a coach who submits the form three
  -- times is one lead with three touches, not three leads.
  first_name         text        NOT NULL DEFAULT '',
  last_name          text        NOT NULL DEFAULT '',
  email              text        NOT NULL,
  phone              text        NOT NULL DEFAULT '',

  -- Who they are. `segment` mirrors src/lib/contact.ts exactly so the form
  -- and the CRM never drift apart.
  segment            text        NOT NULL DEFAULT 'other'
                       CHECK (segment IN ('coach','athlete','partner','local','other')),
  organization       text        NOT NULL DEFAULT '',  -- program, school, club or business
  city               text        NOT NULL DEFAULT '',
  state              text        NOT NULL DEFAULT '',
  website            text        NOT NULL DEFAULT '',

  -- Where they are in the funnel. Mirrors the marketing plan's six waves.
  status             text        NOT NULL DEFAULT 'new'
                       CHECK (status IN ('new','contacted','callback','interested','booked','no_interest')),
  owner              text        NOT NULL DEFAULT '',  -- '' = unassigned; drives My Queue

  -- Segment-specific fields, carried straight off the contact form rather
  -- than flattened into a message blob (which is what the HubSpot leg did).
  squad_size         text        NOT NULL DEFAULT '',  -- coach
  preferred_weeks    text        NOT NULL DEFAULT '',  -- coach
  grad_year          text        NOT NULL DEFAULT '',  -- athlete
  interest           text        NOT NULL DEFAULT '',  -- athlete
  affiliation        text        NOT NULL DEFAULT '',  -- partner
  connection_type    text        NOT NULL DEFAULT '',  -- partner
  business_type      text        NOT NULL DEFAULT '',  -- local
  subject            text        NOT NULL DEFAULT '',  -- other

  -- The alumni asset (docs/01-roadmap.md §5.5). Reserved now on purpose:
  -- the feasibility study is explicit that reconstructing this later is
  -- worthless, so the column exists before there is anything to put in it.
  school             text        NOT NULL DEFAULT '',
  college_destination text       NOT NULL DEFAULT '',

  -- Provenance. Makes the marketing plan's funnel numbers measurable rather
  -- than anecdotal.
  source             text        NOT NULL DEFAULT 'manual'
                       CHECK (source IN ('website_contact','website_newsletter','manual','import')),

  newsletter_subscribed boolean  NOT NULL DEFAULT false,

  -- Clocks. callback_at drives the Callbacks tab; last_checkin_at drives the
  -- 30-day check-in clock; last_contacted_at orders Call Mode.
  callback_at        timestamptz,
  last_contacted_at  timestamptz,
  last_checkin_at    timestamptz,

  archived           boolean     NOT NULL DEFAULT false
);

-- Case-insensitive uniqueness on email — the dedupe guarantee. Partial so
-- archived records never block a genuine re-enquiry.
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_key
  ON leads (lower(email)) WHERE NOT archived;

CREATE INDEX IF NOT EXISTS leads_status_idx      ON leads (status)      WHERE NOT archived;
CREATE INDEX IF NOT EXISTS leads_segment_idx     ON leads (segment)     WHERE NOT archived;
CREATE INDEX IF NOT EXISTS leads_owner_idx       ON leads (owner)       WHERE NOT archived;
CREATE INDEX IF NOT EXISTS leads_state_idx       ON leads (state)       WHERE NOT archived;
CREATE INDEX IF NOT EXISTS leads_callback_idx    ON leads (callback_at) WHERE callback_at IS NOT NULL AND NOT archived;
CREATE INDEX IF NOT EXISTS leads_created_idx     ON leads (created_at DESC);

-- Free-text search across the fields the Leads tab searches on.
CREATE INDEX IF NOT EXISTS leads_search_idx ON leads
  USING gin (to_tsvector('simple',
    first_name || ' ' || last_name || ' ' || email || ' ' ||
    organization || ' ' || city || ' ' || state));

-- ---------------------------------------------------------------------------
-- lead_notes — the dated note thread, with resolve/unresolve.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  author      text NOT NULL DEFAULT '',
  body        text NOT NULL,
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS lead_notes_lead_idx ON lead_notes (lead_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- lead_touches — append-only activity log.
--
-- Separate from notes because these are events, not prose: they answer "what
-- happened and when", which is what the funnel report and the check-in clock
-- are computed from. Never updated, never deleted.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lead_touches (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  actor      text NOT NULL DEFAULT 'system',
  kind       text NOT NULL
               CHECK (kind IN ('form_submission','newsletter_signup','call','checkin',
                               'email','status_change','note','import','manual')),
  outcome    text NOT NULL DEFAULT '',
  detail     text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS lead_touches_lead_idx ON lead_touches (lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lead_touches_kind_idx ON lead_touches (kind, created_at DESC);

-- ---------------------------------------------------------------------------
-- auth_events — who reached the CRM, and who was turned away.
--
-- Required by the PII posture (docs/12-crm-plan.md §6): if minors' records are
-- in here, access to them has to be accountable. Append-only.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS auth_events (
  id         bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  email      text NOT NULL DEFAULT '',
  event      text NOT NULL CHECK (event IN ('signin_success','signin_denied','signout')),
  ip         text NOT NULL DEFAULT '',
  user_agent text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS auth_events_created_idx ON auth_events (created_at DESC);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION crm_touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_touch_updated_at ON leads;
CREATE TRIGGER leads_touch_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();
