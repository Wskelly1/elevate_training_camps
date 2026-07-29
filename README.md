# Elevate Training Camps

The marketing site and registration platform for Elevate Training Camps, a
high-altitude training camp business based in Flagstaff, Arizona.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling, with Radix UI primitives and Framer Motion for animation
- **Sanity CMS** (embedded Studio at `/studio`) for all editable content — camps, coaching programs, team members, FAQs, site settings, etc.
- **Mux** (via `sanity-plugin-mux-input`) for homepage video hosting
- **Gmail/Google Workspace SMTP** (via `nodemailer`) for contact form / newsletter email — see [`docs/04-email-setup.md`](docs/04-email-setup.md)
- **HubSpot** for contact form / newsletter lead capture (CRM)
- **Google Analytics (GA4)** for traffic analytics

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, or
[http://localhost:3000/studio](http://localhost:3000/studio) for the Sanity Studio
content editor.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. See that file for
the full list (Sanity project id/dataset, Gmail SMTP credentials, HubSpot
access token, GA measurement ID, site URL) and
[`docs/04-email-setup.md`](docs/04-email-setup.md) for how to obtain the
email/CRM credentials.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run a production build locally
- `npm run lint` — run ESLint

## Content editing

Non-technical editors can manage all site content (camp details, pricing,
team bios, FAQs, testimonials) through the Sanity Studio at `/studio` without
touching code. Schema definitions live in `src/sanity/schemaTypes/`. See
[`docs/03-sanity-studio-guide.md`](docs/03-sanity-studio-guide.md).

## Documentation

All project documentation lives in [`docs/`](docs/README.md), numbered in
reading order. Start with [`docs/01-roadmap.md`](docs/01-roadmap.md) — it holds
the phase plan, the decision gates, and the positioning brief that every piece
of site copy has to satisfy.

The business plan is **not in this repo**. It lives at `../business-plan/` and
is the source of truth for what is sold, at what price, to whom, and with what
promises; this app renders those decisions.
