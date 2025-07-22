import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutHero',
  title: 'About Page Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: ['video', 'image'],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'mediaSrc',
      title: 'Media Source',
      type: 'file',
      description: 'Upload the main video file.',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.mediaType === 'image',
    }),
    defineField({
      name: 'mediaImage',
      title: 'Media Image',
      type: 'image',
      description: 'Image for the main media.',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'posterSrc',
      title: 'Poster Source',
      type: 'image',
      description: 'Poster image for the video.',
      hidden: ({ parent }) => parent?.mediaType === 'image',
    }),
    defineField({
      name: 'bgImageSrc',
      title: 'Background Image',
      type: 'image',
      description: 'Background image for the hero section.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
    }),
    defineField({
      name: 'scrollToExpand',
      title: 'Scroll to Expand Text',
      type: 'string',
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'bgImageSrc',
    },
  },
}); 