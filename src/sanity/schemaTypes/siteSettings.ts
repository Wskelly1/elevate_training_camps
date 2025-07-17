import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'The name of your site',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'A brief description of your site (used for SEO)'
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      description: 'Upload your site logo here (recommended size: 240x80px)',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette']
      }
    }),
    defineField({
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      description: 'Optional: Upload a different logo for the footer (if not provided, the main logo will be used)',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'aboutUsImage',
      title: 'About Us Dropdown Image',
      type: 'image',
      description: 'Image for the "Learn About Us" dropdown container (recommended size: 200x200px)',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Upload your site favicon (recommended size: 32x32px)',
      options: {
        accept: 'image/png,image/x-icon'
      }
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Main contact email address'
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      description: 'Main contact phone number'
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Physical address (if applicable)'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' }
                ]
              },
              validation: rule => rule.required()
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: rule => rule.required()
            })
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo'
    }
  }
}) 