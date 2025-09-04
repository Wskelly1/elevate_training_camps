import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'upcomingCamp',
  title: 'Upcoming Training Camp',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Camp Date',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "March 15-19, 2025"',
    }),
    defineField({
      name: 'type',
      title: 'Camp Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Basic Camp', value: 'Basic Camp' },
          { title: 'Premium Camp', value: 'Premium Camp' },
          { title: 'Elite Camp', value: 'Elite Camp' },
          { title: 'Custom Camp', value: 'Custom Camp' },
        ],
      },
    }),
    defineField({
      name: 'spots',
      title: 'Spots Remaining',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "8 spots remaining"',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Flagstaff, AZ',
    }),
    defineField({
      name: 'earlyBird',
      title: 'Early Bird Available',
      type: 'boolean',
      description: 'Whether early bird pricing is available for this camp',
      initialValue: false,
    }),
    defineField({
      name: 'earlyBirdEnds',
      title: 'Early Bird Ends',
      type: 'string',
      description: 'When early bird pricing ends (e.g., "February 15, 2025")',
      hidden: ({ document }) => !document?.earlyBird,
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
      description: 'Only active camps will be displayed on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'date',
      subtitle: 'type',
      spots: 'spots',
      earlyBird: 'earlyBird',
    },
    prepare(selection) {
      const { title, subtitle, spots, earlyBird } = selection;
      return {
        title: `${title} - ${subtitle}`,
        subtitle: `${spots}${earlyBird ? ' (Early Bird Available)' : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
});
