# Architecture

How the app actually works, end to end. Written to be read top to bottom once,
then dipped into.

## The shape of it

A **Next.js 15 App Router** site. Every public page is a **Server Component**
that fetches its own content from **Sanity CMS** at build/revalidate time, and
ships almost no JavaScript. Interactivity is opt-in, isolated in a few
`'use client'` islands. Three integrations hang off it: Gmail SMTP for
transactional mail, HubSpot for lead capture, Mux for video.

```
Browser
   │
   ▼
Vercel edge ──► Next.js App Router
                   │
                   ├── Server Components  ──► lib/queries.ts ──► Sanity (GROQ)
                   │      (all pages)            │  unstable_cache, 300s
                   │                             └──► CDN (useCdn: true)
                   │
                   ├── Client islands           LayoutClient · HeroVideo
                   │                            ContactForm · AnimatedCarousel
                   │
                   ├── Route handlers /api/*  ──► nodemailer ──► Gmail SMTP
                   │                          └─► HubSpot CRM
                   │
                   └── /studio  ──────────────► Sanity Studio (client-side SPA)

Video: Sanity holds a Mux playbackId ──► stream.mux.com/{id}.m3u8 ──► hls.js
```

## Rendering model

Everything under `src/app/` is a Server Component unless it says otherwise.
`page.tsx` files are `async` and `await` their data directly — there is no
client-side data fetching anywhere in the public site, and adding some would
reintroduce a bug described below.

The build output tells you the model at a glance:

| Marker | Meaning | Which routes |
|---|---|---|
| `○` Static | Prerendered at build, revalidated every 300s | every public page |
| `ƒ` Dynamic | Server-rendered per request | `/api/*`, `/icon` |

Public pages carry ~200 kB First Load JS, nearly all of it the React runtime
and the layout shell. The homepage's own code is ~1 kB.

### Client islands

Five, and each exists for a specific reason:

- **`LayoutClient.tsx`** — header, nav, mobile menu, footer newsletter form.
  Needs scroll listeners and open/closed state. This is the biggest client
  component and the one to be careful with.
- **`HeroVideo.tsx`** — needs `hls.js` and the `<video>` element API.
- **`ContactForm.tsx`** — form state and submission.
- **`AnimatedCarousel.tsx`** / **`AboutPageContent.tsx`** — the About page's
  interactive team carousel.
- **`FaviconProvider.tsx`** — runtime favicon injection (see the tangle below).

The `Layout` boundary is worth understanding: `src/components/layout.tsx` is a
**Server** Component that fetches `siteSettings` and `aboutSections`, then
passes them as props into `LayoutClient`. This is deliberate — the nav needs
CMS data, but fetching it in the client meant a Sanity request on every single
page navigation.

## Data layer — `src/lib/queries.ts`

**Every Sanity read in the app goes through this one file.** It is the most
load-bearing module in the repo.

Each query follows the same three-part shape:

```ts
const REVALIDATE_SECONDS = 300;

// 1. the raw fetch, wrapped in Next's cache with a stable key
const fetchSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => client.fetch(`*[_type == "siteSettings"][0]{...}`),
  ['site-settings'],
  { revalidate: REVALIDATE_SECONDS }
);

// 2. the exported accessor, which never throws
export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = { title: 'Elevate Training Camps' };
  try {
    return (await fetchSiteSettings()) || fallback;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return fallback;   // 3. a safe default, so the page still renders
  }
}
```

Three rules follow from this, and all three are the result of real incidents:

**1. `unstable_cache` is not optional.** Sanity's JS client uses `get-it`, not
native `fetch`, so **Next's automatic fetch-caching does not apply to it**. A
bare `client.fetch()` in a component runs on every render. That is exactly what
drove this project into a free-tier quota overage: every page fetched fresh on
every visitor page load, and the layout re-fetched on every navigation.

**2. Every accessor returns a safe fallback.** Sanity has been billing-blocked
(HTTP 402) before. When that happens the site must still render. No page should
ever show "No content available."

**3. Caching is layered.** `useCdn: true` on the client gives Sanity's own CDN,
and `unstable_cache` sits in front of that. The 300s window is the trade: staff
edit content occasionally, not moment to moment, so a five-minute delay buys a
very large cut in API volume. This is why the Studio guide tells editors to
wait rather than re-edit when a change hasn't appeared.

### Types

`src/lib/types.ts` holds the CMS shapes. `SanityImageRef` models the raw image
blob (optional `_ref`/`_id`/`url`/`metadata.dimensions`) and exists so the
codebase has no `any` on CMS data. Portable Text fields are typed
`PortableTextBlock[]` from `@portabletext/types`.

## Sanity

Project `yvqe54iq`, dataset `production`, config in `src/sanity/env.ts`.

**One client, in `src/lib/sanity.ts`**, which also exports `urlFor()` for the
image URL builder. (There used to be a second client under `src/sanity/lib/`
from the Sanity starter; it was unused and has been removed. Don't reintroduce
it — two clients means two cache configurations that can silently diverge.)

### Studio

Mounted at `/studio` via `src/app/studio/[[...tool]]/page.tsx`, configured in
`sanity.config.ts`. It is a client-side SPA and is the single largest route in
the build (~1.7 MB) — this is expected and does not affect public pages, which
never load it.

Plugins: `structureTool` (custom desk), `visionTool` (GROQ playground),
`muxInput` (video upload).

**Schemas** live in `src/sanity/schemaTypes/`, registered in `index.ts`.
Adding a type requires registering it there **and** placing it in
`src/sanity/structure.ts`, or it will not be reachable in the Studio.

**Structure** (`src/sanity/structure.ts`) deliberately mirrors the website's
navigation rather than the database. An editor thinks "I need to update the
Registration page", not "I need to edit a `trainingPackage` document". Full
rationale in [`03-sanity-studio-guide.md`](03-sanity-studio-guide.md).

One non-obvious decision: the singletons (Site Settings, Home Page) are shown
as **filtered lists containing one item**, not pinned document IDs. The
existing documents have auto-generated UUIDs, so pinning would open a blank
document and look like all the content had vanished.

### CORS

Only the **Studio** needs CORS origins registered in Sanity — it queries from
the browser. The public site fetches server-side and is unaffected. This is why
a missing origin breaks `/studio` completely while the live site looks fine.

## Content vs. code — where a change belongs

| Layer | Path | Who | What |
|---|---|---|---|
| **Sanity** | `/studio` | anyone, no deploy | **values** — prices, dates, FAQ answers, images |
| **Code** | `src/` | developer + deploy | **shape** — new pages, new fields, structure, nav |

Changing a value is Sanity. Changing the shape of what can be expressed is
code. `../../business-plan/WEBSITE-SYNC.md` maps each business decision to a
surface.

**Current exception:** the homepage's marketing copy lives in
`src/app/page.tsx`, not the CMS. Sanity still holds the old individual-athlete
positioning, and wiring the new copy to those fields would render the old
message. The schema needs reshaping around the team-block product first — that
is Phase 1.5. The file's header comment explains this and lists the claims the
copy must never make.

## Styling

**Tailwind CSS v4, CSS-first.** There is no `tailwind.config.js` — a v3-style
config was present but dead (v4 uses the CSS pipeline and there was no
`@config` directive), and it has been removed.

`src/app/globals.css` has two blocks that must be read together:

- **`@theme inline`** maps Tailwind tokens (`--color-primary`, `--font-serif`…)
  onto CSS variables.
- **`:root`** defines those variables — the actual palette.

For most of this project's life the `@theme` block existed and `:root` did
**not**, so every token resolved to nothing. That is the root cause of the
roughly three hundred hardcoded hex values still being migrated in Phase 2
(293 at the 2026-07-30 count — re-count rather than trust this number).
`:root` is now the source of truth; don't add new literals.

A regression pattern worth remembering: filling in `--background` *broke* an
outline button that had only looked correct because the token was undefined
(transparent → cream, and white text vanished). When defining a token layer,
audit everything that relied on the old undefined behaviour.

**Typography.** Geist Sans for body/UI, Geist Mono, and **Instrument Serif** as
`--font-display` for headings and nav. The variable is deliberately
font-agnostic so a face swap touches `layout.tsx` only. Instrument Serif ships
**weight 400 only** — Google's API silently serves 400 even when 700 is
requested — so the base layer pins `h1`–`h4` to 400. Adding `font-bold` to a
heading produces a synthesised faux bold that smears the strokes.

## Routing map

```
src/app/
  page.tsx              /              homepage — ambient hero + editorial sections
  about/                /about         team carousel + CMS sections
  recruiting/           /recruiting    recruiting advisory, copy-in-code (replaced /coaching, O-16)
  registration/         /registration  team-block pricing — CMS-driven (registrationPage + teamBlock, Wave 1)
  faq/                  /faq
  contact/              /contact       ContactForm island
  media/                /media         honest coming-soon placeholder (real gallery = Phase 3)
  style-guide/          /style-guide   live token/type reference, noindexed
  studio/[[...tool]]/   /studio        Sanity Studio SPA
  icon.tsx              /icon          generated favicon (edge runtime)
  api/contact/          POST           email + HubSpot
  api/newsletter/       POST           email + HubSpot
  api/favicon/          GET            Sanity-derived favicon
  api/manifest/         GET            PWA manifest from siteSettings
```

`/coaching` no longer exists as a route — `next.config.ts` 308-redirects it to
`/recruiting` (O-16 repurpose, PRs #15/#17).

## Forms and integrations

Both form routes (`/api/contact`, `/api/newsletter`) follow the same pattern:

1. Validate required fields and email format; 400 on failure.
2. **If** the Gmail env vars are present, send two mails via
   `src/lib/email.ts` — a notification to the team and a confirmation to the
   sender.
3. **If** `HUBSPOT_ACCESS_TOKEN` is present, create a CRM contact.
4. Return success if **either** succeeded; 500 only if both failed.

Two consequences to be aware of:

- **The integrations are env-gated and fail soft.** If the Gmail variables are
  absent the route skips email entirely and still returns 200. Production once
  ran for a long time with only two env vars configured, so the contact form
  was silently doing nothing for real visitors. If you add an integration,
  make its absence visible somewhere.
- **A HubSpot failure is currently invisible to the user.** The response body
  carries a `results` object with per-service status, but the UI only reads
  the top-level success flag. HubSpot is 401ing right now (owner action O-3),
  which means leads reach the inbox but not the CRM.

`src/lib/email.ts` wraps nodemailer with a lazily-created, memoised Gmail
transport. Auth is a Google Workspace **App Password**, and the `from` address
is a "Send mail as" alias. Setup runbook:
[`04-email-setup.md`](04-email-setup.md).

`src/lib/contact.ts` and `src/lib/newsletter.ts` hold the shared validation and
client-side submit helpers, so the form components and the routes agree on
shapes.

## Video

Covered in full in [`05-video-playback.md`](05-video-playback.md). The short
version: Sanity stores a Mux `playbackId`, the homepage builds
`https://stream.mux.com/{id}.m3u8`, and `HeroVideo` plays it through **hls.js**.

The one thing to carry in your head: **test `Hls.isSupported()` before
`canPlayType()`**. Chrome answers `"maybe"` for every HLS MIME type and then
fails the load with `MEDIA_ERR_SRC_NOT_SUPPORTED`, silently, with nothing in
the console. Native-first ordering works in Safari and breaks everywhere else.

## The favicon tangle — known debt

Worth documenting because it looks like four bugs and is actually one design
that grew. **Four mechanisms currently serve the site icon:**

1. `layout.tsx` → `generateMetadata()` emits `<link rel="icon">` from
   `siteSettings.favicon`, falling back to the static `/favicon.svg`.
2. `layout.tsx` → a hardcoded `<head>` block with `/favicon.ico` and the
   apple-touch icons.
3. `FaviconProvider.tsx` → a **client** component that injects favicon links
   again at runtime, from the same Sanity field.
4. `/api/favicon` and `/icon` → two route handlers that each generate one,
   `/icon` on the **edge runtime** (which is why the build warns that edge
   disables static generation for that route).

They partly contradict each other, and the CMS-driven favicon is off-brand
anyway — it predates the twin-peak mark. The roadmap's resolution is to make
the favicon a static asset generated from `public/logo-mark.svg` and delete the
CMS field, collapsing all four paths into one. Until then, changing the icon in
one place may not change what a browser shows.

## Environment variables

`.env.example` is the contract. Local values in `.env.local` (gitignored);
production values live in Vercel.

| Variable | Used by |
|---|---|
| `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `GMAIL_FROM_EMAIL`, `GMAIL_TO_EMAIL` | both form routes |
| `HUBSPOT_ACCESS_TOKEN` | both form routes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 in `layout.tsx` — GA only mounts if set |
| `NEXT_PUBLIC_BASE_URL` | `/api/favicon` redirect target |

Sanity's project id and dataset are **not** env vars — they are committed in
`src/sanity/env.ts`, which is fine (they are public identifiers).

A phase-boundary sweep verifies Vercel's configured variables against
`.env.example`; see [`07-security-log.md`](07-security-log.md).

## Deployment

Vercel, auto-deploying from `main`. Pushing to `main` ships to
elevatetrainingcamps.com; the domain is fully on Vercel nameservers with TLS.

**Verify a deploy with build-dependent signals**, never with content Sanity
serves dynamically — that same content appears on the previous build too, so it
cannot tell you whether the new code is live. Check for something only the new
code emits: a class that is now absent, a CSS variable now present.

## Where the bodies are buried

A short list of things that will bite someone who doesn't know them:

- `client.fetch()` outside `lib/queries.ts` → uncached → quota burn.
- `font-bold` on a heading → faux-bold smear (Instrument Serif is 400-only).
- Native HLS check before `Hls.isSupported()` → video dead outside Safari.
- New hex literal in a component → undoes the Phase 2 token migration.
- Defining a previously-undefined CSS token → may break components that
  depended on it resolving to nothing.
- Polling Sanity content to confirm a deploy → false positives.
- `paymentOption` is deprecated with 0 documents, but `/registration` still
  renders it from a hardcoded fallback of invented instalment tiers. Schema,
  query, type and page section must be removed together.
