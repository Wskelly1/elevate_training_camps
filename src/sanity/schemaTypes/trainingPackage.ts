import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'trainingPackage',
  title: 'Training Package',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Package Name',
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
      title: 'Current Price',
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
          { title: '4 weeks', value: '4 weeks' },
          { title: '1 month', value: '1 month' },
          { title: '3 months', value: '3 months' },
          { title: '6 months', value: '6 months' },
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
      description: 'Mark this package as the most popular option',
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
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only active packages will be displayed on the website',
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
