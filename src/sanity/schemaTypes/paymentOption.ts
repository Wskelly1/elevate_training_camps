import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'paymentOption',
  title: 'Payment Option',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Payment Plan Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'e.g., "Full Payment", "2-Payment Plan", "Monthly Plan"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'discount',
      title: 'Discount/Details',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g., "Save 5%", "50% + 50%", "3-6 months"',
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
      description: 'Only active payment options will be displayed on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'discount',
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
