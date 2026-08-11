# Elevate CRM — plan

**Status: ACTIVE, started 2026-08-11** (session `b1ad783f`). This document is
the build plan for the in-house CRM. It resolves roadmap item **O-9**
("custom-CRM API/data-model details") and promotes *custom-CRM integration*
out of the roadmap's §7 parking lot into **Phase 9**.

---

## §1 — Why this exists

Three separate things point at the same missing tool.

1. **Nothing is capturing leads right now.** `/api/contact` writes to two
   places: Gmail (works) and HubSpot (401 `INVALID_AUTHENTICATION` since the
   2026-07-30 sweep — see `07-security-log.md`, owner action O-3). Every
   enquiry since then exists only as an email in an inbox. There is no list,
   no status, no follow-up clock.
2. **The marketing plan needs a funnel tool.** `business-plan/` doc 06 commits
   to a **120-coach outreach funnel converging on 3–4 founding teams**, run
   over a six-wave calendar. That is a pipeline with stages, owners, call
   scripts and callback dates — precisely a CRM, and it cannot be run out of
   an inbox.
3. **The alumni database is a hard requirement, not a nicety.** The
   feasibility study calls it *"the only asset here that cannot be purchased
   later at any price"*, worthless if reconstructed retroactively. Roadmap
   §5.5 makes capturing school / graduation year / college destination a
   requirement on the CRM mapping (Gate-1 / O-9), from the first registration
   onward.

## §2 — The source concept

Will supplied a working CRM he already uses: **Blank's Sports Nutrition —
Retailer Pipeline v6.10**, a single 276 KB HTML file (2,087 lines: one
`<style>` block, one `<script>` block, no build step, no dependencies) plus a
JSON export holding **523 contacts**, dated notes, and check-in timestamps.

What it does, and what is worth keeping:

- **Ten tabs over one contact list.** The same records, filtered ten ways for
  ten different jobs. This is the core idea and it is a good one — a lead is
  not a different object from a booked account, only a later state of one.
- **Call Mode.** A single-record-at-a-time queue with disposition buttons
  (interested / callback / no answer / not interested), inline phone and note
  capture, and skip forward/back. It turns "make 120 calls" into a loop you
  can actually sit down and grind.
- **A 30-day check-in clock.** Overdue / due soon / current, with one button
  to reset it. Relationship maintenance that doesn't rely on memory.
- **Dated note threads** per contact, with resolve/unresolve.
- **Paste-to-import** with format auto-detection, and a review table before
  anything is committed.
- **A printable report** view for a PDF pipeline summary.
- **JSON export/import** as the sync-and-backup mechanism.

What must change:

- **Persistence.** It stores everything in `localStorage`, one browser, synced
  by emailing a JSON file to a coworker. That cannot receive a webhook, so it
  structurally cannot satisfy the core requirement here (contact-form
  submissions landing in the CRM automatically). Persistence has to move
  server-side.
- **Auth.** The lock screen checks a password **in client-side JavaScript**.
  Anyone can read it with View Source. See §6.
- **Domain.** Every noun is retail: retailers, store types, licensing codes,
  Shopify starter packs, the Maurten store locator. All of it has an Elevate
  equivalent, but none of it survives literally.
- **Aesthetic.** Black ground, Courier New, 2–3 px letter-spacing, orange
  accents — a terminal. Elevate is cream, Instrument Serif, forest green. See
  §5.

## §3 — Domain mapping

The structure is kept; the content is rebuilt. Column three is the Elevate
meaning, sourced from `business-plan/` rather than invented.

| Source tab | Blank's meaning | Elevate meaning |
|---|---|---|
| **Leads** | 523 run/bike/tri retail stores | **Leads** — the prospect database: high school and club programs, plus parent organisers. Filtered by the five contact segments already defined in `src/lib/contact.ts` (coach · athlete/family · college-pro connect · housing/local partner · other) and by state. The marketing plan's target geography is AZ/NV/NM/CA/W-TX. |
| **Licensed** | retailers with a signed 2026 licence | **Booked teams** — programs with a signed team block: deposit paid, squad size, weeks held. Not "customers"; a booking. |
| **Check-ins** | 30-day retailer check-in clock | **Check-ins** — the same clock, applied to booked teams (pre-arrival logistics) and to warm coach prospects between outreach waves. |
| **My Queue** | leads split by rep (William/JCrow) and store type | **My Queue** — leads split by owner (Will / co-founder) and by segment, so two people can work one list without collision. |
| **Call Mode** | cold-call the retailer queue | **Call Mode** — the single most valuable screen. This is the tool for **O-10** (call 8–10 target coaches, the top unblock on the whole roadmap) and then for the 120-coach funnel. Carries the call script and the validation questions. |
| **Callbacks** | scheduled callbacks | **Callbacks** — unchanged in shape. |
| **Onboarding** | stores ready for Shopify setup | **Onboarding** — teams that said yes and now need booking paperwork: deposit invoice, waivers, roster with grad years, medical minimum, rooming. Gated by Gate-5 (nothing may claim a safety practice that isn't yet true). |
| **Starter Pack** | copy Shopify fields one at a time | **Coach packet** — the same copy-one-field-at-a-time helper, for assembling a quote and trip-planning packet: team base fee, per-athlete rate, squad size, weeks. **Prices render from the canonical source, never typed** (`business-plan/PRICING.md`; the app already enforces this via `npm run check:pricing`). |
| **Outreach** | full pipeline table with status dropdowns | **Pipeline** — the whole funnel in one table: New → Contacted → Callback → Interested → Booked → No interest, mapped onto the marketing plan's six waves. |
| **Settings** | export/import, rep info, add manually | **Settings** — same, plus backup. |

**One addition the source has no equivalent for: Alumni.** Per §1.3 — athlete,
school, graduation year, and later college destination. Deferred to a later
phase, but the data model reserves room for it now, because retrofitting it is
exactly the failure the feasibility study warns about.

## §4 — Hooking the contact form in

The requirement: *anyone submitting a form has their information stored in the
CRM automatically.*

Current flow (`src/app/api/contact/route.ts`): validate → send admin email +
confirmation email via Gmail → create a HubSpot contact → return partial
success if either leg worked.

Target flow adds a third leg, and makes it the authoritative one:

```
POST /api/contact
  ├─► Gmail    (admin notification + sender confirmation)   unchanged
  ├─► CRM      (upsert lead — NEW, authoritative)
  └─► HubSpot  (kept or dropped — see §7 open decision D3)
```

Design rules for the CRM leg:

1. **Upsert on email, never blind-insert.** A coach who fills the form twice
   is one lead with two touches, not two leads. The source CRM has no dedupe
   and it shows.
2. **Every segment field is preserved.** The coach path already captures
   program, state, squad size and preferred weeks — the exact inputs a team
   block quote starts with, deliberately chosen for this reason. They map onto
   CRM fields directly rather than being flattened into a message blob (which
   is what the HubSpot leg currently does).
3. **The form must never fail because the CRM is down.** The CRM write is
   wrapped like the existing legs: failure is recorded in the response
   `results` object and logged, but the visitor still gets a success page and
   the email still goes out.
4. **`/api/newsletter` gets the same treatment**, so subscribers are one
   contact list with the campers and coaches, not a second silo.
5. **Source attribution on every record** — website form vs. manual add vs.
   import — so the marketing plan's funnel numbers are measurable rather than
   anecdotal.

## §5 — Aesthetic translation

The source is a terminal: `#000` ground, Courier New, 8–10 px uppercase labels
at 2–3 px letter-spacing, hairline `#111` borders, orange `#c60` accents.

Elevate is the opposite of that, and the tokens already exist in
`src/app/globals.css` (locked at Checkpoint A1, 2026-07-27):

| Role | Token | Value |
|---|---|---|
| Page ground | `--background` | `#fbf9f3` cream |
| Cards / chrome | `--surface` | `#f0ead6` |
| Hairlines | `--border` | `#d3c7b4` |
| Primary | `--primary` | `#427b4d` Elevate Green |
| Deep ground | `--primary-deep` | `#24422a` |
| Accent | `--accent-rock` | `#b67d5e` Red Rock |
| Accent | `--accent-trail` | `#67563b` Trail Brown |
| Headings | `--font-display` | Instrument Serif (weight 400 only) |
| Body / UI | `--font-sans` | Geist Sans |
| Data / codes | `--font-mono` | Geist Mono |

Translation principles:

- **Keep the density, drop the darkness.** The source's real virtue is that a
  screen shows 30 records without scrolling. That survives; the black ground
  does not. Target feel: a field notebook or a ledger — Tracksmith's editorial
  restraint applied to a data table.
- **Serif headings, sans UI, mono for data.** Tab labels, section headers and
  counts in Instrument Serif; buttons, inputs and body in Geist Sans; phone
  numbers, booking codes and dates in Geist Mono where alignment helps.
- **Status colour is functional, not decorative.** Overdue borrows
  `--destructive`; due-soon `--accent-rock`; current and booked `--primary`.
  Three states, no rainbow.
- **Keep the dark-mode toggle.** The source has one and it earns its place —
  this is a tool someone stares at for an hour making calls. Dark mode uses
  `--primary-deep` as ground rather than pure black.
- **No hardcoded hex.** Phase 2 migrated the site onto the `:root` token
  layer; the CRM ships on tokens from day one.

## §6 — Security constraints

This is the first surface in the project that stores other people's personal
data, including **minors'**. The risk register names this directly — **R16,
data breach of minors' records** — and the mitigation is: minimise what is
collected, encrypt at rest, carry cyber liability.

Three findings that shape the build:

1. **The Sanity `production` dataset is `aclMode: public`** (verified
   2026-08-11 against project `yvqe54iq`). Everything in it is world-readable
   without a token — which is correct for site content and disqualifying for
   lead records. Lead PII must not be written to that dataset. This is why the
   storage question in §7 is a real decision and not a formality.
2. **A client-side password is not authentication.** The source CRM's lock
   screen is defeated by View Source. Replacement: the password is checked
   **server-side**, and success sets a signed, `httpOnly`, `Secure`,
   `SameSite=Lax` session cookie; every CRM route and API endpoint verifies it
   in middleware. Records are never served to an unauthenticated request —
   not even to be hidden by CSS.
3. **The CRM is excluded from indexing** — `robots`, sitemap and nav — the
   same treatment `/style-guide` already gets.

Collection discipline: capture what the funnel and the alumni asset need
(identity, contact route, program, state, squad size, weeks, grad year, later
college destination). Nothing medical, nothing beyond, until a phase actually
requires it.

## §7 — Open decisions

Blocking, in order of consequence. Recorded here so the answer is written down
rather than living in a chat scrollback.

| # | Decision | Options |
|---|---|---|
| **D1** | **Where lead records are stored.** Ruled out: the public Sanity dataset (§6.1) and `localStorage` (§2). | (a) A **second, private Sanity dataset** — no new vendor, no new bill, reuses existing auth and the Studio as a fallback admin UI; but Sanity is a CMS being asked to be a database, and this project has already been billing-blocked once on its free tier. (b) **Postgres** (Vercel/Neon free tier) — the correct tool, private by default, real queries; adds one vendor and one more thing to keep alive. |
| **D2** | **Where the CRM lives.** | (a) A protected route inside this app (`/crm`), deploying with the site — recommended, since the contact-form hook is then in-process. (b) A separate deployment. |
| **D3** | **HubSpot: replace or run alongside?** Its token has been dead since 2026-07-30 (O-3), so today it captures nothing either way. Newsletter recipients are currently read from HubSpot (`newsletter_subscription`), so dropping it means moving that list too. | (a) Replace — CRM becomes the single lead store. (b) Keep both. |
| **D4** | **Import the 523 Blank's contacts?** They are running/bike retail stores — real businesses, wrong industry, and not Elevate's leads. | (a) Skip; seed from the marketing plan's coach target list instead. (b) Import as a separate partner/sponsor list. |

## §8 — Phasing

| Step | Scope | Depends on |
|---|---|---|
| **9.0** | This plan; roadmap activation; O-9 resolved | — |
| **9.1** | Data model + storage layer + server-side auth | D1, D2 |
| **9.2** | Contact-form + newsletter hook (§4), with dedupe and source attribution | 9.1, D3 |
| **9.3** | Core UI: Leads, Pipeline, My Queue on the Elevate token layer | 9.1 |
| **9.4** | Call Mode + Callbacks + dated notes — the O-10 tool | 9.3 |
| **9.5** | Booked teams, Onboarding, Check-in clock, Coach packet | 9.3, Gate-5 |
| **9.6** | Import, export/backup, printable report, Settings | 9.3 |
| **9.7** | Alumni fields (school, grad year, college destination) | Phase 5 registration flow |

**Do not build 9.5's Onboarding copy ahead of Gate-5** — no screen may assert
a safety practice, credential or track record that isn't yet true.

---

*Sources: the supplied `blanks_v6_10.html` and its 2026-08-05 JSON export;
`business-plan/` docs 01 (feasibility), 05 (risk) and 06 (marketing);
`01-roadmap.md` §5.5 and §7; `07-security-log.md`; `src/lib/contact.ts`.*
