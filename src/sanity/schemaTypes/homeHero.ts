import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homeHero',
  title: 'Home Page Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      description: 'Type of media to show in the expanding component',
      type: 'string',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Image', value: 'image'},
        ],
      },
      initialValue: 'video',
    }),
    defineField({
      name: 'mediaSrc',
      title: 'Video File',
      description: 'Upload a video file (for video type)',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({document}) => document?.mediaType !== 'video',
    }),
    defineField({
      name: 'mediaImage',
      title: 'Media Image',
      description: 'Upload an image (for image type)',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({document}) => document?.mediaType !== 'image',
    }),
    defineField({
      name: 'posterSrc',
      title: 'Video Poster Image',
      description: 'Image to show before video plays and as the sliding image in the intro sequence',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({document}) => document?.mediaType !== 'video',
    }),
    defineField({
      name: 'bgImageSrc',
      title: 'Background Image',
      description: 'Image shown behind the media and as the initial full-screen image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'scrollToExpand',
      title: 'Scroll Prompt Text',
      description: 'Text that prompts users to scroll (e.g., "Scroll to Expand")',
      type: 'string',
      initialValue: 'Scroll to Expand',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'bgImageSrc',
    },
  },
}) 