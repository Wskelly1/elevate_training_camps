"use client";

import { useEffect } from "react";
import { urlFor } from "../lib/sanity";
import { type TeamIntroduction } from "./AnimatedCarousel";
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
 * AboutPageContent — full editorial rebuild (owner decision 2026-07-31),
 * applying the A2.5a system that the homepage and /recruiting already use:
 * left-aligned serif masthead, edge-bleeding alternating sections, an
 * editorial team grid replacing the old AnimatedCarousel, and token colors
 * throughout. This retires the "centered PowerPoint" composition the
 * design review (docs/02) diagnosed.
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
      {/* ——— Masthead ————————————————————————————————————— */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">About Elevate</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            {hero?.heroHeading || "About Elevate Training Camps"}
          </h1>
          {hero?.heroIntro && (
            <p className="mt-7 max-w-2xl text-lg leading-[1.75] text-[#4a4a4a]">{hero.heroIntro}</p>
          )}
          {hero?.statChips && hero.statChips.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-[var(--border)] pt-5">
              {hero.statChips.map((chip) => (
                <p key={chip} className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {chip}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——— CMS sections — alternating, edge-bleeding ————————
          The image column runs off one viewport edge, alternating sides, so
          consecutive sections don't share a silhouette (A2.5a system). */}
      {aboutSections.map((section, index) => {
        const left = index % 2 !== 0;
        return (
          <section
            key={section._id}
            id={section.slug.current}
            className={`scroll-mt-32 ${left ? "py-20 md:py-28" : "border-t border-[var(--border)] bg-[var(--surface)] py-16 md:py-24"}`}
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

      {/* ——— Team — editorial grid (replaces the carousel) ———————— */}
      <section id="our-team" className="scroll-mt-32 border-t border-[var(--border)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">The people</p>
          <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.25rem]">Our Team</h2>
          {teamIntroductions.length > 0 ? (
            <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {teamIntroductions.map((member) => (
                <div key={member.name}>
                  {member.src && (
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={member.src}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="mt-5 text-[1.5rem] leading-snug">{member.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--accent-rock)]">
                    {member.designation}
                  </p>
                  {member.quote && (
                    <p className="mt-3 text-[15px] leading-[1.7] text-[#4a4a4a]">{member.quote}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-lg text-[var(--muted-foreground)]">Team members will be added soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
