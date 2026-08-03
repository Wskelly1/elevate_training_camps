import Link from "next/link";
import Image from "next/image";
import Layout from "../../components/layout";
import PageMasthead from "../../components/PageMasthead";
import { getNewsletterPage } from "../../lib/queries";

export const metadata = {
  title: "Newsletter | Elevate Training Camps",
  description:
    "A short monthly update from Flagstaff: camp news, training notes, and what's happening at altitude.",
};

/**
 * /newsletter — the monthly newsletter archive (owner decision 2026-08-02:
 * this replaces the cut Phase 7 blog). Issues are authored in the Studio
 * as `newsletterIssue` documents and appear here as soon as they're
 * published; emailing them to subscribers is a separate step
 * (docs/04-email-setup.md). Before the first issue exists the page shows
 * the Studio-editable empty-state note — a neutral line, no invented
 * back-catalog (docs/10 §5).
 */
export default async function NewsletterPage() {
  const { page, issues } = await getNewsletterPage();

  return (
    <Layout transparentNav>
      <PageMasthead
        imageUrl={page?.mastheadImageUrl}
        eyebrow="The monthly letter"
        heading={page?.title || "Newsletter"}
        intro={page?.intro}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {issues.length === 0 ? (
            <div className="border border-[var(--border)] bg-[var(--surface)] px-8 py-12 text-center shadow-sm">
              <p className="mx-auto max-w-[52ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
                {page?.emptyStateNote ||
                  "The first issue is on its way. Sign up in the footer and it will land in your inbox when it does."}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {issues.map((issue, idx) => (
                <Link
                  key={issue._id}
                  href={`/newsletter/${issue.slug}`}
                  className="group grid gap-6 border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition hover:shadow-md md:grid-cols-12 md:p-8"
                >
                  {issue.heroImageUrl && (
                    <div className="img-live relative h-48 overflow-hidden md:col-span-4 md:h-full md:min-h-[180px]">
                      <Image
                        src={issue.heroImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 30vw"
                      />
                    </div>
                  )}
                  <div className={issue.heroImageUrl ? "md:col-span-8" : "md:col-span-12"}>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">
                      {String(idx + 1).padStart(2, "0")} ·{" "}
                      {issue.issueDate
                        ? new Date(`${issue.issueDate}T12:00:00Z`).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Issue"}
                    </p>
                    <h2 className="mt-3 text-[1.75rem] leading-[1.15] transition-colors group-hover:text-[var(--primary)] md:text-[2.1rem]">
                      {issue.title}
                    </h2>
                    {issue.intro && (
                      <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.7] text-[#4a4a4a]">
                        {issue.intro}
                      </p>
                    )}
                    <p className="mt-5 text-[12px] uppercase tracking-[0.24em] text-[var(--primary)]">
                      Read the issue
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
