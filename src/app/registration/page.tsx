import Link from "next/link";
import type { Metadata } from "next";
import Layout from "../../components/layout";

/**
 * Registration & Pricing — the team-block tariff, stated honestly.
 *
 * Rebuilt 2026-07-30. The previous page rendered hard-coded fallback data —
 * invented per-person tiers ($1,200/$1,800/$2,800), 2025 session dates,
 * "spots remaining" scarcity, early-bird discounts, payment plans, and
 * lodging/meals/transport promises — none of which existed in the business
 * plan, and several of which violated its guardrails outright. The Sanity
 * types it queried (trainingPackage, upcomingCamp, paymentOption,
 * whatsIncluded) hold zero documents, so the fabricated fallbacks always
 * rendered. This page no longer queries them.
 *
 * Copy is in code, not the CMS, for the same reason as the homepage and
 * /recruiting: the schema still models the old per-person product, and the
 * Phase 1.5 reshape (a teamBlock type carrying base fee + per-athlete rate +
 * minimum squad) hasn't happened yet.
 *
 * Constraints this copy is written under — each is load-bearing:
 *  - Prices come from business-plan/PRICING.md and nowhere else:
 *    1-week $1,500 + $250/athlete · 3-week $3,000 + $500/athlete ·
 *    minimum eight athletes. Never quote a range, never a per-person price.
 *  - Programming only. No lodging, meals, transport or overnight
 *    supervision promises — the team's own adults book housing from the
 *    shortlist we provide and hold supervision (facilitate, don't operate).
 *  - Sold to teams via their trip leader — coach or parent organiser —
 *    never to individual athletes.
 *  - No invented dates, scarcity, discounts or payment plans. Booking is
 *    enquiry → deposit holds dates → roster and balance before arrival.
 *  - No race-outcome claims; a summer block builds aerobic base.
 *  - Cancellation/smoke posture is stated plainly; full refund terms travel
 *    with the team agreement, provided before any deposit is taken.
 */

export const metadata: Metadata = {
  title: "Registration & Pricing | Elevate Training Camps",
  description:
    "Team altitude training blocks in Flagstaff, Arizona — a 3-week flagship block and a 1-week camp, priced as a team. Programming only; transparent pricing for coaches and parent organisers.",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

/** The two products, verbatim from business-plan/PRICING.md. */
const BLOCKS = [
  {
    name: "Three-week block",
    tagline: "The flagship. Long enough for real altitude adaptation.",
    base: "$3,000",
    perAthlete: "$500",
    example: "A 15-athlete squad comes to $10,500 — about $700 per athlete.",
    detail:
      "Meaningful physiological adaptation takes roughly three weeks at this elevation. Week one lands the camp experience — orientation, the professional meet-and-greet, the D1 panel, the recruiting seminar. The following weeks are the actual work: coached volume on Flagstaff's trail network with recovery built around it.",
  },
  {
    name: "One-week camp",
    tagline: "The on-ramp. A serious week, without the three-week commitment.",
    base: "$1,500",
    perAthlete: "$250",
    example: "A 15-athlete squad comes to $5,250 — about $350 per athlete.",
    detail:
      "A full training camp week — coached sessions, education blocks and team time at 7,000 feet. Built for programs that want to see how a Flagstaff block works before committing a squad to the full three weeks.",
  },
];

const INCLUDED = [
  {
    t: "Coached training",
    d: "Two daily sessions on Flagstaff's trail network, planned around your coach's own program — it stays their team.",
  },
  {
    t: "Education blocks",
    d: "Altitude physiology, fueling, recovery and the recruiting calendar, delivered mid-day between sessions.",
  },
  {
    t: "Pro and D1 access",
    d: "Flagstaff's professional training groups and collegiate staff — panels and meet-and-greets a visiting coach can't self-provide.",
  },
  {
    t: "A written evaluation for every camper",
    d: "Every athlete leaves a block with an honest written assessment — included, never an upsell.",
  },
  {
    t: "Local logistics",
    d: "Routes, schedules, and the on-the-ground knowledge that makes three weeks in a new town run smoothly.",
  },
  {
    t: "A housing shortlist — not housing",
    d: "We hand your trip leader a vetted shortlist of local options sized for a squad. Your team books directly and your adults hold the reservation.",
  },
];

const NOT_INCLUDED = [
  "Lodging — booked by the team from the shortlist we provide",
  "Meals and groceries — managed by the team's adults",
  "Travel to and around Flagstaff",
  "Overnight supervision — the team's accompanying adults hold it throughout",
];

const STEPS = [
  {
    n: "01",
    t: "Talk to us",
    d: "A call with your coach or parent organiser: dates, squad size, what your program wants from the block.",
  },
  {
    n: "02",
    t: "A deposit holds your dates",
    d: "One team booking, one invoice. The team agreement — including refund and cancellation terms — comes first, before any money.",
  },
  {
    n: "03",
    t: "Roster and balance before arrival",
    d: "Roster, medical forms and signed waivers land ahead of camp, with the balance due before the session starts.",
  },
];

export default function RegistrationPage() {
  return (
    <Layout>
      {/* ——— Masthead ————————————————————————————————————— */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>Registration &amp; pricing · Summer 2027</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Priced as a team, not per head.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-[1.75] text-[#4a4a4a]">
            Elevate sells altitude training blocks to teams — booked by the
            coach, or by a parent organiser running the trip. One base fee
            covers what&apos;s fixed for the squad; a per-athlete rate scales
            with your roster. Minimum eight athletes.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
            >
              Enquire about 2027 dates
            </Link>
            <Link
              href="/recruiting"
              className="rounded-md border border-[var(--border)] px-7 py-3.5 text-base text-[var(--foreground)] transition hover:bg-[var(--surface)]"
            >
              The recruiting advisory
            </Link>
          </div>
        </div>
      </section>

      {/* ——— 01 · The two blocks ————————————————————————— */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>01 — Two formats</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            A three-week flagship, and a one-week way in.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {BLOCKS.map((b) => (
              <div key={b.name} className="border-t-2 border-[var(--primary)] bg-[var(--background)] p-8">
                <h3 className="text-[1.75rem] leading-snug">{b.name}</h3>
                <p className="mt-2 text-[15px] text-[var(--accent-trail)]">{b.tagline}</p>
                <div className="mt-7 flex items-baseline gap-6">
                  <div>
                    <div className="text-4xl leading-none">{b.base}</div>
                    <div className="mt-2 text-sm text-[var(--muted-foreground)]">team base fee</div>
                  </div>
                  <div className="text-2xl text-[var(--muted-foreground)]">+</div>
                  <div>
                    <div className="text-4xl leading-none">{b.perAthlete}</div>
                    <div className="mt-2 text-sm text-[var(--muted-foreground)]">per athlete</div>
                  </div>
                </div>
                <p className="mt-5 text-[15px] leading-[1.7] text-[var(--accent-trail)]">{b.example}</p>
                <p className="mt-5 text-[16px] leading-[1.7] text-[#4a4a4a]">{b.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-[15px] leading-[1.7] text-[var(--muted-foreground)]">
            Prices are for the 2027 season, programming only, minimum eight
            athletes per team. The base fee covers what doesn&apos;t change
            with squad size — the panels, the seminar, the coordination — so
            small squads aren&apos;t subsidised by large ones.
          </p>
        </div>
      </section>

      {/* ——— 02 · What's included / what isn't ———————————————— */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>02 — What the fee buys</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            The program. Deliberately not the beds.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-[#4a4a4a]">
            We&apos;re a program provider, not a camp operator. Your team&apos;s
            own adults hold housing and overnight supervision — that keeps
            costs transparent, keeps the trip yours, and is the reason a
            three-week block can cost what a five-day camp does elsewhere.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((i) => (
              <div key={i.t} className="border-t border-[var(--border)] pt-5">
                <h3 className="text-[1.3rem] leading-snug">{i.t}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#4a4a4a]">{i.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 max-w-2xl border-l-2 border-[var(--accent-rock)] pl-6">
            <h3 className="text-[1.3rem]">Not included — on purpose</h3>
            <ul className="mt-4 space-y-2">
              {NOT_INCLUDED.map((n) => (
                <li key={n} className="text-[15px] leading-[1.7] text-[#4a4a4a]">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— 03 · How booking works ————————————————————————— */}
      <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[#f0ead6]/70">03 — How booking works</p>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            One conversation. One invoice.
          </h2>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t border-[#f0ead6]/25 pt-6">
                <div className="text-sm tracking-[0.2em] text-[#f0ead6]/60">{s.n}</div>
                <h3 className="mt-3 text-[1.4rem] leading-snug">{s.t}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#f0ead6]/80">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— 04 · The honest fine print ————————————————————— */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>04 — Things we&apos;d rather say now than later</Eyebrow>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            <div className="border-t border-[var(--border)] pt-5">
              <h3 className="text-[1.4rem] leading-snug">Smoke, weather and cancellations</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">
                This is the mountain West in summer: wildfire smoke or weather
                can modify or cancel sessions, and we adjust training rather
                than run athletes through bad air. Refund and cancellation
                terms are written into the team agreement your trip leader
                receives before any deposit — not negotiated after the fact.
              </p>
            </div>
            <div className="border-t border-[var(--border)] pt-5">
              <h3 className="text-[1.4rem] leading-snug">Adults travel with the team</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">
                Every team brings accompanying adults — the coach, parent
                chaperones, or both — who hold housing and overnight
                supervision for the whole block. It&apos;s in the team
                agreement, and it&apos;s not negotiable.
              </p>
            </div>
            <div className="border-t border-[var(--border)] pt-5">
              <h3 className="text-[1.4rem] leading-snug">Iron screening before arrival</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">
                We ask that athletes have ferritin checked before a block. Low
                iron makes altitude training useless or actively harmful, and
                deficiency is common in adolescent distance runners — this is
                basic due diligence, not an upsell.
              </p>
            </div>
            <div className="border-t border-[var(--border)] pt-5">
              <h3 className="text-[1.4rem] leading-snug">What a summer block is — and isn&apos;t</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">
                A June or July block builds aerobic base through the
                highest-volume phase of the training year. It is not a promise
                about November — anyone who sells altitude as a race-day
                guarantee is overselling it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Closing CTA ————————————————————————————————— */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[2.5rem] leading-[1.08] md:text-[3.25rem]">
            Bring your squad to 7,000 feet.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
            Tell us your program, your rough dates and your squad size, and
            we&apos;ll come back with a concrete plan for a 2027 block —
            including the housing shortlist your trip leader will book from.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            Enquire about 2027 dates
          </Link>
        </div>
      </section>
    </Layout>
  );
}
