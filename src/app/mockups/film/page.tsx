import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY, MOTION_CSS } from "../shared";

/**
 * Round 2 · Direction 4 — "Documentary Journal" (YETI Presents ×
 * Patagonia Stories). Dark theatre ground with film grain; content plays
 * as chapters with markers; imagery presented as film stills with
 * letterboxing; amber/cream type. Deepest atmosphere, most cinematic.
 */

export const metadata: Metadata = {
  title: "Mockup · Documentary Journal",
  robots: { index: false, follow: false },
};

const THEATRE = "#161a14";
const CREAM = "#ece5d3";
const AMBER = "#d9a566";

/** Subtle SVG-noise grain over the theatre ground. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

export default function FilmMockup() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: THEATRE, backgroundImage: GRAIN, color: CREAM }}>
      <style>{MOTION_CSS}</style>

      {/* ——— Nav — quiet marquee bar ————————————————————————— */}
      <header className="border-b border-[#ece5d3]/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-serif text-2xl lowercase tracking-tight">elevate</span>
          <nav className="hidden gap-8 md:flex">
            {COPY.navItems.map((n) => (
              <span key={n} className="cursor-pointer font-serif text-[15px] opacity-80 transition hover:opacity-100">{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* ——— Masthead — title card over a letterboxed still ————————— */}
      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-20">
        <p className="rise text-center text-[11px] uppercase tracking-[0.34em]" style={{ color: AMBER }}>
          {COPY.eyebrow} — a film in progress
        </p>
        <h1 className="rise rise-1 mx-auto mt-6 max-w-4xl text-center text-5xl leading-[1.05] md:text-7xl">
          {COPY.heading}
        </h1>
        <p className="rise rise-2 mx-auto mt-6 max-w-[60ch] text-center text-[16px] leading-[1.8] text-[#ece5d3]/75">
          {COPY.intro}
        </p>
        <div className="rise rise-3 img-live relative mx-auto mt-12 aspect-[21/9] w-full overflow-hidden">
          <Image src={IMG.dusk} alt="" fill priority className="object-cover" sizes="90vw" />
        </div>
        <div className="mx-auto mt-4 flex max-w-4xl items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#ece5d3]/55">
          <span>Scene 01 — The high country</span>
          <span>{COPY.chips[1]}</span>
        </div>
      </section>

      {/* ——— Chapter marker + team as cast cards ————————————————— */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: AMBER }}>Chapter one</span>
          <span className="h-px flex-1 bg-[#ece5d3]/15" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#ece5d3]/50">The people</span>
        </div>
        <h2 className="mt-8 text-4xl md:text-5xl">Our Team</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {COPY.team.map((m) => (
            <div key={m.name} className="group">
              <div className="img-live relative aspect-[16/10] w-full overflow-hidden">
                <Image src={IMG[m.img]} alt={m.name} fill className="object-cover" sizes="45vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(22,26,20,0.0) 60%, rgba(22,26,20,0.8) 100%)" }} />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-2xl">{m.name}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.24em]" style={{ color: AMBER }}>{m.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Chapter two — story as an intertitle + still pair ———————— */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: AMBER }}>Chapter two</span>
          <span className="h-px flex-1 bg-[#ece5d3]/15" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#ece5d3]/50">{COPY.story.title}</span>
        </div>
        <div className="mt-10 grid items-center gap-12 md:grid-cols-12">
          <p className="text-[24px] leading-[1.55] md:col-span-6 md:text-[27px]">{COPY.story.body}</p>
          <div className="img-live relative aspect-[4/3] w-full md:col-span-6">
            <Image src={IMG.packLandscape} alt="" fill className="object-cover" sizes="48vw" />
          </div>
        </div>
      </section>

      {/* ——— Reel — horizontal strip of stills ————————————————————— */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: AMBER }}>The reel</span>
          <span className="h-px flex-1 bg-[#ece5d3]/15" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[IMG.meadow, IMG.sawmillPortrait, IMG.stormFairway, IMG.runnersTrail].map((src, i) => (
            <figure key={src}>
              <div className="img-live relative aspect-[3/2] w-full">
                <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
              </div>
              <figcaption className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#ece5d3]/45">
                Still {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#ece5d3]/15 py-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#ece5d3]/55">
          Mockup · Documentary Journal · YETI Presents × Patagonia Stories
        </p>
      </footer>
    </div>
  );
}
