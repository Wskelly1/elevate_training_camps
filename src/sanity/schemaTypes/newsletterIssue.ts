import { defineField, defineType } from 'sanity';

/**
 * A monthly newsletter issue, authored in the Studio. Publishing an issue
 * makes it appear on the /newsletter archive; SENDING it to subscribers is
 * a separate deliberate step (the secret-gated /api/newsletter/send
 * endpoint — see docs/04-email-setup.md), so a draft can be polished on
 * the site before it ever hits an inbox. Subscriber emails live in
 * HubSpot, never in this dataset — it is public.
 *
 * Copy guardrails apply here like everywhere: no invented history, no
 * lodging/supervision promises, prices only by reference to /registration.
 */
export default defineType({
  name: 'newsletterIssue',
  title: 'Newsletter Issue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Subject Line',
      type: 'string',
      description: 'Doubles as the email subject when the issue is sent.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issueDate',
      title: 'Issue Month',
      type: 'date',
      options: { dateFormat: 'MMMM YYYY' },
      description: 'The month this issue covers.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro / Teaser',
      type: 'text',
      rows: 3,
      description: 'Shown on the archive card and as the email preheader.',
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent At',
      type: 'datetime',
      readOnly: true,
      description: 'Stamped automatically when the issue is emailed to subscribers.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'issueDate', media: 'heroImage' } },
  orderings: [{ title: 'Issue date (newest first)', name: 'dateDesc', by: [{ field: 'issueDate', direction: 'desc' }] }],
});
