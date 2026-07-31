# Sanity content plan — governance, sequencing, write-safety

Written 2026-07-30, after a week in which three branches (#14 homepage CMS
wiring, #16 token remap, #19 audit rewrite) edited overlapping surfaces, a
CMS content migration ran concurrently in another session, and automated
Sanity writes were repeatedly blocked by the permission layer. This doc is
the coordination contract for anything touching Sanity — content, schema, or
the pages that read them. It complements `03-sanity-studio-guide.md` (how the
Studio works) and `../../business-plan/WEBSITE-SYNC.md` (what business
decisions flow to which surface).

## 1. Surface ownership — who renders what, today

| Surface | Source of copy | CMS role |
|---|---|---|
| `/` homepage | Code (until PR #14 lands, then `homePage` doc) | Media now; full copy after #14 |
| `/recruiting` | Code (deliberate — Gate-7/Gate-5 constraints in the file header) | None |
| `/registration` | Code (rebuilt 2026-07-30 — canonical tariff in the file header) | None until the `teamBlock` reshape |
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

## 5. Phase 1.5 schema reshape (the structural fix)

The reshape in `01-roadmap.md` §5.5, sequenced:

1. Add a **`teamBlock`** type: base fee, per-athlete rate, minimum squad,
   season label, duration (`1 week`/`3 weeks`). This is the only shape that
   can express the two-part tariff — today the CMS literally cannot state
   the real prices.
2. Author the two blocks in Studio from `../../business-plan/PRICING.md`,
   then wire `/registration` to read them **with the code copy as fallback**
   only after the documents exist and match.
3. Add a **CMS drift check**: a script (sibling to the package
   `check-sync.sh` scripts) that GROQ-queries `teamBlock` and diffs against
   PRICING.md's canonical block, so CMS prices get the same protection as
   document prices.
4. Remove the legacy types + their Studio groups: `coachingProgram`,
   `coachingBenefit`, `coachingTestimonial` (documents already deleted),
   `trainingPackage`, `upcomingCamp`, `paymentOption`, `whatsIncluded` — and
   drop their queries/fallbacks (`queries.ts`, `registration` imports).
5. Fix the three known schema defects from `03-sanity-studio-guide.md`:
   FAQ-page fields stranded in `siteSettings`, the inert `logo` field, the
   CMS favicon tangle.

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
- **Optional convenience:** if prompt fatigue becomes real, allowlist
  `mcp__Sanity__patch_documents` and `mcp__Sanity__publish_documents` in
  `.claude/settings.local.json` (keep `unpublish`/`discard`/`deploy_schema`
  prompted — destructive ops should stay gated). Trade-off: any future
  session can then edit live content without asking. Decide deliberately;
  don't add it as a reflex after one blocked call.
- **Schema deploys** (`deploy_schema`/`deploy_studio`) always ride a PR and
  a human approval — never allowlist.
