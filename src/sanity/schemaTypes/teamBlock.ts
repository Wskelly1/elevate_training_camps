import { defineField, defineType } from 'sanity';

/**
 * The team-block product: a base fee plus a per-athlete rate. This is the
 * ONLY type allowed to carry prices (docs/10-sanity-content-plan.md §5).
 * Values must match ../business-plan/PRICING.md exactly — run
 * `npm run check:pricing` after any edit here.
 */
export default defineType({
  name: 'teamBlock',
  title: 'Team Block (pricing)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Block Name',
      type: 'string',
      description: 'e.g. "Three-week block". Shown as the card heading on /registration.',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One line under the name, e.g. "The flagship. Long enough for real altitude adaptation."',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'baseFee',
      title: 'Team Base Fee (USD)',
      type: 'number',
      description:
        'MUST match business-plan/PRICING.md. A price change is a business decision: change PRICING.md first, log it in the CHANGELOG, then update this. Run npm run check:pricing afterwards.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'perAthleteRate',
      title: 'Per-Athlete Rate (USD)',
      type: 'number',
      description: 'MUST match business-plan/PRICING.md — same rule as the base fee.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'exampleLine',
      title: 'Worked Example Line',
      type: 'string',
      description: 'e.g. "A 15-athlete squad comes to $10,500 — about $700 per athlete." Keep the arithmetic consistent with the fees above.',
    }),
    defineField({
      name: 'detail',
      title: 'Description',
      type: 'text',
      rows: 4,
      description:
        'What this block is and why. Guardrails: programming only (never imply lodging/meals are included), no race-outcome promises.',
    }),
    defineField({
      name: 'seasonLabel',
      title: 'Season Label',
      type: 'string',
      description: 'e.g. "Summer 2027". Displayed with the pricing so quotes are clearly season-scoped.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: { title: 'name', baseFee: 'baseFee', perAthleteRate: 'perAthleteRate' },
    prepare({ title, baseFee, perAthleteRate }) {
      return {
        title,
        subtitle: `$${baseFee} base + $${perAthleteRate}/athlete`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
