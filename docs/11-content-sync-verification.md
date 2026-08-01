# Content sync verification — is the Studio telling the truth?

Instructions for Claude (and anyone else) to verify that Sanity Studio
content actually connects to what the web pages display. Run this after
any schema change, page rewrite, content migration, or whenever the owner
suspects the Studio and the site disagree.

**Why this exists.** The dangerous failure mode on this site has never
been "the CMS is down" — it's *the page renders something the Studio
doesn't hold*. That's how fabricated pricing shipped (hard-coded fallback
rendering while the CMS sat empty), and how the nav confused the owner
(empty logo fields while a code fallback rendered). A CMS is only useful
if editing it changes the site and reading it tells you what the site
says.

---

## The dispute rule (owner directive, 2026-08-01)

**When the rendered page and Sanity disagree, the page wins.**

- If the live page shows copy/imagery that Sanity lacks (or holds a
  different value for), patch **Sanity to match the page** — never
  "correct" the page to stale Sanity content without the owner asking.
- The one exception: if the page is rendering something that violates the
  business-plan copy guardrails (`business-plan/WEBSITE-SYNC.md`), stop
  and surface it to the owner instead of syncing it into the CMS.
- Apply the single-writer rules from `10-sanity-content-plan.md` §4 when
  patching: re-query first, pass `ifRevisionId`, publish, then re-run the
  check.

## 1. The automated check

```bash
npm run check:content                              # against production
npm run check:content -- --base http://localhost:3000   # against dev/local
```

`scripts/check-content-sync.mjs` queries every page's backing documents
via GROQ and asserts each checked text field appears in the rendered HTML
(entity-normalized) and each checked image field's asset hash appears in
an image URL. It also checks site chrome: the `siteSettings` favicon and
nav-logo assets must appear in the served markup. Exit 0 = in sync.

**Timing caveat:** pages revalidate on a 300-second ISR window
(`REVALIDATE_SECONDS` in `src/lib/queries.ts`). After editing the CMS,
wait ~5 minutes before judging a production mismatch as real drift.
Browser favicon caches are far stickier than that — verify icons from the
served HTML, never from a browser tab.

**Keep the script's coverage honest:** when a schema gains a rendered
field or a new page type ships, add it to the route table in the script
in the same PR. A sync check that doesn't know about a field will happily
pass while that field drifts.

## 2. Manual spot-checks the script can't do

1. **Edit propagation** — the strongest proof of connection. In the
   Studio, make a trivial edit to one field (e.g. append " ✓" to a
   heading), publish, wait out the ISR window (or run against `npm run
   dev`, which renders fresh), confirm the page changed, revert, publish
   again. Do this against dev, not production, unless the owner is
   watching.
2. **Fallback hunting** — the fabricated-pricing failure mode. For each
   page component, confirm that when the CMS query returns data, no `||`
   / `??` default or hard-coded sibling copy renders instead of it. Grep
   for `|| "` and `?? "` in `src/app/**/page.tsx` and inspect each hit
   against the exceptions table below.
3. **Studio surface check** — everything rendered should be *findable* in
   the Studio sidebar (structure.ts). If a page renders a field no Studio
   section exposes, editors can't edit what they're seeing; fix the
   structure.

## 3. Route → document map (what backs what)

| Route | Documents | Studio location |
|---|---|---|
| `/` | `homePage` (singleton, UUID id) + `sponsor` docs | Home Page → Page Content / Sponsors & Partners |
| `/about` | `aboutPage` + `aboutSection` docs + `teamMember` docs | About Page group |
| `/registration` | `registrationPage` + `teamBlock` docs (prices live ONLY here — `npm run check:pricing`) | Registration Page group |
| `/recruiting` | `recruitingPage` (no price fields — Gate-7) | Recruiting Page |
| `/faq` | `faqPage` + `faq` docs (categorized) | FAQ Page group |
| `/media` | `mediaPage` + `mediaItem` docs | Media Page group |
| `/contact` | `contactPage` + `siteSettings` (email/phone) | Contact Page + Site Settings |
| site chrome | `siteSettings`: favicon, logo, logoOnDark, title, description | Site Settings |

## 4. Deliberate non-CMS content (do NOT flag these as drift)

| What | Where | Why it's code |
|---|---|---|
| Masthead eyebrows on about/faq/media/contact ("About Elevate", "Questions & answers", "Photo & film", "Get in touch") | page files | Structural labels, not copy — promote to CMS only if the owner asks |
| Form field labels, placeholders, validation messages | `ContactForm.tsx`, `lib/contact.ts` | UI, not content (docs/10 §5) |
| Transactional email bodies | `api/contact`, `api/newsletter` | Deliberately code (docs/10 §5) — a bad edit breaks deliverability silently |
| Neutral empty states ("This page is being updated…") | each page's `!content` branch | Render only when the CMS returns nothing; carry no marketing claims |
| BrandLogo fallback | `LayoutClient.tsx` | Renders only if the Studio logo fields are emptied — outage insurance |
| FAQ category headings + "General" bucket | `faq/page.tsx` | Fixed taxonomy matching the schema's category list |
| Contact "Based in / response time" note | `contact/page.tsx` | Page furniture; promote if the owner asks |

## 5. Report format

After a run, report: routes checked · field checks passed/failed · each
mismatch as `route · field: page shows X, Sanity holds Y` · the action
taken under the dispute rule (patched Sanity / surfaced guardrail
conflict) · and a re-run confirming green.

Last full verification: **2026-08-01 — 123/123 field checks passed**
against production (all seven routes + site chrome).
