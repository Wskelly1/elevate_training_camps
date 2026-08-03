import { defineField, defineType } from 'sanity';

/**
 * Newsletter page singleton (fixed id: newsletterPage) — masthead and
 * intro copy for the /newsletter archive. Issues themselves are
 * `newsletterIssue` documents.
 */
export default defineType({
  name: 'newsletterPage',
  title: 'Newsletter Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'emptyStateNote',
      title: 'Empty-State Note',
      type: 'text',
      rows: 2,
      description: 'Shown while no issues have been published yet.',
    }),
    defineField({
      name: 'mastheadImage',
      title: 'Masthead Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-bleed photo behind the page title.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Newsletter Page' }) },
});
