# Sanity content plan — governance, sequencing, write-safety

Written 2026-07-30, after a week in which three branches (#14 homepage CMS
wiring, #16 token remap, #19 audit rewrite) edited overlapping surfaces, a
CMS content migration ran concurrently in another session, and automated
Sanity writes were repeatedly blocked by the permission layer. This doc is
the coordination contract for anything touching Sanity — content, schema, or
the pages that read them. It complements `03-sanity-studio-guide.md` (how the
Studio works) and `../../business-plan/WEBSITE-SYNC.md` (what business
decisions flow to which surface).

> **Owner decision 2026-07-30: everything goes into Sanity.** Almost all
> content — every piece of text and media an owner could reasonably want to
> change — must be manageable from the Studio, with a section per page. The
> copy-in-code state of `/`, `/recruiting` and `/registration` is an
> **interim liability fix**, not the destination: copy went into code only
> because the old schema modelled the wrong business and its CMS content
> violated the guardrails. Section 5 is the migration plan; section 1 is the
> interim state it retires.

## 1. Surface ownership — who renders what, today (interim)

| Surface | Source of copy | CMS role |
|---|---|---|
| `/` homepage | Code (until PR #14 lands, then `homePage` doc) | Media now; full copy after #14 |
| `/recruiting` | Code (deliberate — Gate-7/Gate-5 constraints in the file header) | None |
| `/registration` | **CMS (Wave 1 shipped 2026-07-30)** — `registrationPage` singleton + `teamBlock` docs, seeded with the compliant copy; neutral empty state, no copy fallback | `registrationPage`, `teamBlock` (prices live here only; `npm run check:pricing` verifies) |
| `/about` | Hybrid: hero in code, sections + team from CMS | `aboutSection`, `teamMember` |
| `/faq` | CMS | `faq`, `siteSettings.faqPage` |
| Site-wide `<meta>`, manifest, favicon | CMS | `siteSettings` |
| `/media`, `/contact`, `/style-guide` | Code | None |
| Legacy types (`coachingProgram`/`Benefit`/`Testimonial`, `trainingPackage`, `upcomingCamp`, `paymentOption`, `whatsIncluded`) | — | **Render nowhere.** Coaching docs deleted 2026-07-30 (owner-approved); types come out in the Phase 1.5 reshape |

**Rule: check this table before writing copy anywhere.** If a surface is
copy-in-code, editing the CMS does nothing; if it's CMS-driven, editing code
fallbacks does nothing (they render only when the query returns empty).

## 2. Outstanding CMS content fixes (owner approval per batch)

Live content that still violates the business plan's guardrails, in severity
order — proposed replacement copy exists in the 2026-07-30 audit session and
project memory (`audit-2026-07-30`):

1. FAQ `c662284e-…` — "explicitly provides a house to stay in, as well as a
   van" → facilitate-don't-operate wording. Sharpest liability line on the
   site.
2. aboutSection "Our Mission" `a1f3c990-…` — "We handle the housing,
   transportation, and logistics" → partner-referral wording.
3. FAQ `3cb9827a-…` — "working to nail down a house" → shortlist wording.
4. FAQ `182b91a5-…` — Nike Outdoor Nationals / Olympics framing → team-block
   positioning, no race-outcome adjacency.
5. `siteSettings` `97caa6af-…` — meta description "across the United States"
   → accurate one-location description; trim the trailing-space title.
6. aboutSection "Our Locations" `cac0cfdf-…` — drop the St. Moritz / Park
   City / Boulder / Dullstroom expansion claim.
7. `homePage.testimonials` — remove "Will Squared" (founder-authored). **Do
   this only after re-querying `homePage`** — a concurrent session migrated
   real homepage content into that document on 2026-07-30.
8. Draft `drafts.a1be3785-…` ("Pricing") — discard. It is the origin of the
   fabricated price ranges and is one rename away from publishing (the only
   guard is a title filter in `AboutPageContent.tsx` and `LayoutClient.tsx`).

## 3. Branch and merge sequencing

Current open work touching these surfaces: **#14** (homepage → CMS), **#16**
(token remap: registration/FAQ/contact/about), **#19** (audit rewrite:
registration/FAQ/about/media/footer).

- **Merge order: #19 → #16 (rebased) → #14.** #19 rewrote
  `registration/page.tsx` wholesale, so #16's hex edits to that file are
  obsolete after rebase; its FAQ/contact/about edits should survive. #14
  merges last and must verify the `homePage` document carries the migrated
  copy (and that item 2.7 above has been applied) before wiring the page to
  it.
- **One open branch per route.** Before touching a route, list open PRs and
  check for overlap; if another branch owns the file, coordinate in the PR
  or wait. The #16-vs-#19 collision was avoidable this way.
- **Schema changes ride with the code that reads them** — a schema edit, its
  queries, its types, and the page section land in one PR (already the
  convention; keep it).

## 4. Single-writer rules for CMS documents

- **One session edits a given document at a time.** Record any in-flight CMS
  migration in project memory before starting it, the way the homepage
  migration was recorded — that record is what saved `homePage` from being
  clobbered by the audit session's queued patch.
- **Re-query immediately before patching.** Never patch from content read
  earlier in a session (or from an audit report); pass `ifRevisionId` so a
  concurrent edit fails the patch instead of being silently overwritten.
- **Deletion protocol** (learned 2026-07-30): delete referencing documents
  before referenced ones (`coachingTestimonial` held a strong reference to a
  `coachingProgram`; unpublish fails otherwise). Full delete = unpublish,
  then discard the draft. Prefer unpublish-only when there is any doubt —
  it is reversible.

## 5. Full CMS-ification (the Phase 1.5 reshape, expanded per the 2026-07-30 owner decision)

Target: **one Studio section per page**, every text and media field
editable, no marketing copy living in `.tsx` files. Executed as one wave per
page, each wave = schema + seeded content + wiring + verification in a
single PR (rule from §3).

### Content model (per-page singletons + shared documents)

| Type | Kind | Carries |
|---|---|---|
| `siteSettings` | singleton (exists) | Title/meta, footer contact (phone, email, city line), social links, legal-page links once Phase 4 ships them |
| `homePage` | singleton (exists; PR #14 wires it) | Hero heading/sub/video, editorial sections, stats, standards, CTA |
| `registrationPage` | singleton (new) | Masthead, intro, included/not-included lists, booking steps, fine-print cards, CTA — plus references to `teamBlock` |
| `teamBlock` | document (new) | Name, tagline, base fee, per-athlete rate, example line, detail, season label. **The only place prices live.** |
| `recruitingPage` | singleton (new) | Masthead, stat band, watched/never card lists, pull quote, family/coach sections, CTA, NCAA footnote. **Schema has NO price fields — that is Gate-7 enforced structurally.** |
| `aboutPage` | singleton (new) | Hero copy + stat chips (currently hard-coded in `AboutPageContent.tsx`); keeps existing `aboutSection` + `teamMember` lists |
| `mediaPage` | singleton + `mediaItem` docs (new) | Intro copy; gallery items (image or Mux video, caption, order) — lands with Phase 3 / Gates 3–4 |
| `contactPage` | singleton (new) | Heading, intro, any explanatory copy around the form (field labels stay in code — they're UI, not content) |
| `faq` / `faqPage` | exists / new | Move the FAQ page title/intro/image out of `siteSettings` into a proper `faqPage` singleton (fixes known defect #1) |

Email templates (`api/contact`, `api/newsletter` bodies) are the one
deliberate exception — they stay in code (they're transactional, and a bad
edit breaks deliverability silently). Revisit only if the owner asks.

### The rules that prevent a repeat of the fabrication incident

1. **Seed before wire.** For each page: create + publish the CMS documents
   with the current compliant copy (via MCP `create_documents`/`publish`),
   verify in Studio, and only then merge the code that reads them. A page
   never ships reading an empty type.
2. **No copy-carrying fallbacks, ever.** If a query returns nothing, render
   a minimal neutral empty state (or omit the section) — never a parallel
   hard-coded copy of the content. Divergent fallbacks are exactly how the
   invented $1,200/$1,800/$2,800 tiers ended up live.
3. **Prices only in `teamBlock`,** and a **CMS drift check** (sibling of the
   package `check-sync.sh` scripts) that GROQ-queries `teamBlock` and diffs
   against `../../business-plan/PRICING.md`'s canonical block. Run it in CI
   or at minimum before every content session ends.
4. **Guardrails travel into the Studio.** Every guardrail-sensitive field
   gets a `description` stating its constraint (e.g. recruiting fields: "no
   placement promises, no pricing — see WEBSITE-SYNC.md guardrails"), and
   `recruitingPage` simply has no fields that could hold a price.
5. **Verify by diffing rendered HTML.** After each wave, the built page must
   render byte-identical copy to the pre-wave code version (whitespace
   aside). Any diff is either a seeding mistake or an unapproved copy change.

### Wave order (after #19 → #16 → #14 merge, one PR each)

1. **Wave 1 — `/registration`: ✅ DONE 2026-07-30** (on the PR #19 branch,
   which already owned the route). `teamBlock` + `registrationPage` schemas,
   documents seeded and published with the compliant copy (fixed IDs
   `teamBlock-3wk`, `teamBlock-1wk`, `registrationPage`), page wired with a
   neutral empty state, `scripts/check-cms-pricing.mjs` + `npm run
   check:pricing` passing 4/4, built HTML verified identical to the
   pre-wave copy.
2. **Wave 2 — `/recruiting`:** `recruitingPage` (price-less schema).
3. **Wave 3 — `/about` hero + `/contact` + `faqPage`** (the siteSettings
   FAQ-field migration is a content migration — do it in this wave).
4. **Wave 4 — `/media`:** `mediaPage` + `mediaItem`, gated on Gates 3–4
   (hosting decision + photo consent); this is roadmap Phase 3.
5. **Wave 5 — cleanup:** remove legacy types (`coachingProgram`,
   `coachingBenefit`, `coachingTestimonial`, `trainingPackage`,
   `upcomingCamp`, `paymentOption`, `whatsIncluded`), their queries, the
   inert `logo` field, and the favicon tangle; restructure the Studio
   sidebar so each nav page maps to its singleton + lists.

After Wave 5, `03-sanity-studio-guide.md` needs a rewrite (its sidebar tree
and "feeds nothing" warnings all change) — budget that into the wave.

## 6. Write-safety and permissions

The permission layer treats Sanity mutations as production writes (they
are — no deploy, instantly live) and blocks them unless the owner has
clearly approved in-conversation. The coaching-doc deletion went through
once the owner said so explicitly; the earlier unprompted batch was blocked.

Working agreement:

- **Reads are always fine** (`query_documents`, `get_document`,
  `get_schema`) — allowlist them if prompts appear.
- **Content writes need an explicit owner instruction in the conversation**
  naming what changes ("fix the FAQ housing answer", "delete the coaching
  docs"). Batch them: propose the exact copy, get one approval, apply the
  batch. This is the default and it stayed workable today.
- **Allowlist in force (owner decision 2026-07-30):**
  `mcp__Sanity__patch_documents` and `mcp__Sanity__publish_documents` are
  allowlisted in the owner's user-level Claude Code settings, so sessions
  can patch and publish content without prompting. This makes the
  single-writer rules in §4 (re-query first, `ifRevisionId`, record
  migrations in memory) **mandatory, not advisory** — the permission layer
  no longer catches a stale or conflicting write. Destructive ops
  (`unpublish_documents`, `discard_drafts`) and schema deploys remain
  prompted.
- **Schema deploys** (`deploy_schema`/`deploy_studio`) always ride a PR and
  a human approval — never allowlist.
