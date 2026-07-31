import { defineField, defineType } from 'sanity';

/**
 * Singleton for the /contact page copy (heading + intro). Form field
 * labels stay in code — they are UI, not content
 * (docs/10-sanity-content-plan.md §5). Wave 3 of the CMS-ification.
 */
export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
});
