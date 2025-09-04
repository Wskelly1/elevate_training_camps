"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { client, urlFor } from "../../lib/sanity";
import { AnimatedTeamIntroductions, type TeamIntroduction } from "../../components/AnimatedCarousel";
import { SanityTeamMember } from '../../lib/types';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { User } from "lucide-react";

// Type for team member from Sanity
type TeamMember = {
  _id: string;
  name: string;
  title: string;
  bio?: string; // Make bio optional
  image: any;
};

// Type for about section from Sanity
interface AboutSection {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: any;
  image: any;
}



/**
 * Fetches team members from the Sanity CMS
 *
 * Retrieves all team member documents ordered by their specified order field.
 * Each team member includes their ID, name, title, bio, and image.
 *
 * @returns {Promise<TeamMember[]>} Array of team member objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
async function getTeamMembers() {
  return await client.fetch(`
    *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      title,
      bio,
      image
    }
  `);
}

/**
 * Fetches about sections from the Sanity CMS
 *
 * Retrieves all about section documents with their content, images, and metadata.
 * These sections are displayed dynamically on the about page.
 *
 * @returns {Promise<AboutSection[]>} Array of about section objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
async function getAboutSections() {
    return await client.fetch(`
    *[_type == "aboutSection"] {
      _id,
      title,
      slug,
      content,
      image
    }
  `);
}



/**
 * Converts Sanity team members to the format required by AnimatedTeamIntroductions
 *
 * Transforms raw team member data from Sanity into the structured format needed
 * by the animated carousel component, including fallback values for missing data.
 *
 * @param {TeamMember[]} members - Array of team member objects from Sanity
 * @returns {TeamIntroduction[]} Array of formatted team introductions for the carousel
 */
function convertToIntroductions(members: TeamMember[]): TeamIntroduction[] {
  return members.map(member => {
    // Default placeholder bio if none exists
    const bio = member.bio || `${member.name} is a valued member of our team at Elevate Training Camps.`;

    return {
      name: member.name,
      designation: member.title || 'Team Member', // Default title if none exists
      quote: bio,
      src: member.image ? urlFor(member.image).width(500).height(500).url() : "/logo.svg"
    };
  });
}

/**
 * AboutPage - Main about page component for Elevate Training Camps
 *
 * This component displays the about page content including hero section, team members,
 * and dynamic about sections fetched from Sanity CMS. It handles URL hash navigation
 * for direct linking to specific sections and provides a responsive layout.
 *
 * Features:
 * - Dynamic hero section with background image and overlay text
 * - Team member carousel with animated introductions
 * - Dynamic about sections with alternating layouts
 * - Smooth scroll navigation to sections via URL hash
 * - Responsive design with mobile-first approach
 * - Direct content loading without loading screen
 *
 * @returns {JSX.Element} The complete about page with all sections
 */
export default function AboutPage() {
  const [teamIntroductions, setTeamIntroductions] = useState<TeamIntroduction[]>([]);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Handle URL hash navigation after content loads
  useEffect(() => {
    // Only execute this once everything is loaded
    if (!isLoading) {
      // Get the hash from the URL (if any)
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);

        // Use requestAnimationFrame for immediate execution after DOM is ready
        requestAnimationFrame(() => {
          const section = document.getElementById(sectionId);

          if (section) {
            // Get header height for offset
            const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;

            // Scroll to position section exactly at the top after header
            window.scrollTo({
              top: section.offsetTop - headerHeight,
              behavior: 'smooth'
            });

            // For debugging
            console.log(`Scrolling to section: ${sectionId} at position: ${section.offsetTop - headerHeight}`);
          }
        });
      }
    }
  }, [isLoading]); // Run when loading changes to false

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [members, sections] = await Promise.all([
          getTeamMembers(),
          getAboutSections(),
        ]);

        if (members && members.length > 0) {
          setTeamIntroductions(convertToIntroductions(members));
        } else {
          // Fallback data if no team members in Sanity yet
          setTeamIntroductions([
            {
              quote: "I'm passionate about helping athletes reach their full potential through altitude training.",
              name: "Jane Doe",
              designation: "Head Coach",
              src: "/logo.svg",
            },
          ]);
        }

        setAboutSections(sections);

        // Set loading to false immediately after data is loaded
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching about page data:", error);
        // Still set loading to false even if there's an error
        setIsLoading(false);
      }
    }

    loadAboutData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#427b4d]/10 to-[#755f4f]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <User className="h-16 w-16 mx-auto text-[#427b4d] mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About Elevate Training Camps
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the story behind our commitment to excellence in high-altitude training.
              We're dedicated to helping athletes reach their peak performance through innovative
              training methods and world-class facilities in the heart of Flagstaff, Arizona.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <p className="text-lg font-semibold text-gray-900">Established 2020</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <p className="text-lg font-semibold text-gray-900">Flagstaff, Arizona</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <p className="text-lg font-semibold text-gray-900">7,000 ft Elevation</p>
            </div>
          </div>
        </div>
      </section>

      <section id="our-team" className="py-12 bg-[#f0ead6] scroll-mt-32">
        <h2 className="text-5xl font-bold text-center mb-4">Our Team</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Loading team members...</p>
          </div>
        ) : teamIntroductions.length > 0 ? (
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
                <h2 className="text-5xl font-bold mb-4">{section.title}</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={section.content} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </Layout>
  );
}
