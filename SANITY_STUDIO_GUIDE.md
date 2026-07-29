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
├── Site Settings              ← global: logo, contact details, social links
├── Home Page                  ← hero video, testimonials, content sections
│   ─────────
├── Registration Page
│   ├── Training Packages      ← the pricing tiers
│   ├── Upcoming Camps         ← dated camp sessions
│   └── What's Included        ← the four "what you get" columns
├── Coaching Page
│   ├── Coaching Programs      ← the programme cards
│   ├── Why Choose Us          ← the four benefit tiles
│   └── Athlete Testimonials   ← quotes with star ratings
├── About Page
│   ├── Page Sections          ← the alternating image/text blocks
│   └── Team Members           ← the staff carousel
├── FAQ Page                   ← questions and answers
│   ─────────
└── Deprecated — do not use
```

Three rules the structure follows:

1. **Global content sits above the first divider.** Site Settings and Home
   Page affect every visitor, so they are first and always visible.
2. **Everything else is grouped by the page it appears on**, in the same
   order as the site's own nav.
3. **Deprecated types are shown, not hidden.** Anything on its way out goes
   under the last divider clearly labelled, so content never disappears
   silently — you can always see it still exists.

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

As of 2026-07-28 these types are **empty**, so the site falls back to
placeholder content that was written as scaffolding — including invented
prices and testimonial names. Filling these replaces the placeholders
automatically:

| Needs content | Feeds | Currently showing |
|---|---|---|
| **Training Packages** | Registration pricing tiers | Invented tiers at $1,200 / $1,800 / $2,800 |
| **Upcoming Camps** | Registration camp dates | Invented 2025 dates |
| **What's Included** | Registration "what you get" | Generic placeholder list |
| **Why Choose Us** | Coaching benefit tiles | Generic placeholder benefits |

> **Worth doing soon.** The placeholder pricing and the invented
> testimonial names (Sarah Johnson, Mike Chen, Emma Rodriguez) are visible
> to real visitors right now. Publishing real content is the fix; there is
> no code change needed.

Types that already have real content: Site Settings, Home Page, About
sections (3), Team Members (2), FAQs (3), Coaching Programs (2), Coaching
Testimonials (1).

---

## Editing basics

- **Publish is required.** Edits save as drafts automatically, but nothing
  reaches the live site until you press **Publish**.
- **Changes take up to 5 minutes to appear.** Pages are cached for
  performance (this is what keeps the site inside Sanity's free tier —
  see `ROADMAP.md`). If an edit has not appeared, wait rather than
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
