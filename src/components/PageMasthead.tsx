/**
 * PageMasthead — the shared top band for every inner page (owner request
 * 2026-07-31: the white strip under the header and the per-page spacing
 * drift both go away).
 *
 * The band is `--surface`, the same cream as the site header, so the
 * header and masthead read as one continuous surface; content below sits
 * on `--background`. Every inner page uses identical spacing. The
 * homepage keeps its transparent-nav hero and does not use this.
 */
export default function PageMasthead({
  eyebrow,
  heading,
  intro,
  aside,
  children,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  intro?: string;
  /** Optional right-hand column (e.g. the FAQ header image). */
  aside?: React.ReactNode;
  /** Rendered under the intro — CTA buttons, chip rows, etc. */
  children?: React.ReactNode;
}) {
  const body = (
    <>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">{eyebrow}</p>
      )}
      <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] md:text-6xl">{heading}</h1>
      {intro && (
        <p className="mt-6 max-w-2xl text-lg leading-[1.75] text-[#4a4a4a]">{intro}</p>
      )}
      {children}
    </>
  );

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)] pt-14 pb-14 md:pt-20 md:pb-16">
      {aside ? (
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-12">
          <div className="md:col-span-7">{body}</div>
          <div className="md:col-span-5">{aside}</div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-6">{body}</div>
      )}
    </section>
  );
}
