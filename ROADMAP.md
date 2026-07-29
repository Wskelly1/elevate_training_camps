# Elevate Training Camps — Roadmap v2

The working plan for this repo. Owner actions are front-loaded (§0) so engineering
is never stalled waiting on a key, decision, or approval. Engineering phases (§4)
route around whatever is still pending. Maintained by Claude Code sessions;
update it as phases complete rather than letting it rot.

## Current state (as of 2026-07-29)

Live at https://elevatetrainingcamps.com (Vercel, auto-deploy from `main`).
Shipped: site-wide crash fix, SendGrid→Gmail SMTP migration, GA4, CVE-2025-66478
patch, Sanity caching refactor (all pages are cached Server Components), domain
cutover with TLS, brand guide + A1 decisions, `:root` token layer, and the
**rebuilt homepage** (A2.5a — scroll-hijack deleted, ambient hero, editorial
layout system, repositioned copy). Known-broken: Sanity billing-blocked (quota
overage — billing team contacted), HubSpot token 401s (leads not reaching CRM),
Stripe not yet created.

**The site's positioning changed on 2026-07-29.** Three planning documents at
the project root established that the buyer is a high school cross country
*coach*, not an individual athlete, and that the product is a team altitude
block sold on a two-part tariff with lodging deliberately excluded. This
invalidates content across Registration, Coaching and FAQ. See **§5.5
(Phase 1.5)** — read it before writing any copy.

---

## §0 — Owner Action Queue

**Tier 1 — today (long lead times / hard blockers):**

| # | Action | Unblocks |
|---|---|---|
| O-1 | Create Stripe account, start business verification (takes days) | Phase 5 build (test keys) and go-live (live keys) |
| O-2 | Sanity billing — forward the billing team's reply when it arrives | Gate-1; all CMS schema/content writes (Phases 3, 5, 6, 7) |
| O-3 | Regenerate HubSpot private-app token (Settings → Integrations → Private Apps), provide new token (~10 min) | CRM lead capture working again |
| O-4 | Vercel preview access: issue a protection-bypass secret (recommended) or disable deployment protection | Preview rung of the verification ladder (Gate-2) |

**Tier 2 — this week (inputs needed mid-phase):**

| # | Action | Unblocks |
|---|---|---|
| O-5 | Pick from Claude's proposed reference-site menu | Brand-guide layout section (Phase 1) |
| O-6 | **Photo consent** — confirm which of the 195 staged photos are cleared for public use (identifiable people, especially minors, need releases). Hard stop; not defaulted | Phase 3 publishing (Gate-4) |
| O-7 | Legal inputs: business entity name, refund/cancellation policy; lawyer review of waiver language recommended (physical sports business) | Phase 4 → Stripe go-live |
| O-8 | Real registration + coaching content (pricing, dates, packages, testimonials with consent) | Phase 6 |
| O-9 | Custom-CRM API/data-model details from partner contact | Gate-1 CRM side |

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

**Tier 3 — approvals on demand:** brand-guide sign-off (A1), per-PR screenshot
approvals, component picks from shortlist menus. Each takes minutes.

## §1 — Decision Gates

- **Gate-1 · CMS stay/leave.** Inputs: Sanity billing reply (O-2), custom-CRM
  details (O-9), and a measured comparison of post-caching API usage vs.
  free-tier limits. Resolves before Phase 3. If stalled: Phases 0–2 and 4 are
  CMS-agnostic; Phase 5 can fall back to Stripe metadata + email.
- **Gate-2 · Preview verification** (= O-4). Until resolved, verification runs
  local → production-post-merge only.
- **Gate-3 · Media hosting.** Default (confirm or veto): don't upload ~200
  originals into Sanity while billing is unstable — curate 40–60, optimize to
  WebP, serve from `public/` via `next/image`.
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
  against `.env.example`. Logged as a dated entry in `SECURITY_LOG.md`.
- **Event-driven:** new secret → immediate scan + confirm it lives in Vercel
  env, not the repo; new dependency → audit; Next.js security advisory →
  same-day patch.
- **One-time payment security review** at end of Phase 5 before live keys:
  webhook signature verification, idempotency, fulfillment only from the
  webhook, no card data server-side, rate limiting on the checkout route.
- **Billing/renewal tracking:** `BILLING.md` tracks every service, tier, cost,
  renewal date, and paying account; renewal dates mirrored to Google Calendar
  with reminders once dates are confirmed.

## §4 — Phase Roadmap

| Phase | Scope | Depends on | Gates/Checkpoints |
|---|---|---|---|
| **0 · Hygiene & docs** | Docs rewrite (this file, `EMAIL_SETUP.md`, README, `README_VIDEO.md`), dead-code + unused-dep removal, version pairings, ESLint config + ~50 error fixes, `BILLING.md`/`SECURITY_LOG.md`, calendar renewal events | none | baseline sweep |
| **1 · Brand guide** | Photo-derived palette, green/cream canonicalization, type scale, layout references, motion vocabulary; delivered as a committed `/style-guide` route | O-5 mid-phase | **A1** approval |
| **1.5 · Positioning & IA** | See §5.5. Repositions the site from individual athletes to the coaches who buy; team-block product model; page-by-page IA; claims discipline; alumni-data capture; CMS schema reshape | The three planning docs (done); O-10/O-11 refine it | **A1.5** positioning approval; Gate-5, Gate-6 |
| **2 · Token migration + providers** | Fill the empty `:root` token layer, delete dead `tailwind.config.js`, migrate hardcoded hexes page-by-page, reconcile Sanity-schema + email-template palette copies, register Magic UI + Aceternity | A1 | **A2** regression approval + sweep |
| **2.5 · UI & content-organisation overhaul** | Driven by `DESIGN_REVIEW.md`. **Homepage done** (A2.5a approved — scroll-hijack deleted, layout system landed). Remaining: apply the same system to the inner pages; rebuild the testimonial card; fix vertical rhythm and left-edge alignment; retire off-palette dark buttons; resolve CMS-authored `<strong>` marks | Phase 2 tokens; inner-page copy needs Phase 1.5 | ~~**A2.5a**~~ done, **A2.5b** per-page approval |
| **3 · Media page** | Curate → optimize → gallery with provider scroll components | Phase 2, Gates 1/3/4 | **A3a** direction, **A3b** final + sweep |
| **4 · Legal pages** | Privacy / ToS / Cookies (footer links are currently dead) **plus the refund/cancellation and wildfire-smoke-AQI policy** — the risk plan requires the latter published at the point of sale, so it is revenue-protecting, not boilerplate | O-7, O-13 | **A4** light + sweep, Gate-5 |
| **5 · Stripe foundation** | **Re-scoped by Phase 1.5.** The sale is B2B and quote-based: two-part tariff (team base fee + per-athlete), squad minimum, non-refundable deposit at booking with balance before arrival. So: deposit/invoice flow rather than a per-head product checkout; signature-verified idempotent webhook; `/registration/success`; drop `paymentOption` schema | O-1, Phase 1.5, Gate-1 (or fallback); live: Phase 4 | payment security review + **A5** |
| **6 · Real content** | Replace fabricated Registration/Coaching fallbacks (the invented $1,200/$1,800/$2,800 tiers are structurally wrong, not merely stale), honest empty-states, wire CTAs to the quote/deposit flow | O-8, Phase 1.5, Gate-1, Gate-6 | **A6** direction + approval + sweep |
| **7 · Blog** | `blogPost` schema, listing, post page, nav | Phase 2, Gate-1 | **A7** + sweep |

**Critical path:** A1 → Phase 2 → all visual work; **Phase 1.5 → Phases 5/6**
(the product model determines both the checkout and the content); O-1/O-7 →
Stripe live. O-10 (the coach calls) is the highest-value unblock on the board:
it validates or kills the duration assumption every downstream projection
rests on.

## §5.5 — Positioning & information architecture (Phase 1.5 detail)

Phase 1 settled how the site looks. Phase 1.5 settles **what it says and who
it says it to.** Added 2026-07-29, derived from three planning documents at
the project root — read them before working in this phase:

- `team-altitude-block-pricing-analysis.pdf` — product, price, structure
- `feasibility-study-2027-2031.pdf` (Rev 2) — sequencing, revenue lines, gates
- `risk-management-loss-control-plan.pdf` — the constraints on what may be said

### The repositioning, in one line

**The site addressed individual athletes. The business sells multi-week
altitude blocks to high school cross country coaches.** Nearly every content
problem downstream is a consequence of that mismatch.

| | Site said (pre-2026-07-29) | Business actually does |
|---|---|---|
| Buyer | Individual athlete / parent | **A coach**, buying for a squad. B2B. |
| Product | Generic "training camps" | **Team Altitude Block** — 3–4 weeks flagship, **1-week on-ramp** as a first-class product (ST-1 hedge) |
| Price | Flat per-head tiers | **Two-part tariff**: team base fee + per-athlete, ~8–10 athlete minimum (≈$7,500 revenue floor) |
| Included | "Housing, transport and logistics handled" | **Programming only.** Lodging and food excluded — brokered via partners |
| Altitude | Implied performance promise | **Aerobic base development** in the highest-volume phase. Explicitly not a sea-level race effect |
| Edge | Local knowledge, discounts | **Professional access, D1/recruiting guidance, on-the-ground logistics** — what a coach cannot self-provide |

The competitor is not Nike. It is **a coach renting a house in Mammoth and
running the trip himself for free.** Flagstaff's answer: resident professional
community, university facilities, trail volume, a real town, cheaper lodging,
and proximity for AZ/NV/NM/W-TX. Say that; don't lead with bagel-shop runs.

### Claims discipline (Gate-5) — three rules, each load-bearing

1. **Never claim lodging is provided.** "Facilitate, don't operate" is a
   liability posture (R12), not a wording preference. Refer to partners;
   never take booking custody or overnight supervision. It is what keeps
   Elevate a programme provider rather than a camp operator, which materially
   reduces insurance and regulatory exposure.
2. **Never promise the sea-level race effect.** A June/July block cannot
   deliver it before November championships. Overselling is the fastest way
   to lose the sophisticated coaches this business targets.
3. **Never state a track record that does not exist.** No season has run.
   Write safety and quality as *the standard sessions run to* — commitments,
   not history — until G1 clears.

### Page-by-page IA

| Page | Change |
|---|---|
| **Home** | ✅ Done — rebuilt on the A2.5a composition with corrected positioning |
| **Registration** | The biggest rebuild. Becomes *team blocks + quote request*, modelling the two-part tariff and squad minimum. Present the 1-week on-ramp alongside the 3-week block (Gate-6). Current invented tiers and 2025 dates are structurally wrong, not just stale |
| **Coaching** | Currently sells individual coaching, which is not a Year-1 revenue line. Re-scope toward the coach-facing offer or retire it for now — an owner decision |
| **About** | Carry the community flywheel: HS camper → collegiate counsellor → professional advocate. The feasibility study calls this "the primary product, not the marketing wrapper" |
| **FAQ** | Rewrite for the questions a coach actually asks: who supervises, state-association summer contact rules (O-14), what is and isn't included, ferritin screening, AQI and cancellation, minimum squad size, payment terms |
| **Safety & safeguarding** | **New page.** Two-deep leadership, background screening, WFR on session, EAP, altitude protocols, AQI thresholds. Risk plan §06 is explicit that these are sales differentiators as much as controls — coaches and parents will look for them |
| **For coaches** | **New page.** A single shareable page that supports the O-10 calls and any cold outreach — product, price structure, what's included, what isn't, next step |
| **Legal** (Phase 4) | Refund/cancellation + wildfire/smoke/AQI policy, published at the point of sale |

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
squad), coach-facing FAQ, safety standards, partner lodging. Fold in the three
known Studio defects already queued — FAQ fields stranded inside
`siteSettings`, the inert `logo` field, the CMS-driven favicon. Gated behind
Sanity billing (O-2) like all schema work.

### What NOT to build yet

Year 1 is deliberately asset-light and programming-only. Do not build lodging
booking, federation/delegation portals, or an athlete-housing marketplace —
those are Year 2+ revenue lines, and the feasibility study's central finding
is that the layers **must be sequenced, not pursued in parallel**. Leave room
in the IA; build nothing.

### Checkpoint A1.5

Owner approves: the coach-as-buyer repositioning, the product model (3–4 week
block + 1-week on-ramp), whether Coaching is re-scoped or retired, and the
new-page list. Content build does not start before it.

## §5 — Brand-guide production (Phase 1 detail)

1. Photo palette extraction (node + sharp over `media-source/`, dominant-color
   clustering per photo set) → candidate accents from the real photography.
2. Green/cream canonicalization: `#427b4d` (dominant, 50×) proposed as
   `--primary` with derived hover/dark shades replacing the four ad-hoc greens;
   ~9 creams collapse to a 2–3 step ramp. Full old-hex → token mapping table.
3. Typography scale (Geist Sans/Mono kept): display/h1–h4/body/small/caption.
4. Layout references: researched menu, owner picks, guide annotates which
   patterns map to which pages.
5. Motion vocabulary: cinematic scroll (the homepage scroll-hijack hero),
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

**Open (rendered on `/style-guide` for the owner to pick):**
- Serif display face: Fraunces (warm, wonky, rustic) vs Instrument Serif
  (high-contrast, editorial, closest to the inspiration wordmark). Body/UI
  stays Geist Sans either way.
- Logo mark: twin peak vs single peak; plus which lockup and colour
  treatment are primary. Concepts drafted as inline SVG; the approved mark
  needs redrawing as a standalone optimised SVG asset with the wordmark
  converted to outlines before it replaces the current Sanity-hosted logo.

## §6 — Component providers (Magic UI + Aceternity)

Install via shadcn CLI into `src/components/ui/` as owned source; rewrite
`motion/react` imports to `framer-motion` (single animation dep); re-theme to
brand tokens on arrival — nothing merges with provider-default styling.
Starting shortlist: Magic UI Marquee / Scroll Progress / Scroll-Based Velocity;
Aceternity parallax gallery / timeline. Adopt only where a phase needs them,
never speculatively.

## §7 — Parking lot

Customer/parent portal + auth (prereq for an in-site billing dashboard);
coaching booking/calendar; dark mode; multi-location; custom-CRM integration
(awaiting O-9); custom weekly-analytics report via Vercel Cron (native GA
scheduled emails already active).
