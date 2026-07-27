# Security Sweep Log

Dated record of every security sweep (cadence: end of every roadmap phase, plus
event-driven — see ROADMAP.md §3). Newest first. Each entry records what was
checked and what was found, so "silently broken for a year" can't recur.

Sweep contents: GitHub secret scanning · `npm audit` + `npm outdated` review ·
live credential checks (Gmail SMTP, HubSpot, Sanity, Stripe) · Vercel env-var
verification against `.env.example`.

---

## 2026-07-26/27 — Pre-log baseline (retroactive, from the session that created this file)

Recorded retroactively; the first formally-logged sweep closes Phase 0.

- **CVE-2025-66478 (critical RCE, Next.js/React Server Components):** found via
  Vercel's deploy-block; patched same-day (`next@15.4.11`, `react@19.1.9`).
- **Live credential checks:** Sanity → 402 billing-blocked (quota overage;
  owner contacted billing). HubSpot → 401 invalid token (regeneration pending,
  O-3). Gmail SMTP → verified working with real sends. SendGrid → key was live;
  service since removed from the codebase entirely.
- **Vercel env audit:** production had only 2 of the required vars configured
  (project was ~374 days old); all required vars have now been set across
  production/preview/development.
- **Secrets in repo:** `.env.local` is gitignored; `.env.example` contains
  placeholders only.
