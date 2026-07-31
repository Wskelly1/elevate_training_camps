import Image from "next/image";
import type { Metadata } from "next";
import { IMG, COPY } from "../shared";

/**
 * Direction C — "Quiet Gallery" (Aesop × Cereal magazine).
 * One unbroken warm-stone ground; restraint as the aesthetic. Small type,
 * asymmetric 12-column grid, images treated as hung objects with air around
 * them, underlined text links, no rules except a single hairline under the
 * nav. The masthead is deliberately modest — the photography carries it.
 */

export const metadata: Metadata = {
  title: "Mockup C — Quiet Gallery",
  robots: { index: false, follow: false },
};

const STONE = "#f2ede1";
const INK = "#2b2b26";
const MUTE = "#7d776a";

export default function GalleryMockup() {
  return (
    <div style={{ backgroundColor: STONE, color: INK }} className="min-h-screen">
      {/* ——— Nav — tiny, wide-tracked, hairline below ————————————— */}
      <header className="border-b border-[#ddd5c2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <span className="font-serif text-xl lowercase tracking-tight text-[var(--primary-deep)]">elevate</span>
          <nav className="hidden gap-7 md:flex">
            {COPY.navItems.map((n) => (
              <span key={n} className="cursor-pointer text-[12px] uppercase tracking-[0.18em] hover:opacity-60" style={{ color: MUTE }}>
                {n}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* ——— Masthead — asymmetric: modest heading left, dossier right ——— */}
      <section className="mx-auto max-w-6xl px-8 pt-20 pb-16 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="max-w-[16ch] text-4xl leading-[1.12] md:text-5xl">{COPY.heading}</h1>
            <p className="mt-8 max-w-[52ch] text-[16px] leading-[1.9] text-[#4c4a41]">{COPY.intro}</p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <dl className="space-y-5 text-[13px] leading-relaxed md:pt-2">
              {[
                ["Season", "Summer 2027"],
                ["Location", "Flagstaff, Arizona"],
                ["Elevation", "7,000 ft · 2,100 m"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#ddd5c2] pb-2">
                  <dt style={{ color: MUTE }}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ——— Team — offset portraits, no cards ————————————————— */}
      <section className="mx-auto max-w-6xl px-8 pb-20">
        <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: MUTE }}>Our Team</p>
        <div className="mt-8 grid gap-14 md:grid-cols-12">
          <figure className="md:col-span-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image src={IMG.trackPortrait} alt={COPY.team[0].name} fill className="object-cover" sizes="33vw" />
            </div>
            <figcaption className="mt-3 text-[13px]">
              {COPY.team[0].name} <span style={{ color: MUTE }}>· {COPY.team[0].role}</span>
            </figcaption>
          </figure>
          <figure className="md:col-span-4 md:col-start-7 md:mt-20">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image src={IMG.overlookPortrait} alt={COPY.team[1].name} fill className="object-cover" sizes="33vw" />
            </div>
            <figcaption className="mt-3 text-[13px]">
              {COPY.team[1].name} <span style={{ color: MUTE }}>· {COPY.team[1].role}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ——— Story — narrow centered text, then a wide hung image ——— */}
      <section className="mx-auto max-w-6xl px-8 pb-20">
        <div className="mx-auto max-w-[58ch]">
          <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: MUTE }}>{COPY.story.title}</p>
          <p className="mt-6 text-[17px] leading-[1.9] text-[#4c4a41]">{COPY.story.body}</p>
          <p className="mt-6 text-[14px] underline underline-offset-4 decoration-[#b2a98f] cursor-pointer">Read the full story</p>
        </div>
        <div className="relative mx-auto mt-16 aspect-[21/9] w-full max-w-4xl overflow-hidden">
          <Image src={IMG.dusk} alt="" fill className="object-cover" sizes="80vw" />
        </div>
        <p className="mx-auto mt-3 max-w-4xl text-[12px]" style={{ color: MUTE }}>
          Dusk over the high country, 10,000 ft.
        </p>
      </section>

      {/* ——— Gallery — two hung images, uneven ————————————————— */}
      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="grid gap-14 md:grid-cols-12">
          <figure className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image src={IMG.sawmillPortrait} alt="" fill className="object-cover" sizes="40vw" />
            </div>
          </figure>
          <figure className="md:col-span-6 md:col-start-7 md:mt-28">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={IMG.meadow} alt="" fill className="object-cover" sizes="50vw" />
            </div>
          </figure>
        </div>
      </section>

      <footer className="border-t border-[#ddd5c2] py-10 text-center text-[12px] uppercase tracking-[0.18em]" style={{ color: MUTE }}>
        Mockup C · Quiet Gallery · Aesop × Cereal
      </footer>
    </div>
  );
}
