# Documentation — Elevate Training Camps app

**Scope:** how this app is planned, built, operated and paid for. Not the camp
business itself — that lives in `../../business-plan/`, which is the source of
truth for what is sold, at what price, to whom, and with what promises.

Same convention as the sibling folders in `pro-fleet/elevate-training-camps/`:
numbered documents in reading order, an index here, and history kept in the
document that owns it rather than scattered across the tree.

## Read in this order

| # | Document | What it answers |
|---|---|---|
| **01** | [`01-roadmap.md`](01-roadmap.md) | **Start here.** Phases, decision gates, the owner action queue, and how Claude operates on this repo. §5.5 is the positioning brief every piece of copy must satisfy. |
| **02** | [`02-design-review.md`](02-design-review.md) | The blunt critique of the site as it stood on 2026-07-29, with measured evidence. Drives Phase 2.5. |
| **03** | [`03-sanity-studio-guide.md`](03-sanity-studio-guide.md) | How to edit site content without touching code, and why the Studio is organised the way it is. Written for non-developers. |
| **04** | [`04-email-setup.md`](04-email-setup.md) | Gmail SMTP + HubSpot runbook for the contact and newsletter forms. |
| **05** | [`05-video-playback.md`](05-video-playback.md) | How video works here, and the HLS branch-ordering trap that silently breaks playback outside Safari. |
| **06** | [`06-billing.md`](06-billing.md) | Every paid service, tier, renewal date and paying account. |
| **07** | [`07-security-log.md`](07-security-log.md) | Dated sweep entries. Append-only. |
| **08** | [`08-contributing.md`](08-contributing.md) | Code and commit conventions actually used in this repo. |
| **09** | [`09-architecture.md`](09-architecture.md) | How the app works end to end — rendering model, the caching rules that keep Sanity inside its free tier, integrations, and the known debt. |
| **10** | [`10-sanity-content-plan.md`](10-sanity-content-plan.md) | The coordination contract for Sanity: surface ownership, pending content fixes, branch sequencing, single-writer rules, the Phase 1.5 reshape, and CMS write-safety. |
| **11** | [`11-content-sync-verification.md`](11-content-sync-verification.md) | How to verify the Studio actually connects to what the pages render (`npm run check:content`), and the dispute rule: the page wins. |

## Where content lives

Two places, and the distinction decides who can change something:

| Layer | Path | Who edits | Use for |
|---|---|---|---|
| **Sanity CMS** | `/studio` | Anyone, no deploy | Values — prices, dates, FAQ answers, copy, images |
| **Code** | `src/` | Developer + deploy | Shape — new pages, new fields, structural changes, navigation |

Changing a *value* is Sanity. Changing the *shape* of what can be expressed is
code. Full mapping from business decision to site surface:
`../../business-plan/WEBSITE-SYNC.md`.

## Related, outside this repo

- `../../business-plan/` — strategy, pricing, five-year model, risk register.
  **Read `WEBSITE-SYNC.md` there before acting on any business change**, and
  `CHANGELOG.md` before proposing anything: several obvious ideas are already
  tested and rejected.
- `../../investor-package/` — the F&F debt raise.
- `../../grant-research/` — why no grant buys land for a for-profit LLC.
- `../../BUSINESS-SETUP.md` — LLC, insurance, bootstrap budget.
