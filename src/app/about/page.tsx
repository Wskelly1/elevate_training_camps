"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { client, urlFor } from "../../lib/sanity";
import { AnimatedTeamIntroductions, type TeamIntroduction } from "../../components/AnimatedCarousel";
import { SanityTeamMember, SanityContentSection } from '../../lib/types';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';

// Type for team member from Sanity
type TeamMember = {
  _id: string;
  name: string;
  title: string;
  bio?: string; // Make bio optional
  image: any;
};

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

// Fetch content sections from Sanity
async function getAboutSections() {
    return await client.fetch(`
    *[_type == "contentSection" && (slug.current == "our-story" || slug.current == "our-mission" || slug.current == "our-locations")] {
      _id,
      heading,
      subheading,
      text,
      image,
      "slug": slug.current
    }
  `);
}

// Convert Sanity team members to the format needed by AnimatedTeamIntroductions
function convertToIntroductions(members: TeamMember[]): TeamIntroduction[] {
  return members.map(member => {
    // Default placeholder bio if none exists
    const bio = member.bio || `${member.name} is a valued member of our team at Summit Flagstaff.`;
    
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
  const [aboutSections, setAboutSections] = useState<SanityContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [members, sections] = await Promise.all([getTeamMembers(), getAboutSections()]);
        
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

      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAboutData();
  }, []);
  
  return (
    <Layout>
      <section id="our-story" className="py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg text-center mb-12">
          Discover our story, mission, and the dedicated team behind Elevate Training Camps.
        </p>
      </section>

      {aboutSections.map((section) => (
        <section key={section._key} id={section.slug} className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{section.heading}</h2>
            {section.subheading && <p className="text-xl text-center text-gray-600 mb-12">{section.subheading}</p>}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                {section.image && (
                  <Image
                    src={urlFor(section.image).url()}
                    alt={section.heading}
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg"
                  />
                )}
              </div>
              <div className="md:w-1/2">
                <div className="prose prose-lg max-w-none">
                  <PortableText value={section.text} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="our-team" className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Loading team members...</p>
          </div>
        ) : teamIntroductions.length > 0 ? (
          <AnimatedTeamIntroductions 
            introductions={teamIntroductions} 
            autoplay={true} 
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Team members will be added soon!</p>
          </div>
        )}
      </section>
    </Layout>
  );
} 