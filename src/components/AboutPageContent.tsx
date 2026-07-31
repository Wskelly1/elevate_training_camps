"use client";

import { useEffect } from "react";
import { urlFor } from "../lib/sanity";
import { AnimatedTeamIntroductions, type TeamIntroduction } from "./AnimatedCarousel";
import { AboutSection } from "../lib/queries";
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { User } from "lucide-react";

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
 * AboutPageContent - client-side interactive body of the About page.
 *
 * Receives already-fetched data as props (fetched server-side in
 * app/about/page.tsx) and owns only the hash-based scroll-to-section
 * behavior, which needs the browser.
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
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#427b4d]/10 to-[#755f4f]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <User className="h-16 w-16 mx-auto text-[#427b4d] mb-6" />
            <h1 className="text-5xl md:text-6xl text-gray-900 mb-6">
              {hero?.heroHeading || "About Elevate Training Camps"}
            </h1>
            {hero?.heroIntro && (
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {hero.heroIntro}
              </p>
            )}
          </div>
          {hero?.statChips && hero.statChips.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hero.statChips.map((chip) => (
                <div key={chip} className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
                  <p className="text-lg text-gray-900">{chip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="our-team" className="py-12 bg-[#f0ead6] scroll-mt-32">
        <h2 className="text-5xl text-center mb-4">Our Team</h2>
        {teamIntroductions.length > 0 ? (
          <AnimatedTeamIntroductions
            introductions={teamIntroductions}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Team members will be added soon!</p>
          </div>
        )}
      </section>

      {aboutSections
        .filter(section => !section.title.toLowerCase().includes('pricing'))
        .map((section, index) => (
        <section key={section._id} id={section.slug.current} className={`py-12 ${index % 2 !== 0 ? 'bg-[#f0ead6]' : 'bg-transparent'} scroll-mt-32`}>
          <div className="container mx-auto px-4">
            <div className={`flex flex-col items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="md:w-1/2">
                {section.image && (
                  <Image
                    src={urlFor(section.image).url()}
                    alt={section.title}
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg"
                  />
                )}
              </div>
              <div className="md:w-1/2">
                <h2 className="text-5xl mb-4">{section.title}</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={section.content} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
