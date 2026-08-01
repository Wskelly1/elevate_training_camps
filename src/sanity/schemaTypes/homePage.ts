import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Home Page — the team-altitude-block positioning.
 *
 * This schema mirrors the sections the homepage actually renders, in the order
 * it renders them, so an editor changing "the stat band" can find a field group
 * called Stat Band. The previous schema modelled a scroll-to-expand hero
 * component that no longer exists, which had two consequences worth
 * remembering:
 *
 *  - `expandMuxVideo` held the real hero video but was `hidden` unless
 *    `useScrollExpandMedia` was ticked, so the video field was invisible in the
 *    Studio while the video played on the live site.
 *  - `contentSections` and `testimonials` fed components that have been deleted.
 *
 * MIGRATION NOTE. The legacy fields are kept, marked deprecated and collapsed
 * into a "Legacy" group at the bottom, rather than deleted. The production
 * document still stores the Mux asset in `expandMuxVideo`, and removing the
 * field would orphan the video. `heroVideo` is the field to fill going forward;
 * the page prefers it and falls back to `expandMuxVideo`, so both work during
 * the changeover. Once `heroVideo` is populated and published, the legacy group
 * can be dropped in a follow-up.
 *
 * Copy written against these fields must satisfy the claims discipline in
 * docs/01-roadmap.md §5.5 — no lodging promises, no sea-level race effect, no
 * track record that does not exist yet.
 */

const linkFields = [
  defineField({ name: 'label', title: 'Button label', type: 'string' }),
  defineField({
    name: 'href',
    title: 'Links to',
    type: 'string',
    description: 'A path on this site, e.g. /contact or /registration',
  }),
]

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'sections', title: 'Sections' },
    { name: 'standards', title: 'How we run it' },
    { name: 'cta', title: 'Closing CTA' },
    { name: 'legacy', title: 'Legacy (deprecated)' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal label',
      type: 'string',
      description: 'Only shown in the Studio, never on the site.',
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),

    /* ——— Hero ————————————————————————————————————————————— */
    defineField({
      name: 'heroEyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small spaced caps above the headline. e.g. "Flagstaff, Arizona · 7,000 ft"',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      description: 'Keep it to two short lines.',
      group: 'hero',
    }),
    defineField({
      name: 'heroStandfirst',
      title: 'Standfirst',
      type: 'text',
      rows: 3,
      description:
        'One or two sentences under the headline. Say who it is for and what it is — never promise lodging or race outcomes.',
      group: 'hero',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero video',
      type: 'mux.video',
      description:
        'Plays muted and looping behind the headline. Wants 15–30s of landscape footage; short or portrait clips crop badly. If empty, the hero image is shown instead.',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image (poster / fallback)',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown before the video loads, and instead of it if no video is set.',
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Primary button',
      type: 'object',
      fields: linkFields,
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary button',
      type: 'object',
      fields: linkFields,
      group: 'hero',
    }),

    /* ——— Editorial sections ——————————————————————————————— */
    defineField({
      name: 'editorialSections',
      title: 'Editorial sections',
      type: 'array',
      description:
        'The big image-and-text blocks. The image runs off the edge of the screen — alternate which side so consecutive sections do not look the same.',
      group: 'sections',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'editorialSection',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow',
              type: 'string',
              description: 'e.g. "01 — What we are"',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] }],
              description:
                'Keep paragraphs short. Emphasis comes from scale and colour, not bold weight.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'metaLine',
              title: 'Meta line',
              type: 'string',
              description:
                'Optional small caps line under a rule, closing the column. e.g. "Flagstaff, Arizona · Summer blocks"',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imageSide',
              title: 'Image bleeds off the',
              type: 'string',
              options: {
                list: [
                  { title: 'Right edge', value: 'right' },
                  { title: 'Left edge', value: 'left' },
                ],
                layout: 'radio',
              },
              initialValue: 'right',
            }),
            defineField({ name: 'linkLabel', title: 'Link text', type: 'string' }),
            defineField({ name: 'linkHref', title: 'Link target', type: 'string' }),
          ],
          preview: { select: { title: 'heading', subtitle: 'eyebrow', media: 'image' } },
        }),
      ],
    }),

    /* ——— Full-bleed break ————————————————————————————————— */
    defineField({
      name: 'fullBleed',
      title: 'Full-bleed break',
      type: 'object',
      description: 'The edge-to-edge photograph with a single line of type over it.',
      group: 'sections',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          description: 'e.g. "High school camper · Collegiate counsellor · Professional"',
        }),
        defineField({ name: 'quote', title: 'Line', type: 'text', rows: 3 }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          description:
            'Landscape, and quiet — the type sits over the lower third. Avoid close-up faces; type over faces fights the type.',
        }),
      ],
    }),

    /* ——— Stat band ————————————————————————————————————— */
    defineField({
      name: 'stats',
      title: 'Stat band',
      type: 'array',
      description: 'Three works best. Every figure here must be defensible.',
      group: 'sections',
      validation: (Rule) => Rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'value',
              title: 'Figure',
              type: 'string',
              description: 'e.g. "7,000" or "3–4"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'note', title: 'Small note', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),

    /* ——— Standards ————————————————————————————————————— */
    defineField({
      name: 'standardsEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'standards',
    }),
    defineField({
      name: 'standardsHeading',
      title: 'Heading',
      type: 'string',
      group: 'standards',
    }),
    defineField({
      name: 'standards',
      title: 'Standards',
      type: 'array',
      group: 'standards',
      description:
        'How sessions are run — safeguarding, altitude protocols, air quality. Write these as the standard every session runs to. Do NOT write them as things that have already happened: no season has been delivered yet.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'standard',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),

    /* ——— Closing CTA ————————————————————————————————— */
    defineField({
      name: 'sponsorsHeading',
      title: 'Sponsors Band Heading',
      type: 'string',
      description:
        'Small heading over the partner-logo marquee (e.g. "Our partners"). The band only renders when at least one Sponsor document is published.',
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
        ...linkFields,
      ],
    }),

    /* ——— Legacy ————————————————————————————————————————
       Kept only so existing content is not orphaned. Do not fill these in. */
    defineField({
      name: 'expandMuxVideo',
      title: 'Hero video (legacy field)',
      type: 'mux.video',
      description:
        'DEPRECATED. The original home of the hero video. Still read as a fallback so the site keeps working — copy the asset into "Hero video" above, then this can be removed.',
      group: 'legacy',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Headline (legacy)',
      type: 'string',
      description:
        'DEPRECATED and no longer rendered. Held the pre-2026-07-29 individual-athlete positioning. Use "Headline" above.',
      group: 'legacy',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Standfirst (legacy)',
      type: 'text',
      rows: 2,
      description:
        'DEPRECATED and no longer rendered. Use "Standfirst" above.',
      group: 'legacy',
    }),
    defineField({
      name: 'contentSections',
      title: 'Content sections (legacy)',
      type: 'array',
      description: 'DEPRECATED. Superseded by Editorial sections. Not rendered.',
      group: 'legacy',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contentSection',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'subheading', type: 'string' }),
            defineField({ name: 'text', type: 'array', of: [{ type: 'block' }] }),
            defineField({ name: 'image', type: 'image' }),
            defineField({ name: 'buttonText', type: 'string' }),
            defineField({ name: 'buttonLink', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials (legacy)',
      type: 'array',
      description:
        'DEPRECATED. The homepage testimonial carousel was removed pending a rebuild. Not rendered.',
      group: 'legacy',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          fields: [
            defineField({ name: 'image', type: 'image' }),
            defineField({ name: 'text', type: 'string' }),
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'designation', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title', media: 'heroImage' } },
})
