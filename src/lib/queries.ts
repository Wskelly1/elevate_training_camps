import { unstable_cache } from 'next/cache'
import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageRef } from './types'
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
  logo?: SanityImageRef;
  footerLogo?: SanityImageRef;
  aboutUsImage?: SanityImageRef;
  favicon?: SanityImageRef;
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
  content?: PortableTextBlock[];
  image?: SanityImageRef;
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
  faqPageImage?: SanityImageRef;
};

// Reads the faqPage singleton (Wave 3 — content migrated out of
// siteSettings.faqPage on 2026-07-30). The image field is aliased to the
// old faqPageImage name so the page component is unchanged.
const fetchFAQPageSettings = unstable_cache(
  async (): Promise<FAQPageSettings | null> => {
    return await client.fetch(`
      *[_type == "faqPage" && _id == "faqPage"][0] {
        title,
        introduction,
        "faqPageImage": image
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
    return settings || {};
  } catch (error) {
    console.error('Error fetching FAQ page settings:', error);
    return {};
  }
}

/**
 * TeamBlock - the team-sold product: a base fee plus a per-athlete rate.
 * Prices live ONLY on these documents (docs/10-sanity-content-plan.md §5)
 * and must match business-plan/PRICING.md — `npm run check:pricing` verifies.
 */
export type TeamBlock = {
  _id: string;
  name: string;
  tagline?: string;
  baseFee: number;
  perAthleteRate: number;
  exampleLine?: string;
  detail?: string;
  seasonLabel?: string;
};

export type RegistrationPageContent = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  pricingEyebrow?: string;
  pricingHeading?: string;
  blocks?: TeamBlock[];
  pricingFootnote?: string;
  includedEyebrow?: string;
  includedHeading?: string;
  includedIntro?: string;
  includedItems?: Array<{ title?: string; body?: string }>;
  notIncludedTitle?: string;
  notIncludedItems?: string[];
  bookingEyebrow?: string;
  bookingHeading?: string;
  bookingSteps?: Array<{ title?: string; body?: string }>;
  finePrintEyebrow?: string;
  finePrintCards?: Array<{ title?: string; body?: string }>;
  closingHeading?: string;
  closingBody?: string;
  closingCtaLabel?: string;
};

const fetchRegistrationPage = unstable_cache(
  async (): Promise<RegistrationPageContent | null> => {
    return await client.fetch(`
      *[_type == "registrationPage" && _id == "registrationPage"][0]{
        eyebrow,
        heading,
        intro,
        pricingEyebrow,
        pricingHeading,
        "blocks": blocks[]->{
          _id,
          name,
          tagline,
          baseFee,
          perAthleteRate,
          exampleLine,
          detail,
          seasonLabel
        },
        pricingFootnote,
        includedEyebrow,
        includedHeading,
        includedIntro,
        includedItems[]{ title, body },
        notIncludedTitle,
        notIncludedItems,
        bookingEyebrow,
        bookingHeading,
        bookingSteps[]{ title, body },
        finePrintEyebrow,
        finePrintCards[]{ title, body },
        closingHeading,
        closingBody,
        closingCtaLabel
      }
    `);
  },
  ['registration-page'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches the Registration page copy + referenced team blocks.
 *
 * Returns null on failure or when the singleton doesn't exist. The page
 * renders a neutral empty state in that case — deliberately NOT a
 * copy-carrying fallback (docs/10-sanity-content-plan.md §5 rule 2: a
 * divergent hard-coded fallback is how fabricated pricing went live once).
 *
 * @returns {Promise<RegistrationPageContent | null>} Page content or null
 */
export async function getRegistrationPage(): Promise<RegistrationPageContent | null> {
  try {
    return await fetchRegistrationPage();
  } catch (error) {
    console.error('Error fetching registration page:', error);
    return null;
  }
}

/**
 * RecruitingPageContent — /recruiting copy + media (CMS-ification Wave 2).
 * Deliberately carries no pricing anywhere: the recruitingPage schema has
 * no price fields (Gate-7 — no rate card until the attach rate is measured).
 */
export type RecruitingPageContent = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  stats?: Array<{ number?: string; label?: string; sub?: string }>;
  whyEyebrow?: string;
  whyHeading?: string;
  whyParagraphs?: string[];
  whyImage?: SanityImageRef;
  whyImageAlt?: string;
  watchEyebrow?: string;
  watchHeading?: string;
  watchIntro?: string;
  watchItems?: Array<{ title?: string; body?: string }>;
  evalEyebrow?: string;
  evalHeading?: string;
  evalBody?: string;
  evalAccent?: string;
  evalLinkLabel?: string;
  evalImage?: SanityImageRef;
  evalImageAlt?: string;
  quoteLabel?: string;
  quoteText?: string;
  neverEyebrow?: string;
  neverHeading?: string;
  neverItems?: Array<{ title?: string; body?: string }>;
  familyEyebrow?: string;
  familyHeading?: string;
  familyParagraphs?: string[];
  coachEyebrow?: string;
  coachHeading?: string;
  coachBody?: string;
  coachLinkLabel?: string;
  closingHeading?: string;
  closingBody?: string;
  closingCtaLabel?: string;
  footnote?: string;
};

const fetchRecruitingPage = unstable_cache(
  async (): Promise<RecruitingPageContent | null> => {
    return await client.fetch(`
      *[_type == "recruitingPage" && _id == "recruitingPage"][0]{
        eyebrow, heading, intro, ctaPrimary, ctaSecondary,
        stats[]{ number, label, sub },
        whyEyebrow, whyHeading, whyParagraphs, whyImage, whyImageAlt,
        watchEyebrow, watchHeading, watchIntro,
        watchItems[]{ title, body },
        evalEyebrow, evalHeading, evalBody, evalAccent, evalLinkLabel,
        evalImage, evalImageAlt,
        quoteLabel, quoteText,
        neverEyebrow, neverHeading,
        neverItems[]{ title, body },
        familyEyebrow, familyHeading, familyParagraphs,
        coachEyebrow, coachHeading, coachBody, coachLinkLabel,
        closingHeading, closingBody, closingCtaLabel, footnote
      }
    `);
  },
  ['recruiting-page'],
  { revalidate: REVALIDATE_SECONDS }
);

/**
 * Fetches the Recruiting page copy. Null on failure → the page renders a
 * neutral empty state, never a copy-carrying fallback (docs/10 §5 rule 2).
 */
export async function getRecruitingPage(): Promise<RecruitingPageContent | null> {
  try {
    return await fetchRecruitingPage();
  } catch (error) {
    console.error('Error fetching recruiting page:', error);
    return null;
  }
}

/** AboutPageHero — the /about hero copy (Wave 3). */
export type AboutPageHero = {
  heroHeading?: string;
  heroIntro?: string;
  statChips?: string[];
};

const fetchAboutPage = unstable_cache(
  async (): Promise<AboutPageHero | null> => {
    return await client.fetch(`
      *[_type == "aboutPage" && _id == "aboutPage"][0]{ heroHeading, heroIntro, statChips }
    `);
  },
  ['about-page'],
  { revalidate: REVALIDATE_SECONDS }
);

/** Null on failure → the hero renders a minimal neutral state (docs/10 §5 rule 2). */
export async function getAboutPage(): Promise<AboutPageHero | null> {
  try {
    return await fetchAboutPage();
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

/** ContactPageContent — the /contact heading + intro (Wave 3). */
export type ContactPageContent = {
  heading?: string;
  intro?: string;
};

const fetchContactPage = unstable_cache(
  async (): Promise<ContactPageContent | null> => {
    return await client.fetch(`
      *[_type == "contactPage" && _id == "contactPage"][0]{ heading, intro }
    `);
  },
  ['contact-page'],
  { revalidate: REVALIDATE_SECONDS }
);

/** Null on failure → the form renders with a bare neutral heading. */
export async function getContactPage(): Promise<ContactPageContent | null> {
  try {
    return await fetchContactPage();
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}
