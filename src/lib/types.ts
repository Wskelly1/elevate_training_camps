/**
 * SanityImage - Type definition for Sanity CMS image assets
 *
 * Represents the structure of image assets stored in Sanity CMS,
 * including the asset ID and URL for rendering.
 *
 * @property {Object} asset - Image asset object
 * @property {string} asset._id - Unique identifier for the asset
 * @property {string} asset.url - URL to access the image
 */
export interface SanityImage {
  asset: {
    _id: string;
    url: string;
  };
}

/**
 * SanityTestimonial - Type definition for testimonial data from Sanity
 *
 * Represents customer testimonials with personal information and quotes.
 * Used for displaying customer feedback on the website.
 *
 * @property {string} _key - Unique key for the testimonial
 * @property {string} name - Name of the person giving the testimonial
 * @property {string} text - The testimonial quote text
 * @property {string} [designation] - Role or designation of the person (optional for backward compatibility)
 * @property {SanityImage} image - Profile image of the person
 */
export interface SanityTestimonial {
  _key: string;
  name: string;
  text: string;
  designation?: string;
  image: SanityImage;
}

/**
 * SanityContentSection - Type definition for content sections from Sanity
 *
 * Represents content sections that can be displayed on various pages,
 * including headings, text, images, and call-to-action buttons.
 *
 * @property {string} _key - Unique key for the content section
 * @property {string} [slug] - Optional URL slug for the section
 * @property {string} heading - Main heading for the section
 * @property {string} [subheading] - Optional subheading text
 * @property {any} text - Rich text content (typically PortableText)
 * @property {SanityImage} image - Section image
 * @property {string} [buttonText] - Optional call-to-action button text
 * @property {string} [buttonLink] - Optional button link URL
 */
export interface SanityContentSection {
  _key: string;
  slug?: string;
  heading: string;
  subheading?: string;
  text: any; // Typically rich text
  image: SanityImage;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * SanityHomePage - Type definition for homepage data from Sanity
 *
 * Represents the complete structure of homepage content including
 * hero sections, testimonials, and dynamic content sections.
 *
 * @property {string} _id - Unique identifier for the homepage
 * @property {string} title - Page title
 * @property {boolean} [useScrollExpandMedia] - Whether to use scroll-expand media
 * @property {'video' | 'image'} [expandMediaType] - Type of expandable media
 * @property {SanityImage} [expandMediaSrc] - Source for expandable media
 * @property {SanityImage} [expandMediaImage] - Image for expandable media
 * @property {SanityImage} [expandPosterSrc] - Poster image for video media
 * @property {SanityImage} [expandBgImageSrc] - Background image for expandable media
 * @property {string} [expandTitle] - Title for expandable media section
 * @property {string} [expandSubtitle] - Subtitle for expandable media section
 * @property {string} [scrollToExpandText] - Text prompting user to scroll
 * @property {SanityImage} heroImage - Main hero section image
 * @property {string} [heroHeading] - Hero section heading
 * @property {string} [heroSubheading] - Hero section subheading
 * @property {SanityTestimonial[]} [testimonials] - Array of customer testimonials
 * @property {SanityContentSection[]} [contentSections] - Array of content sections
 */
export interface SanityHomePage {
  _id: string;
  title: string;
  useScrollExpandMedia?: boolean;
  expandMediaType?: 'video' | 'image';
  expandMuxVideo?: { asset?: { playbackId?: string; status?: string } };
  expandTitle?: string;
  expandSubtitle?: string;
  scrollToExpandText?: string;
  heroImage: SanityImage;
  heroHeading?: string;
  heroSubheading?: string;
  testimonials?: SanityTestimonial[];
  contentSections?: SanityContentSection[];
}

/**
 * SanityTeamMember - Type definition for team member data from Sanity
 *
 * Represents team member information including personal details,
 * professional information, and profile images.
 *
 * @property {string} _id - Unique identifier for the team member
 * @property {string} name - Full name of the team member
 * @property {string} title - Professional title or role
 * @property {any} bio - Biography or description (typically rich text)
 * @property {SanityImage} image - Profile image of the team member
 */
export interface SanityTeamMember {
  _id: string;
  name: string;
  title: string;
  bio: any; // Typically rich text
  image: SanityImage;
}

/**
 * HomeHero - Type definition for homepage hero section data
 *
 * Represents the hero section configuration including media assets,
 * text content, and display options.
 *
 * @property {'video' | 'image'} mediaType - Type of media to display
 * @property {Object} [mediaSrc] - Source object for media asset
 * @property {any} [mediaImage] - Image asset for the hero section
 * @property {any} [posterSrc] - Poster image for video media
 * @property {any} bgImageSrc - Background image for the hero section
 * @property {string} [title] - Hero section title
 * @property {string} [date] - Optional date information
 * @property {string} [scrollToExpand] - Text prompting user to scroll
 */
export interface HomeHero {
  mediaType: 'video' | 'image';
  mediaSrc?: { asset: { url: string } };
  mediaImage?: any;
  posterSrc?: any;
  bgImageSrc: any;
  title?: string;
  date?: string;
  scrollToExpand?: string;
}
