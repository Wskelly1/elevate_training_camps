import { defineField, defineType } from 'sanity';

/**
 * Singleton for the /about hero (heading, intro, stat chips). The rest of
 * the page stays on aboutSection + teamMember. Wave 3 of the
 * CMS-ification (docs/10-sanity-content-plan.md §5).
 *
 * Guardrail: no invented track record — the business has no operating
 * history until the first 2027 season, so chips must stay factual
 * ("First season: Summer 2027", location, elevation).
 */
export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'mastheadImage',
      title: 'Masthead Image',
      type: 'image',
      description:
        'The full-bleed photograph behind the page title (Cinematic Lodge masthead). Landscape orientation works best; the title sits over the lower third.',
      options: { hotspot: true },
    }),
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroIntro', title: 'Hero Intro', type: 'text', rows: 4 }),
    defineField({
      name: 'statChips',
      title: 'Stat Chips',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short factual chips under the hero. No claims the business cannot back.',
    }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
});
