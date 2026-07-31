import { defineField, defineType } from 'sanity';

/**
 * Singleton carrying every piece of copy and media on /recruiting.
 * Wave 2 of the CMS-ification (docs/10-sanity-content-plan.md §5).
 *
 * DELIBERATELY NO PRICE FIELDS. Gate-7 (01-roadmap.md) forbids publishing
 * recruiting prices until the attach rate is measured; this schema enforces
 * that structurally — there is no field that could hold a rate card. Do not
 * add one without clearing Gate-7.
 *
 * Copy guardrails (business-plan/WEBSITE-SYNC.md + doc 04 §03): never
 * promise placement, roster spots or scholarships; no fees contingent on
 * outcomes; no invented track record or testimonials; advice is sold to
 * families, never athlete information to colleges; NCAA figures must carry
 * their as-of date and be re-verified each cycle.
 */

const titleBody = [
  defineField({ name: 'title', title: 'Title', type: 'string' }),
  defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
];

export default defineType({
  name: 'recruitingPage',
  title: 'Recruiting Page',
  type: 'document',
  groups: [
    { name: 'masthead', title: 'Masthead' },
    { name: 'stats', title: 'Stat band' },
    { name: 'why', title: '01 · Why now' },
    { name: 'watch', title: '02 · What we watch' },
    { name: 'evaluation', title: '03 · The evaluation' },
    { name: 'quote', title: 'Pull quote' },
    { name: 'never', title: '04 · What we never do' },
    { name: 'audiences', title: '05 · Families & coaches' },
    { name: 'closing', title: 'Closing' },
  ],
  fields: [
    defineField({ name: 'eyebrow', title: 'Masthead Eyebrow', type: 'string', group: 'masthead' }),
    defineField({ name: 'heading', title: 'Masthead Heading', type: 'string', group: 'masthead', validation: (Rule) => Rule.required() }),
    defineField({ name: 'intro', title: 'Masthead Intro', type: 'text', rows: 4, group: 'masthead' }),
    defineField({ name: 'ctaPrimary', title: 'Primary CTA Label', type: 'string', group: 'masthead' }),
    defineField({ name: 'ctaSecondary', title: 'Secondary CTA Label', type: 'string', group: 'masthead' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'stats',
      of: [{
        type: 'object',
        name: 'stat',
        fields: [
          defineField({ name: 'number', title: 'Number', type: 'string', description: 'e.g. "~7%" or "Jun 15". A statistic, never a price.' }),
          defineField({ name: 'label', title: 'Label', type: 'string' }),
          defineField({ name: 'sub', title: 'Subtext', type: 'string', description: 'Keep the as-of framing for NCAA figures — they change annually.' }),
        ],
        preview: { select: { title: 'number', subtitle: 'label' } },
      }],
    }),
    defineField({ name: 'whyEyebrow', title: 'Why Section Eyebrow', type: 'string', group: 'why' }),
    defineField({ name: 'whyHeading', title: 'Why Section Heading', type: 'string', group: 'why' }),
    defineField({
      name: 'whyParagraphs',
      title: 'Why Section Paragraphs',
      type: 'array',
      group: 'why',
      of: [{ type: 'text', rows: 4 }],
    }),
    defineField({ name: 'whyImage', title: 'Why Section Image', type: 'image', group: 'why' }),
    defineField({ name: 'whyImageAlt', title: 'Why Section Image Alt Text', type: 'string', group: 'why' }),
    defineField({ name: 'watchEyebrow', title: 'Watch Section Eyebrow', type: 'string', group: 'watch' }),
    defineField({ name: 'watchHeading', title: 'Watch Section Heading', type: 'string', group: 'watch' }),
    defineField({ name: 'watchIntro', title: 'Watch Section Intro', type: 'text', rows: 3, group: 'watch' }),
    defineField({
      name: 'watchItems',
      title: 'What We Watch Items',
      type: 'array',
      group: 'watch',
      of: [{ type: 'object', name: 'watchItem', fields: titleBody, preview: { select: { title: 'title' } } }],
    }),
    defineField({ name: 'evalEyebrow', title: 'Evaluation Eyebrow', type: 'string', group: 'evaluation' }),
    defineField({ name: 'evalHeading', title: 'Evaluation Heading', type: 'string', group: 'evaluation' }),
    defineField({ name: 'evalBody', title: 'Evaluation Body', type: 'text', rows: 4, group: 'evaluation' }),
    defineField({
      name: 'evalAccent',
      title: 'Evaluation Accent Paragraph',
      type: 'text',
      rows: 3,
      group: 'evaluation',
      description: 'Guardrail: the evaluation is included with camp, never an upsell — keep that promise intact.',
    }),
    defineField({ name: 'evalLinkLabel', title: 'Evaluation Link Label', type: 'string', group: 'evaluation' }),
    defineField({ name: 'evalImage', title: 'Evaluation Image', type: 'image', group: 'evaluation' }),
    defineField({ name: 'evalImageAlt', title: 'Evaluation Image Alt Text', type: 'string', group: 'evaluation' }),
    defineField({ name: 'quoteLabel', title: 'Pull Quote Label', type: 'string', group: 'quote' }),
    defineField({ name: 'quoteText', title: 'Pull Quote', type: 'text', rows: 3, group: 'quote' }),
    defineField({ name: 'neverEyebrow', title: 'Never Section Eyebrow', type: 'string', group: 'never' }),
    defineField({ name: 'neverHeading', title: 'Never Section Heading', type: 'string', group: 'never' }),
    defineField({
      name: 'neverItems',
      title: 'What We Never Do Items',
      type: 'array',
      group: 'never',
      of: [{ type: 'object', name: 'neverItem', fields: titleBody, preview: { select: { title: 'title' } } }],
      description: 'These are the compliance guardrails published as a differentiator (doc 04 §03). Edit wording, never the substance.',
    }),
    defineField({ name: 'familyEyebrow', title: 'Families Eyebrow', type: 'string', group: 'audiences' }),
    defineField({ name: 'familyHeading', title: 'Families Heading', type: 'string', group: 'audiences' }),
    defineField({
      name: 'familyParagraphs',
      title: 'Families Paragraphs',
      type: 'array',
      group: 'audiences',
      of: [{ type: 'text', rows: 4 }],
      description: 'Guardrail: no rate card here — Gate-7. Describe the service, not prices.',
    }),
    defineField({ name: 'coachEyebrow', title: 'Coaches Eyebrow', type: 'string', group: 'audiences' }),
    defineField({ name: 'coachHeading', title: 'Coaches Heading', type: 'string', group: 'audiences' }),
    defineField({ name: 'coachBody', title: 'Coaches Body', type: 'text', rows: 4, group: 'audiences' }),
    defineField({ name: 'coachLinkLabel', title: 'Coaches Link Label', type: 'string', group: 'audiences' }),
    defineField({ name: 'closingHeading', title: 'Closing Heading', type: 'string', group: 'closing' }),
    defineField({ name: 'closingBody', title: 'Closing Body', type: 'text', rows: 3, group: 'closing' }),
    defineField({ name: 'closingCtaLabel', title: 'Closing CTA Label', type: 'string', group: 'closing' }),
    defineField({
      name: 'footnote',
      title: 'Footnote',
      type: 'text',
      rows: 3,
      group: 'closing',
      description: 'Carries the NCAA as-of date. Update the date whenever figures are re-verified.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Recruiting Page' };
    },
  },
});
