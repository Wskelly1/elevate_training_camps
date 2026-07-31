import { defineField, defineType } from 'sanity';

/**
 * Singleton for the /faq page header (title, introduction, image).
 * Fixes the known defect where these fields were stranded inside
 * siteSettings (docs/03-sanity-studio-guide.md); the content was migrated
 * to this type on 2026-07-30 (Wave 3). FAQ items stay on the `faq` type.
 */
export default defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string' }),
    defineField({ name: 'introduction', title: 'Introduction', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Header Image', type: 'image' }),
  ],
  preview: { prepare: () => ({ title: 'FAQ Page' }) },
});
