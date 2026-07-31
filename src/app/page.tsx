import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import Layout from "../components/layout";
import HeroVideo from "../components/HeroVideo";
import { getHomePage, type EditorialSection } from "../lib/queries";

/**
 * Home — Elevate Training Camps. CMS-driven (completes the homepage wave of
 * the CMS-ification, docs/10-sanity-content-plan.md §5; supersedes PR #14).
 *
 * Composition approved at Checkpoint A2.5a (see docs/02-design-review.md):
 * a full-bleed ambient hero with the nav floating over it, then alternating
 * editorial sections that bleed off opposite viewport edges, a full-bleed
 * break, a stat band, the standards grid, and a closing CTA. The previous
 * IntegratedHomepage scroll-hijack is deliberately gone — do not reintroduce
 * it (docs/05-video-playback.md).
 *
 * Every string, image and link renders from the `homePage` document
 * (content migrated + published 2026-07-30). There is NO copy-carrying
 * fallback: if the CMS returns nothing the page renders a neutral shell
 * (docs/10 §5 rule 2 — divergent fallbacks are how fabricated copy went
 * live once). Sections render only when their fields exist.
 *
 * Copy rules for whoever edits the Studio (also in the schema descriptions
 * and docs/01-roadmap.md §5.5):
 *  1. Never claim lodging or supervision is provided — facilitate, don't
 *     operate (risk register R12).
 *  2. Never promise the sea-level race effect; a summer block builds
 *     aerobic base, not a November result.
 *  3. Never state a track record the business does not have. The standards
 *     section is a commitment, not history.
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

/** Renders CMS Portable Text section body. */
function SectionBody({ body }: { body?: EditorialSection["body"] }) {
  if (!body?.length) return null;
  return (
    <div className="[&>p]:mt-4 [&>p]:max-w-[52ch] [&>p]:text-[17px] [&>p]:leading-[1.75] [&>p]:text-[#4a4a4a] [&>p:first-child]:mt-7">
      <PortableText value={body} />
    </div>
  );
}

export default async function Home() {
  const data = await getHomePage();

  if (!data) {
    return (
      <Layout>
        <section className="py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-5xl md:text-6xl">Elevate Training Camps</h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
              Team altitude training camps in Flagstaff, Arizona.
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

  const sections = data.editorialSections ?? [];
  const stats = data.stats ?? [];
  const standards = data.standards ?? [];

  return (
    <Layout transparentNav>
      {/* ——— Hero ————————————————————————————————————————————— */}
      <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        {data.heroPlaybackId ? (
          <HeroVideo playbackId={data.heroPlaybackId} poster={data.heroImageUrl} />
        ) : (
          data.heroImageUrl && (
            <Image src={data.heroImageUrl} alt="" fill priority className="object-cover" sizes="100vw" />
          )
        )}

        {/* Directional scrim — keeps type legible over any frame of the loop
            without dimming the whole picture. */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(20,28,20,0.74) 0%, rgba(20,28,20,0.46) 38%, rgba(20,28,20,0.06) 70%, rgba(20,28,20,0) 100%)",
          }}
        />
        {/* Short top scrim so nav links on the right stay legible. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{ background: "linear-gradient(180deg, rgba(20,28,20,0.55) 0%, rgba(20,28,20,0) 100%)" }}
        />

        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-2xl">
              {data.heroEyebrow && (
                <p className="text-xs uppercase tracking-[0.28em] text-[#f0ead6]/85">{data.heroEyebrow}</p>
              )}
              {/* Newlines in the CMS value control where the headline wraps. */}
              {data.heroHeadline && (
                <h1 className="mt-5 whitespace-pre-line text-6xl leading-[1.03] text-[#f0ead6] md:text-7xl">
                  {data.heroHeadline}
                </h1>
              )}
              {data.heroStandfirst && (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#f0ead6]/90">{data.heroStandfirst}</p>
              )}
              <div className="mt-9 flex flex-wrap gap-4">
                {data.heroPrimaryCta?.label && data.heroPrimaryCta.href && (
                  <Link
                    href={data.heroPrimaryCta.href}
                    className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
                  >
                    {data.heroPrimaryCta.label}
                  </Link>
                )}
                {data.heroSecondaryCta?.label && data.heroSecondaryCta.href && (
                  <Link
                    href={data.heroSecondaryCta.href}
                    className="rounded-md border border-[#f0ead6]/60 px-7 py-3.5 text-base text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
                  >
                    {data.heroSecondaryCta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Editorial sections ————————————————————————————————
          The image column runs off one viewport edge — breaking the container
          is what stops a section reading as a boxed slide. Alternating the
          side keeps consecutive sections from sharing a silhouette. */}
      {sections.map((s, i) => {
        const left = s.imageSide === "left";
        return (
          <section key={s._key ?? s.heading ?? i} className={left ? "py-20 md:py-28" : "py-16 md:py-24"}>
            <div
              className={`grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 ${
                left ? "md:pl-0 md:pr-[6vw]" : "md:pl-[6vw] md:pr-0"
              }`}
            >
              <div className={left ? "md:col-span-7" : "md:order-2 md:col-span-8"}>
                <div className={`relative w-full overflow-hidden ${left ? "aspect-[4/3]" : "aspect-[4/5] md:aspect-[5/6]"}`}>
                  {s.imageUrl && (
                    <Image
                      src={s.imageUrl}
                      alt={s.imageAlt ?? ""}
                      fill
                      className="object-cover"
                      sizes={left ? "(max-width:768px) 100vw, 56vw" : "(max-width:768px) 100vw, 62vw"}
                    />
                  )}
                </div>
              </div>
              <div className={left ? "md:col-span-5" : "md:order-1 md:col-span-4"}>
                {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
                {s.heading && (
                  <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">{s.heading}</h2>
                )}
                <SectionBody body={s.body} />
                {s.metaLine && (
                  <div className="mt-10 border-t border-[var(--border)] pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{s.metaLine}</p>
                  </div>
                )}
                {s.linkLabel && s.linkHref && (
                  <Link
                    href={s.linkHref}
                    className="mt-8 inline-block border-b border-[var(--primary)] pb-1 text-[17px] text-[var(--primary)] transition hover:border-[var(--primary-hover)] hover:text-[var(--primary-hover)]"
                  >
                    {s.linkLabel}
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* ——— Full-bleed break ————————————————————————————————— */}
      {data.fullBleed?.imageUrl && (
        <section className="relative h-[78vh] min-h-[460px] w-full overflow-hidden">
          <Image src={data.fullBleed.imageUrl} alt="" fill className="object-cover" sizes="100vw" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(20,28,20,0.80) 0%, rgba(20,28,20,0.36) 45%, rgba(20,28,20,0) 78%)" }}
          />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-6xl px-6 pb-14 md:pb-20">
              {data.fullBleed.eyebrow && (
                <p className="text-xs uppercase tracking-[0.24em] text-[#f0ead6]/70">{data.fullBleed.eyebrow}</p>
              )}
              {data.fullBleed.quote && (
                <p className="mt-5 max-w-3xl text-[2rem] leading-[1.28] text-[#f0ead6] md:text-[2.75rem]">
                  {data.fullBleed.quote}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ——— Stat band ————————————————————————————————————— */}
      {stats.length > 0 && (
        <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s._key ?? s.label} className="border-t border-[#f0ead6]/25 pt-6">
                <div className="text-6xl leading-none">{s.value}</div>
                <div className="mt-3 text-lg">{s.label}</div>
                {s.note && <div className="mt-1 text-sm text-[#f0ead6]/65">{s.note}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ——— How we run it ————————————————————————————————
          Per the risk plan §06 these protocols are a sales differentiator as
          much as a control: they signal competence to exactly the sophisticated
          coaches this business targets. Phrased as the standard every session
          runs to — no season has been delivered, so nothing claims history. */}
      {standards.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>{data.standardsEyebrow}</Eyebrow>
            {data.standardsHeading && (
              <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
                {data.standardsHeading}
              </h2>
            )}
            <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {standards.map((i) => (
                <div key={i._key ?? i.title}>
                  <h3 className="text-[1.4rem] leading-snug">{i.title}</h3>
                  {i.description && (
                    <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Closing CTA ————————————————————————————————— */}
      {data.closingCta?.heading && (
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-[2.5rem] leading-[1.08] md:text-[3.25rem]">{data.closingCta.heading}</h2>
            {data.closingCta.body && (
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
                {data.closingCta.body}
              </p>
            )}
            {data.closingCta.label && data.closingCta.href && (
              <Link
                href={data.closingCta.href}
                className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
              >
                {data.closingCta.label}
              </Link>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
}
