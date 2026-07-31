# Security Sweep Log

Dated record of every security sweep (cadence: end of every roadmap phase, plus
event-driven — see `01-roadmap.md` §3). Newest first. Each entry records what was
checked and what was found, so "silently broken for a year" can't recur.

Sweep contents: GitHub secret scanning · `npm audit` + `npm outdated` review ·
live credential checks (Gmail SMTP, HubSpot, Sanity, Stripe) · Vercel env-var
verification against `.env.example`.

---

## 2026-07-30 — Catch-up entry (consistency-audit branch)

**Cadence breach, recorded first:** Phases 1, 2 and 2.5a all merged (PRs
#6–#13, #15, #17, #18) with **no end-of-phase sweep entries** — this log's own
rule wasn't followed. This entry is a partial catch-up, not a full sweep; the
next full sweep should run at the next phase close.

- **`npm audit` (production deps):** 49 vulnerabilities — 2 low / 20
  moderate / 25 high / 2 critical (was 24 high / 5 critical at baseline).
  Spot-check shows the same shape as the baseline: DOMPurify, PrismJS,
  picomatch — Studio/CLI toolchain, not visitor-serving code. Real
  remediation remains the major `sanity` upgrade **queued behind Gate-1**.
- **Secret scan (this branch's diff):** docs and marketing-copy changes
  only; no credentials touched. Footer email switched to
  `support@elevatetrainingcamps.com`; the residential street address was
  removed from the public footer.
- **Live credentials:** not re-verified in this entry (see `06-billing.md`
  for last-known state: HubSpot 401 / O-3, Stripe absent / O-1). One
  observation: the Sanity **content API answered reads normally** on
  2026-07-30 via MCP — worth re-testing the site's own token, since the 402
  billing block may have lifted.
- **Content-liability fixes shipped on this branch** (not security, logged
  for the record): fabricated `/registration` pricing removed; invented
  operating history removed from `/about`, `/media` and the newsletter
  auto-reply; dead footer legal links removed until Phase 4 ships real
  policy pages.

## 2026-07-27 — Phase 0 closing sweep (baseline)

- **Secret scan:** regex sweep over the complete Phase 0 diff (PRs #2–#4,
  lockfile excluded) — clean; the only credential-shaped hit was a placeholder
  line deleted with the old `CONTACT_FORM_SETUP.md`. New docs use `****` masks
  only.
- **`npm audit` (production deps):** 2 low / 18 moderate / 24 high / 5
  critical — **every high/critical traces to the Sanity CLI/Studio toolchain**
  (`@sanity/cli` → `decompress`, `adm-zip`, `@architect/*`, `lodash`,
  `js-yaml`, `glob`), i.e. build-time/Studio tooling bundled inside the
  `sanity` package, not code that serves site visitors. Real remediation is a
  major `sanity` package upgrade — **queued behind Gate-1** (CMS stay/leave),
  since it's wasted work if the CMS changes. Revisit at the next sweep.
- **Live credentials:** Gmail SMTP `transporter.verify()` → **OK**. HubSpot
  contacts API → **still 401** (owner action O-3 outstanding; leads are NOT
  reaching the CRM). Sanity → **still 402 billing-blocked** (owner emailed
  billing team 2026-07-26, awaiting reply). Stripe → n/a (account not yet
  created, O-1).
- **Vercel env verification:** production has exactly the 10 vars
  `.env.example` expects — full match, no drift.
- **Finding fixed during sweep:** the main checkout's `.env.local` was still
  carrying the removed `SENDGRID_*` vars and lacked the `GMAIL_*` ones —
  local dev email would have silently failed. Updated in place (file is
  gitignored).
- **Production health:** live site 200; deploys from all three Phase 0 merges
  green (final one confirmed after this entry's PR).

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
