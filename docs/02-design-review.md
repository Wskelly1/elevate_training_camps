# Design review — elevatetrainingcamps.com

A working critique of the live site as of 2026-07-29, based on driving every
page and interacting with every component (desktop 1440, mobile 390). Written
to be blunt, because vague design feedback is useless.

> **Status 2026-07-30:** this is a point-in-time document; the prioritised
> list at the bottom is not all open. Items 1 (scroll hijack) and 3 (video
> chrome) shipped in A2.5a; item 2's placeholder text was replaced with an
> honest coming-soon page (the real gallery is still Phase 3); the
> Registration critique was resolved by the 2026-07-30 rebuild. Items 5–10
> remain open — tracked in `01-roadmap.md` Phase 2.5b.

---

## The verdict in one paragraph

**You have better raw material than the site currently deserves.** The
photography is genuinely excellent — that Flagstaff sunrise, the dirt-road
running shots, the track team under the peaks. The palette is right. The
Instrument Serif choice is right. What's missing is *composition*. Every page
is currently a vertical stack of centred, self-contained boxes with the same
rhythm: centred heading, centred subhead, a row of cards, next section. That
is precisely the PowerPoint feeling — each section is a slide rather than
part of a continuous document. Nothing overlaps, nothing bleeds off the edge,
nothing varies in density, and nothing carries your eye from one section to
the next. The fix is not more decoration. It is fewer, larger, braver
compositional moves.

---

## The core diagnosis

Three structural habits produce the "PowerPoint" read. Everything else is
downstream of them.

**1. Everything is centred, and everything is contained.**
Every page opens with a centred icon, a centred heading, and a centred
paragraph, then drops into a symmetrical card grid inside a `max-w-7xl`
container. Centred symmetry is *restful* — which is exactly wrong for a
brand about ascent and effort. It reads as institutional, not editorial.
Tracksmith almost never centres a headline; it sets type left, lets images
run to the edge, and varies column widths so the eye has somewhere to go.

**2. Sections are sealed boxes stacked on a shelf.**
Section backgrounds alternate cream / white with hard horizontal seams and
uniform vertical padding (`py-20` almost everywhere; measured section heights
run 906 / 584 / 584 / 908). There is no overlap, no element ever crosses a
section boundary, no full-bleed image interrupts the rhythm. The result is
visually metronomic. Real editorial layouts vary section density
deliberately — a tight text block, then a huge silent image, then a dense
data table.

**3. Whitespace is accidental rather than composed.**
This is the most damaging one and it's most visible in the homepage "What we
are" section: a ~460px-tall photo sits beside a ~140px paragraph, leaving a
enormous dead void under the text. That isn't generous whitespace, it's an
unbalanced two-column grid. Same story on the FAQ page, where the intro block
is left-aligned at x≈112 but the accordions start at x≈336 — **two different
left edges on the same page**. The eye notices misalignment even when the
viewer can't name it.

---

## The homepage hero: the single biggest problem

You called the video component "disgusting." I'd go further — it's actively
hostile, and I can show it rather than assert it.

**Measured behaviour on load:**

| Moment | `body` overflow | `window.scrollY` | `<video>` in DOM |
|---|---|---|---|
| Page load | **`hidden`** | 0 | **no** |
| After ~3 wheel notches | `auto` | 300 | yes |
| After ~6 wheel notches | `auto` | **900** | yes |

Read that top row again: **the page disables scrolling the moment it
loads.** A visitor's first interaction with your business is their scroll
wheel not working. They don't perceive "cinematic reveal," they perceive
"broken page." And when the hijack does release, scroll position jumps
discontinuously from 0 to ~900px — the page lurches.

It gets worse on inspection:

- **The video renders with raw, unstyled browser controls** — a black bar
  with a play button, `0:00 / 0:03`, a volume icon, fullscreen, and a
  three-dot kebab menu. On a brand positioning itself as high-end, this
  looks like a file someone dropped into a page. It is the single most
  off-brand element on the site.
- **The clip is three seconds long.** That is a GIF, not a film. Three
  seconds cannot carry a hero moment; looped, it becomes a twitch.
- **It doesn't autoplay** — it sits paused behind a play-button overlay, so
  the "cinematic" hero is in practice a still frame with a UI control on it.
- **The nav disappears** partway through the sequence, so mid-experience
  there is no way to navigate.
- The `<video>` element **isn't in the DOM at page load at all**; it mounts
  once expansion starts, so the transition is a pop-in rather than a reveal.

**Prescription.** Delete the scroll-hijack entirely. Never take scroll away
from a user — it is the one interaction they own. Replace it with a
full-bleed, muted, auto-looping background video behind the headline, nav
floating over it, with a normal page scrolling normally underneath. If you
want motion tied to scroll, use a *subtle parallax* (background moves at
0.5× scroll speed) — that reads as depth and costs the user nothing. The
Under Canvas reference you liked does exactly this: video plays, you scroll,
nothing fights you.

Separately: the current hero **still image** has the headline in near-black
serif sitting over mid-tone grass and dead sticks — the busiest, lowest-
contrast part of the frame — with no scrim. The subhead is barely legible.
Meanwhile the top third of that photograph is a clean gradient sky doing
nothing. Move the type into the sky, or add a soft dark gradient behind it
and set the type in cream.

---

## Component-level findings

### Testimonial carousel — rebuild, don't patch
The worst-looking component on the site. Currently the card is **rotated at
an angle** mid-interaction so it reads as a rendering bug; the quote is dark
text laid **directly over a busy photograph of people's faces**, at low
contrast; a **circular avatar overlaps the card centre**, cropping across
those same faces; and **the same photo is used as both the card background
and the avatar**, which is visually redundant and confusing. The copy
currently in production — *"flagstaff is awesome, come visit!"* attributed to
*"will squared, athlete"* — reads as a placeholder that escaped. Then the
whole thing floats alone in a very large empty area with two navigation
arrows stranded in the bottom-right corner, disconnected from the card they
control.

A testimonial should be quiet: generous type, plenty of air, attribution
small and confident, photo *beside* the quote rather than under it. Let the
words carry it.

### FAQ page — clip-art and a broken grid
A pine tree PNG with a transparent background floats on the cream field with
no ground, no frame, no relationship to anything. It reads as clip-art
dropped onto a slide. Either art-direct it properly (a real photograph, or a
drawn mark that belongs to the brand system) or remove it. The accordion
group is also misaligned with the intro block above it (two different left
edges), and the disclosure marker is an unstyled `▸` text glyph. There are
three questions on a page with room for fifteen.

### Media page — this should not be public
The page currently renders a **bulleted list describing photographs that do
not exist**:

> • Photo: Campers at sunrise on Buffalo Park Trail
> • Video: Coach's welcome speech (2023)
> • Photo: Group run through the pines

This is scaffolding that shipped. Anyone who clicks Media in your nav sees
it. Given that ~195 real camp photos are already sitting in `media-source/`,
this is the highest embarrassment-to-effort ratio on the whole site — and
it's also the page with the most upside, because your photography is your
strongest asset.

### Registration — the card-grid problem at its worst
Three pricing tiers, three camp cards, four "what's included" columns, three
payment tiles: four consecutive card grids. Nothing modulates. Two of the
three pricing CTAs are also **near-black `bg-gray-900` buttons**, which are
off-palette and read as a different design system than the green ones beside
them. And the prices shown are still invented placeholders.

### Nav and header
Good news first: the header now reads as one typographic system, and the
About dropdown looks right after the de-bold. Two issues remain. The header
is a floating cream pill sitting **above** the hero with a visible white band
between them, which breaks the full-bleed illusion — the hero should run
behind a transparent nav. On mobile, the open menu leaves the page behind it
scrollable (`body` overflow stays `visible`), and the close button uses a
pink/red tint that isn't in the palette.

### Residual bold — from the CMS, not the CSS
Five `<strong>` elements remain on the homepage (*"training, recovery, and
performance"*, *"runner, cyclist, or triathlete"*, and three instances of
*"Elevate"*). These come from **Portable Text marks authored in Sanity**, so
the CSS de-bold couldn't reach them. Two options: restyle `strong` to use
colour or letter-spacing rather than weight, or remove the marks in the
Studio. Worth deciding, because right now the only bold text on the site is
inconsistent with everything around it.

---

## What "refined rustic" should actually mean here

Right now the phrase is aspirational. Concretely, it should mean:

**Editorial, not brochure.** Left-aligned headlines. Asymmetric two-column
layouts where the text column is genuinely narrow (~60ch) and the image
column is genuinely large. Occasional single-sentence pull-quotes set large,
alone, with air around them.

**Photography as structure, not decoration.** At least two full-bleed,
edge-to-edge images per page that break the container and give the scroll a
change in pressure. Your photos are good enough to carry this; currently
every one of them is politely boxed with the same rounded corner and drop
shadow, which flattens them all to the same visual weight.

**Texture and warmth.** "Rustic" is currently only doing work through colour.
It should also come from grain (a very subtle paper/noise overlay on cream
sections), from rules and hairlines rather than boxes and shadows, and from
letting the serif get genuinely large — 72–96px headlines, not 48.

**Restraint in motion.** Slow fades and small parallax on scroll. No
hijacking, no bounce, no tilt. Motion should feel like weight, not like
javascript.

**Hierarchy without weight.** You've already removed bold, which is correct.
Fill the gap with *scale* (much bigger jumps between heading levels), *space*
(more air above a heading than below it, so headings group with their
content), and *colour* (Trail Brown and Red Rock for emphasis instead of
heavier type).

---

## Prioritised fix list

Ranked by impact per unit of effort.

| # | Fix | Why it's here |
|---|---|---|
| 1 | **Kill the scroll hijack.** Full-bleed autoplaying muted loop, nav over it, normal scroll. | It's the first thing every visitor experiences and it currently breaks their scroll. |
| 2 | **Replace the Media page** with a real gallery from `media-source/`. | Placeholder text is publicly visible; the assets already exist. |
| 3 | **Hide the native video controls**, autoplay muted, loop. | One attribute change; removes the most off-brand element on the site. |
| 4 | **Fix the hero type** — into the sky, or a scrim, set in cream. | Legibility, on the single most-viewed screen. |
| 5 | **Rebuild the testimonial card.** Quote beside photo, no rotation, no overlap. | Currently reads as a bug. |
| 6 | **Introduce a real layout system** — left-aligned headlines, asymmetric columns, two full-bleed breaks per page. | This is the actual cure for the PowerPoint feeling. |
| 7 | **Fix vertical rhythm** — balance the two-column sections, unify left edges, vary section density. | Removes the dead voids. |
| 8 | **Retire the dark `gray-900` buttons**; unify on the palette. | Off-brand inconsistency. |
| 9 | Longer hero footage (15–30s), or a still. | Three seconds cannot carry a hero. |
| 10 | Resolve residual `<strong>` marks from the CMS. | Last remaining bold, and it's inconsistent. |

Items 1–5 are each small, self-contained, and individually visible. Item 6
is the real design work and should follow an agreed direction rather than
being improvised.

---

## What is already working — keep it

- The photography. Genuinely strong, and under-used.
- The palette, and the decision to ground it in those photos.
- Instrument Serif, and the choice to run it at regular weight.
- The logo lockup, and the nav now matching it.
- The cream/green/brown relationship. It's warm without being twee.
- The footer, which is the best-composed block on the site — clear columns,
  sensible hierarchy, comfortable density. It's a useful proof that the
  system can produce good layout when the grid is respected.
