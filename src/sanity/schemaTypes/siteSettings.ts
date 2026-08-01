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
    // Nav logo (owner request 2026-07-31): uploadable again, with the
    // committed BrandLogo component as the fallback when empty — so an
    // unreachable CMS can never reduce the header to plain text, which is
    // why the field was once removed. footerLogo was deleted as unused.
    defineField({
      name: 'logo',
      title: 'Nav Logo (light backgrounds)',
      type: 'image',
      description:
        'Shown in the header on light/cream backgrounds. Leave empty to use the built-in twin-peak brand logo. Landscape lockups work best; rendered at 40px tall.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoOnDark',
      title: 'Nav Logo (over imagery)',
      type: 'image',
      description:
        'Shown while the header floats over a masthead photo — needs to read on dark. Falls back to the light-background logo, then to the built-in brand logo.',
      options: { hotspot: true },
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
    }),
    // The FAQ page settings that used to be stranded here moved to the
    // faqPage singleton (CMS-ification Wave 3, 2026-07-30). The old data
    // remains harmlessly on existing documents; the field is gone so
    // editors can't author into the dead location.
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo'
    }
  }
}) 