import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";
import HeroVideo from "../components/HeroVideo";
import { getHomePage } from "../lib/queries";

/**
 * Home — Elevate Training Camps.
 *
 * Composition approved at Checkpoint A2.5a (see DESIGN_REVIEW.md and the
 * /mockup route it came from): a full-bleed ambient hero with the nav
 * floating over it, then alternating editorial sections that bleed off
 * opposite viewport edges, a full-bleed break, and a stat band.
 *
 * The previous IntegratedHomepage scroll-hijack is deliberately gone. It set
 * `overflow: hidden` on <body> at page load and then jumped scroll position
 * from 0 to ~900px — a visitor's first interaction with the business was
 * their scroll wheel not working.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * COPY IS INTENTIONALLY IN CODE, NOT IN THE CMS, AND ONLY FOR NOW.
 *
 * The positioning below comes from three planning documents at the project
 * root (team-altitude-block-pricing-analysis, feasibility-study-2027-2031,
 * risk-management-loss-control-plan). It contradicts what currently sits in
 * Sanity (`heroHeading` = "Elevate Training Camps", `heroSubheading` = "An
 * elevated training experience for all athletes"), which addresses individual
 * athletes rather than the coaches who actually buy.
 *
 * Wiring these strings to the existing CMS fields would render the old
 * positioning. The schema needs reshaping around the team-block product
 * before that is worth doing — that is Phase 1.5 in ROADMAP.md. Media assets
 * (the Mux clip, photography) DO still come from Sanity, because those are
 * assets rather than positioning.
 *
 * Three things this copy must not do, each load-bearing:
 *  1. Never claim lodging is provided. "Facilitate, don't operate" is a
 *     deliberate liability posture (risk register R12): refer teams to
 *     partners, never take booking custody or overnight supervision.
 *  2. Never promise the sea-level race effect. A June/July block cannot
 *     deliver it before November championships. It is sold as aerobic base
 *     development; overselling it loses exactly the sophisticated coaches
 *     this business targets.
 *  3. Never state track record the business does not yet have. No season has
 *     run. Safety language is written as the standard sessions run to, which
 *     is a commitment, not a claim of history.
 * ─────────────────────────────────────────────────────────────────────────
 */

type SanityAssetRef = { asset?: { url?: string; playbackId?: string } | null } | null;

/** Professionally shot frames. Phone snapshots and group selfies are avoided
 *  deliberately — type over faces at close range fights the type. */
const CDN = "https://cdn.sanity.io/images/yvqe54iq/production";
const IMG = {
  editorial: `${CDN}/c48d0605d78850ce8f379d5e09aea8f5587b867d-1638x2048.jpg`,
  bleed: `${CDN}/6b27b330c8812c2621133c650f7a83cf2fc491fc-3840x2160.jpg`,
  pack: `${CDN}/2edafd98ea58992f2bdd7f8c1dfe6b6a1cb82bee-2048x1638.jpg`,
  heroStill: `${CDN}/b7785c73f2955fc5e92a8a9f8cd2d075806e9f60-3024x4032.jpg`,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

const STANDARDS = [
  {
    t: "Two-deep leadership",
    d: "No adult is ever alone with a minor. Every staff member is background-screened and trained in youth protection before any participant contact.",
  },
  {
    t: "Graduated arrival load",
    d: "Reduced volume and intensity for the first three to five days. Arriving from sea level and training hard on day one is how an altitude block goes wrong.",
  },
  {
    t: "Pre-arrival iron screening",
    d: "We ask every athlete to have ferritin checked before travelling. Low iron makes an altitude block useless at best — and deficiency is common in adolescent distance runners.",
  },
  {
    t: "Published air-quality thresholds",
    d: "Flagstaff's fire season overlaps the training season. Our AQI action thresholds, training alternatives and cancellation terms are published up front, not negotiated during a smoke event.",
  },
  {
    t: "Route-specific emergency plans",
    d: "Every route has an identified shelter and a named receiving hospital, with certified wilderness first aid on session and communications carried on every run.",
  },
  {
    t: "Your staff keep their athletes",
    d: "We are a programme provider, not a camp operator. Supervision and lodging stay with your coaches and families — clearer for everyone, and safer for your athletes.",
  },
];

const STATS = [
  { n: "7,000", l: "feet of elevation", s: "Inside the 2,000–2,500m adaptation band" },
  { n: "3–4", l: "week team blocks", s: "One-week on-ramp also available" },
  { n: "8+", l: "athlete team minimum", s: "Priced as a team, not per head" },
];

export default async function Home() {
  const data = await getHomePage();

  // Every field is treated as optional: Sanity has been quota-blocked before,
  // and the page must still render rather than showing "No content available."
  const playbackId: string | undefined =
    (data?.expandMuxVideo as SanityAssetRef)?.asset?.playbackId ?? undefined;
  const heroStill: string = (data?.heroImage as SanityAssetRef)?.asset?.url ?? IMG.heroStill;

  return (
    <Layout transparentNav>
      {/* ——— Hero ————————————————————————————————————————————— */}
      <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        {playbackId ? (
          <HeroVideo playbackId={playbackId} poster={heroStill} />
        ) : (
          <Image src={heroStill} alt="" fill priority className="object-cover" sizes="100vw" />
        )}

        {/* Directional scrim — keeps type legible over any frame of the loop
            without dimming the whole picture. */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,28,20,0.74) 0%, rgba(20,28,20,0.46) 38%, rgba(20,28,20,0.06) 70%, rgba(20,28,20,0) 100%)",
          }}
        />
        {/* Short top scrim so nav links on the right stay legible. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{ background: "linear-gradient(180deg, rgba(20,28,20,0.55) 0%, rgba(20,28,20,0) 100%)" }}
        />

        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#f0ead6]/85">
                Flagstaff, Arizona · 7,000 ft
              </p>
              <h1 className="mt-5 text-6xl leading-[1.03] text-[#f0ead6] md:text-7xl">
                Train where the
                <br />
                air is thin.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#f0ead6]/90">
                Multi-week altitude blocks built for high school cross country
                teams — professional athlete access, D1 recruiting guidance, and
                the logistics handled on the ground.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
                >
                  Plan your team&apos;s block
                </Link>
                <Link
                  href="/registration"
                  className="rounded-md border border-[#f0ead6]/60 px-7 py-3.5 text-base text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
                >
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 01 · What we are — image bleeds off the RIGHT edge ———— */}
      <section className="py-16 md:py-24">
        <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-[6vw] md:pr-0">
          <div className="md:col-span-4">
            <Eyebrow>01 — What we are</Eyebrow>
            <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">
              A team altitude block, not a summer camp.
            </h2>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              Three to four weeks at 7,000 feet, sold to a programme rather than
              to individuals. We run the training environment, open doors to
              professionals and collegiate coaches, and handle coordination on
              the ground. Your coaching staff keeps their athletes; lodging is
              arranged through our local partners.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[var(--accent-trail)]">
              Built for aerobic base development during the highest-volume phase
              of your training year — not as a taper trick before championships.
              Flagstaff sits at roughly 2,100m, squarely inside the band where
              meaningful adaptation happens.
            </p>
            <div className="mt-10 border-t border-[var(--border)] pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Flagstaff, Arizona · Summer blocks
              </p>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
              <Image
                src={IMG.editorial}
                alt="Runners on the track beneath the San Francisco Peaks at sunrise"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 62vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Full-bleed break · the community flywheel ——————————— */}
      <section className="relative h-[78vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src={IMG.bleed}
          alt="Aerial view of a runner on a red dirt road through the Flagstaff pines"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(20,28,20,0.80) 0%, rgba(20,28,20,0.36) 45%, rgba(20,28,20,0) 78%)" }}
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-14 md:pb-20">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f0ead6]/70">
              High school camper · Collegiate counsellor · Professional
            </p>
            <p className="mt-5 max-w-3xl text-[2rem] leading-[1.28] text-[#f0ead6] md:text-[2.75rem]">
              Anyone can copy a training itinerary. Nobody can copy the athletes
              who came back.
            </p>
          </div>
        </div>
      </section>

      {/* ——— Stat band ————————————————————————————————————— */}
      <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.l} className="border-t border-[#f0ead6]/25 pt-6">
              <div className="text-6xl leading-none">{s.n}</div>
              <div className="mt-3 text-lg">{s.l}</div>
              <div className="mt-1 text-sm text-[#f0ead6]/65">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— 02 · Who we serve — image bleeds off the LEFT edge ———— */}
      <section className="py-20 md:py-28">
        <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-0 md:pr-[6vw]">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={IMG.pack}
                alt="A pack of athletes running into low sun on the track"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 56vw"
              />
            </div>
          </div>
          <div className="md:col-span-5">
            <Eyebrow>02 — Who we serve</Eyebrow>
            <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">
              Coaches bringing a squad.
            </h2>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              High school cross country programmes from Arizona, Nevada, New
              Mexico, California and West Texas — and collegiate groups in the
              summer and school-break windows.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              You could rent a house somewhere high and run the trip yourself.
              Flagstaff earns the trip differently: a deep resident professional
              community, university facilities, more runnable trail than you can
              cover in a month, a real town around it, and lodging that costs
              meaningfully less than the California altitude towns.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block border-b border-[var(--primary)] pb-1 text-[17px] text-[var(--primary)] transition hover:border-[var(--primary-hover)] hover:text-[var(--primary-hover)]"
            >
              Start a conversation →
            </Link>
          </div>
        </div>
      </section>

      {/* ——— 03 · How we run it ————————————————————————————
          Per the risk plan §06 these protocols are a sales differentiator as
          much as a control: they signal competence to exactly the sophisticated
          coaches this business targets. Phrased as the standard every session
          runs to — no season has been delivered, so nothing here claims
          history. */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>03 — How we run it</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            The standard every session runs to.
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((i) => (
              <div key={i.t}>
                <h3 className="text-[1.4rem] leading-snug">{i.t}</h3>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Closing CTA ————————————————————————————————— */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[2.5rem] leading-[1.08] md:text-[3.25rem]">
            Bringing a team to altitude?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
            Tell us your squad size, the weeks you have, and what you want out of
            the block. We will come back with a plan and a price.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            Plan your team&apos;s block
          </Link>
        </div>
      </section>
    </Layout>
  );
}
