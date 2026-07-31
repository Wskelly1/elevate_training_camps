import Image from "next/image";

/**
 * PageMasthead — the Cinematic Lodge masthead (direction chosen
 * 2026-07-31): every inner page opens with a full-bleed photograph, the
 * title set over it in cream, and the nav floating on the image (pages
 * pass `transparentNav` to Layout). Scrims keep type legible over any
 * image without flattening it; the amber eyebrow is the lodge accent.
 *
 * The image comes from each page singleton's `mastheadImage` field, so
 * every masthead is Studio-swappable. `imageUrl` is required in practice —
 * when the CMS has no image yet the masthead falls back to the deep-green
 * ground so the page never opens on a bare strip.
 */
export default function PageMasthead({
  imageUrl,
  eyebrow,
  heading,
  intro,
  meta,
  children,
}: {
  imageUrl?: string;
  eyebrow?: string;
  heading: React.ReactNode;
  intro?: string;
  /** Small uppercase line under the intro (e.g. stat chips joined with dots). */
  meta?: string;
  /** Rendered under the copy — CTA buttons etc. */
  children?: React.ReactNode;
}) {
  return (
    <section
      className="relative flex min-h-[440px] w-full flex-col justify-end overflow-hidden md:h-[62vh] md:min-h-[520px]"
      style={{ backgroundColor: "var(--primary-deep)" }}
    >
      {imageUrl && (
        <Image src={imageUrl} alt="" fill priority className="object-cover" sizes="100vw" />
      )}
      {/* Directional scrims: dark base at the bottom for the title block,
          a short one up top so nav links stay legible over any sky. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,26,18,0.50) 0%, rgba(20,26,18,0.10) 30%, rgba(20,26,18,0.08) 52%, rgba(20,26,18,0.68) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12 pt-36 md:pb-14">
        {eyebrow && (
          <p className="rise text-[11px] uppercase tracking-[0.3em] text-[#e0b48e]">{eyebrow}</p>
        )}
        <h1 className="rise rise-1 mt-4 max-w-3xl text-5xl leading-[1.04] text-[#f0ead6] md:text-6xl lg:text-7xl">
          {heading}
        </h1>
        {intro && (
          <p className="rise rise-2 mt-5 max-w-2xl text-lg leading-[1.7] text-[#f0ead6]/85">{intro}</p>
        )}
        {meta && (
          <p className="rise rise-2 mt-6 text-[12px] uppercase tracking-[0.24em] text-[#f0ead6]/70">
            {meta}
          </p>
        )}
        {children && <div className="rise rise-3">{children}</div>}
      </div>
    </section>
  );
}
