import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Title for the home page (for admin purposes)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Large hero image that takes up the entire first view (16:9 aspect ratio recommended)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Large text displayed on the hero image',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
      description: 'Smaller text displayed below the hero heading',
    }),
    // Testimonials section
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      description: 'Add testimonials with image, text, and name',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'testimonial',
          title: 'Testimonial',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Testimonial Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'text',
              media: 'image',
            },
          },
        }
      ],
    }),
    defineField({
      name: 'contentSections',
      title: 'Content Sections',
      description: 'Add alternating image and text sections that appear as the user scrolls',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Text Content',
              type: 'array',
              of: [{ type: 'block' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              description: 'Image for this section (4:3 aspect ratio recommended)',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'Optional call-to-action button text',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
              description: 'URL for the call-to-action button',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              media: 'image',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
}) 