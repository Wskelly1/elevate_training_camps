import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import Layout from "../components/layout";
import HeroVideo from "../components/HeroVideo";
import { getHomePage, type EditorialSection } from "../lib/queries";

/**
 * Home — Elevate Training Camps.
 *
 * Composition approved at Checkpoint A2.5a (see docs/02-design-review.md):
 * a full-bleed ambient hero with the nav floating over it, then alternating
 * editorial sections that bleed off opposite viewport edges, a full-bleed
 * break, and a stat band. It began as a throwaway /mockup route, which was
 * removed once this page superseded it — see PR #12 for that history.
 *
 * The previous IntegratedHomepage scroll-hijack is deliberately gone. It set
 * `overflow: hidden` on <body> at page load and then jumped scroll position
 * from 0 to ~900px — a visitor's first interaction with the business was
 * their scroll wheel not working.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CONTENT COMES FROM SANITY. THE CONSTANTS BELOW ARE FALLBACKS, NOT COPY.
 *
 * Every string, image and link on this page is editable in the Studio under
 * Home Page. The `FALLBACK` object mirrors that structure and is used field by
 * field wherever the CMS is empty or unreachable — Sanity has been
 * billing-blocked (HTTP 402) before, and the page must still render something
 * correct rather than a blank section.
 *
 * So these are a safety net, not the source of truth. Edit copy in the Studio.
 * Change these only when the *fallback* should change.
 *
 * Whoever writes this copy — in the Studio or here — must respect three rules.
 * They are in the schema descriptions too, and in docs/01-roadmap.md §5.5,
 * because each is a liability or credibility exposure rather than a style
 * preference:
 *
 *  1. Never claim lodging or supervision is provided. "Facilitate, don't
 *     operate" is a deliberate posture (risk register R12): refer teams to
 *     partners, never take booking custody. It is what keeps Elevate a
 *     programme provider rather than a camp operator.
 *  2. Never promise the sea-level race effect. A June/July block builds
 *     aerobic base; it cannot deliver a November championship result.
 *     Overselling loses exactly the sophisticated coaches this targets.
 *  3. Never state a track record the business does not have. No season has
 *     run. The standards section is written as what every session runs to —
 *     a commitment, not history.
 * ─────────────────────────────────────────────────────────────────────────
 */

const CDN = "https://cdn.sanity.io/images/yvqe54iq/production";

const FALLBACK = {
  heroEyebrow: "Flagstaff, Arizona · 7,000 ft",
  heroHeadline: "Train where the\nair is thin.",
  heroStandfirst:
    "Multi-week altitude blocks built for high school cross country teams — professional athlete access, D1 recruiting guidance, and the logistics handled on the ground.",
  heroImageUrl: `${CDN}/b7785c73f2955fc5e92a8a9f8cd2d075806e9f60-3024x4032.jpg`,
  heroPrimaryCta: { label: "Plan your team's block", href: "/contact" },
  heroSecondaryCta: { label: "How it works", href: "/registration" },

  /* Only professionally shot frames are used as fallbacks. Phone snapshots and
     group selfies are avoided deliberately — type over faces at close range
     fights the type. */
  editorialSections: [
    {
      eyebrow: "01 — What we are",
      heading: "A team altitude block, not a summer camp.",
      paragraphs: [
        "Three to four weeks at 7,000 feet, sold to a programme rather than to individuals. We run the training environment, open doors to professionals and collegiate coaches, and handle coordination on the ground. Your coaching staff keeps their athletes; lodging is arranged through our local partners.",
        "Built for aerobic base development during the highest-volume phase of your training year — not as a taper trick before championships. Flagstaff sits at roughly 2,100m, squarely inside the band where meaningful adaptation happens.",
      ],
      metaLine: "Flagstaff, Arizona · Summer blocks",
      imageUrl: `${CDN}/c48d0605d78850ce8f379d5e09aea8f5587b867d-1638x2048.jpg`,
      imageAlt: "Runners on the track beneath the San Francisco Peaks at sunrise",
      imageSide: "right" as const,
    },
    {
      eyebrow: "02 — Who we serve",
      heading: "Coaches bringing a squad.",
      paragraphs: [
        "High school cross country programmes from Arizona, Nevada, New Mexico, California and West Texas — and collegiate groups in the summer and school-break windows.",
        "You could rent a house somewhere high and run the trip yourself. Flagstaff earns the trip differently: a deep resident professional community, university facilities, more runnable trail than you can cover in a month, a real town around it, and lodging that costs meaningfully less than the California altitude towns.",
      ],
      imageUrl: `${CDN}/2edafd98ea58992f2bdd7f8c1dfe6b6a1cb82bee-2048x1638.jpg`,
      imageAlt: "A pack of athletes running into low sun on the track",
      imageSide: "left" as const,
      linkLabel: "Start a conversation →",
      linkHref: "/contact",
    },
  ],

  fullBleed: {
    eyebrow: "High school camper · Collegiate counsellor · Professional",
    quote: "Anyone can copy a training itinerary. Nobody can copy the athletes who came back.",
    imageUrl: `${CDN}/6b27b330c8812c2621133c650f7a83cf2fc491fc-3840x2160.jpg`,
  },

  stats: [
    { value: "7,000", label: "feet of elevation", note: "Inside the 2,000–2,500m adaptation band" },
    { value: "3–4", label: "week team blocks", note: "One-week on-ramp also available" },
    { value: "8+", label: "athlete team minimum", note: "Priced as a team, not per head" },
  ],

  standardsEyebrow: "03 — How we run it",
  standardsHeading: "The standard every session runs to.",
  standards: [
    {
      title: "Two-deep leadership",
      description:
        "No adult is ever alone with a minor. Every staff member is background-screened and trained in youth protection before any participant contact.",
    },
    {
      title: "Graduated arrival load",
      description:
        "Reduced volume and intensity for the first three to five days. Arriving from sea level and training hard on day one is how an altitude block goes wrong.",
    },
    {
      title: "Pre-arrival iron screening",
      description:
        "We ask every athlete to have ferritin checked before travelling. Low iron makes an altitude block useless at best — and deficiency is common in adolescent distance runners.",
    },
    {
      title: "Published air-quality thresholds",
      description:
        "Flagstaff's fire season overlaps the training season. Our AQI action thresholds, training alternatives and cancellation terms are published up front, not negotiated during a smoke event.",
    },
    {
      title: "Route-specific emergency plans",
      description:
        "Every route has an identified shelter and a named receiving hospital, with certified wilderness first aid on session and communications carried on every run.",
    },
    {
      title: "Your staff keep their athletes",
      description:
        "We are a programme provider, not a camp operator. Supervision and lodging stay with your coaches and families — clearer for everyone, and safer for your athletes.",
    },
  ],

  closingCta: {
    heading: "Bringing a team to altitude?",
    body: "Tell us your squad size, the weeks you have, and what you want out of the block. We will come back with a plan and a price.",
    label: "Plan your team's block",
    href: "/contact",
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

/** Renders CMS Portable Text when present, otherwise the fallback paragraphs. */
function SectionBody({ body, paragraphs }: { body?: EditorialSection["body"]; paragraphs?: string[] }) {
  const cls = "mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a] first:mt-7";
  if (body?.length) {
    return (
      <div className="[&>p]:mt-4 [&>p]:max-w-[52ch] [&>p]:text-[17px] [&>p]:leading-[1.75] [&>p]:text-[#4a4a4a] [&>p:first-child]:mt-7">
        <PortableText value={body} />
      </div>
    );
  }
  return (
    <>
      {(paragraphs ?? []).map((p) => (
        <p key={p.slice(0, 32)} className={cls}>
          {p}
        </p>
      ))}
    </>
  );
}

export default async function Home() {
  const data = await getHomePage();

  const heroHeadline = data.heroHeadline ?? FALLBACK.heroHeadline;
  const heroImageUrl = data.heroImageUrl ?? FALLBACK.heroImageUrl;
  const primaryCta = {
    label: data.heroPrimaryCta?.label ?? FALLBACK.heroPrimaryCta.label,
    href: data.heroPrimaryCta?.href ?? FALLBACK.heroPrimaryCta.href,
  };
  const secondaryCta = {
    label: data.heroSecondaryCta?.label ?? FALLBACK.heroSecondaryCta.label,
    href: data.heroSecondaryCta?.href ?? FALLBACK.heroSecondaryCta.href,
  };
  // Only fall back wholesale when the CMS array is absent — a populated array
  // is authoritative, so removing a section in the Studio removes it here.
  const sections = data.editorialSections?.length
    ? data.editorialSections
    : FALLBACK.editorialSections;
  const fullBleed = {
    eyebrow: data.fullBleed?.eyebrow ?? FALLBACK.fullBleed.eyebrow,
    quote: data.fullBleed?.quote ?? FALLBACK.fullBleed.quote,
    imageUrl: data.fullBleed?.imageUrl ?? FALLBACK.fullBleed.imageUrl,
  };
  const stats = data.stats?.length ? data.stats : FALLBACK.stats;
  const standards = data.standards?.length ? data.standards : FALLBACK.standards;
  const cta = {
    heading: data.closingCta?.heading ?? FALLBACK.closingCta.heading,
    body: data.closingCta?.body ?? FALLBACK.closingCta.body,
    label: data.closingCta?.label ?? FALLBACK.closingCta.label,
    href: data.closingCta?.href ?? FALLBACK.closingCta.href,
  };

  return (
    <Layout transparentNav>
      {/* ——— Hero ————————————————————————————————————————————— */}
      <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        {data.heroPlaybackId ? (
          <HeroVideo playbackId={data.heroPlaybackId} poster={heroImageUrl} />
        ) : (
          <Image src={heroImageUrl} alt="" fill priority className="object-cover" sizes="100vw" />
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
              <p className="text-xs uppercase tracking-[0.28em] text-[#f0ead6]/85">
                {data.heroEyebrow ?? FALLBACK.heroEyebrow}
              </p>
              {/* Newlines in the CMS value control where the headline wraps. */}
              <h1 className="mt-5 whitespace-pre-line text-6xl leading-[1.03] text-[#f0ead6] md:text-7xl">
                {heroHeadline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#f0ead6]/90">
                {data.heroStandfirst ?? FALLBACK.heroStandfirst}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href={primaryCta.href}
                  className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
                >
                  {primaryCta.label}
                </Link>
                <Link
                  href={secondaryCta.href}
                  className="rounded-md border border-[#f0ead6]/60 px-7 py-3.5 text-base text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
                >
                  {secondaryCta.label}
                </Link>
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
        const paragraphs = "paragraphs" in s ? (s.paragraphs as string[]) : undefined;
        return (
          <section key={s.eyebrow ?? s.heading ?? i} className={left ? "py-20 md:py-28" : "py-16 md:py-24"}>
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
                <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">{s.heading}</h2>
                <SectionBody body={s.body} paragraphs={paragraphs} />
                {s.metaLine && (
                  <div className="mt-10 border-t border-[var(--border)] pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      {s.metaLine}
                    </p>
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
      <section className="relative h-[78vh] min-h-[460px] w-full overflow-hidden">
        {fullBleed.imageUrl && (
          <Image src={fullBleed.imageUrl} alt="" fill className="object-cover" sizes="100vw" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(20,28,20,0.80) 0%, rgba(20,28,20,0.36) 45%, rgba(20,28,20,0) 78%)" }}
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-14 md:pb-20">
            {fullBleed.eyebrow && (
              <p className="text-xs uppercase tracking-[0.24em] text-[#f0ead6]/70">{fullBleed.eyebrow}</p>
            )}
            <p className="mt-5 max-w-3xl text-[2rem] leading-[1.28] text-[#f0ead6] md:text-[2.75rem]">
              {fullBleed.quote}
            </p>
          </div>
        </div>
      </section>

      {/* ——— Stat band ————————————————————————————————————— */}
      <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-[#f0ead6]/25 pt-6">
              <div className="text-6xl leading-none">{s.value}</div>
              <div className="mt-3 text-lg">{s.label}</div>
              {s.note && <div className="mt-1 text-sm text-[#f0ead6]/65">{s.note}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ——— How we run it ————————————————————————————————
          Per the risk plan §06 these protocols are a sales differentiator as
          much as a control: they signal competence to exactly the sophisticated
          coaches this business targets. Phrased as the standard every session
          runs to — no season has been delivered, so nothing claims history. */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>{data.standardsEyebrow ?? FALLBACK.standardsEyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            {data.standardsHeading ?? FALLBACK.standardsHeading}
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((i) => (
              <div key={i.title}>
                <h3 className="text-[1.4rem] leading-snug">{i.title}</h3>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Closing CTA ————————————————————————————————— */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[2.5rem] leading-[1.08] md:text-[3.25rem]">{cta.heading}</h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">{cta.body}</p>
          <Link
            href={cta.href}
            className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            {cta.label}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
