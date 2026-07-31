import { defineField, defineType } from 'sanity';

/**
 * Singleton carrying every piece of copy on /registration except the prices
 * themselves, which live on teamBlock documents (the only type allowed to
 * hold prices). Created as part of the full CMS-ification
 * (docs/10-sanity-content-plan.md §5, Wave 1).
 *
 * Copy guardrails (business-plan/WEBSITE-SYNC.md) apply to every field:
 * no lodging/supervision promises, no race-outcome claims, no invented
 * track record, no guaranteed sessions, never a price range.
 */

const titleBody = [
  defineField({ name: 'title', title: 'Title', type: 'string' }),
  defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
];

export default defineType({
  name: 'registrationPage',
  title: 'Registration Page',
  type: 'document',
  groups: [
    { name: 'masthead', title: 'Masthead' },
    { name: 'pricing', title: 'Pricing section' },
    { name: 'included', title: "What's included" },
    { name: 'booking', title: 'How booking works' },
    { name: 'finePrint', title: 'Fine print' },
    { name: 'closing', title: 'Closing CTA' },
  ],
  fields: [
    defineField({
      name: 'mastheadImage',
      title: 'Masthead Image',
      type: 'image',
      description:
        'The full-bleed photograph behind the page title (Cinematic Lodge masthead). Landscape orientation works best; the title sits over the lower third.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'eyebrow',
      title: 'Masthead Eyebrow',
      type: 'string',
      group: 'masthead',
      description: 'Small uppercase line above the heading, e.g. "Registration & pricing · Summer 2027"',
    }),
    defineField({
      name: 'heading',
      title: 'Masthead Heading',
      type: 'string',
      group: 'masthead',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Masthead Intro',
      type: 'text',
      rows: 4,
      group: 'masthead',
      description: 'Guardrail: sold to teams via their trip leader (coach or parent organiser), never to individual athletes.',
    }),
    defineField({
      name: 'pricingEyebrow',
      title: 'Pricing Section Eyebrow',
      type: 'string',
      group: 'pricing',
    }),
    defineField({
      name: 'pricingHeading',
      title: 'Pricing Section Heading',
      type: 'string',
      group: 'pricing',
    }),
    defineField({
      name: 'blocks',
      title: 'Team Blocks',
      type: 'array',
      group: 'pricing',
      of: [{ type: 'reference', to: [{ type: 'teamBlock' }] }],
      description: 'The products shown. Prices live on the Team Block documents, nowhere else.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'pricingFootnote',
      title: 'Pricing Footnote',
      type: 'text',
      rows: 3,
      group: 'pricing',
      description: 'e.g. season scope, minimum squad, why the base fee exists. Never quote a price range here.',
    }),
    defineField({
      name: 'includedEyebrow',
      title: 'Included Section Eyebrow',
      type: 'string',
      group: 'included',
    }),
    defineField({
      name: 'includedHeading',
      title: 'Included Section Heading',
      type: 'string',
      group: 'included',
    }),
    defineField({
      name: 'includedIntro',
      title: 'Included Section Intro',
      type: 'text',
      rows: 3,
      group: 'included',
      description: 'Guardrail: programming only — facilitate, don’t operate.',
    }),
    defineField({
      name: 'includedItems',
      title: 'Included Items',
      type: 'array',
      group: 'included',
      of: [{ type: 'object', name: 'includedItem', fields: titleBody, preview: { select: { title: 'title' } } }],
    }),
    defineField({
      name: 'notIncludedTitle',
      title: '"Not Included" Title',
      type: 'string',
      group: 'included',
    }),
    defineField({
      name: 'notIncludedItems',
      title: '"Not Included" Items',
      type: 'array',
      group: 'included',
      of: [{ type: 'string' }],
      description: 'Guardrail: lodging, meals, travel and overnight supervision stay here — the team’s adults own them.',
    }),
    defineField({
      name: 'bookingEyebrow',
      title: 'Booking Section Eyebrow',
      type: 'string',
      group: 'booking',
    }),
    defineField({
      name: 'bookingHeading',
      title: 'Booking Section Heading',
      type: 'string',
      group: 'booking',
    }),
    defineField({
      name: 'bookingSteps',
      title: 'Booking Steps',
      type: 'array',
      group: 'booking',
      of: [{ type: 'object', name: 'bookingStep', fields: titleBody, preview: { select: { title: 'title' } } }],
      description: 'The enquiry → deposit → roster-and-balance flow. No fake checkout, dates, scarcity or discounts.',
    }),
    defineField({
      name: 'finePrintEyebrow',
      title: 'Fine Print Eyebrow',
      type: 'string',
      group: 'finePrint',
    }),
    defineField({
      name: 'finePrintCards',
      title: 'Fine Print Cards',
      type: 'array',
      group: 'finePrint',
      of: [{ type: 'object', name: 'finePrintCard', fields: titleBody, preview: { select: { title: 'title' } } }],
      description: 'Smoke/cancellation posture, adult-coverage requirement, iron screening, honest altitude framing. The risk plan requires the cancellation posture stated at the point of sale — do not delete that card.',
    }),
    defineField({
      name: 'closingHeading',
      title: 'Closing Heading',
      type: 'string',
      group: 'closing',
    }),
    defineField({
      name: 'closingBody',
      title: 'Closing Body',
      type: 'text',
      rows: 3,
      group: 'closing',
    }),
    defineField({
      name: 'closingCtaLabel',
      title: 'Closing CTA Label',
      type: 'string',
      group: 'closing',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Registration Page' };
    },
  },
});
