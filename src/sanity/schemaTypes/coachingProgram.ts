import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'coachingProgram',
  title: 'Coaching Program',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Program Name',
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
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (for strikethrough)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: '3 days', value: '3 days' },
          { title: '5 days', value: '5 days' },
          { title: '7 days', value: '7 days' },
          { title: '1 month', value: '1 month' },
          { title: '3 months', value: '3 months' },
          { title: '6 months', value: '6 months' },
          { title: 'Ongoing', value: 'Ongoing' },
        ],
      },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'popular',
      title: 'Most Popular',
      type: 'boolean',
      description: 'Mark this program as the most popular option',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Target (Individual)', value: 'target' },
          { title: 'Users (Group)', value: 'users' },
          { title: 'MapPin (Location)', value: 'mappin' },
          { title: 'Zap (Virtual)', value: 'zap' },
          { title: 'Award (Elite)', value: 'award' },
          { title: 'Clock (Time-based)', value: 'clock' },
        ],
      },
      initialValue: 'target',
    }),
    defineField({
      name: 'color',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'from-blue-500 to-blue-600' },
          { title: 'Green (Primary)', value: 'from-[#427b4d] to-[#387143]' },
          { title: 'Purple', value: 'from-purple-500 to-purple-600' },
          { title: 'Orange', value: 'from-orange-500 to-orange-600' },
          { title: 'Teal', value: 'from-teal-500 to-teal-600' },
        ],
      },
      initialValue: 'from-[#427b4d] to-[#387143]',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only active programs will be displayed on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      price: 'price',
      popular: 'popular',
    },
    prepare(selection) {
      const { title, subtitle, price, popular } = selection;
      return {
        title: `${title}${popular ? ' ⭐' : ''}`,
        subtitle: `$${price} - ${subtitle}`,
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
      title: 'Price Low to High',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Price High to Low',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],
});
