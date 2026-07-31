import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY, MOTION_CSS } from "../shared";

/**
 * Round 2 · Direction 2 — "Botanical Estate" (Flamingo Estate × Scribe).
 * Confident colored grounds instead of cream fields: deep garden green and
 * sun terracotta plates carry whole sections, cream is only an accent.
 * Big, warm serif moments; photography inset ON the color so nothing feels
 * vacant. Sun-soaked and alive.
 */

export const metadata: Metadata = {
  title: "Mockup · Botanical Estate",
  robots: { index: false, follow: false },
};

const GREEN = "#2e4b32";
const GREEN_DEEP = "#24422a";
const TERRA = "#c26a45";
const SUN = "#e9dab8";
const CREAM = "#f0ead6";

export default function EstateMockup() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: GREEN, color: CREAM }}>
      <style>{MOTION_CSS}</style>

      {/* ——— Nav — lives on the green, part of the estate ——————— */}
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-serif text-2xl lowercase tracking-tight">elevate</span>
          <nav className="hidden gap-8 md:flex">
            {COPY.navItems.map((n) => (
              <span key={n} className="cursor-pointer font-serif text-[15px] opacity-90 transition hover:opacity-100">{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* ——— Masthead — big warm serif on green, photo inset right ——— */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 md:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="rise text-[12px] uppercase tracking-[0.28em]" style={{ color: SUN }}>{COPY.eyebrow}</p>
            <h1 className="rise rise-1 mt-5 text-6xl leading-[1.02] md:text-7xl">
              Summers at
              <span className="italic" style={{ color: SUN }}> altitude</span>.
            </h1>
            <p className="rise rise-2 mt-7 max-w-[54ch] text-[17px] leading-[1.8] text-[#f0ead6]/85">{COPY.intro}</p>
            <div className="rise rise-3 mt-9 flex flex-wrap gap-3">
              {COPY.chips.map((chip) => (
                <span key={chip} className="rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.18em]" style={{ backgroundColor: GREEN_DEEP, color: SUN }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="img-live rise rise-2 relative aspect-[4/5] w-full overflow-hidden rounded-t-full">
              <Image src={IMG.meadow} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Team — terracotta plate, portraits with arched crops ——— */}
      <section style={{ backgroundColor: TERRA }} className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-5xl" style={{ color: "#20180f" }}>Our Team</h2>
            <p className="hidden text-[12px] uppercase tracking-[0.22em] md:block" style={{ color: "#5c3421" }}>Flagstaff, Arizona</p>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {COPY.team.map((m) => (
              <div key={m.name} className="grid grid-cols-5 items-center gap-6">
                <div className="img-live relative col-span-2 aspect-[3/4] w-full overflow-hidden rounded-t-full">
                  <Image src={IMG[m.img]} alt={m.name} fill className="object-cover" sizes="20vw" />
                </div>
                <div className="col-span-3" style={{ color: "#2a1d12" }}>
                  <h3 className="text-3xl">{m.name}</h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.22em] opacity-70">{m.role}</p>
                  <p className="mt-4 text-[15px] leading-[1.7] opacity-90">
                    Distance runner, high-country convert, and the reason the coffee is ready before the morning run.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Story — sun plate with big pull-quote energy —————————— */}
      <section style={{ backgroundColor: SUN, color: "#2c3a26" }} className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-12">
            <div className="img-live relative aspect-[4/3] w-full overflow-hidden md:col-span-5">
              <Image src={IMG.packLandscape} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" />
            </div>
            <div className="md:col-span-7">
              <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: TERRA }}>{COPY.story.title}</p>
              <p className="mt-6 text-[26px] leading-[1.45] md:text-[30px]">{COPY.story.body}</p>
              <p className="mt-7 inline-block cursor-pointer rounded-full px-6 py-3 text-[13px] uppercase tracking-[0.18em] transition hover:opacity-85" style={{ backgroundColor: GREEN_DEEP, color: CREAM }}>
                The whole story
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Gallery — back on green, generous but full ————————————— */}
      <section className="py-20" style={{ backgroundColor: GREEN }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: SUN }}>From the high country</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[IMG.dusk, IMG.sawmillPortrait, IMG.stormFairway, IMG.runnersTrail].map((src) => (
              <div key={src} className="img-live relative aspect-[3/4] w-full overflow-hidden rounded-t-full">
                <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: GREEN_DEEP }} className="py-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: SUN }}>Mockup · Botanical Estate · Flamingo Estate × Scribe</p>
      </footer>
    </div>
  );
}
