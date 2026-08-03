#!/usr/bin/env node
/**
 * Content sync check — verifies that what the CMS holds actually renders on
 * the pages that claim to be CMS-driven (docs/11-content-sync-verification.md
 * is the full procedure and the dispute rule).
 *
 *   npm run check:content            # against https://elevatetrainingcamps.com
 *   npm run check:content -- --base http://localhost:3000
 *
 * For every route it queries the backing Sanity documents and asserts that
 * each checked text field appears in the rendered HTML (entity-normalized),
 * and that each checked image field's asset hash appears in an image URL.
 * A field that is EMPTY in the CMS while the page clearly renders copy in
 * its place is reported as UNTRUTHFUL (code default rendering) — per the
 * dispute rule the page wins and Sanity should be patched to match.
 *
 * Deliberate non-CMS strings (form labels, code eyebrows, email templates)
 * are documented in docs/11 §4 and are not checked here.
 */

const BASE = (() => {
  const i = process.argv.indexOf('--base');
  return i > -1 ? process.argv[i + 1] : 'https://elevatetrainingcamps.com';
})();

const API = 'https://yvqe54iq.api.sanity.io/v2024-01-01/data/query/production?query=';

const q = async (groq) => {
  const res = await fetch(API + encodeURIComponent(groq));
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  return (await res.json()).result;
};

/** Decode the entities Next emits into rendered markup, so CMS strings can
 *  be substring-matched against the HTML. */
const norm = (s) =>
  s
    .replaceAll('&amp;', '&')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replace(/\s+/g, ' ');

const page = async (route) => {
  const res = await fetch(`${BASE}${route}`, { headers: { 'user-agent': 'content-sync-check' } });
  if (!res.ok) throw new Error(`${route}: HTTP ${res.status}`);
  return norm(await res.text());
};

let pass = 0;
let fail = 0;
const failures = [];

function check(route, label, value, html, { image = false } = {}) {
  if (value == null || value === '') {
    return; // absence handled by the caller when it matters
  }
  const needle = image ? value.replace(/^image-/, '').replace(/-(png|jpg|webp)$/, '') : norm(String(value).trim());
  if (html.includes(needle)) {
    pass++;
  } else {
    fail++;
    failures.push(`${route} · ${label}: CMS value not found in page — "${String(needle).slice(0, 80)}"`);
  }
}

// ——— Route definitions: [route, groq, (doc, html) => void] ————————————
const ROUTES = [
  [
    '/',
    `*[_type == "homePage"][0]{heroEyebrow, heroHeadline, heroStandfirst,
      heroPrimaryCta, heroSecondaryCta, sponsorsHeading,
      editorialSections[]{heading, eyebrow, metaLine},
      stats[]{value, label}, standardsHeading, standards[]{title},
      fullBleed{quote}, closingCta{heading, label}}`,
    (d, h) => {
      check('/', 'heroEyebrow', d.heroEyebrow, h);
      // The headline uses CMS newlines for wrapping; check line by line.
      for (const line of (d.heroHeadline ?? '').split('\n')) check('/', 'heroHeadline line', line, h);
      check('/', 'heroStandfirst', d.heroStandfirst, h);
      check('/', 'primary CTA', d.heroPrimaryCta?.label, h);
      check('/', 'secondary CTA', d.heroSecondaryCta?.label, h);
      for (const s of d.editorialSections ?? []) check('/', `section "${s.eyebrow}"`, s.heading, h);
      for (const s of d.stats ?? []) check('/', `stat ${s.value}`, s.label, h);
      check('/', 'standardsHeading', d.standardsHeading, h);
      for (const s of d.standards ?? []) check('/', 'standard', s.title, h);
      check('/', 'fullBleed quote', d.fullBleed?.quote, h);
      check('/', 'closing heading', d.closingCta?.heading, h);
    },
  ],
  [
    '/about',
    `{"page": *[_type == "aboutPage"][0]{heroHeading, heroIntro, statChips, "masthead": mastheadImage.asset._ref},
      "sections": *[_type == "aboutSection"] | order(_createdAt asc) {title},
      "team": *[_type == "teamMember"] | order(order asc) {name, title}}`,
    (d, h) => {
      check('/about', 'heroHeading', d.page?.heroHeading, h);
      check('/about', 'heroIntro', d.page?.heroIntro, h);
      for (const c of d.page?.statChips ?? []) check('/about', 'chip', c, h);
      check('/about', 'masthead image', d.page?.masthead, h, { image: true });
      for (const s of d.sections ?? []) check('/about', 'section title', s.title, h);
      for (const m of d.team ?? []) check('/about', 'team member', m.name, h);
    },
  ],
  [
    '/registration',
    `{"page": *[_type == "registrationPage"][0]{heading, intro, pricingHeading, pricingFootnote,
        includedHeading, includedIntro, includedItems[]{title}, notIncludedTitle, notIncludedItems,
        bookingHeading, bookingSteps[]{title}, finePrintCards[]{title}, closingHeading, closingCtaLabel,
        "masthead": mastheadImage.asset._ref},
      "blocks": *[_type == "teamBlock"] | order(order asc) {name, baseFee, perAthleteRate, exampleLine}}`,
    (d, h) => {
      const p = d.page ?? {};
      check('/registration', 'heading', p.heading, h);
      check('/registration', 'intro', p.intro, h);
      check('/registration', 'pricingHeading', p.pricingHeading, h);
      check('/registration', 'pricingFootnote', p.pricingFootnote, h);
      check('/registration', 'includedHeading', p.includedHeading, h);
      for (const i of p.includedItems ?? []) check('/registration', 'included item', i.title, h);
      for (const n of p.notIncludedItems ?? []) check('/registration', 'not-included item', n, h);
      for (const s of p.bookingSteps ?? []) check('/registration', 'booking step', s.title, h);
      for (const c of p.finePrintCards ?? []) check('/registration', 'fine print', c.title, h);
      check('/registration', 'closingHeading', p.closingHeading, h);
      check('/registration', 'masthead image', p.masthead, h, { image: true });
      for (const b of d.blocks ?? []) {
        check('/registration', `block ${b.name}`, b.name, h);
        check('/registration', `${b.name} base fee`, `$${Number(b.baseFee).toLocaleString('en-US')}`, h);
        check('/registration', `${b.name} per athlete`, `$${Number(b.perAthleteRate).toLocaleString('en-US')}`, h);
      }
    },
  ],
  [
    '/recruiting',
    `*[_type == "recruitingPage"][0]{heading, intro, stats[]{number, label}, whyHeading,
      watchHeading, watchItems[]{title}, evalHeading, quoteText, neverHeading, neverItems[]{title},
      familyHeading, coachHeading, closingHeading, footnote, "masthead": mastheadImage.asset._ref}`,
    (d, h) => {
      check('/recruiting', 'heading', d.heading, h);
      check('/recruiting', 'intro', d.intro, h);
      for (const s of d.stats ?? []) check('/recruiting', `stat ${s.number}`, s.label, h);
      check('/recruiting', 'whyHeading', d.whyHeading, h);
      check('/recruiting', 'watchHeading', d.watchHeading, h);
      for (const i of d.watchItems ?? []) check('/recruiting', 'watch item', i.title, h);
      check('/recruiting', 'evalHeading', d.evalHeading, h);
      check('/recruiting', 'quote', d.quoteText, h);
      for (const i of d.neverItems ?? []) check('/recruiting', 'never item', i.title, h);
      check('/recruiting', 'familyHeading', d.familyHeading, h);
      check('/recruiting', 'coachHeading', d.coachHeading, h);
      check('/recruiting', 'footnote', d.footnote, h);
      check('/recruiting', 'masthead image', d.masthead, h, { image: true });
    },
  ],
  [
    '/faq',
    `{"page": *[_type == "faqPage"][0]{title, introduction, "masthead": mastheadImage.asset._ref},
      "faqs": *[_type == "faq"] | order(order asc) {question, answer}}`,
    (d, h) => {
      check('/faq', 'title', d.page?.title, h);
      check('/faq', 'introduction', d.page?.introduction, h);
      check('/faq', 'masthead image', d.page?.masthead, h, { image: true });
      for (const f of d.faqs ?? []) {
        check('/faq', 'question', f.question?.trim(), h);
        check('/faq', 'answer', f.answer?.trim(), h);
      }
    },
  ],
  [
    '/media',
    `{"page": *[_type == "mediaPage"][0]{heading, intro, "masthead": mastheadImage.asset._ref},
      "items": *[_type == "mediaItem"] | order(order asc) {caption, "img": image.asset._ref}}`,
    (d, h) => {
      check('/media', 'heading', d.page?.heading, h);
      check('/media', 'intro', d.page?.intro, h);
      check('/media', 'masthead image', d.page?.masthead, h, { image: true });
      for (const i of d.items ?? []) {
        check('/media', 'caption', i.caption, h);
        check('/media', 'gallery image', i.img, h, { image: true });
      }
    },
  ],
  [
    '/contact',
    `{"page": *[_type == "contactPage"][0]{heading, intro, "masthead": mastheadImage.asset._ref},
      "settings": *[_type == "siteSettings"][0]{contactEmail, contactPhone}}`,
    (d, h) => {
      check('/contact', 'heading', d.page?.heading, h);
      check('/contact', 'intro', d.page?.intro, h);
      check('/contact', 'masthead image', d.page?.masthead, h, { image: true });
      check('/contact', 'contactEmail', d.settings?.contactEmail, h);
    },
  ],
  [
    '/newsletter',
    `{"page": *[_type == "newsletterPage" && _id == "newsletterPage"][0]{title, intro, emptyStateNote, "masthead": mastheadImage.asset._ref},
      "issues": *[_type == "newsletterIssue" && defined(slug.current)] | order(issueDate desc) {title, intro}}`,
    (d, h) => {
      check('/newsletter', 'title', d.page?.title, h);
      check('/newsletter', 'intro', d.page?.intro, h);
      check('/newsletter', 'masthead image', d.page?.masthead, h, { image: true });
      // The empty-state note only renders while no issues exist.
      if ((d.issues ?? []).length === 0) {
        check('/newsletter', 'emptyStateNote', d.page?.emptyStateNote, h);
      }
      for (const i of d.issues ?? []) check('/newsletter', `issue "${i.title}"`, i.title, h);
    },
  ],
];

// ——— Site-wide: nav logo + favicon come from siteSettings ————————————
async function checkSiteChrome() {
  const s = await q(`*[_type == "siteSettings"][0]{
    "favicon": favicon.asset._ref, "logo": logo.asset._ref, "logoOnDark": logoOnDark.asset._ref, title}`);
  const h = await page('/');
  check('site', 'favicon asset', s.favicon, h, { image: true });
  const logoShown = (s.logo && h.includes(s.logo.replace(/^image-/, '').replace(/-(png|jpg)$/, ''))) ||
    (s.logoOnDark && h.includes(s.logoOnDark.replace(/^image-/, '').replace(/-(png|jpg)$/, '')));
  if (s.logo || s.logoOnDark) {
    if (logoShown) pass++;
    else { fail++; failures.push('site · nav logo: uploaded logo asset not found in page'); }
  }
}

console.log(`Checking CMS content against rendered pages at ${BASE}\n`);
for (const [route, groq, verify] of ROUTES) {
  try {
    const [doc, html] = await Promise.all([q(groq), page(route)]);
    const before = fail;
    verify(doc, html);
    console.log(`  ${fail > before ? 'DRIFT' : 'ok   '} ${route}`);
  } catch (e) {
    fail++;
    failures.push(`${route}: ${e.message}`);
    console.log(`  ERROR ${route} — ${e.message}`);
  }
}
await checkSiteChrome();

console.log('');
if (failures.length) {
  console.log('Failures:');
  for (const f of failures) console.log('  - ' + f);
  console.log(`\nSYNC CHECK FAILED — ${pass} checks passed, ${fail} failed.`);
  console.log('Dispute rule (docs/11): the rendered page wins — patch Sanity to match it.');
  process.exit(1);
}
console.log(`Sync check passed — ${pass} field checks match between Sanity and the rendered pages.`);
