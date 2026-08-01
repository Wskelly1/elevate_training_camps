/**
 * SponsorMarquee — the partner band on the homepage, restyled 2026-08-01
 * to the owner's reference: a centered heading over white logo cards
 * (rounded, hairline border, generous padding, full-color logos) on the
 * deep-green lodge ground.
 *
 * With four or fewer sponsors the cards render as a static centered grid —
 * there is nothing meaningful to rotate. With more than four, the same
 * cards ride the auto-scrolling marquee (duplicated row, seamless CSS
 * loop, pause on hover; reduced-motion gets the static grid regardless —
 * see globals.css).
 *
 * Renders nothing without sponsors — an invented partner is a guardrail
 * violation, so the band exists only when real logos are published.
 */
import type { Sponsor } from "../lib/queries";

function Card({ sponsor }: { sponsor: Sponsor }) {
  const inner = (
    <div className="flex h-44 w-64 items-center justify-center rounded-xl border border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary partner-logo aspect ratios; contained box */}
      <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-20 w-auto max-w-[80%] object-contain" />
    </div>
  );
  return sponsor.url ? (
    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
      {inner}
    </a>
  ) : (
    <span aria-label={sponsor.name}>{inner}</span>
  );
}

export default function SponsorMarquee({ heading, sponsors }: { heading?: string; sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;

  const scrolls = sponsors.length > 4;

  return (
    <section className="bg-[var(--primary-deep)] py-16 md:py-20">
      {heading && (
        <h2 className="mb-10 text-center text-[2rem] text-[#f0ead6] md:text-[2.5rem]">{heading}</h2>
      )}
      {scrolls ? (
        <div className="marquee flex overflow-hidden">
          {[false, true].map((hidden) => (
            <div key={String(hidden)} className="marquee-row flex shrink-0 items-center gap-6 pr-6" aria-hidden={hidden}>
              {sponsors.map((s) => (
                <Card key={s._id + (hidden ? "-dup" : "")} sponsor={s} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6">
          {sponsors.map((s) => (
            <Card key={s._id} sponsor={s} />
          ))}
        </div>
      )}
    </section>
  );
}
