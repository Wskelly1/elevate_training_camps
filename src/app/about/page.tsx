import Layout from "../../components/layout";
import { urlFor } from "../../lib/sanity";
import { type TeamIntroduction } from "../../components/AnimatedCarousel";
import AboutPageContent from "../../components/AboutPageContent";
import { getTeamMembers, getAboutSections } from "../../lib/queries";
import type { SanityImageRef } from "../../lib/types";

// Type for team member from Sanity
type TeamMember = {
  _id: string;
  name: string;
  title: string;
  bio?: string; // Make bio optional
  image: SanityImageRef | null;
};

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

const FALLBACK_TEAM_INTRODUCTIONS: TeamIntroduction[] = [
  {
    quote: "I'm passionate about helping athletes reach their full potential through altitude training.",
    name: "Jane Doe",
    designation: "Head Coach",
    src: "/logo.svg",
  },
];

/**
 * AboutPage - Main about page component for Elevate Training Camps
 *
 * Server-rendered: fetches team members and about sections from Sanity CMS
 * (cached — see REVALIDATE_SECONDS in lib/queries.ts), then hands them to
 * AboutPageContent for rendering and hash-based scroll navigation.
 *
 * @returns {JSX.Element} The complete about page with all sections
 */
export default async function AboutPage() {
  const [members, aboutSections] = await Promise.all([
    getTeamMembers(),
    getAboutSections(),
  ]);

  const teamIntroductions = members && members.length > 0
    ? convertToIntroductions(members)
    : FALLBACK_TEAM_INTRODUCTIONS;

  return (
    <Layout>
      <AboutPageContent teamIntroductions={teamIntroductions} aboutSections={aboutSections} />
    </Layout>
  );
}
