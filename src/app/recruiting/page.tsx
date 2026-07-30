import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Layout from "../../components/layout";

/**
 * College Recruiting Advisory — the page that replaced /coaching.
 *
 * O-16 (owner decision, 2026-07-29): /coaching was selling the remote
 * coaching subscription cut from the business plan the same day — a product
 * that undercuts the coaches and parent organisers who actually book camps —
 * plus fabricated testimonials and a "proven results" claim with no season
 * behind it. Rather than re-scope it, the page was repurposed for the
 * recruiting advisory, the business's principal service line
 * (`../business-plan/04-recruiting-advisory-launch-plan`), which needed a
 * home anyway. /coaching now 308-redirects here (next.config.ts).
 *
 * Copy is in code, not the CMS, for the same reason as the homepage: the
 * Sanity schema still models the old positioning, and wiring this page to
 * CMS fields would let stale copy win. Phase 1.5 reshapes the schema.
 *
 * Constraints this copy is written under — each is load-bearing:
 *  - Gate-7: NO PRICING may appear anywhere on this page. Year 1 ships only
 *    the free evaluation every camper receives; the rate card publishes
 *    after the attach rate is measured, not before. Do not add tier names
 *    with dollar amounts to this page without clearing Gate-7.
 *  - Gate-5 rule 4 / doc 04 §03: never promise placement, roster spots or
 *    scholarships, and never charge a fee contingent on any of them. That
 *    pattern resembles athlete agency and is restricted in several states.
 *    Outcomes are stated only as work performed.
 *  - Gate-5 rule 3: no track record exists — no alumni outcomes, no
 *    "proven results", no invented testimonials. Commitments, not history.
 *  - Doc 04 compliance guardrail: Elevate sells advice TO FAMILIES. Nothing
 *    here may drift toward selling athlete information to colleges — that
 *    is a scouting service under NCAA rules and a different regime.
 *  - NCAA figures (roster caps, contact dates, participation) are as of
 *    July 2026 and change annually; re-verify each cycle (footer note).
 */

export const metadata: Metadata = {
  title: "College Recruiting Advisory | Elevate Training Camps",
  description:
    "An honest read on where you can really run. Every camper leaves a block with a written evaluation — realistic competitive level, development priorities, and how they respond to real training.",
};

const CDN = "https://cdn.sanity.io/images/yvqe54iq/production";
const IMG = {
  editorial: `${CDN}/c48d0605d78850ce8f379d5e09aea8f5587b867d-1638x2048.jpg`,
  pack: `${CDN}/2edafd98ea58992f2bdd7f8c1dfe6b6a1cb82bee-2048x1638.jpg`,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{children}</p>;
}

/** Market reality, from the July 2026 review of NCAA rules and participation
 *  data. These are the numbers that make honest guidance worth having. */
const STATS = [
  { n: "~7%", l: "of high school runners reach any college varsity roster", s: "Fewer than 2% reach NCAA Division I" },
  { n: "17", l: "athletes on a D1 cross country roster", s: "Roster caps replaced scholarship limits in 2025" },
  { n: "Jun 15", l: "after sophomore year — first D1 contact", s: "D2, D3 and NAIA can talk to you at any time" },
];

const WATCHED = [
  {
    t: "Response to real training",
    d: "How an athlete handles volume, altitude and accumulating fatigue over weeks — the single best predictor of surviving a collegiate programme.",
  },
  {
    t: "Coachability",
    d: "What happens when a session goes badly. How feedback lands. Whether the third week looks sharper than the first.",
  },
  {
    t: "Capacity or ceiling",
    d: "Whether race results reflect training that still has room, or an athlete already at the edge of what their volume can support.",
  },
  {
    t: "Temperament and team fit",
    d: "How they train in a group, lead, and follow — which is what college coaches actually ask about when they call.",
  },
];

const NEVER = [
  {
    t: "No placement promises",
    d: "We never promise a roster spot or a scholarship, and we never charge a fee contingent on either. Outcomes belong to the athlete; we are paid for work performed.",
  },
  {
    t: "Honest even when it disappoints",
    d: "If the realistic answer is Division III, that is the answer you get — with a list of D3 programmes that would genuinely want you. Encouragement is not advice.",
  },
  {
    t: "Advice to families, never marketing to colleges",
    d: "We advise you. We do not sell athlete information to college programmes, and our collegiate staff never recruit for their own schools.",
  },
  {
    t: "Rules re-verified every cycle",
    d: "NCAA recruiting legislation changes annually — roster caps did in 2025. Every calendar and contact-date we work from is re-checked each cycle.",
  },
];

export default function RecruitingPage() {
  return (
    <Layout>
      {/* ——— Masthead ————————————————————————————————————— */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>College recruiting advisory</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            An honest read on where you can really run.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-[1.75] text-[#4a4a4a]">
            Most families don&apos;t need help being recruited by Oregon. They
            need a truthful assessment of the level an athlete can compete at —
            Division I, II, III, NAIA or junior college — and a list of
            programmes that would actually want them. That is what we do.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
            >
              Start a conversation
            </Link>
            <Link
              href="/registration"
              className="rounded-md border border-[var(--border)] px-7 py-3.5 text-base text-[var(--foreground)] transition hover:bg-[var(--surface)]"
            >
              Bring your team to camp
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Stat band · market reality ————————————————————— */}
      <section className="bg-[var(--primary-deep)] py-20 text-[#f0ead6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.l} className="border-t border-[#f0ead6]/25 pt-6">
              <div className="text-6xl leading-none">{s.n}</div>
              <div className="mt-3 text-lg leading-snug">{s.l}</div>
              <div className="mt-2 text-sm text-[#f0ead6]/65">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ——— 01 · Why guidance, why now ————————————————————— */}
      <section className="py-16 md:py-24">
        <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-[6vw] md:pr-0">
          <div className="md:col-span-4">
            <Eyebrow>01 — Why now</Eyebrow>
            <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">
              The rules changed. Most advice hasn&apos;t.
            </h2>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              In 2025 the NCAA replaced Division I scholarship limits with hard
              roster caps — seventeen places for cross country. Fewer guaranteed
              spots means walking on is harder and target lists have to be more
              realistic than the ones last year&apos;s families used.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              And the window opens earlier than most families expect: Division I
              coaches can first contact an athlete on June 15 after sophomore
              year — for a rising junior, that is the middle of camp season.
              The summer you spend at altitude is the summer recruiting starts.
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
              <Image
                src={IMG.editorial}
                alt="Runners on the track beneath the San Francisco Peaks at sunrise"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 62vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— 02 · The advantage — weeks of watching, not a video ——— */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>02 — What we see that a database can&apos;t</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            No recruiting service has watched your athlete train for three
            weeks. We will have.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-[#4a4a4a]">
            The big recruiting platforms assign a specialist who has read a
            profile and watched a highlight video. Our assessment is built on
            something different: weeks of daily training at altitude, observed
            by staff who include collegiate athletes that navigated this exact
            process themselves.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {WATCHED.map((i) => (
              <div key={i.t}>
                <h3 className="text-[1.4rem] leading-snug">{i.t}</h3>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— 03 · The evaluation — what every camper gets ——————— */}
      <section className="py-20 md:py-28">
        <div className="grid items-end gap-12 px-6 md:grid-cols-12 md:gap-14 md:pl-0 md:pr-[6vw]">
          <div className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={IMG.pack}
                alt="A pack of athletes running into low sun on the track"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 56vw"
              />
            </div>
          </div>
          <div className="md:col-span-5">
            <Eyebrow>03 — Included with every block</Eyebrow>
            <h2 className="mt-5 text-[2.75rem] leading-[1.06] md:text-[3.5rem]">
              Every camper leaves with a written evaluation.
            </h2>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              At the end of a block, every athlete receives a written
              assessment: an honest read on the level they can realistically
              compete at, two or three development priorities that would move
              it, and what we observed about how they respond to sustained
              training.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[var(--accent-trail)]">
              It is included with camp — for every athlete on the squad, not an
              upsell at the door. Families who want to go further from there
              can, but the evaluation itself never costs extra.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block border-b border-[var(--primary)] pb-1 text-[17px] text-[var(--primary)] transition hover:border-[var(--primary-hover)] hover:text-[var(--primary-hover)]"
            >
              Ask about the evaluation →
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Full-width pull quote ——————————————————————— */}
      <section className="bg-[var(--primary-deep)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[#f0ead6]/70">
            The standard we hold ourselves to
          </p>
          <p className="mt-5 max-w-3xl text-[2rem] leading-[1.28] text-[#f0ead6] md:text-[2.75rem]">
            An advisor known for telling families the truth is worth more than
            one known for encouraging them.
          </p>
        </div>
      </section>

      {/* ——— 04 · What we never do ————————————————————————
          Doc 04's compliance guardrails, published as a differentiator.
          The incumbents sell through a sales call with no public pricing;
          we publish our constraints. */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>04 — What we never do</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-[2.25rem] leading-[1.1] md:text-[2.75rem]">
            The lines we don&apos;t cross.
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {NEVER.map((i) => (
              <div key={i.t} className="border-t border-[var(--border)] pt-5">
                <h3 className="text-[1.4rem] leading-snug">{i.t}</h3>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#4a4a4a]">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— 05 · Beyond the evaluation ————————————————————— */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <Eyebrow>05 — For families</Eyebrow>
              <h2 className="mt-5 text-[2.25rem] leading-[1.1]">
                Want more than the evaluation?
              </h2>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
                For families who want help through the whole cycle — a
                realistic target list, outreach that gets answered, and a
                timeline keyed to the actual contact dates — we work with a
                small number of athletes each year. Deliberately small: this is
                judgement work, and it collapses if it is oversold.
              </p>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
                Talk to us and we will tell you honestly whether it is worth
                your money — including when it isn&apos;t.
              </p>
            </div>
            <div>
              <Eyebrow>For coaches &amp; trip leaders</Eyebrow>
              <h2 className="mt-5 text-[2.25rem] leading-[1.1]">
                Recruiting support for the whole squad.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
                Whether your team travels with its coach or with parent
                chaperones, we can run a recruiting session for your athletes
                and their families during the block — how the calendar works,
                what roster caps changed, and what a realistic list looks like
                — so every family hears the same straight answers.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block border-b border-[var(--primary)] pb-1 text-[17px] text-[var(--primary)] transition hover:border-[var(--primary-hover)] hover:text-[var(--primary-hover)]"
              >
                Add it to your team&apos;s block →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Closing CTA ————————————————————————————————— */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[2.5rem] leading-[1.08] md:text-[3.25rem]">
            Start with the truth.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-[1.75] text-[#4a4a4a]">
            Tell us where your athlete is — season bests, year, what they want
            — and we will tell you what we would honestly do next.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-block rounded-md bg-[var(--primary)] px-8 py-4 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
          >
            Start a conversation
          </Link>
          <p className="mx-auto mt-12 max-w-xl text-[13px] leading-[1.7] text-[var(--muted-foreground)]">
            NCAA participation figures, roster caps and contact dates as of
            July 2026. Recruiting legislation changes annually and every
            calendar we work from is re-verified each cycle.
          </p>
        </div>
      </section>
    </Layout>
  );
}
