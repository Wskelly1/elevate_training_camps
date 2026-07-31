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
        eyebrow="About Elevate"
        heading={hero?.heroHeading || "About Elevate Training Camps"}
        intro={hero?.heroIntro}
      >
        {hero?.statChips && hero.statChips.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-[var(--border)] pt-5">
            {hero.statChips.map((chip) => (
              <p key={chip} className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                {chip}
              </p>
            ))}
          </div>
        )}
      </PageMasthead>

      {/* ——— Our Team — first, matching the dropdown ————————————— */}
      <section id="our-team" className="scroll-mt-32 py-16 md:py-20">
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
      {aboutSections.map((section, index) => {
        const surface = index % 2 === 0;
        const left = index % 2 !== 0;
        return (
          <section
            key={section._id}
            id={section.slug.current}
            className={`scroll-mt-32 ${surface ? "border-t border-[var(--border)] bg-[var(--surface)] py-16 md:py-24" : "py-20 md:py-28"}`}
          >
            <div
              className={`grid items-center gap-12 px-6 md:grid-cols-12 md:gap-14 ${
                left ? "md:pl-0 md:pr-[6vw]" : "md:pl-[6vw] md:pr-0"
              }`}
            >
              <div className={left ? "md:col-span-7" : "md:order-2 md:col-span-7"}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
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
              <div className={left ? "md:col-span-5" : "md:order-1 md:col-span-5"}>
                <h2 className="text-[2.75rem] leading-[1.06] md:text-[3.25rem]">{section.title}</h2>
                <div className="mt-6 [&_p]:mt-4 [&_p]:max-w-[52ch] [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-[#4a4a4a] [&_p:first-child]:mt-0">
                  <PortableText value={section.content} />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
