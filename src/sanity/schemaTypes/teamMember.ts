import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Job title or position'
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'A brief biography of the team member (optional)'
      // No validation rule means this field is optional
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true // Enables image cropping
      }
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display team members (lower numbers first)'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image'
    }
  }
}) 