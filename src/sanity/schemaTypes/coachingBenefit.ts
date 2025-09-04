import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'coachingBenefit',
  title: 'Coaching Benefit',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Award (Expert Guidance)', value: 'award' },
          { title: 'TrendingUp (Proven Results)', value: 'trendingup' },
          { title: 'Heart (Personalized)', value: 'heart' },
          { title: 'MapPin (High-Altitude)', value: 'mappin' },
          { title: 'Target (Goal-oriented)', value: 'target' },
          { title: 'Users (Team Support)', value: 'users' },
          { title: 'Clock (Time-efficient)', value: 'clock' },
          { title: 'Zap (Performance)', value: 'zap' },
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
      description: 'Only active benefits will be displayed on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
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
