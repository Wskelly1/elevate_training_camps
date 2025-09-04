import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'whatsIncluded',
  title: 'What\'s Included Category',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'e.g., "Training & Coaching", "Accommodation & Meals"',
    }),
    defineField({
      name: 'items',
      title: 'Included Items',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Award (Training & Coaching)', value: 'award' },
          { title: 'MapPin (Accommodation & Meals)', value: 'mappin' },
          { title: 'Zap (Equipment & Gear)', value: 'zap' },
          { title: 'Users (Support & Follow-up)', value: 'users' },
          { title: 'Target (Goal-oriented)', value: 'target' },
          { title: 'Clock (Time-based)', value: 'clock' },
          { title: 'Heart (Personalized)', value: 'heart' },
        ],
      },
      initialValue: 'award',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only active categories will be displayed on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'category',
      items: 'items',
    },
    prepare(selection) {
      const { title, items } = selection;
      return {
        title: title,
        subtitle: `${items?.length || 0} items included`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
