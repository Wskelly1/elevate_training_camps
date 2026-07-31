import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description:
        'Which audience section this question appears under on /faq. Uncategorized questions land in "General".',
      options: {
        list: [
          { title: 'For coaches & trip leaders', value: 'coaches' },
          { title: 'For families & athletes', value: 'families' },
          { title: 'Logistics & housing', value: 'logistics' },
          { title: 'Safety & weather', value: 'safety' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Set the order in which FAQs appear. Lower numbers appear first.',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}); 