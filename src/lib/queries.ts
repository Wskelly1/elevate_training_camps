import { unstable_cache } from 'next/cache'
import { client } from './sanity'
import { groq } from 'next-sanity';

/**
 * How long (in seconds) cached Sanity query results are reused before being
 * refetched. Content here is edited occasionally by staff, not moment-to-moment,
 * so this trades a little freshness for a large cut in Sanity API request
 * volume — every page previously fetched fresh on every single visitor page
 * load, which is what drove the project into its free-tier quota overage.
 */
const REVALIDATE_SECONDS = 300;

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

const fetchSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    return await client.fetch(`
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
  },
  ['site-settings'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches site settings from Sanity CMS
 *
 * Retrieves the main site configuration including branding, contact information,
 * and social media links. Returns default values if no settings are found or if
 * the Sanity request fails — this is called from the root layout's
 * generateMetadata() on every route, so it must never throw.
 *
 * @returns {Promise<SiteSettings>} Site settings object with branding and contact info
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    title: 'Elevate Training Camps',
  };

  try {
    const settings = await fetchSiteSettings();
    return settings || fallback;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return fallback;
  }
}

const fetchTeamMembers = unstable_cache(
  async () => {
    return await client.fetch(`
      *[_type == "teamMember"] | order(order asc) {
        _id,
        name,
        title,
        bio,
        image
      }
    `);
  },
  ['team-members'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches team members from Sanity CMS
 *
 * Retrieves all team member documents ordered by their specified order field.
 * Each team member includes their ID, name, title, bio, and image.
 *
 * @returns {Promise<Array>} Array of team member objects from Sanity, or [] on failure
 */
export async function getTeamMembers() {
  try {
    return await fetchTeamMembers();
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

/**
 * AboutSection - Type definition for a dynamic about-page section
 */
export type AboutSection = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content?: any;
  image?: any;
}

const fetchAboutSections = unstable_cache(
  async (): Promise<AboutSection[]> => {
    return await client.fetch(`
      *[_type == "aboutSection"] | order(_createdAt asc) {
        _id,
        title,
        slug,
        content,
        image
      }
    `);
  },
  ['about-sections'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches about sections from Sanity CMS
 *
 * Retrieves all about section documents, used both for the About page's
 * body content and for the site nav's About dropdown.
 *
 * @returns {Promise<AboutSection[]>} Array of about section objects from Sanity, or [] on failure
 */
export async function getAboutSections(): Promise<AboutSection[]> {
  try {
    return await fetchAboutSections();
  } catch (error) {
    console.error('Error fetching about sections:', error);
    return [];
  }
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

const fetchHomePage = unstable_cache(
  async () => {
    return await client.fetch(homePageQuery);
  },
  ['home-page'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches homepage content from Sanity CMS
 *
 * @returns {Promise<Object|null>} Homepage document, or null on failure
 */
export async function getHomePage() {
  try {
    return await fetchHomePage();
  } catch (error) {
    console.error('Error fetching home page:', error);
    return null;
  }
}

const fetchCoachingPrograms = unstable_cache(
  async () => {
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
  },
  ['coaching-programs'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches coaching programs from Sanity CMS
 *
 * Retrieves all active coaching programs ordered by their display order.
 * Each program includes pricing, features, and program details.
 *
 * @returns {Promise<Array>} Array of coaching program objects from Sanity, or [] on failure
 */
export async function getCoachingPrograms() {
  try {
    return await fetchCoachingPrograms();
  } catch (error) {
    console.error('Error fetching coaching programs:', error);
    return [];
  }
}

const fetchCoachingBenefits = unstable_cache(
  async () => {
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
  },
  ['coaching-benefits'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches coaching benefits from Sanity CMS
 *
 * Retrieves all active coaching benefits ordered by their display order.
 * Each benefit includes title, description, and icon information.
 *
 * @returns {Promise<Array>} Array of coaching benefit objects from Sanity, or [] on failure
 */
export async function getCoachingBenefits() {
  try {
    return await fetchCoachingBenefits();
  } catch (error) {
    console.error('Error fetching coaching benefits:', error);
    return [];
  }
}

const fetchCoachingTestimonials = unstable_cache(
  async () => {
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
  },
  ['coaching-testimonials'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches coaching testimonials from Sanity CMS
 *
 * Retrieves all active coaching testimonials ordered by their display order.
 * Each testimonial includes athlete information, quotes, and ratings.
 *
 * @returns {Promise<Array>} Array of coaching testimonial objects from Sanity, or [] on failure
 */
export async function getCoachingTestimonials() {
  try {
    return await fetchCoachingTestimonials();
  } catch (error) {
    console.error('Error fetching coaching testimonials:', error);
    return [];
  }
}

const fetchTrainingPackages = unstable_cache(
  async () => {
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
  },
  ['training-packages'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches training packages from Sanity CMS
 *
 * Retrieves all active training packages ordered by their display order.
 * Each package includes pricing, features, and package details.
 *
 * @returns {Promise<Array>} Array of training package objects from Sanity, or [] on failure
 */
export async function getTrainingPackages() {
  try {
    return await fetchTrainingPackages();
  } catch (error) {
    console.error('Error fetching training packages:', error);
    return [];
  }
}

const fetchUpcomingCamps = unstable_cache(
  async () => {
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
  },
  ['upcoming-camps'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches upcoming training camps from Sanity CMS
 *
 * Retrieves all active upcoming camps ordered by their display order.
 * Each camp includes date, type, spots remaining, and early bird information.
 *
 * @returns {Promise<Array>} Array of upcoming camp objects from Sanity, or [] on failure
 */
export async function getUpcomingCamps() {
  try {
    return await fetchUpcomingCamps();
  } catch (error) {
    console.error('Error fetching upcoming camps:', error);
    return [];
  }
}

const fetchPaymentOptions = unstable_cache(
  async () => {
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
  },
  ['payment-options'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches payment options from Sanity CMS
 *
 * Retrieves all active payment options ordered by their display order.
 * Each option includes name, description, and discount details.
 *
 * @returns {Promise<Array>} Array of payment option objects from Sanity, or [] on failure
 */
export async function getPaymentOptions() {
  try {
    return await fetchPaymentOptions();
  } catch (error) {
    console.error('Error fetching payment options:', error);
    return [];
  }
}

const fetchWhatsIncluded = unstable_cache(
  async () => {
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
  },
  ['whats-included'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches what's included categories from Sanity CMS
 *
 * Retrieves all active what's included categories ordered by their display order.
 * Each category includes items and icon information.
 *
 * @returns {Promise<Array>} Array of what's included objects from Sanity, or [] on failure
 */
export async function getWhatsIncluded() {
  try {
    return await fetchWhatsIncluded();
  } catch (error) {
    console.error("Error fetching what's included:", error);
    return [];
  }
}

const fetchFAQs = unstable_cache(
  async () => {
    return await client.fetch(`
      *[_type == "faq"] | order(order asc) {
        _id,
        question,
        answer
      }
    `);
  },
  ['faqs'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches FAQ entries from Sanity CMS
 *
 * @returns {Promise<Array>} Array of FAQ objects from Sanity, or [] on failure
 */
export async function getFAQs() {
  try {
    return await fetchFAQs();
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export type FAQPageSettings = {
  title?: string;
  introduction?: string;
  faqPageImage?: any;
};

const fetchFAQPageSettings = unstable_cache(
  async (): Promise<{ faqPage?: FAQPageSettings } | null> => {
    return await client.fetch(`
      *[_type == "siteSettings"][0] {
        faqPage {
          title,
          introduction,
          faqPageImage
        }
      }
    `);
  },
  ['faq-page-settings'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches the FAQ page's title/intro/image settings from Sanity CMS
 *
 * @returns {Promise<FAQPageSettings>} FAQ page settings, or {} on failure
 */
export async function getFAQPageSettings(): Promise<FAQPageSettings> {
  try {
    const settings = await fetchFAQPageSettings();
    return settings?.faqPage || {};
  } catch (error) {
    console.error('Error fetching FAQ page settings:', error);
    return {};
  }
}
