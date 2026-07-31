import Layout from "../../components/layout";
import Link from "next/link";
import { urlFor } from "../../lib/sanity";
import { getFAQs, getFAQPageSettings } from "../../lib/queries";
import Image from "next/image";

/**
 * FAQ — grouped by audience (owner decision 2026-07-31) and restyled onto
 * the A2.5a editorial system, replacing the off-palette brown banner.
 *
 * Questions come from `faq` documents; each carries a `category` that maps
 * to one of the section headings below. Uncategorized questions render
 * under "General" so nothing an editor writes silently disappears. The
 * page header (title/intro/image) comes from the `faqPage` singleton.
 */

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

const CATEGORIES: Array<{ id: string; title: string }> = [
  { id: "coaches", title: "For coaches & trip leaders" },
  { id: "families", title: "For families & athletes" },
  { id: "logistics", title: "Logistics & housing" },
  { id: "safety", title: "Safety & weather" },
  { id: "general", title: "General" },
];

export default async function FAQPage() {
  const [faqs, settings] = await Promise.all([
    getFAQs(),
    getFAQPageSettings(),
  ]);

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: (faqs as FAQ[]).filter((f) =>
      cat.id === "general"
        ? !f.category || !CATEGORIES.some((c) => c.id === f.category)
        : f.category === cat.id
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <Layout>
      {/* ——— Masthead ————————————————————————————————————— */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">
              Questions & answers
            </p>
            <h1 className="mt-5 text-5xl leading-[1.05] md:text-6xl">
              {settings.title || "Frequently Asked Questions"}
            </h1>
            {settings.introduction && (
              <p className="mt-6 max-w-xl text-lg leading-[1.75] text-[#4a4a4a]">
                {settings.introduction}
              </p>
            )}
          </div>
          {settings.faqPageImage && (
            <div className="md:col-span-5">
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg md:ml-auto">
                <Image
                  src={urlFor(settings.faqPageImage).url()}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 40vw"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ——— Grouped questions ———————————————————————————— */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-3xl px-6">
          {grouped.map((cat) => (
            <div key={cat.id} className="mb-14 last:mb-0">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">
                {cat.title}
              </p>
              <div className="mt-5 space-y-3">
                {cat.items.map((faq) => (
                  <details
                    key={faq._id}
                    className="group rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm overflow-hidden"
                  >
                    <summary className="faq-summary cursor-pointer pl-10 pr-4 py-3.5 text-lg leading-snug rounded-lg group-open:rounded-b-none focus:outline-none">
                      {faq.question}
                    </summary>
                    <div className="px-10 pb-5 text-[16px] leading-[1.7] text-[#4a4a4a]">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Contact prompt */}
          <div className="mt-16 border-t border-[var(--border)] pt-10 text-center">
            <p className="text-lg">Have a question we haven&apos;t answered?</p>
            <Link
              href="/contact"
              className="mt-5 inline-block rounded-md bg-[var(--primary)] px-7 py-3.5 text-base text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)]"
            >
              Ask us directly
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
