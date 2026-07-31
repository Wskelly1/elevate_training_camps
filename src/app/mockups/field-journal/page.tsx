import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY } from "../shared";

/**
 * Direction A — "Field Journal" (Tracksmith × Kinfolk).
 * One continuous paper ground for the whole page — no bands, no seams.
 * Centered masthead with ruled small-caps eyebrow, tight vertical rhythm,
 * hairline rules as the only dividers, italic serif captions.
 */

export const metadata: Metadata = {
  title: "Mockup A — Field Journal",
  robots: { index: false, follow: false },
};

const PAPER = "#f6f1e2";
const INK = "#232a20";
const FADED = "#6b6558";

export default function FieldJournalMockup() {
  return (
    <div style={{ backgroundColor: PAPER, color: INK }} className="min-h-screen">
      {/* ——— Nav — sits directly on the paper, hairline rule below ——— */}
      <header className="border-b border-[#d8cfb8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-serif text-2xl lowercase tracking-tight text-[var(--primary-deep)]">elevate</span>
          <nav className="hidden gap-8 md:flex">
            {COPY.navItems.map((n) => (
              <span key={n} className="cursor-pointer font-serif text-[15px] text-[var(--primary-deep)] hover:opacity-70">{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* ——— Masthead — centered, compact, journal front-page ————— */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center md:pt-20">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-[#c9bfa4]" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">{COPY.eyebrow}</p>
          <span className="h-px w-12 bg-[#c9bfa4]" />
        </div>
        <h1 className="mt-6 text-5xl leading-[1.06] md:text-6xl">{COPY.heading}</h1>
        <p className="mx-auto mt-6 max-w-[58ch] text-[17px] leading-[1.8] text-[#4a4a42]">{COPY.intro}</p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.24em]" style={{ color: FADED }}>
          {COPY.chips.join("   ·   ")}
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-[#d8cfb8]" /></div>

      {/* ——— Team — two portrait columns, museum-caption style ————— */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">The people</p>
        <h2 className="mt-4 text-center text-4xl">Our Team</h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-x-12 gap-y-10 sm:grid-cols-2">
          {COPY.team.map((m) => (
            <figure key={m.name} className="text-center">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image src={IMG[m.img]} alt={m.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 40vw" />
              </div>
              <figcaption className="mt-4">
                <span className="font-serif text-xl">{m.name}</span>
                <span className="mx-2" style={{ color: FADED }}>—</span>
                <span className="font-serif text-xl italic" style={{ color: FADED }}>{m.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-[#d8cfb8]" /></div>

      {/* ——— Story — text beside image, italic caption under image ——— */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">Chapter one</p>
            <h2 className="mt-4 text-4xl">{COPY.story.title}</h2>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.8] text-[#4a4a42]">{COPY.story.body}</p>
          </div>
          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={IMG.packLandscape} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 46vw" />
            </div>
            <figcaption className="mt-3 font-serif text-[15px] italic" style={{ color: FADED }}>
              Into low sun on the track — the highest-volume weeks of the year.
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-[#d8cfb8]" /></div>

      {/* ——— Gallery strip — contact-sheet row —————————————————— */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">From the high country</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[IMG.meadow, IMG.dusk, IMG.sawmillPortrait, IMG.runnersTrail].map((src) => (
            <div key={src} className="relative aspect-square w-full overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#d8cfb8] py-10 text-center text-[11px] uppercase tracking-[0.24em]" style={{ color: FADED }}>
        Mockup A · Field Journal · Tracksmith × Kinfolk
      </footer>
    </div>
  );
}
