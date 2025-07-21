export interface SanityImage {
  asset: {
    _id: string;
    url: string;
  };
}

export interface SanityTestimonial {
  _key: string;
  name: string;
  text: string;
  image: SanityImage;
}

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

export interface SanityHomePage {
  _id: string;
  title: string;
  heroImage: SanityImage;
  heroHeading?: string;
  heroSubheading?: string;
  testimonials?: SanityTestimonial[];
  contentSections?: SanityContentSection[];
}

export interface SanityTeamMember {
  _id: string;
  name: string;
  title: string;
  bio: any; // Typically rich text
  image: SanityImage;
} 