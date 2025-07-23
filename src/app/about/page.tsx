"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { client, urlFor } from "../../lib/sanity";
import { AnimatedTeamIntroductions, type TeamIntroduction } from "../../components/AnimatedCarousel";
import { SanityTeamMember } from '../../lib/types';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import ScrollExpandMedia from "../../components/ScrollExpandMedia";
import LoadingBar from "../../components/LoadingBar";

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

interface AboutHero {
  mediaType: 'video' | 'image';
  mediaSrc?: { asset: { url: string } };
  mediaImage?: any;
  posterSrc?: any;
  bgImageSrc: any;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  overview?: string;
  conclusion?: string;
}

// Fetch team members from Sanity
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

// Fetch about sections from Sanity
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

async function getAboutHero() {
  return await client.fetch(`
    *[_type == "aboutHero"][0] {
      ...,
      mediaSrc {
        asset-> {
          url
        }
      }
    }
  `);
}

// Convert Sanity team members to the format needed by AnimatedTeamIntroductions
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

export default function AboutPage() {
  const [teamIntroductions, setTeamIntroductions] = useState<TeamIntroduction[]>([]);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [aboutHero, setAboutHero] = useState<AboutHero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Handle URL hash navigation after content loads
  useEffect(() => {
    // Only execute this once everything is loaded
    if (!isLoading) {
      // Need to wait a bit longer to ensure all images and components are fully rendered
      const timer = setTimeout(() => {
        // Get the hash from the URL (if any)
        if (window.location.hash) {
          const sectionId = window.location.hash.substring(1);
          const section = document.getElementById(sectionId);
          
          if (section) {
            // Get header height for offset
            const headerHeight = document.querySelector('header')?.getBoundingClientRect().height || 80;
            
            // Scroll with enough offset to account for the fixed header
            window.scrollTo({
              top: section.offsetTop - headerHeight - 40,
              behavior: 'smooth'
            });
            
            // For debugging
            console.log(`Scrolling to section: ${sectionId} at position: ${section.offsetTop - headerHeight - 40}`);
          }
        }
      }, 1000); // Longer timeout to ensure everything is rendered
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]); // Run when loading changes to false
  
  // We don't need the timeout anymore since we're setting videoLoaded immediately

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [members, sections, hero] = await Promise.all([
          getTeamMembers(),
          getAboutSections(),
          getAboutHero(),
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
        setAboutHero(hero);
        
        // Always set videoLoaded to true when data is loaded
        // The actual video will load in the background
        setVideoLoaded(true);
        
        // Set loading to false immediately after data is loaded
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching about page data:", error);
        // Still set loading to false even if there's an error
        setIsLoading(false);
        // Also set videoLoaded to true in case of error
        setVideoLoaded(true);
      }
    }

    loadAboutData();
  }, []);
  
  // Handle video load completion
  const handleMediaLoaded = () => {
    setVideoLoaded(true);
  };
  
  // Show loading screen only while data is loading from Sanity
  if (isLoading) {
    return <LoadingBar 
      message="Loading About Page" 
      subMessage="Fetching content from our servers..." 
    />;
  }
  
  // Remove the second loading screen for video - we'll show content immediately
  // and let the video load in the background
  
  return (
    <Layout>
      {aboutHero && (
        <ScrollExpandMedia
          mediaType={aboutHero.mediaType}
          mediaSrc={aboutHero.mediaType === 'video' ? aboutHero.mediaSrc?.asset.url : urlFor(aboutHero.mediaImage).url()}
          posterSrc={aboutHero.posterSrc ? urlFor(aboutHero.posterSrc).url() : undefined}
          bgImageSrc={urlFor(aboutHero.bgImageSrc).url()}
          title={aboutHero.title}
          date={aboutHero.date}
          scrollToExpand={aboutHero.scrollToExpand}
          textBlend
          onFullyExpanded={handleMediaLoaded}
        />
      )}

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

      {aboutSections.map((section, index) => (
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