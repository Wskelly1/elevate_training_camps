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
    expandMuxVideo {
      asset->{
        playbackId,
        status
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

/**
 * Fetches coaching programs from Sanity CMS
 *
 * Retrieves all active coaching programs ordered by their display order.
 * Each program includes pricing, features, and program details.
 *
 * @returns {Promise<Array>} Array of coaching program objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getCoachingPrograms() {
  return await client.fetch(`
    *[_type == "coachingProgram" && active == true] | order(order asc) {
      _id,
      name,
      description,
      price,
      originalPrice,
      duration,
      features,
      popular,
      order,
      icon,
      color,
      active
    }
  `);
}

/**
 * Fetches coaching benefits from Sanity CMS
 *
 * Retrieves all active coaching benefits ordered by their display order.
 * Each benefit includes title, description, and icon information.
 *
 * @returns {Promise<Array>} Array of coaching benefit objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getCoachingBenefits() {
  return await client.fetch(`
    *[_type == "coachingBenefit" && active == true] | order(order asc) {
      _id,
      title,
      description,
      icon,
      order,
      active
    }
  `);
}

/**
 * Fetches coaching testimonials from Sanity CMS
 *
 * Retrieves all active coaching testimonials ordered by their display order.
 * Each testimonial includes athlete information, quotes, and ratings.
 *
 * @returns {Promise<Array>} Array of coaching testimonial objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getCoachingTestimonials() {
  return await client.fetch(`
    *[_type == "coachingTestimonial" && active == true] | order(order asc) {
      _id,
      name,
      sport,
      quote,
      rating,
      program,
      image {
        asset->{
          _id,
          url
        }
      },
      order,
      active
    }
  `);
}

/**
 * Fetches training packages from Sanity CMS
 *
 * Retrieves all active training packages ordered by their display order.
 * Each package includes pricing, features, and package details.
 *
 * @returns {Promise<Array>} Array of training package objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getTrainingPackages() {
  return await client.fetch(`
    *[_type == "trainingPackage" && active == true] | order(order asc) {
      _id,
      name,
      description,
      price,
      originalPrice,
      duration,
      features,
      popular,
      order,
      active
    }
  `);
}

/**
 * Fetches upcoming training camps from Sanity CMS
 *
 * Retrieves all active upcoming camps ordered by their display order.
 * Each camp includes date, type, spots remaining, and early bird information.
 *
 * @returns {Promise<Array>} Array of upcoming camp objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getUpcomingCamps() {
  return await client.fetch(`
    *[_type == "upcomingCamp" && active == true] | order(order asc) {
      _id,
      date,
      type,
      spots,
      location,
      earlyBird,
      earlyBirdEnds,
      order,
      active
    }
  `);
}

/**
 * Fetches payment options from Sanity CMS
 *
 * Retrieves all active payment options ordered by their display order.
 * Each option includes name, description, and discount details.
 *
 * @returns {Promise<Array>} Array of payment option objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getPaymentOptions() {
  return await client.fetch(`
    *[_type == "paymentOption" && active == true] | order(order asc) {
      _id,
      name,
      description,
      discount,
      order,
      active
    }
  `);
}

/**
 * Fetches what's included categories from Sanity CMS
 *
 * Retrieves all active what's included categories ordered by their display order.
 * Each category includes items and icon information.
 *
 * @returns {Promise<Array>} Array of what's included objects from Sanity
 * @throws {Error} If the Sanity API request fails
 */
export async function getWhatsIncluded() {
  return await client.fetch(`
    *[_type == "whatsIncluded" && active == true] | order(order asc) {
      _id,
      category,
      items,
      icon,
      order,
      active
    }
  `);
}
