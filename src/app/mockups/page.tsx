import Link from "next/link";
import type { Metadata } from "next";

/** Index for the round-2 refined-rustic direction mockups (2026-07-31).
 *  Round 1 (flat print-editorial) was rejected: too much empty cream, too
 *  flat, too static. Round 2 brief: photography and atmosphere first,
 *  confident color, layered and alive. */
export const metadata: Metadata = {
  title: "Layout Mockups · Round 2",
  robots: { index: false, follow: false },
};

const OPTIONS = [
  {
    href: "/mockups/lodge",
    name: "1 · Cinematic Lodge",
    refs: "Post Ranch Inn · Rock Creek · Under Canvas",
    blurb:
      "Photography IS the page: full-bleed image mastheads with the title over them, portraits with names on the photo, edge-to-edge triptychs. Warm-dark and expensive.",
  },
  {
    href: "/mockups/estate",
    name: "2 · Botanical Estate",
    refs: "Flamingo Estate · Scribe",
    blurb:
      "Confident colored grounds — garden green, terracotta, sun — carry whole sections; cream is only an accent. Arched crops, big italic serif moments. Sun-soaked and alive.",
  },
  {
    href: "/mockups/modern",
    name: "3 · Modern Refined Outdoor",
    refs: "Snow Peak · Klättermusen",
    blurb:
      "Contemporary sans type in a tight modular grid where photography fills the modules — calm through order, not emptiness. Heritage craft, zero costume.",
  },
  {
    href: "/mockups/film",
    name: "4 · Documentary Journal",
    refs: "YETI Presents · Patagonia Stories",
    blurb:
      "Dark theatre ground with film grain, chapters with markers, letterboxed stills, amber titles. The deepest atmosphere of the four.",
  },
];

export default function MockupsIndex() {
  return (
    <div className="min-h-screen bg-[#161a14] text-[#ece5d3]">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a566]">Aesthetic explorations · round 2</p>
        <h1 className="mt-4 text-4xl">Photography-first directions</h1>
        <p className="mt-4 text-[16px] leading-[1.8] text-[#ece5d3]/75">
          Four treatments of the same About-page content, built to the revised
          brief: imagery and atmosphere first, confident color, layered and
          alive — no empty cream fields, nothing print-flat, subtle motion
          throughout.
        </p>
        <div className="mt-12 space-y-8">
          {OPTIONS.map((o) => (
            <Link key={o.href} href={o.href} className="block border-t border-[#ece5d3]/15 pt-6 transition hover:opacity-70">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl">{o.name}</h2>
                <span className="text-right text-[11px] uppercase tracking-[0.18em] text-[#ece5d3]/50">{o.refs}</span>
              </div>
              <p className="mt-2 max-w-[64ch] text-[15px] leading-[1.7] text-[#ece5d3]/75">{o.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
