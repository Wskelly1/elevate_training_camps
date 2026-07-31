import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY, MOTION_CSS } from "../shared";

/**
 * Round 2 · Direction 3 — "Modern Refined Outdoor" (Snow Peak ×
 * Klättermusen). Contemporary sans-led type on warm neutrals with faded
 * alpine green; a dense modular grid where photography fills the modules —
 * calm through ORDER, not through emptiness. Heritage craft, zero costume.
 */

export const metadata: Metadata = {
  title: "Mockup · Modern Refined Outdoor",
  robots: { index: false, follow: false },
};

const BONE = "#efece4";
const MOSS = "#5c6b52";
const PINE = "#39473a";
const INK = "#26291f";

export default function ModernMockup() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BONE, color: INK }}>
      <style>{MOTION_CSS}</style>

      {/* ——— Nav — utilitarian bar, thin bottom rule ————————————— */}
      <header className="border-b border-[#d6d1c4]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-sans text-lg font-semibold tracking-tight" style={{ color: PINE }}>ELEVATE</span>
          <nav className="hidden gap-7 md:flex">
            {COPY.navItems.map((n) => (
              <span key={n} className="cursor-pointer font-sans text-[13px] font-medium tracking-wide transition hover:opacity-60">{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* ——— Masthead — split module: type panel + photo panel ————— */}
      <section className="mx-auto max-w-6xl px-6 pt-8 md:pt-12">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="rise flex flex-col justify-between p-9 md:p-12" style={{ backgroundColor: PINE, color: BONE }}>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em]" style={{ color: "#b8c4ac" }}>
              {COPY.eyebrow}
            </p>
            <div>
              <h1 className="mt-10 font-sans text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl">
                {COPY.heading}
              </h1>
              <p className="mt-6 max-w-[48ch] font-sans text-[15px] leading-[1.75] opacity-85">{COPY.intro}</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#f0ead6]/20 pt-5">
              {COPY.chips.map((chip) => (
                <p key={chip} className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] opacity-75">{chip}</p>
              ))}
            </div>
          </div>
          <div className="img-live rise rise-1 relative min-h-[420px] w-full">
            <Image src={IMG.meadow} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* ——— Team — module row: photo, spec-sheet text ————————————— */}
      <section className="mx-auto max-w-6xl px-6 pt-2">
        <div className="grid gap-2 md:grid-cols-2">
          {COPY.team.map((m, i) => (
            <div key={m.name} className="grid grid-cols-2" style={{ backgroundColor: i % 2 ? MOSS : "#e3ded1", color: i % 2 ? BONE : INK }}>
              <div className="img-live relative aspect-[3/4] w-full">
                <Image src={IMG[m.img]} alt={m.name} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="flex flex-col justify-between p-7">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] opacity-70">{m.role}</p>
                <div>
                  <h3 className="font-sans text-2xl font-semibold tracking-tight">{m.name}</h3>
                  <p className="mt-3 font-sans text-[13px] leading-[1.7] opacity-85">
                    Distance runner, high-country convert. Builds the day so the squad only has to run it.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Story — wide photo module with caption bar ————————————— */}
      <section className="mx-auto max-w-6xl px-6 pt-2">
        <div className="img-live relative aspect-[21/9] w-full">
          <Image src={IMG.stormFairway} alt="" fill className="object-cover" sizes="90vw" />
        </div>
        <div className="grid gap-2 pt-2 md:grid-cols-12">
          <div className="p-8 md:col-span-4" style={{ backgroundColor: PINE, color: BONE }}>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em]" style={{ color: "#b8c4ac" }}>{COPY.story.title}</p>
          </div>
          <div className="p-8 md:col-span-8" style={{ backgroundColor: "#e3ded1" }}>
            <p className="max-w-[64ch] font-sans text-[15px] leading-[1.8]">{COPY.story.body}</p>
          </div>
        </div>
      </section>

      {/* ——— Gallery — tight modular grid, no captions ————————————— */}
      <section className="mx-auto max-w-6xl px-6 py-2 pb-16">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[IMG.dusk, IMG.sawmillPortrait, IMG.runnersTrail, IMG.overlookPortrait].map((src) => (
            <div key={src} className="img-live relative aspect-square w-full">
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#d6d1c4] py-10 text-center">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] opacity-60">
          Mockup · Modern Refined Outdoor · Snow Peak × Klättermusen
        </p>
      </footer>
    </div>
  );
}
