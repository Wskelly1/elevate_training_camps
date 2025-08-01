import { client } from './sanity'
import { groq } from 'next-sanity';

/**
 * SiteSettings - Type definition for site configuration data
 *
 * This type defines the structure of site settings data retrieved from Sanity CMS,
 * including branding elements, contact information, and social media links.
 *
 * @property {string} title - The main site title
 * @property {string} [description] - Optional site description
 * @property {any} [logo] - Main site logo image
 * @property {any} [footerLogo] - Footer-specific logo image
 * @property {any} [aboutUsImage] - Image for the about us section
 * @property {any} [favicon] - Site favicon
 * @property {string} [contactEmail] - Contact email address
 * @property {string} [contactPhone] - Contact phone number
 * @property {string} [address] - Physical address
 * @property {Array<{platform: string, url: string}>} [socialLinks] - Social media links
 */
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

/**
 * Fetches site settings from Sanity CMS
 *
 * Retrieves the main site configuration including branding, contact information,
 * and social media links. Returns default values if no settings are found.
 *
 * @returns {Promise<SiteSettings>} Site settings object with branding and contact info
 * @throws {Error} If the Sanity API request fails
 */
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

/**
 * Fetches team members from Sanity CMS
 *
 * Retrieves all team member documents ordered by their specified order field.
 * Each team member includes their ID, name, title, bio, and image.
 *
 * @returns {Promise<Array>} Array of team member objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
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

/**
 * Fetches home hero data from Sanity CMS
 *
 * Retrieves the hero section configuration for the homepage including media assets,
 * text content, and styling options.
 *
 * @returns {Promise<Object>} Hero configuration object or null if not found
 * @throws {Error} If the Sanity API request fails
 */
export async function getHomeHero() {
  return await client.fetch(`
    *[_type == "homeHero"][0] {
      mediaType,
      mediaSrc {
        asset-> {
          url
        }
      },
      mediaImage,
      posterSrc,
      bgImageSrc,
      title,
      date,
      scrollToExpand
    }
  `);
}

/**
 * Homepage query for Sanity CMS
 *
 * GROQ query that retrieves all homepage content including hero section,
 * testimonials, and content sections. This is the main query for the homepage.
 *
 * @type {string} GROQ query string for homepage data
 */
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    _id,
    title,
    useScrollExpandMedia,
    expandMediaType,
    expandMediaSrc {
      asset->{
        _id,
        url
      }
    },
    expandMediaImage {
      asset->{
        _id,
        url
      }
    },
    expandPosterSrc {
      asset->{
        _id,
        url
      }
    },
    expandBgImageSrc {
      asset->{
        _id,
        url
      }
    },
    expandTitle,
    expandSubtitle,
    scrollToExpandText,
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
