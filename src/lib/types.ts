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

/**
 * SanityCoachingProgram - Type definition for coaching program data from Sanity
 *
 * Represents coaching program information including pricing, features,
 * and program details for display on the coaching page.
 *
 * @property {string} _id - Unique identifier for the coaching program
 * @property {string} name - Name of the coaching program
 * @property {string} description - Brief description of the program
 * @property {number} price - Current price of the program
 * @property {number} [originalPrice] - Original price for strikethrough display
 * @property {string} duration - Duration of the program
 * @property {string[]} features - Array of program features
 * @property {boolean} popular - Whether this is marked as most popular
 * @property {number} order - Display order for sorting
 * @property {string} icon - Icon identifier for the program
 * @property {string} color - Color theme for the program
 * @property {boolean} active - Whether the program is active
 */
export interface SanityCoachingProgram {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  features: string[];
  popular: boolean;
  order: number;
  icon: string;
  color: string;
  active: boolean;
}

/**
 * SanityCoachingBenefit - Type definition for coaching benefit data from Sanity
 *
 * Represents benefits of coaching services for display on the coaching page.
 *
 * @property {string} _id - Unique identifier for the benefit
 * @property {string} title - Title of the benefit
 * @property {string} description - Description of the benefit
 * @property {string} icon - Icon identifier for the benefit
 * @property {number} order - Display order for sorting
 * @property {boolean} active - Whether the benefit is active
 */
export interface SanityCoachingBenefit {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

/**
 * SanityCoachingTestimonial - Type definition for coaching testimonial data from Sanity
 *
 * Represents athlete testimonials for coaching services.
 *
 * @property {string} _id - Unique identifier for the testimonial
 * @property {string} name - Name of the athlete
 * @property {string} sport - Sport the athlete participates in
 * @property {string} quote - Testimonial quote
 * @property {number} rating - Star rating (1-5)
 * @property {Object} [program] - Reference to the coaching program attended
 * @property {SanityImage} [image] - Optional photo of the athlete
 * @property {number} order - Display order for sorting
 * @property {boolean} active - Whether the testimonial is active
 */
export interface SanityCoachingTestimonial {
  _id: string;
  name: string;
  sport: string;
  quote: string;
  rating: number;
  program?: { _ref: string };
  image?: SanityImage;
  order: number;
  active: boolean;
}

/**
 * SanityTrainingPackage - Type definition for training package data from Sanity
 *
 * Represents training package information for the registration page.
 *
 * @property {string} _id - Unique identifier for the training package
 * @property {string} name - Name of the training package
 * @property {string} description - Brief description of the package
 * @property {number} price - Current price of the package
 * @property {number} [originalPrice] - Original price for strikethrough display
 * @property {string} duration - Duration of the package
 * @property {string[]} features - Array of package features
 * @property {boolean} popular - Whether this is marked as most popular
 * @property {number} order - Display order for sorting
 * @property {boolean} active - Whether the package is active
 */
export interface SanityTrainingPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  features: string[];
  popular: boolean;
  order: number;
  active: boolean;
}

/**
 * SanityUpcomingCamp - Type definition for upcoming camp data from Sanity
 *
 * Represents upcoming training camp information for the registration page.
 *
 * @property {string} _id - Unique identifier for the upcoming camp
 * @property {string} date - Camp date (e.g., "March 15-19, 2025")
 * @property {string} type - Type of camp (Basic, Premium, Elite, etc.)
 * @property {string} spots - Spots remaining (e.g., "8 spots remaining")
 * @property {string} location - Camp location
 * @property {boolean} earlyBird - Whether early bird pricing is available
 * @property {string} [earlyBirdEnds] - When early bird pricing ends
 * @property {number} order - Display order for sorting
 * @property {boolean} active - Whether the camp is active
 */
export interface SanityUpcomingCamp {
  _id: string;
  date: string;
  type: string;
  spots: string;
  location: string;
  earlyBird: boolean;
  earlyBirdEnds?: string;
  order: number;
  active: boolean;
}

/**
 * SanityPaymentOption - Type definition for payment option data from Sanity
 *
 * Represents payment plan options for the registration page.
 *
 * @property {string} _id - Unique identifier for the payment option
 * @property {string} name - Name of the payment plan
 * @property {string} description - Description of the payment plan
 * @property {string} discount - Discount or payment details
 * @property {number} order - Display order for sorting
 * @property {boolean} active - Whether the payment option is active
 */
export interface SanityPaymentOption {
  _id: string;
  name: string;
  description: string;
  discount: string;
  order: number;
  active: boolean;
}

/**
 * SanityWhatsIncluded - Type definition for what's included data from Sanity
 *
 * Represents categories of what's included in training packages.
 *
 * @property {string} _id - Unique identifier for the category
 * @property {string} category - Category name (e.g., "Training & Coaching")
 * @property {string[]} items - Array of included items
 * @property {string} icon - Icon identifier for the category
 * @property {number} order - Display order for sorting
 * @property {boolean} active - Whether the category is active
 */
export interface SanityWhatsIncluded {
  _id: string;
  category: string;
  items: string[];
  icon: string;
  order: number;
  active: boolean;
}
