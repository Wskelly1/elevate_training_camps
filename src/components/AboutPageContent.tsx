"use client";

import { useEffect } from "react";
import { urlFor } from "../lib/sanity";
import { type TeamIntroduction } from "./AnimatedCarousel";
import TeamRotator from "./TeamRotator";
import PageMasthead from "./PageMasthead";
import { AboutSection } from "../lib/queries";
import { PortableText } from '@portabletext/react';
import Image from 'next/image';

interface AboutPageContentProps {
  teamIntroductions: TeamIntroduction[];
  aboutSections: AboutSection[];
  /** Hero copy from the aboutPage singleton (CMS-ification Wave 3).
   *  Absent fields render nothing — no hard-coded copy fallback. */
  hero?: {
    mastheadImageUrl?: string;
    heroHeading?: string;
    heroIntro?: string;
    statChips?: string[];
  } | null;
}

/**
 * AboutPageContent — editorial About page (A2.5a system).
 *
 * Section order deliberately mirrors the About dropdown in the nav (owner
 * decision 2026-07-31): Our Team first, then the CMS sections in the same
 * query order the dropdown itself is built from — the two can't drift
 * because they share `getAboutSections()`. The team section uses the
 * rotational TeamRotator (replacing first the old carousel, then the
 * static grid).
 *
 * Owns only the hash-based scroll-to-section behavior (needs the browser);
 * all data arrives as props from the server component.
 */
export default function AboutPageContent({ teamIntroductions, aboutSections, hero }: AboutPageContentProps) {
  // Handle URL hash navigation on load (e.g. /about#our-team)
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);

      requestAnimationFrame(() => {
        const section = document.getElementById(sectionId);

        if (section) {
          const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;

          window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, []);

  return (
    <>
      <PageMasthead
        imageUrl={hero?.mastheadImageUrl}
        eyebrow="About Elevate"
        heading={hero?.heroHeading || "About Elevate Training Camps"}
        meta={hero?.statChips?.join("  ·  ")}
      />

      {/* ——— Intro — large type on paper, straight off the image ————— */}
      {hero?.heroIntro && (
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <p className="max-w-3xl font-serif text-[24px] leading-[1.55] md:text-[30px]">{hero.heroIntro}</p>
        </section>
      )}

      {/* ——— Our Team — first, matching the dropdown ————————————— */}
      <section id="our-team" className="scroll-mt-32 border-t border-[var(--border)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">The people</p>
          <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.25rem]">Our Team</h2>
          {teamIntroductions.length > 0 ? (
            <TeamRotator introductions={teamIntroductions} />
          ) : (
            <p className="mt-8 text-lg text-[var(--muted-foreground)]">Team members will be added soon.</p>
          )}
        </div>
      </section>

      {/* ——— CMS sections — same order as the dropdown ————————
          Alternating edge-bleed layout (A2.5a); zebra backgrounds continue
          from the team section above. */}
      {aboutSections.map((section, index) =>
        index % 2 === 0 ? (
          /* Full-bleed image with a floating dark plate (lodge grammar). */
          <section key={section._id} id={section.slug.current} className="scroll-mt-32">
            <div className="relative min-h-[520px] w-full overflow-hidden md:h-[70vh]">
              {section.image && (
                <Image
                  src={urlFor(section.image).url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              )}
              <div className="absolute inset-0 bg-[#141a12]/25" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-6xl px-6">
                  <div className="max-w-lg p-9 backdrop-blur-[2px] md:p-10" style={{ backgroundColor: "rgba(28,36,25,0.82)", color: "#f0ead6" }}>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#e0b48e]">{section.title}</p>
                    <div className="mt-5 [&_p]:mt-4 [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-[#f0ead6]/90 [&_p:first-child]:mt-0">
                      <PortableText value={section.content} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Split editorial on paper. */
          <section key={section._id} id={section.slug.current} className="scroll-mt-32 py-20 md:py-24">
            <div className="grid items-center gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-0 md:pr-[6vw]">
              <div className="md:col-span-7">
                <div className="img-live relative aspect-[4/3] w-full overflow-hidden">
                  {section.image && (
                    <Image
                      src={urlFor(section.image).url()}
                      alt={section.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 58vw"
                    />
                  )}
                </div>
              </div>
              <div className="md:col-span-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">{section.title}</p>
                <div className="mt-5 [&_p]:mt-4 [&_p]:max-w-[52ch] [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-[#4a4a4a] [&_p:first-child]:mt-0">
                  <PortableText value={section.content} />
                </div>
              </div>
            </div>
          </section>
        )
      )}
    </>
  );
}
