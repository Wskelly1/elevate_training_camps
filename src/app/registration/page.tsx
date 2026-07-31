import Link from "next/link";
import type { Metadata } from "next";
import Layout from "../../components/layout";
import PageMasthead from "../../components/PageMasthead";
import { getRegistrationPage } from "../../lib/queries";

/**
 * Registration & Pricing — CMS-driven (Wave 1 of the full CMS-ification,
 * docs/10-sanity-content-plan.md §5).
 *
 * Copy lives in the `registrationPage` singleton; prices live ONLY on the
 * referenced `teamBlock` documents, which must match
 * ../business-plan/PRICING.md (verified by `npm run check:pricing`).
 * The documents were seeded 2026-07-30 with the guardrail-compliant copy
 * that previously lived in this file.
 *
 * If the CMS returns nothing, this page renders a NEUTRAL empty state —
 * deliberately not a copy-carrying fallback. A divergent hard-coded
 * fallback is exactly how fabricated pricing went live once (the
 * $1,200/$1,800/$2,800 incident); do not reintroduce one.
 *
 * Guardrails carried by the content (business-plan/WEBSITE-SYNC.md):
 * programming only, no lodging/supervision promises, sold to teams via
 * their trip leader, no ranges, no invented dates/scarcity/discounts, the
 * cancellation posture stated at the point of sale.
 */

export const metadata: Metadata = {
  title: "Registration & Pricing | Elevate Training Camps",
  description:
    "Team altitude training blocks in Flagstaff, Arizona — a 3-week flagship block and a 1-week camp, priced as a team. Programming only; transparent pricing for coaches and parent organisers.",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

function formatUsd(n: number | undefined): string {
  return typeof n === "number" ? `$${n.toLocaleString("en-US")}` : "—";
}

export default async function RegistrationPage() {
  const content = await getRegistrationPage();

  if (!content) {
    return (
      <Layout>
        <section className="py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl">Registration</h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
              Pricing and registration details are being updated. Get in touch
              and we&apos;ll walk you through bringing your team to Flagstaff.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
            >
              Contact us
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const blocks = content.blocks ?? [];

  return (
    <Layout>
      {/* ——— Masthead ————————————————————————————————————— */}
      <PageMasthead eyebrow={content.eyebrow} heading={content.heading} intro={content.intro}>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            {content.closingCtaLabel || "Contact us"}
          </Link>
          <Link
            href="/recruiting"
            className="rounded-md border border-[var(--accent-trail)]/40 px-7 py-3.5 text-base text-[var(--foreground)] transition hover:bg-[var(--background)]"
          >
            The recruiting advisory
          </Link>
        </div>
      </PageMasthead>

      {/* ——— 01 · The team blocks ————————————————————————— */}
      {blocks.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>{content.pricingEyebrow}</Eyebrow>
            {content.pricingHeading && (
              <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
                {content.pricingHeading}
              </h2>
            )}
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {blocks.map((b) => (
                <div key={b._id} className="border-t-2 border-[var(--primary)] bg-[var(--background)] p-8">
                  <h3 className="text-[1.75rem] leading-snug">{b.name}</h3>
                  {b.tagline && <p className="mt-2 text-[15px] text-[var(--accent-trail)]">{b.tagline}</p>}
                  <div className="mt-7 flex items-baseline gap-6">
                    <div>
                      <div className="text-4xl leading-none">{formatUsd(b.baseFee)}</div>
                      <div className="mt-2 text-sm text-[var(--muted-foreground)]">team base fee</div>
                    </div>
                    <div className="text-2xl text-[var(--muted-foreground)]">+</div>
                    <div>
                      <div className="text-4xl leading-none">{formatUsd(b.perAthleteRate)}</div>
                      <div className="mt-2 text-sm text-[var(--muted-foreground)]">per athlete</div>
                    </div>
                  </div>
                  {b.exampleLine && (
                    <p className="mt-5 text-[15px] leading-[1.7] text-[var(--accent-trail)]">{b.exampleLine}</p>
                  )}
                  {b.detail && <p className="mt-5 text-[16px] leading-[1.7] text-[#4a4a4a]">{b.detail}</p>}
                </div>
              ))}
            </div>
            {content.pricingFootnote && (
              <p className="mt-10 max-w-2xl text-[15px] leading-[1.7] text-[var(--muted-foreground)]">
                {content.pricingFootnote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ——— 02 · What's included / what isn't ———————————————— */}
      {(content.includedItems?.length || content.includedHeading) && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>{content.includedEyebrow}</Eyebrow>
            {content.includedHeading && (
              <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
                {content.includedHeading}
              </h2>
            )}
            {content.includedIntro && (
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-[#4a4a4a]">{content.includedIntro}</p>
            )}
            {content.includedItems && content.includedItems.length > 0 && (
              <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {content.includedItems.map((i) => (
                  <div key={i.title} className="border-t border-[var(--border)] pt-5">
                    <h3 className="text-[1.3rem] leading-snug">{i.title}</h3>
                    {i.body && <p className="mt-3 text-[15px] leading-[1.7] text-[#4a4a4a]">{i.body}</p>}
                  </div>
                ))}
              </div>
            )}
            {content.notIncludedItems && content.notIncludedItems.length > 0 && (
              <div className="mt-14 max-w-2xl border-l-2 border-[var(--accent-rock)] pl-6">
                {content.notIncludedTitle && <h3 className="text-[1.3rem]">{content.notIncludedTitle}</h3>}
                <ul className="mt-4 space-y-2">
                  {content.notIncludedItems.map((n) => (
                    <li key={n} className="text-[15px] leading-[1.7] text-[#4a4a4a]">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ——— 03 · How booking works ————————————————————————— */}
      {content.bookingSteps && content.bookingSteps.length > 0 && (
        <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
          <div className="mx-auto max-w-6xl px-6">
            {content.bookingEyebrow && (
              <p className="text-xs uppercase tracking-[0.22em] text-[#f0ead6]/70">{content.bookingEyebrow}</p>
            )}
            {content.bookingHeading && (
              <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
                {content.bookingHeading}
              </h2>
            )}
            <div className="mt-12 grid gap-12 sm:grid-cols-3">
              {content.bookingSteps.map((s, idx) => (
                <div key={s.title} className="border-t border-[#f0ead6]/25 pt-6">
                  <div className="text-sm tracking-[0.2em] text-[#f0ead6]/60">{String(idx + 1).padStart(2, "0")}</div>
                  <h3 className="mt-3 text-[1.4rem] leading-snug">{s.title}</h3>
                  {s.body && <p className="mt-3 text-[15px] leading-[1.7] text-[#f0ead6]/80">{s.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— 04 · The honest fine print ————————————————————— */}
      {content.finePrintCards && content.finePrintCards.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>{content.finePrintEyebrow}</Eyebrow>
            <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {content.finePrintCards.map((c) => (
                <div key={c.title} className="border-t border-[var(--border)] pt-5">
                  <h3 className="text-[1.4rem] leading-snug">{c.title}</h3>
                  {c.body && <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{c.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Closing CTA ————————————————————————————————— */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          {content.closingHeading && (
            <h2 className="text-[2.5rem] leading-[1.08] md:text-[3.25rem]">{content.closingHeading}</h2>
          )}
          {content.closingBody && (
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">{content.closingBody}</p>
          )}
          <Link
            href="/contact"
            className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            {content.closingCtaLabel || "Contact us"}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
