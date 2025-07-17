import { client } from './sanity'
import { groq } from 'next-sanity';

// Type for site settings
export type SiteSettings = {
  title: string;
  description?: string;
  logo?: any;
  footerLogo?: any;
  aboutUsImage?: any;
  favicon?: any;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  // Get the first (and only) site settings document
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0]{
      title,
      description,
      logo {
        ...,
        asset->{
          ...,
          metadata
        }
      },
      footerLogo {
        ...,
        asset->{
          ...,
          metadata
        }
      },
      aboutUsImage,
      favicon,
      contactEmail,
      contactPhone,
      address,
      "socialLinks": socialLinks[] {
        platform,
        url
      }
    }
  `);
  
  return settings || {
    title: 'Summit Flagstaff',
  };
}

// Fetch team members
export async function getTeamMembers() {
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

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    _id,
    title,
    heroImage {
      asset->{
        _id,
        url
      }
    },
    heroHeading,
    heroSubheading,
    testimonials[] {
      _key,
      name,
      text,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    contentSections[] {
      _key,
      heading,
      subheading,
      text,
      image {
        asset->{
          _id,
          url
        }
      },
      buttonText,
      buttonLink
    }
  }
`; 