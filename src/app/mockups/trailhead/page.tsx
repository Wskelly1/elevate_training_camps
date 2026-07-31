import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY } from "../shared";

/**
 * Direction B — "Trailhead Lodge" (Under Canvas × Filson × vintage NPS).
 * The masthead is a deep-green block running from the very top of the page —
 * the nav lives inside it in cream, so there is no seam anywhere. Thick-thin
 * double rules, letterspaced small caps, stat "trail markers", brave color.
 */

export const metadata: Metadata = {
  title: "Mockup B — Trailhead Lodge",
  robots: { index: false, follow: false },
};

const GREEN = "#24422a";
const CREAM = "#f0ead6";
const PAPER = "#f6f1e2";

function DoubleRule({ color }: { color: string }) {
  return (
    <div className="space-y-[3px]">
      <div className="h-[3px]" style={{ backgroundColor: color }} />
      <div className="h-px" style={{ backgroundColor: color }} />
    </div>
  );
}

export default function TrailheadMockup() {
  return (
    <div style={{ backgroundColor: PAPER }} className="min-h-screen text-[#232a20]">
      {/* ——— Green block: nav + masthead as ONE surface ——————————— */}
      <div style={{ backgroundColor: GREEN, color: CREAM }}>
        <header>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <span className="font-serif text-2xl lowercase tracking-tight">elevate</span>
            <nav className="hidden gap-8 md:flex">
              {COPY.navItems.map((n) => (
                <span key={n} className="cursor-pointer font-serif text-[15px] opacity-90 hover:opacity-100">{n}</span>
              ))}
            </nav>
          </div>
          <div className="mx-auto max-w-6xl px-6"><div className="h-px bg-[#f0ead6]/25" /></div>
        </header>

        <section className="mx-auto max-w-6xl px-6 pt-12 pb-12 md:pt-16 md:pb-14">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#cf9d77]">{COPY.eyebrow}</p>
          <div className="mt-5 grid items-end gap-8 md:grid-cols-12">
            <h1 className="text-5xl leading-[1.04] md:col-span-8 md:text-6xl">{COPY.heading}</h1>
            <p className="text-[15px] leading-[1.7] text-[#f0ead6]/80 md:col-span-4">{COPY.intro}</p>
          </div>
          <div className="mt-10"><DoubleRule color="rgba(240,234,214,0.4)" /></div>
          {/* Trail-marker stat tags */}
          <div className="mt-5 flex flex-wrap gap-3">
            {COPY.chips.map((chip) => (
              <span key={chip} className="border border-[#f0ead6]/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#f0ead6]/90">
                {chip}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* ——— Team — on paper, ranger-board cards ————————————————— */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-rock)]">The people</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Our Team</h2>
          </div>
          <p className="hidden text-[11px] uppercase tracking-[0.22em] md:block" style={{ color: "#8a8272" }}>Est. Flagstaff, AZ</p>
        </div>
        <div className="mt-4"><DoubleRule color="#232a20" /></div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {COPY.team.map((m) => (
            <div key={m.name} className="grid grid-cols-5 items-center gap-6">
              <div className="relative col-span-2 aspect-[4/5] w-full overflow-hidden">
                <Image src={IMG[m.img]} alt={m.name} fill className="object-cover" sizes="20vw" />
              </div>
              <div className="col-span-3">
                <h3 className="text-2xl">{m.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-rock)]">{m.role}</p>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#4a4a42]">
                  Distance runner, high-country convert, and the reason the coffee is ready before the morning run.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Story — full-bleed image with green plate overlay ———— */}
      <section className="relative">
        <div className="relative h-[64vh] min-h-[420px] w-full">
          <Image src={IMG.stormFairway} alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="-mt-24 max-w-xl p-10" style={{ backgroundColor: GREEN, color: CREAM }}>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#cf9d77]">{COPY.story.title}</p>
            <p className="mt-4 text-[17px] leading-[1.75] text-[#f0ead6]/90">{COPY.story.body}</p>
          </div>
        </div>
      </section>

      {/* ——— Gallery strip ————————————————————————————————————— */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-rock)]">From the high country</p>
        <div className="mt-4"><DoubleRule color="#232a20" /></div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[IMG.meadow, IMG.dusk, IMG.sawmillPortrait].map((src) => (
            <div key={src} className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
            </div>
          ))}
        </div>
      </section>

      <footer style={{ backgroundColor: GREEN, color: CREAM }} className="py-10 text-center text-[11px] uppercase tracking-[0.24em]">
        Mockup B · Trailhead Lodge · Under Canvas × Filson × NPS heritage
      </footer>
    </div>
  );
}
