import { defineField, defineType } from 'sanity';

/**
 * A sponsor / partner logo for the homepage marquee band (owner request
 * 2026-07-31).
 *
 * Guardrail (business-plan/WEBSITE-SYNC.md — no claims we can't back):
 * only publish partnerships that actually exist in writing. An announced
 * name on this band is a public claim of partnership. The band renders
 * nothing until at least one sponsor is published.
 */
export default defineType({
  name: 'sponsor',
  title: 'Sponsor / Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Transparent PNG or SVG reads best; rendered ~44px tall on the cream band.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'url', title: 'Website', type: 'url', description: 'Optional — the logo links here when set.' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', validation: (Rule) => Rule.required().min(0) }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
});
