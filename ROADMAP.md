# Elevate Training Camps — Roadmap v2

The working plan for this repo. Owner actions are front-loaded (§0) so engineering
is never stalled waiting on a key, decision, or approval. Engineering phases (§4)
route around whatever is still pending. Maintained by Claude Code sessions;
update it as phases complete rather than letting it rot.

## Current state (as of 2026-07-27)

Live at https://elevatetrainingcamps.com (Vercel, auto-deploy from `main`).
Shipped: site-wide crash fix, SendGrid→Gmail SMTP migration, GA4, CVE-2025-66478
patch, Sanity caching refactor (all pages are cached Server Components), domain
cutover with TLS. Known-broken: Sanity billing-blocked (quota overage — billing
team contacted), HubSpot token 401s (leads not reaching CRM), Stripe not yet
created.

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
| **2 · Token migration + providers** | Fill the empty `:root` token layer, delete dead `tailwind.config.js`, migrate hardcoded hexes page-by-page, reconcile Sanity-schema + email-template palette copies, register Magic UI + Aceternity | A1 | **A2** regression approval + sweep |
| **3 · Media page** | Curate → optimize → gallery with provider scroll components | Phase 2, Gates 1/3/4 | **A3a** direction, **A3b** final + sweep |
| **4 · Legal pages** | Privacy / ToS / Cookies (footer links are currently dead) | O-7 | **A4** light + sweep |
| **5 · Stripe foundation** | Hosted Checkout, `/api/registration/checkout`, signature-verified idempotent webhook, `/registration/success`, numeric `spots`, drop `paymentOption` schema | O-1, Gate-1 (or fallback); live: Phase 4 | payment security review + **A5** |
| **6 · Real content** | Replace fabricated Registration/Coaching fallbacks, honest empty-states, wire CTAs to checkout | O-8, Gate-1 | **A6** direction + approval + sweep |
| **7 · Blog** | `blogPost` schema, listing, post page, nav | Phase 2, Gate-1 | **A7** + sweep |

**Critical path:** A1 → Phase 2 → all visual work; O-1/O-7 → Stripe live.

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
