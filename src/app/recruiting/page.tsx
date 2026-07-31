import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Layout from "../../components/layout";
import PageMasthead from "../../components/PageMasthead";
import { getRecruitingPage } from "../../lib/queries";
import { urlFor } from "../../lib/sanity";

/**
 * College Recruiting Advisory — CMS-driven (Wave 2 of the CMS-ification,
 * docs/10-sanity-content-plan.md §5). Copy and images live in the
 * `recruitingPage` singleton, seeded 2026-07-30 with the compliant copy
 * this file previously carried in code.
 *
 * The constraints are unchanged and load-bearing — they now live in the
 * schema (src/sanity/schemaTypes/recruitingPage.ts) as well as here:
 *  - Gate-7: NO PRICING appears anywhere on this page. The schema has no
 *    price fields, so a rate card cannot be authored without a code change
 *    that clears Gate-7 first.
 *  - Gate-5 rule 4 / doc 04 §03: never promise placement, roster spots or
 *    scholarships; never a fee contingent on any of them.
 *  - Gate-5 rule 3: no invented track record or testimonials.
 *  - Doc 04 compliance: advice is sold TO FAMILIES, never athlete
 *    information to colleges.
 *  - NCAA figures carry their as-of date (footnote field) and are
 *    re-verified each cycle.
 *
 * If the CMS returns nothing, a neutral empty state renders — deliberately
 * not a copy-carrying fallback (docs/10 §5 rule 2).
 */

export const metadata: Metadata = {
  title: "College Recruiting Advisory | Elevate Training Camps",
  description:
    "An honest read on where you can really run. Every camper leaves a block with a written evaluation — realistic competitive level, development priorities, and how they respond to real training.",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

export default async function RecruitingPage() {
  const content = await getRecruitingPage();

  if (!content) {
    return (
      <Layout>
        <section className="py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl">College Recruiting Advisory</h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
              This page is being updated. Get in touch and we&apos;ll talk
              through where your athlete really stands.
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

  return (
    <Layout transparentNav>
      {/* ——— Masthead ————————————————————————————————————— */}
      <PageMasthead
        imageUrl={content.mastheadImageUrl}
        eyebrow={content.eyebrow}
        heading={content.heading}
        intro={content.intro}
      >
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            {content.ctaPrimary || "Contact us"}
          </Link>
          <Link
            href="/registration"
            className="rounded-md border border-[#f0ead6]/60 px-7 py-3.5 text-base text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
          >
            {content.ctaSecondary || "Bring your team to camp"}
          </Link>
        </div>
      </PageMasthead>

      {/* ——— Stat band · market reality ————————————————————— */}
      {content.stats && content.stats.length > 0 && (
        <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
            {content.stats.map((s) => (
              <div key={s.label} className="border-t border-[#f0ead6]/25 pt-6">
                <div className="text-6xl leading-none">{s.number}</div>
                <div className="mt-3 text-lg leading-snug">{s.label}</div>
                {s.sub && <div className="mt-2 text-sm text-[#f0ead6]/65">{s.sub}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ——— 01 · Why guidance, why now ————————————————————— */}
      {(content.whyHeading || content.whyParagraphs?.length) && (
        <section className="py-16 md:py-24">
          <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-[6vw] md:pr-0">
            <div className="md:col-span-4">
              <Eyebrow>{content.whyEyebrow}</Eyebrow>
              {content.whyHeading && (
                <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">{content.whyHeading}</h2>
              )}
              {content.whyParagraphs?.map((p, i) => (
                <p key={p} className={`${i === 0 ? "mt-7" : "mt-4"} max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]`}>
                  {p}
                </p>
              ))}
            </div>
            {content.whyImage && (
              <div className="md:col-span-8">
                <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
                  <Image
                    src={urlFor(content.whyImage).url()}
                    alt={content.whyImageAlt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 62vw"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ——— 02 · The advantage — weeks of watching, not a video ——— */}
      {(content.watchHeading || content.watchItems?.length) && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>{content.watchEyebrow}</Eyebrow>
            {content.watchHeading && (
              <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
                {content.watchHeading}
              </h2>
            )}
            {content.watchIntro && (
              <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-[#4a4a4a]">{content.watchIntro}</p>
            )}
            {content.watchItems && content.watchItems.length > 0 && (
              <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {content.watchItems.map((i) => (
                  <div key={i.title}>
                    <h3 className="text-[1.4rem] leading-snug">{i.title}</h3>
                    {i.body && <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.body}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ——— 03 · The evaluation — what every camper gets ——————— */}
      {(content.evalHeading || content.evalBody) && (
        <section className="py-20 md:py-28">
          <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-0 md:pr-[6vw]">
            {content.evalImage && (
              <div className="md:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={urlFor(content.evalImage).url()}
                    alt={content.evalImageAlt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 56vw"
                  />
                </div>
              </div>
            )}
            <div className="md:col-span-5">
              <Eyebrow>{content.evalEyebrow}</Eyebrow>
              {content.evalHeading && (
                <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">{content.evalHeading}</h2>
              )}
              {content.evalBody && (
                <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">{content.evalBody}</p>
              )}
              {content.evalAccent && (
                <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[var(--accent-trail)]">
                  {content.evalAccent}
                </p>
              )}
              {content.evalLinkLabel && (
                <Link
                  href="/contact"
                  className="mt-8 inline-block border-b border-[var(--primary)] pb-1 text-[17px] text-[var(--primary)] transition hover:border-[var(--primary-hover)] hover:text-[var(--primary-hover)]"
                >
                  {content.evalLinkLabel}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ——— Full-width pull quote ——————————————————————— */}
      {content.quoteText && (
        <section className="bg-[var(--primary-deep)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            {content.quoteLabel && (
              <p className="text-xs uppercase tracking-[0.24em] text-[#f0ead6]/70">{content.quoteLabel}</p>
            )}
            <p className="mt-5 max-w-3xl text-[2rem] leading-[1.28] text-[#f0ead6] md:text-[2.75rem]">
              {content.quoteText}
            </p>
          </div>
        </section>
      )}

      {/* ——— 04 · What we never do ———————————————————————— */}
      {content.neverItems && content.neverItems.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>{content.neverEyebrow}</Eyebrow>
            {content.neverHeading && (
              <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
                {content.neverHeading}
              </h2>
            )}
            <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {content.neverItems.map((i) => (
                <div key={i.title} className="border-t border-[var(--border)] pt-5">
                  <h3 className="text-[1.4rem] leading-snug">{i.title}</h3>
                  {i.body && <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— 05 · Beyond the evaluation ————————————————————— */}
      {(content.familyHeading || content.coachHeading) && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <Eyebrow>{content.familyEyebrow}</Eyebrow>
                {content.familyHeading && (
                  <h2 className="mt-5 text-[2.25rem] leading-[1.1]">{content.familyHeading}</h2>
                )}
                {content.familyParagraphs?.map((p, i) => (
                  <p key={p} className={`${i === 0 ? "mt-6" : "mt-4"} max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]`}>
                    {p}
                  </p>
                ))}
              </div>
              <div>
                <Eyebrow>{content.coachEyebrow}</Eyebrow>
                {content.coachHeading && (
                  <h2 className="mt-5 text-[2.25rem] leading-[1.1]">{content.coachHeading}</h2>
                )}
                {content.coachBody && (
                  <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">{content.coachBody}</p>
                )}
                {content.coachLinkLabel && (
                  <Link
                    href="/contact"
                    className="mt-6 inline-block border-b border-[var(--primary)] pb-1 text-[17px] text-[var(--primary)] transition hover:border-[var(--primary-hover)] hover:text-[var(--primary-hover)]"
                  >
                    {content.coachLinkLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ——— Closing CTA ————————————————————————————————— */}
      <section className="py-24">
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
          {content.footnote && (
            <p className="mx-auto mt-12 max-w-xl text-[13px] leading-[1.7] text-[var(--muted-foreground)]">
              {content.footnote}
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
