import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroVideo from "../../components/HeroVideo";

/**
 * Homepage mockup — Checkpoint A2.5a direction gate.
 *
 * Not linked from navigation; noindexed. Exists so the owner can react to
 * real layout rather than description. Uses the real Mux clip and real
 * Sanity photography so what is shown is what would ship.
 *
 * Everything here is a proposal. Nothing on the live homepage changes.
 */

export const metadata: Metadata = {
  title: "Homepage mockup (internal) — Elevate Training Camps",
  robots: { index: false, follow: false },
};

const PLAYBACK_ID = "fxHuJJc00bhNAmrlrVFJu6gD3RC00c00B3lpatovKjwv58";
const CDN = "https://cdn.sanity.io/images/yvqe54iq/production";

/**
 * Art direction: the three images below are the only *professionally shot*
 * frames in the CMS (golden-hour track work and a 16:9 drone plate). The
 * phone snapshots and group selfies are deliberately not used — faces at
 * close range fight any type laid over them, which is the same mistake
 * DESIGN_REVIEW.md calls out on the testimonial card.
 */
const HERO_STILL = `${CDN}/b7785c73f2955fc5e92a8a9f8cd2d075806e9f60-3024x4032.jpg`;
// 031A1281 — portrait, runners on the track against the peaks.
const IMG_EDITORIAL = `${CDN}/c48d0605d78850ce8f379d5e09aea8f5587b867d-1638x2048.jpg`;
// DJI drone plate, true 16:9 — a lone runner, big sky, no faces.
const IMG_BLEED = `${CDN}/6b27b330c8812c2621133c650f7a83cf2fc491fc-3840x2160.jpg`;
// 031A1346-2 — the pack running into the sun.
const IMG_PACK = `${CDN}/2edafd98ea58992f2bdd7f8c1dfe6b6a1cb82bee-2048x1638.jpg`;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <p className="border-l-2 border-[#b67d5e] py-1 pl-3 text-xs uppercase tracking-[0.18em] text-[#b67d5e]">
        {children}
      </p>
    </div>
  );
}

export default function MockupPage() {
  return (
    <div className="bg-[#fbf9f3] text-[#333333]">

      {/* ——— HERO: the Under Canvas treatment ——————————————————— */}
      <section className="relative h-[82vh] min-h-[560px] w-full overflow-hidden">
        <HeroVideo playbackId={PLAYBACK_ID} poster={HERO_STILL} />

        {/* Scrim: dark from the left so type stays legible over any frame */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,28,20,0.72) 0%, rgba(20,28,20,0.45) 38%, rgba(20,28,20,0.05) 70%, rgba(20,28,20,0) 100%)",
          }}
        />

        {/* A short top-down scrim so nav links on the right stay legible over
            bright frames — the left gradient alone doesn't reach them. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{ background: "linear-gradient(180deg, rgba(20,28,20,0.55) 0%, rgba(20,28,20,0) 100%)" }}
        />

        {/* Nav floats over the video — no white seam */}
        <div className="absolute inset-x-0 top-0 z-20 px-6 pt-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span className="flex items-center gap-2.5">
              <svg viewBox="0 0 200 200" width={34} height={34} fill="#f0ead6" aria-hidden="true">
                <path d="M100 16 L196 184 L140 184 L100 112 L60 184 L4 184 Z" />
                <path d="M100 132 L134 184 L66 184 Z" />
              </svg>
              <span className="leading-none">
                <span className="block font-serif text-2xl lowercase leading-none text-[#f0ead6]">elevate</span>
                <span className="mt-1 block text-[0.5rem] uppercase leading-none tracking-[0.26em] text-[#f0ead6]/70">
                  Training Camps
                </span>
              </span>
            </span>
            <nav className="hidden gap-8 font-serif text-[17px] text-[#f0ead6] md:flex">
              {["About", "Coaching", "Registration", "Media", "FAQ", "Contact"].map((i) => (
                <span key={i} className="cursor-default border-b border-transparent pb-0.5 transition hover:border-[#f0ead6]/70">
                  {i}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Left-aligned type block — not centred */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#f0ead6]/85">
                Flagstaff, Arizona · 7,000 ft
              </p>
              <h1 className="mt-5 font-serif text-6xl leading-[1.03] text-[#f0ead6] md:text-7xl">
                Train where the
                <br />
                air is thin.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#f0ead6]/90">
                An elevated training experience for endurance athletes — housing,
                transport and logistics handled, so you can focus on the work.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/registration"
                  className="rounded-md bg-[#427b4d] px-7 py-3.5 text-base text-[#fbf9f3] transition hover:bg-[#33603c]"
                >
                  See upcoming camps
                </Link>
                <Link
                  href="/about"
                  className="rounded-md border border-[#f0ead6]/60 px-7 py-3.5 text-base text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
                >
                  Our story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— A: editorial asymmetry ——————————————————————————— */}
      <div className="pt-16">
        <Label>Direction A · editorial asymmetry — narrow text, oversized offset image</Label>
      </div>
      <section className="py-14 md:py-20">
        {/* No max-width and no right padding on md+: the image column runs off
            the right edge of the viewport. Breaking the container is the whole
            point — it is what stops a section reading as a boxed slide. */}
        <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-[6vw] md:pr-0">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#b67d5e]">01 — What we are</p>
            <h2 className="mt-5 font-serif text-[2.75rem] leading-[1.06] md:text-[3.5rem]">
              An endurance organisation, not a holiday.
            </h2>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              We provide training camps in world-class altitude locations, starting
              with Flagstaff. By handling housing, transportation and logistics we
              remove the barriers that distract athletes from their true focus.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[#67563b]">
              Elevate is more than camps; it is a community built to support athletes
              on their journey to the next level.
            </p>
            {/* A hairline + meta line closes the column so the text block ends
                on a deliberate edge rather than trailing off into dead space. */}
            <div className="mt-10 border-t border-[#d3c7b4] pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#755f4f]">
                Flagstaff, Arizona · Est. 2024
              </p>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
              <Image src={IMG_EDITORIAL} alt="Runners on the track beneath the San Francisco Peaks at sunrise" fill className="object-cover" sizes="(max-width:768px) 100vw, 62vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ——— B: full-bleed break with pull quote ————————————————— */}
      <div className="pt-6">
        <Label>Direction B · full-bleed break — interrupts the scroll, changes the pressure</Label>
      </div>
      <section className="relative mt-8 h-[78vh] min-h-[460px] w-full overflow-hidden">
        <Image src={IMG_BLEED} alt="Aerial view of a runner on a red dirt road through the Flagstaff pines" fill className="object-cover" sizes="100vw" />
        {/* Bottom-up scrim only: the sky stays clean and the type sits on the
            road, which is the quietest part of the frame. */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(20,28,20,0.78) 0%, rgba(20,28,20,0.35) 45%, rgba(20,28,20,0) 78%)" }}
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-14 md:pb-20">
            <p className="max-w-3xl font-serif text-[2rem] leading-[1.28] text-[#f0ead6] md:text-[2.75rem]">
              “We train driven athletes in high-altitude environments to unlock peak
              performance where it matters most.”
            </p>
          </div>
        </div>
      </section>

      {/* ——— C: stat band ————————————————————————————————————— */}
      <div className="pt-16">
        <Label>Direction C · stat band — dense, factual, breaks up the image rhythm</Label>
      </div>
      <section className="mt-8 bg-[#24422a] py-20 text-[#f0ead6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
          {[
            { n: "7,000", l: "feet of elevation", s: "Flagstaff, Arizona" },
            { n: "4", l: "week programmes", s: "Housing and transport included" },
            { n: "All", l: "levels welcome", s: "High school to professional" },
          ].map((s) => (
            <div key={s.l} className="border-t border-[#f0ead6]/25 pt-6">
              <div className="font-serif text-6xl leading-none">{s.n}</div>
              <div className="mt-3 text-lg">{s.l}</div>
              <div className="mt-1 text-sm text-[#f0ead6]/65">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— A mirrored, to show the rhythm holds ————————————— */}
      {/* Mirrored: the image bleeds off the LEFT edge, so consecutive
          sections don't share a silhouette. */}
      <section className="py-20 md:py-28">
        <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-0 md:pr-[6vw]">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={IMG_PACK} alt="A pack of athletes running into low sun on the track" fill className="object-cover" sizes="(max-width:768px) 100vw, 56vw" />
            </div>
          </div>
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#b67d5e]">02 — Who we serve</p>
            <h2 className="mt-5 font-serif text-[2.75rem] leading-[1.06] md:text-[3.5rem]">
              From first big goals to professional seasons.
            </h2>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              High school runners chasing a breakthrough, collegiate competitors,
              and seasoned professionals. Whatever your starting point, the
              environment, support and community are built to take you further.
            </p>
            <Link href="/registration" className="mt-8 inline-block border-b border-[#427b4d] pb-1 text-[17px] text-[#427b4d] transition hover:border-[#33603c] hover:text-[#33603c]">
              Browse camp dates →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d3c7b4] px-6 py-10">
        <p className="mx-auto max-w-6xl text-sm text-[#755f4f]">
          Internal mockup — unlinked and noindexed. The live homepage is unchanged.
        </p>
      </footer>
    </div>
  );
}
