# Contributing

Conventions actually used in this repo. Where a rule exists because something
went wrong, the reason is stated — those are the ones worth keeping.

## Comments

Comment the **why**, not the what. `// increment i` is noise; a note explaining
that a branch order is deliberate because Chrome lies about HLS support saves
the next person a day.

Match the density of the surrounding file. A JSDoc block on every function was
the old house style — enforced by a pre-commit hook that never actually ran,
since husky was never installed. The current standard is a file-level block
explaining a module's purpose and any non-obvious constraint, plus inline notes
where behaviour would otherwise look arbitrary.

Comments that carry real weight here — do not strip them:

- `src/app/page.tsx` — why the homepage copy lives in code rather than the CMS,
  and the three claims it must never make.
- `src/lib/queries.ts` — why every query is wrapped in `unstable_cache`.
- `src/sanity/structure.ts` — why the Studio singletons are filtered lists
  rather than pinned document IDs.

## Architecture rules

**Server Components by default.** Every page fetches its own data server-side.
Client components are for interactivity only, marked `'use client'`.

**All Sanity reads go through `src/lib/queries.ts`.** Every query is wrapped in
`unstable_cache` with a shared `REVALIDATE_SECONDS`, and every exported function
try/catches into a safe fallback. This is not decoration: uncached client-side
fetching is what previously blew through the Sanity free tier, and Sanity's
client uses `get-it` rather than native `fetch`, so Next's automatic
fetch-caching does not apply. A raw `client.fetch` in a component reintroduces
the bug.

**Pages must render when Sanity is down.** It has been quota-blocked before.
Fall back; never show "No content available."

**Colours come from tokens.** `:root` in `src/app/globals.css` is the source of
truth, surfaced through `@theme inline`. Migrating the remaining hardcoded
hexes is Phase 2 — do not add new ones.

**Headings are weight 400.** Instrument Serif ships weight 400 only, and
Google's API silently serves 400 even when 700 is requested, so `font-bold` on
a heading produces a synthesised faux bold. The base layer pins it. Do not add
bold utilities to `h1`–`h4`.

## Copy

Any user-facing string must satisfy the claims discipline in
[`01-roadmap.md`](01-roadmap.md) §5.5 — five rules covering lodging,
performance promises, track record, recruiting and session guarantees. Each is
a liability or credibility exposure, not a style preference. Read them before
writing marketing copy, and check `../../business-plan/WEBSITE-SYNC.md` when a
business decision is the driver.

## Verification before opening a PR

1. `npx tsc --noEmit` — clean.
2. `npm run lint` — zero errors.
3. `npm run build` — green.
4. Playwright at **1440** and **390**: no console errors, no horizontal
   overflow, screenshots of every affected page.

**Verify deploys with build-dependent signals.** Polling for content that
Sanity serves dynamically cannot distinguish a new build from an old one — the
same content appears on the previous deployment. Check for something only the
new code produces (a class that is now absent, a CSS variable now present).

## Commits and PRs

Present tense, imperative subject. The body explains *why*, and records
anything discovered along the way that would otherwise be lost — a bug found
while testing, a decision taken, an assumption invalidated. These messages are
the project's memory; a one-line "update homepage" throws that away.

Never commit to `main`. Branch per coherent unit, PR per branch. For
visually-affecting changes, attach desktop and mobile screenshots — approval is
a merge precondition.

## Things that are decided, not open

Before proposing a feature, check `../../business-plan/CHANGELOG.md`. A remote
coaching subscription, a paid alumni membership, individual housing referrals
and a 501(c)(3) structure were each analysed and rejected, for reasons recorded
there.
