# Elevate Training Camps — Roadmap v2

The working plan for this repo. Owner actions are front-loaded (§0) so engineering
is never stalled waiting on a key, decision, or approval. Engineering phases (§4)
route around whatever is still pending. Maintained by Claude Code sessions;
update it as phases complete rather than letting it rot.

## Current state (as of 2026-08-11)

**Active work: Phase 9 — the CRM** (started 2026-08-11, plan at
[`12-crm-plan.md`](12-crm-plan.md)). Everything below this line was last
revised 2026-08-02 and remains accurate; note only that the HubSpot 401 it
records is now the reason Phase 9 exists, since no lead has reached any CRM
since 2026-07-30.


Live at https://elevatetrainingcamps.com (Vercel, auto-deploy from `main`).
Shipped: site-wide crash fix, SendGrid→Gmail SMTP migration, GA4, CVE-2025-66478
patch, Sanity caching refactor (all pages are cached Server Components), domain
cutover with TLS, brand guide + A1 decisions, `:root` token layer, the
**rebuilt homepage** (A2.5a — scroll-hijack deleted, ambient hero, editorial
layout system, repositioned copy), `/recruiting` (O-16, PRs #15/#17), and the
**rebuilt `/registration`** (2026-07-30 — canonical team-block tariff replaced
the fabricated per-person tiers; `/media` and the About hero de-fabricated the
invented history at the same time). Known-broken: Sanity billing-blocked (quota
overage — billing team contacted), HubSpot token 401s (leads not reaching CRM),
Stripe not yet created.

**The site's positioning changed on 2026-07-29.** The business plan (now at
`../../business-plan/`, restructured and expanded the same day) establishes that
the buyer is a high school cross country *coach*, not an individual athlete;
that the product is a team altitude block sold on a two-part tariff with
lodging deliberately excluded; and that the **college recruiting advisory is
now the principal service line**, with the camp reframed as the funnel rather
than the business. A remote coaching subscription and a paid alumni membership
were both cut, and the 501(c)(3) route was declined.

This invalidates content across Registration, Coaching and FAQ. `/coaching`
was actively selling the cut subscription until O-16 resolved it (repurposed
as `/recruiting` — see §5.5). **Also 2026-07-29: the buyer definition was
widened** — team blocks sell to the coach *or a parent organiser* where the
coach can't travel; parent-led trips are first-class (see
`../../business-plan/CHANGELOG.md`). Read §5.5 before writing any copy, and
`../../business-plan/WEBSITE-SYNC.md` before acting on any business change.

---

## §0 — Owner Action Queue

**Tier 1 — today (long lead times / hard blockers):**

| # | Action | Unblocks |
|---|---|---|
| O-1 | Create Stripe account, start business verification (takes days) | Phase 5 build (test keys) and go-live (live keys) |
| O-2 | ✅ **Resolved 2026-07-30** — the billing block lifted; the CMS has taken schema deploys and content writes continuously since | ~~Gate-1; CMS writes~~ |
| O-3 | ✅ **Closed 2026-08-11 — no longer needed.** HubSpot was removed entirely (CRM decision D3): both form routes and the newsletter recipient query now use the in-house CRM, and `@hubspot/api-client` is gone. The dead token does not need regenerating. Superseded by O-17 | ~~CRM lead capture~~ |
| O-17 | **Provision the CRM database** — Vercel dashboard → project → Storage → Create Database → **Neon**, Free plan, connect to all environments (~3 min). The CLI path (`vercel integration add neon`) needs an interactive terminal and fails silently when scripted. Then `npx vercel env pull .env.local && npm run crm:migrate`. See [`13-crm-setup.md`](13-crm-setup.md) §2 | Phase 9 — until this is done, `/crm` shows setup instructions and contact-form submissions email but are not filed |
| O-4 | Vercel preview access: issue a protection-bypass secret (recommended) or disable deployment protection | Preview rung of the verification ladder (Gate-2) |

**Tier 2 — this week (inputs needed mid-phase):**

| # | Action | Unblocks |
|---|---|---|
| O-5 | Pick from Claude's proposed reference-site menu | Brand-guide layout section (Phase 1) |
| O-6 | **Photo consent** — confirm which of the 195 staged photos are cleared for public use (identifiable people, especially minors, need releases). Hard stop; not defaulted | Phase 3 publishing (Gate-4) |
| O-7 | Legal inputs: business entity name, refund/cancellation policy; lawyer review of waiver language recommended (physical sports business) | Phase 4 → Stripe go-live |
| O-8 | Real registration + coaching content (pricing, dates, packages, testimonials with consent) | Phase 6 |
| O-9 | ✅ **Resolved 2026-08-11.** The custom CRM is Will's own — supplied as a working single-file app (Blank's Retailer Pipeline v6.10) plus a 523-contact JSON export, so the data model and feature set are known and no longer wait on a partner. Being rebuilt on the Elevate token layer as **Phase 9**; see [`12-crm-plan.md`](12-crm-plan.md) | ~~Gate-1 CRM side~~ |

**Tier 1b — gates what the site is allowed to say.** Added 2026-07-29 from the
three planning documents. These are business actions, listed here because
website copy depends on them; see §5.5.

| # | Action | Unblocks |
|---|---|---|
| O-10 | **Call 8–10 target coaches** (AZ/NV/NM/CA/W-TX) and ask whether they would release a squad for 3 weeks, and at what price. Both documents name this as the single most valuable next action | Gate-6. Everything about the Registration page's product model |
| O-11 | Confirm the **one-week on-ramp ships from day one** alongside the 3-week block (ST-1 mitigation — the duration assumption is the likeliest thing to go wrong) | Registration IA: one product or two |
| O-12 | **Insurance bound**, with abuse & molestation confirmed in writing | Gate-5. Any safety claim going live |
| O-13 | **Refund / cancellation / AQI-and-smoke policy text**, legally reviewed. The risk plan requires it published at the point of sale, not negotiated during a smoke event | Gate-5, Phase 4, Phase 5 checkout |
| O-14 | Verify **state-association summer contact rules** (AIA, CIF, NIAA, NMAA…) — they decide whether a team's own coaches may attend, which changes supervision, staffing and liability | FAQ content; supervision claims |
| O-15 | Written **worker classification opinion** (1099 vs W-2) from an AZ attorney/CPA | Any site content describing staff; blocks counsellor hiring |
| O-16 | ✅ **Decided 2026-07-29: repurpose for the recruiting advisory.** Shipped: `/recruiting` live on `main`, `/coaching` 308-redirected — PR #15 merged 2026-07-29, plus PR #17 (which added the page file #15 shipped without; see the `git add` pathspec incident in project memory) | ~~The single most urgent live content fix~~ |

**Tier 3 — approvals on demand:** brand-guide sign-off (A1), per-PR screenshot
approvals, component picks from shortlist menus. Each takes minutes.

## §1 — Decision Gates

- **Gate-1 · CMS stay/leave. ✅ Resolved: STAY (2026-08-02).** The billing
  block lifted (O-2), the full CMS-ification shipped on Sanity (every page
  Studio-editable, sync-checked 143/143), and post-caching API usage sits
  comfortably inside the free tier. Reversing this now would mean redoing
  the entire content layer; do not reopen without a new forcing event.
- **Gate-2 · Preview verification** (= O-4). Until resolved, verification runs
  local → production-post-merge only.
- **Gate-3 · Media hosting. ✅ Superseded (2026-08-02).** Billing stabilised
  and curated photos now live on Sanity's CDN (12 uploaded and serving on
  /media). The public/-folder fallback is no longer planned.
- **Gate-4 · Photo consent** (= O-6).
- **Gate-5 · Claims gate.** No page may state a safety practice, a credential,
  or a track record as fact until it is true: insurance bound with A&M (O-12),
  the written policies existing (O-13), and a season actually delivered.
  Forward-looking commitments ("the standard every session runs to") are
  allowed; history is not, because no season has run. Applies to every phase
  that writes copy, and is a merge precondition alongside the aesthetic gates.
- **Gate-6 · Duration validation** (= O-10). Until 8–10 coaches have been
  asked, the 3–4 week block is an unvalidated assumption. Registration must
  therefore present the one-week on-ramp as a first-class product, not a
  footnote, and no phase should invest heavily in 3-week-specific content.
- **Gate-7 · Recruiting attach rate.** No priced recruiting tiers publish
  until the Year-1 pilot measures one. The launch sequence gives the Tier-1
  evaluation away free to every camper and counts who asks follow-up questions
  unprompted; below roughly 15% the line does not work. Phase 8 ships the free
  evaluation as camp copy first, and the rate card only after the number
  exists — publishing pricing earlier inverts the sequence and risks building
  a surface for demand that was never measured.

**Keeping this in sync.** `../../business-plan/` is the source of truth for
product, price, audience and promises; this file is the source of truth for how
the site gets built. When a business document changes, work through
`../../business-plan/WEBSITE-SYNC.md` — it maps each decision to a site surface
and says whether it is a Sanity edit or a code change — then update §5.5 here.
Check `CHANGELOG.md`'s *superseded assumptions* and *decisions taken* tables
before proposing anything; they exist to stop settled questions being reopened.

## §2 — How Claude Operates

**Git/PR:** isolated worktree per phase, branch + PR per coherent unit, small
PRs. Never commit to `main`. Merge criteria: build green, security review clean,
verification-ladder rung achieved, aesthetic approval attached when
visually-affecting.

**Agent playbook:** Explore agents for read-only recon (parallel encouraged);
a Plan agent before major phases (2, 3, 5); general-purpose agents for
independent research/data tasks; main thread only for implementation writes,
git operations, and anything credential-touching (subagents never see secrets).
Parallel reads/research fine; never parallel writes to one worktree; owner
approvals are never parallelized.

**Verification ladder (every task):**
1. **Local** — build, then Playwright: accessibility snapshot, console errors,
   screenshots at 1440px and 390px, form dry-runs.
2. **Preview** — same suite against the Vercel preview URL (needs Gate-2).
3. **Production post-merge** — smoke: nav, contact dry-run, console clean, GA
   beacon fires.

**Aesthetic checkpoints:** *direction gates* (screenshot menu of options before
building) and *approval gates* (desktop+mobile screenshots after building,
before merge — approval is a merge precondition). Any PR that unexpectedly
touches visuals gets promoted to gated.

## §3 — Security Sweep Program + billing tracking

- **Per-PR:** security review of the branch diff + `npm audit` (fail on
  high/critical in production deps).
- **Phase-boundary sweep** (every phase in §4): GitHub secret scanning;
  `npm audit` + `npm outdated`; **live credential checks** (Gmail SMTP,
  HubSpot, Sanity quota, Stripe once it exists); Vercel env verification
  against `.env.example`. Logged as a dated entry in `07-security-log.md`.
- **Event-driven:** new secret → immediate scan + confirm it lives in Vercel
  env, not the repo; new dependency → audit; Next.js security advisory →
  same-day patch.
- **One-time payment security review** at end of Phase 5 before live keys:
  webhook signature verification, idempotency, fulfillment only from the
  webhook, no card data server-side, rate limiting on the checkout route.
- **Billing/renewal tracking:** `06-billing.md` tracks every service, tier, cost,
  renewal date, and paying account; renewal dates mirrored to Google Calendar
  with reminders once dates are confirmed.

## §4 — Phase Roadmap

| Phase | Scope | Depends on | Gates/Checkpoints |
|---|---|---|---|
| **0 · Hygiene & docs** | Docs rewrite (this file, `04-email-setup.md`, README, `05-video-playback.md`), dead-code + unused-dep removal, version pairings, ESLint config + ~50 error fixes, `06-billing.md`/`07-security-log.md`, calendar renewal events | none | baseline sweep |
| **1 · Brand guide** | Photo-derived palette, green/cream canonicalization, type scale, layout references, motion vocabulary; delivered as a committed `/style-guide` route | O-5 mid-phase | **A1** approval |
| **1.5 · Positioning & IA** | See §5.5. Repositions the site from individual athletes to the trip leaders who buy; team-block product model; page-by-page IA; claims discipline; alumni-data capture; CMS schema reshape. ~~Opens with the two live inconsistencies~~ — both fixed (O-16 shipped `/recruiting`; `2 weeks`/`3 weeks` added to `trainingPackage.duration`). **✅ CMS-ification COMPLETE 2026-07-31 — all five waves shipped (`10-sanity-content-plan.md` §5); every page is Studio-editable and `npm run check:content` verifies it** | `../../business-plan/` (source of truth); O-10/O-11 refine the product model | **A1.5** positioning approval; Gate-5, Gate-6 |
| **2 · Token migration + providers** | ✅ Essentially complete 2026-08-02: `:root` layer live, page hexes migrated across the lodge rebuilds, email palette reconciled, LayoutClient migrated in the roadmap-refresh PR. Residual: deliberate literal cream/scrim values inside dark sections, and Magic UI / Aceternity remain unregistered until a component actually needs them | A1 | ~~A2~~ done |
| **2.5 · UI & content-organisation overhaul** | ✅ Complete 2026-08-02 via the Cinematic Lodge system (PRs #23–#31): every inner page on the lodge grammar, TeamRotator replaced the carousel, off-palette buttons gone, `<strong>` marks styled deliberately | — | done |
| **3 · Media page** | ✅ Built 2026-08-01: continuous mosaic wall + lightbox, CMS-managed items, 12 Colorado photos live. **Remaining: Flagstaff photography** — the staged library has zero usable Flagstaff shots (the two that exist are consent-blocked portraits), so this closes with O-6 consent or a people-free Flagstaff shoot | Gate-4 for any photo with a recognisable athlete | — |
| **4 · Legal pages** | Privacy / ToS / Cookies (footer links are currently dead) **plus the refund/cancellation and wildfire-smoke-AQI policy** — the risk plan requires the latter published at the point of sale, so it is revenue-protecting, not boilerplate | O-7, O-13 | **A4** light + sweep, Gate-5 |
| **5 · Stripe foundation** | **Re-scoped by Phase 1.5.** The sale is B2B and quote-based: two-part tariff (team base fee + per-athlete), squad minimum, non-refundable deposit at booking with balance before arrival. So: deposit/invoice flow rather than a per-head product checkout; signature-verified idempotent webhook; `/registration/success`; drop `paymentOption` schema | O-1, Phase 1.5, Gate-1 (or fallback); live: Phase 4 | payment security review + **A5** |
| **6 · Real content** | ✅ Complete 2026-08-01: canonical tariff live from the CMS, all copy Studio-editable, tone pass applied. Only the Phase-5 CTA wiring (quote/deposit flow) remains, tracked under Phase 5 | Gate-6 still governs 3-week-specific investment | done |
| **8 · Recruiting advisory surface** | **Partly shipped** via O-16 (PRs #15/#17): `/recruiting` is live with the Y1-phased, no-pricing copy. Remaining: the priced rate card (waits on the Gate-7 measured attach rate), any schema backing, and the two-buyer split if the copy ever needs it | Phase 1.5, Gate-7 | **A8** direction + approval, Gate-5 rule 4 |
| **9 · CRM** | 🟢 **ACTIVE — started 2026-08-11.** Promoted out of §7 by O-9's resolution. An in-house CRM at `/crm`, rebuilt from Will's supplied concept onto the Elevate token layer, **with `/api/contact` and `/api/newsletter` writing every submission into it automatically**. Closes the gap left by the dead HubSpot token (O-3), gives the marketing plan's 120-coach funnel a tool to run in, and is where the alumni database (§5.5 — *"the only asset that cannot be purchased later at any price"*) starts accumulating. Full plan, domain mapping, security constraints and open decisions: [`12-crm-plan.md`](12-crm-plan.md) | O-9 (done); D1–D3 in the plan doc; Gate-5 for Onboarding copy | server-side auth review before any real lead data lands (R16 — minors' records) |

**Cut from the roadmap:** Phase 7 (Blog) — owner decision 2026-08-02, not
necessary; the monthly newsletter (issues authored in the Studio, archived at
`/newsletter`) covers recurring content instead. Do not re-propose.

**Critical path:** A1 → Phase 2 → all visual work; **Phase 1.5 → Phases 5/6/8**
(the product model determines the checkout, the content and the service-line
surface); O-1/O-7 → Stripe live.

**The dominant unblock is O-10** (the coach calls) — it validates or kills the
duration assumption every downstream projection rests on, and now doubles as
the test of the parent-led configuration ("if you couldn't attend, would a
parent group run the trip?"). O-16, previously the most urgent item, was
resolved 2026-07-29 (repurpose → `/recruiting`).

## §5 — Brand-guide production (Phase 1 detail)

1. Photo palette extraction (node + sharp over `media-source/`, dominant-color
   clustering per photo set) → candidate accents from the real photography.
2. Green/cream canonicalization: `#427b4d` (dominant, 50×) proposed as
   `--primary` with derived hover/dark shades replacing the four ad-hoc greens;
   ~9 creams collapse to a 2–3 step ramp. Full old-hex → token mapping table.
3. Typography scale (Geist Sans/Mono kept): display/h1–h4/body/small/caption.
4. Layout references: researched menu, owner picks, guide annotates which
   patterns map to which pages.
5. Motion vocabulary: calm, cinematic scroll (the scroll-hijack hero was
   deleted in A2.5a — do not reintroduce it; see `05-video-playback.md`),
   spring-based shared-layout transitions (testimonial modal), rules for
   marquee/velocity/parallax usage, `prefers-reduced-motion` requirements.
6. Deliverable: a committed **`/style-guide` route** rendering live tokens,
   type scale, swatches, and motion demos — excluded from nav/sitemap/robots;
   permanent regression reference.

### A1 decisions (owner, 2026-07-27)

**Locked:**
- Palette consolidation approved. Green hover revised `#387143` → `#33603c`
  (the original was only 4% lighter than primary — invisible as a state).
- Accents: **Red Rock `#b67d5e`** + **Trail Brown `#67563b`**. Alpine Sky,
  Haze Blue, Golden Trail and Summit Navy dropped.
- Reference mapping: **Kenya Experience** (Young Athlete Camp page) drives
  page content, pricing structure and camp information architecture →
  Phase 6. **Under Canvas** drives the homepage video treatment — note the
  Mux/Sanity scroll-expanding hero already exists; the work is tuning it
  toward a calmer, more cinematic feel, not rebuilding. **Tracksmith**
  drives general aesthetics, typography and layout: retro running-culture,
  serif headlines, refined rustic — high-end and classy but unmistakably
  outdoors.

**Since decided (both shipped; recorded here 2026-07-30):**
- Serif display face: **Instrument Serif** — shipped in the Phase 2 work
  (`09-architecture.md` documents its weight-400-only constraint).
- Logo mark: **twin peak** — `public/logo-mark.svg` exists and is in use.
  Residual item: confirm the wordmark-to-outlines conversion is done before
  any print use.

## §5.5 — Positioning & information architecture (Phase 1.5 detail)

Phase 1 settled how the site looks. Phase 1.5 settles **what it says and who
it says it to.**

### Source of truth — `../../business-plan/`

The business plan is **not in this repo**. It lives one level up, and it is the
source of truth for what the business sells, at what price, to whom, and with
what promises. **The website is a rendering of those decisions.** Restructured
and expanded 2026-07-29; the paths below supersede the loose project-root
files this section originally cited.

| Doc | File | Drives |
|---|---|---|
| **01** | `01-feasibility-study-2027-2031` | Sequencing, revenue lines, go/no-go gates |
| **02** | `02-team-block-pricing-analysis` | The flagship product, price and structure |
| **03** | `03-revenue-expansion-and-structure-decision` | The seven service lines; LLC-vs-501(c)(3) (declined) |
| **04** | `04-recruiting-advisory-launch-plan` | **The principal service line.** Four tiers, launch sequence, compliance |
| **05** | `05-risk-management-loss-control-plan` | The constraints on what may be said |

Two companion files matter as much as the documents:

- **`WEBSITE-SYNC.md`** — the propagation map from business decision to site
  surface, and whether each is a Sanity edit or a code change. **Work through
  its checklist whenever a document changes.** Rule of thumb it sets: changing
  a *value* is Sanity; changing the *shape* of what can be expressed is code.
- **`CHANGELOG.md`** — what changed and *why*, including a **"superseded
  assumptions — do not reintroduce"** table and a **"decisions taken"** table.
  Read it before proposing anything; several obvious ideas (a coaching
  subscription, a paid alumni membership, a nonprofit structure, individual
  housing referrals) are already tested and rejected there.

**The reusable test**, from `CHANGELOG.md`: for any revenue line or page, ask
*does it compete with the high school coach, or complement them?* Training
plans compete — the coach already writes those, and selling around them damages
the relationship the camp depends on. Recruiting help complements. This test is
why `/coaching` is now the site's most urgent problem (below).

### The repositioning, in one line

**The site addressed individual athletes. The business sells multi-week
altitude blocks to high school cross country coaches.** Nearly every content
problem downstream is a consequence of that mismatch.

| | Site said (pre-2026-07-29) | Business actually does |
|---|---|---|
| Buyer | Individual athlete / parent | **The team's trip leader** — the coach, or a **parent organiser** where the coach can't travel (buyer widened 2026-07-29; parent-led trips are first-class, and the accompanying adults own supervision either way). B2B. |
| Product | Generic "training camps" | **Team Altitude Block** — 3–4 weeks flagship, **1-week on-ramp** as a first-class product (ST-1 hedge) |
| Price | Flat per-head tiers | **Two-part tariff**: team base fee + per-athlete, ~8–10 athlete minimum (≈$7,500 revenue floor) |
| Included | "Housing, transport and logistics handled" | **Programming only.** Lodging and food excluded — brokered via partners |
| Altitude | Implied performance promise | **Aerobic base development** in the highest-volume phase. Explicitly not a sea-level race effect |
| Edge | Local knowledge, discounts | **Professional access, D1/recruiting guidance, on-the-ground logistics** — what a coach cannot self-provide |

The competitor is not Nike. It is **a coach renting a house in Mammoth and
running the trip himself for free.** Flagstaff's answer: resident professional
community, university facilities, trail volume, a real town, cheaper lodging,
and proximity for AZ/NV/NM/W-TX. Say that; don't lead with bagel-shop runs.

### Claims discipline (Gate-5) — five rules, each load-bearing

Mirrors the guardrails in `../../business-plan/WEBSITE-SYNC.md`. Each is a
liability or credibility exposure, not a style preference.

1. **Never claim lodging or supervision is provided.** "Facilitate, don't
   operate" is a liability posture (R12), not a wording preference. Refer to
   partners; never take booking custody or overnight supervisory
   responsibility. It is what keeps Elevate a programme provider rather than a
   camp operator, which materially reduces insurance and regulatory exposure.
2. **Never promise the sea-level race effect.** A June/July block builds
   aerobic base; it does not make anyone faster at a November championship.
   Overselling is the fastest way to lose the sophisticated coaches this
   business targets.
3. **Never state a track record that does not exist.** No season has run.
   Write safety and quality as *the standard sessions run to* — commitments,
   not history — until G1 clears. **Currently violated in production:**
   `/coaching` claims *"Proven Results — our athletes consistently achieve
   personal bests"* and *"certified coaches with decades of experience."*
4. **Never promise placement or scholarships, and never charge a fee
   contingent on either** (04 §04). Contingency pricing tied to scholarship
   value is the pattern that resembles athlete agency, is restricted in
   several states, and would put the reputation the camp depends on at risk.
   Flat fees; outcomes stated only as work performed. Applies to every word of
   recruiting copy.
5. **Never imply a guaranteed session.** Wildfire and smoke can cancel or
   truncate one. Refund terms must be published at the point of sale, not
   negotiated afterwards (05 §05).

### ✅ Two live inconsistencies — resolved (historical)

Both raised by `../../business-plan/WEBSITE-SYNC.md` and confirmed against the
running site on 2026-07-29. **Both fixed and merged to `main`** — PR #15 plus
follow-up PR #17 (O-16 resolved as a repurpose → `/recruiting`;
`2 weeks`/`3 weeks` added to `trainingPackage.duration`). The history below is
kept for context only.

**1. `/coaching` sells the product that was cut — and undercuts the buyer.**

On 2026-07-29 the remote coaching subscription was **cut** (`CHANGELOG.md`,
"Decisions taken"), previously modelled at ~$130,000 by Year 5. The reason is
the reusable test above: campers arrive **as teams with established coaches**
who already write their off-season plans. Selling those athletes a competing
plan undercuts the person who books the camp.

Production right now advertises exactly that: *"Personalized Training Plans —
built around your goals and schedule"*, *"Weekly Phone Calls"*, and an
**"Ongoing $100"** programme. `coachingProgram.duration` still offers
`1 month / 3 months / 6 months / Ongoing`. The same page also breaks Gate-5
rule 3 with *"Proven Results — our athletes consistently achieve personal
bests."*

A coach who lands here may reasonably conclude the camp intends to poach their
athletes. **Do not leave it as-is.** Three options, in the sync guide's order
of preference — this is O-16, an owner decision:

1. **Re-scope** to what survives: in-person strength, mobility and recovery
   delivered *at camp*, plus unattached/graduating/masters athletes. Drop the
   ongoing and monthly durations.
2. **Repurpose** the page for the recruiting advisory (04), which is the
   intended service line and needs a home anyway.
3. **Remove** it from navigation until there is something to put there.

**2. The flagship product cannot be expressed in the schema.**
`trainingPackage.duration` offers `3 days, 5 days, 7 days, 4 weeks, 1 month,
3 months, 6 months`. The flagship is a **3-week team block** and the on-ramp is
**1 week**. There is no `2 weeks` or `3 weeks` value, so the product literally
cannot be entered in the Studio. Add both to
`src/sanity/schemaTypes/trainingPackage.ts` — schema change, so code + deploy.

### Page-by-page IA

| Page | Change |
|---|---|
| **Home** | ✅ Done — rebuilt on the A2.5a composition with corrected positioning |
| **Coaching → Recruiting** | ✅ O-16 resolved: repurposed as `/recruiting` (recruiting advisory, Y1-phased — free evaluation only, no pricing per Gate-7). `/coaching` 308-redirects. The `coachingProgram`/`coachingBenefit`/`coachingTestimonial` schema types remain for the Phase 1.5 CMS reshape (3 documents still in the dataset) |
| **Registration** | The biggest rebuild. Becomes *team blocks + quote request*, modelling the two-part tariff and squad minimum. Present the 1-week on-ramp alongside the 3-week block (Gate-6). Needs the schema durations fixed first. Current invented tiers and 2025 dates are structurally wrong, not just stale |
| **Recruiting advisory** | **New page + new schema.** The principal service line (04) — four tiers, buyer changes between them (Tier 4 sold to coaches, Tiers 2–3 to families). **Phased: publish nothing priced in Y1.** The Y1 move is the free Tier-1 evaluation for every camper, which doubles as the attach-rate measurement; pricing publishes in Y2, where transparency is itself the differentiator against NCSA's no-published-pricing sales call |
| **About** | Carry the community flywheel: HS camper → collegiate counsellor → professional advocate. Note the alumni network is retained as **free** infrastructure — the paid "Elevate Family" membership was cut, so never present it as a paid tier |
| **FAQ** | Rewrite for the questions a coach actually asks: who supervises, state-association summer contact rules (O-14), what is and isn't included, ferritin screening, AQI and cancellation, minimum squad size, payment terms |
| **Safety & safeguarding** | **New page.** Two-deep leadership, background screening, WFR on session, EAP, altitude protocols, AQI thresholds. Risk plan §06 is explicit that these are sales differentiators as much as controls — coaches and parents will look for them |
| **For coaches** | **New page.** A single shareable page that supports the O-10 calls and any cold outreach — product, price structure, what's included, what isn't, next step |
| **Legal** (Phase 4) | Refund/cancellation + wildfire/smoke/AQI policy, published at the point of sale |

### The recruiting advisory is now the strategic centre

Doc 03's framing: **"the camp is not the business — it is the funnel."** Camps
alone reach Year 5 at ~$477K revenue / ~$39K net. The year-round service lines
lift that to ~$703K / ~$184K, and they work because they consume time rather
than beds — which is also what fixes the seasonality problem the flywheel does
*not* fix.

Consequences for the site, in priority order:

- **The camp pages must feed the funnel, not just sell a camp.** Every camper
  captured is a recruiting-advisory prospect and a future counsellor. This
  raises the alumni-data requirement below from "important" to load-bearing.
- **The Tier-1 evaluation belongs in camp copy from Y1** — every camper gets a
  written assessment. It costs almost nothing, it is a genuine differentiator
  (no competitor has watched the athlete train for three weeks), and it is the
  natural upsell conversation.
- **All seven service lines are sized off the alumni base**, so they fail
  together if retention fails. That concentration is deliberate: it makes
  "build the community" a measurable variable rather than a soft aspiration.
- **Compliance is a copy constraint, not just an ops one.** Counsellors may not
  advise on or advocate for their own programme. If Elevate ever sold athlete
  information *to colleges* rather than advice *to families*, that is a
  recruiting/scouting service under NCAA rules and a different regime applies —
  nothing on the site should drift toward implying it.

### Alumni data — a website requirement, not a nicety

The feasibility study: the alumni database is *"the only asset here that
cannot be purchased later at any price"*, and it is worthless if reconstructed
retroactively. So from the first registration the forms must capture, per
athlete: **school, graduation year, and (later) college destination**, plus a
durable contact route. This is a hard requirement on Phase 5's registration
flow and on the CRM mapping (Gate-1 / O-9), not a Phase 7 nice-to-have.

Counterweight from the same documents: **R16 — data breach of minors'
records.** Minimise what is collected, encrypt at rest, carry cyber liability.
Collect the lifecycle fields and the medical minimum; nothing beyond.

### CMS schema reshape

Sanity currently models an individual-athlete camp business, which is why the
homepage copy now lives in code (see the header comment in `src/app/page.tsx`)
rather than being wired to fields that would render the old positioning.
Reshape around: `teamBlock` (duration, base fee, per-athlete rate, minimum
squad), coach-facing FAQ, safety standards, partner lodging, and — later — the
recruiting tiers. Fold in:

- **`trainingPackage.duration` is missing `2 weeks` and `3 weeks`** — the
  flagship product cannot currently be entered. Smallest, most urgent fix here.
- **`coachingProgram.duration` still offers `1 month / 3 months / 6 months /
  Ongoing`** — the shape of a subscription that no longer exists. Resolve with
  O-16.
- `paymentOption`, deprecated. **Verified 2026-07-29: 0 documents in the
  production dataset**, so nothing is lost by deleting the type. The only
  blocker is that `/registration` still *renders* it — from a hardcoded
  `fallbackPaymentOptions` array of invented instalment tiers, which
  contradicts the agreed deposit-plus-balance model. Delete the schema, the
  query, the type and that section together in Phase 5; removing the schema
  alone would leave the invented fallback showing.
- The three known Studio defects: FAQ fields stranded inside `siteSettings`,
  the inert `logo` field, the CMS-driven favicon.

Gated behind Sanity billing (O-2) like all schema work.

### What NOT to build yet

Year 1 is deliberately asset-light and programming-only, and doc 01's central
finding is that the layers **must be sequenced, not pursued in parallel**.
Leave room in the IA; build nothing for:

- Lodging booking, federation/delegation portals, athlete-housing marketplace
  (Year 2+).
- **Priced recruiting tiers** — Y1 gives the Tier-1 evaluation away free and
  *measures* the attach rate; publishing a rate card before that number exists
  inverts the launch sequence. Under ~15% attach and the line doesn't work.
- **A paid alumni membership.** Cut 2026-07-29 — no recurring benefit survived
  scrutiny. The network stays free infrastructure. Listed explicitly because it
  is the kind of thing a future session would otherwise propose.
- Anything premised on a 501(c)(3). The hybrid structure was analysed in
  detail and **declined** by owner decision; Elevate remains a for-profit LLC.
  Do not reintroduce donation, tax-credit or grant-funded framing.

### Checkpoint A1.5

Owner approves: the coach-as-buyer repositioning; the product model (3–4 week
block + 1-week on-ramp); **`/coaching`'s disposition (O-16)**; the phased
recruiting-advisory surface — free Tier-1 evaluation in camp copy now, priced
tiers only after Gate-7; and the new-page list. Content build does not start
before it, but the `/coaching` fix and the `trainingPackage` duration fix
should not wait for the rest of the checkpoint — both are live defects.

## §6 — Component providers (Magic UI + Aceternity)

Install via shadcn CLI into `src/components/ui/` as owned source; rewrite
`motion/react` imports to `framer-motion` (single animation dep); re-theme to
brand tokens on arrival — nothing merges with provider-default styling.

**`framer-motion` is no longer installed.** Its only consumer was
`ui/testimonials.tsx`, removed in the repo reorganisation once the homepage
rebuild orphaned it. Re-add it (`npm i framer-motion`) with the first provider
component that needs it, rather than carrying an unused runtime dependency.
Starting shortlist: Magic UI Marquee / Scroll Progress / Scroll-Based Velocity;
Aceternity parallax gallery / timeline. Adopt only where a phase needs them,
never speculatively.

## §7 — Parking lot

Customer/parent portal + auth (prereq for an in-site billing dashboard);
coaching booking/calendar; dark mode; multi-location; custom weekly-analytics
report via Vercel Cron (native GA scheduled emails already active).

**Left the parking lot 2026-08-11:** custom-CRM integration, now **Phase 9**
(§4) — O-9 resolved, plan at [`12-crm-plan.md`](12-crm-plan.md).

Later service lines from doc 03, each needing a surface eventually but **not
yet** — winter & spring break camps, coach education & clinics, brand
partnerships & sponsorship, event & race hosting. They start Y3 in the model.
Leave room in the IA; build nothing.

**Do not park these — they are decided, not deferred:** a remote coaching
subscription, a paid alumni membership, individual housing referrals, and any
501(c)(3) or hybrid structure. All were analysed and rejected; see
`../../business-plan/CHANGELOG.md`.
