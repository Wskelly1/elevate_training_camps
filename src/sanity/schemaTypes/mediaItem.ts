import { defineField, defineType } from 'sanity';

/**
 * A gallery item for /media (Wave 4). DO NOT publish items until the
 * photo-consent gate clears (01-roadmap.md Gate-4) — every recognisable
 * athlete needs consent on file first. Captions must not invent history
 * (no "past camps" framing before the first 2027 season).
 */
export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', description: 'Describe the image for screen readers.' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Which chapter of the gallery this appears in.',
      options: {
        list: [
          { title: 'Trails', value: 'trails' },
          { title: 'Town', value: 'town' },
          { title: 'Training', value: 'training' },
        ],
      },
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', validation: (Rule) => Rule.required().min(0) }),
  ],
  preview: { select: { title: 'caption', media: 'image' } },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
});
