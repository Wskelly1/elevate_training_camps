/**
 * SponsorMarquee — the auto-rotating partner-logo band on the homepage
 * (owner request 2026-07-31). The row is duplicated and slides by 50%
 * on a linear loop, so the rotation is seamless; hover pauses it, and
 * prefers-reduced-motion replaces it with a static wrapped row (see
 * globals.css). Logos render muted and lift to full strength on hover.
 *
 * Renders nothing without sponsors — an empty band is a broken promise,
 * and an invented one is a guardrail violation.
 */
import type { Sponsor } from "../lib/queries";

export default function SponsorMarquee({ heading, sponsors }: { heading?: string; sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;

  const row = (ariaHidden: boolean) => (
    <div className="marquee-row flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {sponsors.map((s) => {
        const img = (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary partner-logo aspect ratios; fixed height, auto width
          <img
            src={s.logoUrl}
            alt={ariaHidden ? "" : s.name}
            className="mx-10 h-11 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
          />
        );
        return s.url ? (
          <a key={s._id} href={s.url} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          <span key={s._id}>{img}</span>
        );
      })}
    </div>
  );

  return (
    <section className="border-t border-[var(--border)] py-14">
      {heading && (
        <p className="mb-9 text-center text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">
          {heading}
        </p>
      )}
      <div className="marquee flex overflow-hidden">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
