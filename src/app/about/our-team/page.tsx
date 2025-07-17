"use client";

import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { client, urlFor } from "../../../lib/sanity";
import { AnimatedTeamIntroductions, type TeamIntroduction } from "../../../components/AnimatedCarousel";
import { SanityTeamMember } from '../../../lib/types';

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

export default function OurTeamPage() {
  const [teamIntroductions, setTeamIntroductions] = useState<TeamIntroduction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const members = await getTeamMembers();
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
            {
              quote: "Summit Flagstaff combines the perfect environment with expert coaching for maximum results.",
              name: "John Smith",
              designation: "Training Specialist",
              src: "/logo.svg",
            },
            {
              quote: "Our program is designed to challenge athletes while ensuring they have a memorable experience.",
              name: "Emily Johnson",
              designation: "Camp Director",
              src: "/logo.svg",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        // Set fallback data on error
        setTeamIntroductions([
          {
            quote: "I'm passionate about helping athletes reach their full potential through altitude training.",
            name: "Jane Doe",
            designation: "Head Coach",
            src: "/logo.svg",
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadTeamMembers();
  }, []);
  
  return (
    <Layout>
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Our Team</h1>
        <p className="max-w-2xl mx-auto text-lg text-center mb-12">
          Meet the people behind Summit Flagstaff. Our dedicated team is committed to providing the best experience for all campers and families.
        </p>
        
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