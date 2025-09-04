import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'coachingTestimonial',
  title: 'Coaching Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Athlete Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'sport',
      title: 'Sport',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'program',
      title: 'Program Attended',
      type: 'reference',
      to: [{ type: 'coachingProgram' }],
      description: 'Which coaching program did this athlete attend?',
    }),
    defineField({
      name: 'image',
      title: 'Athlete Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional photo of the athlete',
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
      description: 'Only active testimonials will be displayed on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sport',
      quote: 'quote',
      rating: 'rating',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, quote, rating } = selection;
      const stars = '⭐'.repeat(rating || 5);
      return {
        title: `${title} (${subtitle})`,
        subtitle: `${stars} - ${quote?.substring(0, 50)}...`,
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
      title: 'Rating High to Low',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
  ],
});
