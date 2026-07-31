import Link from "next/link";
import type { Metadata } from "next";

/** Index for the three refined-rustic direction mockups (2026-07-31). */
export const metadata: Metadata = {
  title: "Layout Mockups",
  robots: { index: false, follow: false },
};

const OPTIONS = [
  {
    href: "/mockups/field-journal",
    name: "A · Field Journal",
    refs: "Tracksmith · Kinfolk",
    blurb:
      "One continuous paper ground, centered ruled masthead, hairline dividers, italic captions. Quietest and most literary.",
  },
  {
    href: "/mockups/trailhead",
    name: "B · Trailhead Lodge",
    refs: "Under Canvas · Filson · vintage NPS",
    blurb:
      "Deep-green masthead running from the very top with the nav inside it — no seam possible. Double rules, trail-marker stat tags, bravest color.",
  },
  {
    href: "/mockups/gallery",
    name: "C · Quiet Gallery",
    refs: "Aesop · Cereal",
    blurb:
      "One warm-stone ground, modest type, asymmetric offset grid, images hung like objects. Most restrained and most 'artistic'.",
  },
];

export default function MockupsIndex() {
  return (
    <div className="min-h-screen bg-[#f6f1e2] text-[#232a20]">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">Aesthetic explorations</p>
        <h1 className="mt-4 text-4xl">Refined-rustic layout directions</h1>
        <p className="mt-4 text-[16px] leading-[1.8] text-[#4a4a42]">
          Three treatments of the same About-page content. Each fixes the nav
          seam and the masthead spacing in its own way — pick the one that
          feels right and it becomes the system for every inner page.
        </p>
        <div className="mt-12 space-y-8">
          {OPTIONS.map((o) => (
            <Link key={o.href} href={o.href} className="block border-t border-[#d8cfb8] pt-6 transition hover:opacity-70">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl">{o.name}</h2>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8a8272]">{o.refs}</span>
              </div>
              <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.7] text-[#4a4a42]">{o.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
