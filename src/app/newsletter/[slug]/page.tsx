import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Layout from "../../../components/layout";
import PageMasthead from "../../../components/PageMasthead";
import { getNewsletterIssue } from "../../../lib/queries";

/**
 * /newsletter/[slug] — a single newsletter issue, rendered in the lodge
 * style. The same document is what the send endpoint emails to
 * subscribers, so the page doubles as the issue's permanent home ("view
 * in browser").
 */
export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getNewsletterIssue(slug);
  if (!issue) notFound();

  const dateLabel = issue.issueDate
    ? new Date(`${issue.issueDate}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <Layout transparentNav>
      <PageMasthead
        imageUrl={issue.heroImageUrl}
        eyebrow={dateLabel ? `The monthly letter · ${dateLabel}` : "The monthly letter"}
        heading={issue.title}
        intro={issue.intro}
      />

      <article className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          {issue.body && (
            <div className="space-y-5 text-[17px] leading-[1.8] text-[#4a4a4a] [&_a]:text-[var(--primary)] [&_a]:underline [&_h2]:mt-10 [&_h2]:text-[1.75rem] [&_h2]:leading-[1.2] [&_h2]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:text-[1.35rem] [&_h3]:text-[var(--foreground)] [&_strong]:font-semibold [&_strong]:text-[var(--primary-deep)] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
              <PortableText value={issue.body} />
            </div>
          )}
          <div className="mt-14 border-t border-[var(--border)] pt-8">
            <Link
              href="/newsletter"
              className="text-[12px] uppercase tracking-[0.24em] text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
            >
              All issues
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
