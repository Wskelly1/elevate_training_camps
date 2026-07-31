# Sanity Studio — content editing guide

For anyone editing site content (owner, coaches, staff). No code required.

Open the Studio at **https://elevatetrainingcamps.com/studio** (or
`http://localhost:3000/studio` when running locally) and sign in with your
Sanity account.

---

## How the Studio is organised, and why

The sidebar mirrors **the website's own navigation**, not the underlying
database. The reasoning: an editor thinks *"I need to update the
Registration page"* — not *"I need to edit a `trainingPackage` document."*
So every content type is nested under the page it feeds.

```
Elevate Training Camps
├── Site Settings              ← global: contact details, social links, meta
├── Home Page                  ← hero video, content sections
│   ─────────
├── Registration Page
│   ├── Page Copy              ← every piece of /registration text
│   └── Team Blocks (pricing)  ← the two products; the ONLY place prices live
├── Recruiting Page            ← every piece of /recruiting text + images
├── About Page
│   ├── Hero Copy              ← heading, intro, stat chips
│   ├── Page Sections          ← the alternating image/text blocks
│   └── Team Members           ← the staff carousel
├── Contact Page               ← heading + intro (form labels are code)
├── FAQ Page
│   ├── Page Header            ← title, introduction, image
│   └── FAQ Questions          ← the question/answer items
└── Media Page
    ├── Page Copy              ← heading, intro, note
    └── Gallery Items          ← publish NOTHING until photo consent clears
```

Three rules the structure follows:

1. **Global content sits above the first divider.** Site Settings and Home
   Page affect every visitor, so they are first and always visible.
2. **Everything else is grouped by the page it appears on**, in the same
   order as the site's own nav.
3. **Deprecated types are shown, not hidden.** Anything on its way out goes
   under the last divider clearly labelled, so content never disappears
   silently — you can always see it still exists.

> **Every page now has a Studio section (CMS-ification Waves 1–5,
> 2026-07-30).** Editing a section changes its page after the ~5-minute
> cache. Two hard rules: **prices live only on Team Blocks** and must
> match `business-plan/PRICING.md` (change PRICING.md + its CHANGELOG
> first, then the Team Block, then run `npm run check:pricing`); and
> **Media → Gallery Items stays empty** until the photo-consent gate
> clears (roadmap Gate-4). The legacy coaching/registration types were
> removed entirely in Wave 5.

### Ordering

Lists that the site renders in sequence are sorted in the Studio by their
**Order** field, so the Studio list matches what a visitor sees. To
rearrange cards on a page, change the Order numbers (lower = earlier).
This applies to training packages, camps, what's-included, coaching
programmes, benefits, testimonials, team members and FAQs.

### Why Site Settings and Home Page are lists containing one item

They *are* single-document types, but the existing documents were created
with auto-generated IDs rather than fixed ones. Presenting them as a true
one-click singleton requires pinning a specific document ID — and pinning
the wrong one would open a blank document, making it look like all the
real content had vanished. The extra click is deliberate and safe. If a
true singleton is wanted later it needs a small content migration first.

---

## What still needs filling in

**Updated 2026-07-30.** The table that used to sit here directed editors to
fill Training Packages, Upcoming Camps, What's Included and Why Choose Us.
That advice is retired: the fabricated fallbacks it was trying to displace
were removed when `/registration` was rebuilt copy-in-code, and none of those
four types is read by any page anymore (see the callout in the structure
section above). Authoring into them changes nothing on the site.

What *does* still take content today: **Site Settings**, **Home Page** media,
**About sections**, **Team Members**, **FAQs**, and **Media** assets. The
next real content task is the Phase 1.5 schema reshape (a `teamBlock` type
the Registration page can actually read), tracked in `01-roadmap.md` §5.5.

Types with real content: Site Settings, Home Page, About sections (3), Team
Members (2), FAQs (3) — plus 2 Coaching Programs and 1 Coaching Testimonial
that belong to the cut product and are queued for removal in the reshape.

---

## Editing basics

- **Publish is required.** Edits save as drafts automatically, but nothing
  reaches the live site until you press **Publish**.
- **Changes take up to 5 minutes to appear.** Pages are cached for
  performance (this is what keeps the site inside Sanity's free tier —
  see `01-roadmap.md`). If an edit has not appeared, wait rather than
  re-editing.
- **Images:** drag and drop. Use the crop tool rather than pre-cropping —
  the site generates its own sizes.
- **Order fields:** lower numbers appear first.
- **Active toggles:** unticking hides an item from the site without
  deleting it. Prefer this over deleting.

## Adding a new camp session — worked example

1. **Registration Page → Upcoming Camps → + Create**
2. Fill in date, type, location, spots remaining and early-bird details.
3. Set **Order** (e.g. `0` for the soonest).
4. Tick **Active**.
5. **Publish**, then check the Registration page after a few minutes.

---

## Known schema problems (queued, not yet fixed)

Raised by the owner 2026-07-29 after first using the reorganised Studio:

1. **FAQ page content lives in the wrong place.** The FAQ page's title,
   introduction and image are fields *inside* `siteSettings`, so they appear
   under Site Settings rather than under FAQ Page where an editor would look
   for them. They should move into their own document type surfaced under
   FAQ Page.
2. **The `logo` field is inert.** The site logo is now a hard-coded brand
   asset (`BrandLogo.tsx`); changing this field does nothing. It should be
   removed so it stops presenting as a working control.
3. **The favicon is still CMS-driven and off-brand** — it does not use the
   new twin-peak mark. It should become a static asset generated from
   `public/logo-mark.svg`, and the field removed.

Items 2 and 3 are the trailing edge of moving the logo out of the CMS; item
1 predates it. All three are structural schema edits (they change where
existing content lives), so they need a content migration rather than a
simple field move — hence queued rather than done in passing.

## Notes for developers

- Structure lives in `src/sanity/structure.ts`; schemas in
  `src/sanity/schemaTypes/`.
- Adding a new document type requires registering it in
  `schemaTypes/index.ts` **and** placing it in `structure.ts` — otherwise it
  will not be reachable in the Studio.
- The logo is no longer CMS-driven. It is a hard-coded brand asset
  (`src/components/BrandLogo.tsx`), because a logo fetched from the CMS
  meant the site degraded to plain text whenever Sanity was unreachable.
  The `logo` field in Site Settings is therefore **inert** and should be
  removed from the schema in a future content pass.
- `paymentOption` is deprecated: it models instalment plans, which
  contradicts the agreed full-payment-only checkout. It is empty and slated
  for removal alongside the Stripe work.
