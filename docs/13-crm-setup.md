# CRM setup & operation

The runbook for `/crm`. What it needs to run, how to stand it up, how to get
into it, and what to do when something breaks. The *why* — the domain mapping,
the decisions, the PII posture — is in [`12-crm-plan.md`](12-crm-plan.md).

---

## §1 — What it needs

| Variable | Used by | Required? |
|---|---|---|
| `DATABASE_URL` | every CRM read/write, the contact-form intake, the newsletter recipient list | **Yes.** Without it the CRM shows setup instructions and the contact form silently skips filing (email still sends). |
| `AUTH_SECRET` | signing the session cookie | **Yes.** Sign-in fails without it. |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google Workspace SSO | **Yes.** |
| `CRM_ALLOWED_EMAILS` | who may sign in — comma-separated | **Yes.** An empty list denies everyone, deliberately. |

Nothing else on the site depends on any of these. A deploy missing all four
builds and serves normally; only `/crm` degrades.

## §2 — Standing it up

### 2.1 Provision the database

Neon Postgres, free tier, through the Vercel marketplace. **Do this in the
Vercel dashboard, not the CLI** — `vercel integration add neon` needs an
interactive terminal plus a browser confirmation and fails silently when
scripted.

1. <https://vercel.com/dashboard> → the **elevate-training-camps** project
2. **Storage** tab → **Create Database** → **Neon** (Serverless Postgres)
3. Plan: **Free**. Region: pick the one nearest the project's function region.
4. Connect it to the project when prompted, for **all** environments.

Vercel writes `DATABASE_URL` into the project's environment variables itself.

### 2.2 Pull the variable locally

```bash
npx vercel env pull .env.local
```

### 2.3 Create the tables

```bash
npm run crm:migrate
```

Applies `src/lib/crm/schema.sql`. Every statement guards with `IF NOT EXISTS`,
so it is safe to re-run after any schema edit — that is the intended workflow;
there is no migration-history table.

### 2.4 Google sign-in

Already configured (2026-08-11), recorded here so it can be rebuilt.

At <https://console.cloud.google.com>, **signed in as a Workspace account on
`elevatetrainingcamps.com`** — not a personal Gmail, or the Internal option
below is unavailable:

1. Create a project (`Elevate Training Camps`)
2. **Branding** — app name, support email, developer contact
3. **Audience** → **Internal**. This is the load-bearing setting: Google
   itself then refuses anyone outside the Workspace domain, before the app's
   allowlist is consulted.
4. **Clients** → **Create client** → **Web application**, with these
   authorized redirect URIs and no others:
   ```
   http://localhost:3000/api/auth/callback/google
   https://elevatetrainingcamps.com/api/auth/callback/google
   ```
5. Put the client ID and secret in `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

Default scopes only — do not add anything under **Data Access**. The CRM reads
an email address and nothing else.

### 2.5 Generate the session secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Into `AUTH_SECRET`. Rotating it signs everyone out; nothing else breaks.

### 2.6 Set them in Vercel

`DATABASE_URL` arrives automatically from §2.1. The other three:

```bash
npx vercel env add AUTH_SECRET production
npx vercel env add AUTH_GOOGLE_ID production
npx vercel env add AUTH_GOOGLE_SECRET production
npx vercel env add CRM_ALLOWED_EMAILS production
```

Then redeploy.

## §3 — Using it

Open <https://elevatetrainingcamps.com/crm> and sign in with Google. Sessions
last 12 hours.

| Tab | What it is for |
|---|---|
| **Leads** | The database. Search and filter; filters live in the URL, so a filtered view is a link you can send to your co-founder. |
| **My Queue** | Leads split by owner, so two people never call the same coach. Owners come from the allowlist, so the tab defaults to *your* queue whoever you are. |
| **Call Mode** | One lead at a time with disposition buttons. This is the tool for the O-10 coach calls and then the 120-coach funnel. |
| **Callbacks** | Everyone who asked to be called back, overdue first. |
| **Check-ins** | 30-day cadence over booked teams and interested coaches. |
| **Booked Teams** | Programs that have committed. |
| **Pipeline** | The whole funnel as one table, with the conversion rate. |
| **Settings** | JSON export, manual lead entry, and who can sign in. |

### Granting access — and adding a queue owner

Both are the same action. `CRM_ALLOWED_EMAILS` is the single roster: who can
sign in **and** who can be assigned leads in My Queue. There is deliberately
no second list, because someone who cannot sign in cannot work a queue, and
two lists would only give you a way for them to disagree.

```bash
npx vercel env rm  CRM_ALLOWED_EMAILS production --yes
printf '%s' "william.skelly@elevatetrainingcamps.com,will.sacay@elevatetrainingcamps.com" \
  | npx vercel env add CRM_ALLOWED_EMAILS production
```

Repeat for `preview` and `development`, then redeploy.

Display names are derived from the address — `will.sacay@…` renders as **Will
Sacay** — by splitting the local part on `.`, `_` and `-` and capitalising each
word. Nothing to configure.

Two constraints:

- The address must be a **Workspace account on the domain**. Google blocks
  everyone else before the allowlist is consulted, because the OAuth client is
  an Internal app. To admit an outside address you would have to switch the
  consent screen to External, which removes that outer gate — not recommended
  while the database holds minors' contact details.
- Removing an address takes effect on that person's **next request**, not when
  their session expires: the allowlist is re-checked per request on purpose.

A lead already assigned to someone who has since been removed keeps them, shown
as *"(no longer has access)"* in the owner dropdown, rather than being silently
reassigned. Pick a new owner to move it.

### Where leads come from

- **The contact form** (`/contact`) — automatic, and the point of the whole
  build. Segment, program, state, squad size and preferred weeks all carry
  across as fields rather than being flattened into a message blob.
- **The newsletter signup** — creates or flags a lead with
  `newsletter_subscribed`.
- **Manual entry** — Settings.

Duplicates are prevented on lower(email). A second submission fills blanks
only; it never overwrites something typed by hand, and never changes a lead's
status or owner.

## §4 — When something is wrong

**"The CRM has no database yet"** — `DATABASE_URL` is unset. §2.1–2.2.

**Sign-in bounces back with "not authorised"** — the address is not in
`CRM_ALLOWED_EMAILS`, or the variable is unset entirely (empty list denies
everyone). Check the deploy actually has it.

**`redirect_uri_mismatch` from Google** — the callback URL is not on the
client's authorized list. It must match exactly, including scheme and the
absence of a trailing slash. Preview deploys have their own hostnames and are
not on the list; sign in on localhost or production.

**Contact form works but nothing appears in the CRM** — the intake leg is
best-effort by design. `POST /api/contact` returns a `results.crm` object with
the reason; check the function logs for `[crm] contact intake failed`.

**Did a submission get filed?** The response body carries
`results.crm.success` and, when it worked, `results.crm.leadId`.

## §5 — Backups

Settings → **Export all data** downloads every lead, note and activity entry
as JSON. Same escape hatch the original tool had, so the data is never trapped
in this app.

Neon's free tier keeps its own point-in-time history, but that is a database
feature, not a backup you control. Take a manual export before anything
destructive.

## §6 — What is not built yet

Phase 9.5 and 9.6, per [`12-crm-plan.md`](12-crm-plan.md) §8:

- **Onboarding queue** — deposit, waivers, roster with graduation years,
  rooming. Gated by Gate-5.
- **Coach packet** — copy-one-field-at-a-time quote assembly. Prices must
  render from the canonical tariff, never be typed.
- **Paste-import** — the source tool's format-detecting bulk import.
- **Printable pipeline report.**
- **Alumni fields** — school, graduation year, college destination. The
  columns exist in the schema already, deliberately: the feasibility study is
  explicit that reconstructing this data later is worthless.
