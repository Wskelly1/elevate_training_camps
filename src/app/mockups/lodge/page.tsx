import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY, MOTION_CSS } from "../shared";

/**
 * Round 2 · Direction 1 — "Cinematic Lodge" (Post Ranch Inn × Rock Creek ×
 * Under Canvas). Photography IS the page: every inner page opens with a
 * full-bleed image masthead, the title set over it, nav floating on the
 * image. Content sections interleave with full-width imagery so there is
 * almost no bare background anywhere. Warm-dark, expensive, quiet.
 */

export const metadata: Metadata = {
  title: "Mockup · Cinematic Lodge",
  robots: { index: false, follow: false },
};

const CREAM = "#f0ead6";
const DARK = "#1c2419";

export default function LodgeMockup() {
  return (
    <div className="min-h-screen bg-[#f6f1e2] text-[#232a20]">
      <style>{MOTION_CSS}</style>

      {/* ——— Full-bleed image masthead, nav floating on it —————— */}
      <section className="relative h-[74vh] min-h-[520px] w-full overflow-hidden">
        <Image src={IMG.dusk} alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,26,18,0.55) 0%, rgba(20,26,18,0.12) 34%, rgba(20,26,18,0.05) 55%, rgba(20,26,18,0.62) 100%)" }} />

        <header className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6" style={{ color: CREAM }}>
            <span className="font-serif text-2xl lowercase tracking-tight">elevate</span>
            <nav className="hidden gap-8 md:flex">
              {COPY.navItems.map((n) => (
                <span key={n} className="cursor-pointer font-serif text-[15px] opacity-90 transition hover:opacity-100">{n}</span>
              ))}
            </nav>
          </div>
        </header>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-6xl px-6 pb-14" style={{ color: CREAM }}>
            <p className="rise text-[11px] uppercase tracking-[0.3em] text-[#e0b48e]">{COPY.eyebrow}</p>
            <h1 className="rise rise-1 mt-4 max-w-3xl text-5xl leading-[1.04] md:text-7xl">{COPY.heading}</h1>
            <p className="rise rise-2 mt-6 text-[12px] uppercase tracking-[0.24em] text-[#f0ead6]/75">
              {COPY.chips.join("  ·  ")}
            </p>
          </div>
        </div>
      </section>

      {/* ——— Intro — short, on warm paper, immediately followed by imagery ——— */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="rise rise-1 text-[22px] leading-[1.6] md:col-span-8 md:text-[26px]">{COPY.intro}</p>
          <div className="hidden items-end justify-end md:col-span-4 md:flex">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8272]">Flagstaff · Arizona</p>
          </div>
        </div>
      </section>

      {/* ——— Team — portraits ON imagery, names over the photo ————— */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">The people</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {COPY.team.map((m) => (
            <div key={m.name} className="img-live relative aspect-[4/5] w-full">
              <Image src={IMG[m.img]} alt={m.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 48vw" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,26,18,0) 55%, rgba(20,26,18,0.65) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-6" style={{ color: CREAM }}>
                <h3 className="text-2xl">{m.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#e0b48e]">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Story — full-bleed fixed-feel image with floating plate ——— */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
          <Image src={IMG.stormFairway} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[#141a12]/25" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-6">
              <div className="rise max-w-lg p-10 backdrop-blur-[2px]" style={{ backgroundColor: "rgba(28,36,25,0.82)", color: CREAM }}>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#e0b48e]">{COPY.story.title}</p>
                <p className="mt-5 text-[17px] leading-[1.75] text-[#f0ead6]/90">{COPY.story.body}</p>
                <p className="mt-6 cursor-pointer border-b border-[#e0b48e] pb-1 text-[13px] uppercase tracking-[0.2em] text-[#e0b48e] transition hover:opacity-75" style={{ display: "inline-block" }}>
                  Read more
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Gallery — edge-to-edge triptych, no gutter air ————————— */}
      <section className="grid grid-cols-1 gap-1 md:grid-cols-3">
        {[IMG.meadow, IMG.sawmillPortrait, IMG.packLandscape].map((src) => (
          <div key={src} className="img-live relative aspect-[4/5] w-full md:aspect-[3/4]">
            <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </section>

      <footer style={{ backgroundColor: DARK, color: CREAM }} className="py-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] opacity-80">Mockup · Cinematic Lodge · Post Ranch Inn × Rock Creek</p>
      </footer>
    </div>
  );
}
