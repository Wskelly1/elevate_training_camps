import { defineField, defineType } from 'sanity';

/**
 * Singleton for the /media page copy (Wave 4 of the CMS-ification).
 * The gallery itself is `mediaItem` documents — none exist until the
 * photo-consent and hosting gates clear (01-roadmap.md Gates 3–4); until
 * then the page shows only this intro copy.
 *
 * Guardrail: no invented history — the first season is 2027, so captions
 * and copy describe the place and the training, not "past camps".
 */
export default defineType({
  name: 'mediaPage',
  title: 'Media Page',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 4 }),
    defineField({ name: 'note', title: 'Secondary Note', type: 'text', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Media Page' }) },
});
