import Link from "next/link";

/**
 * BrandLogo — the Elevate Training Camps identity, approved at Checkpoint A1.
 *
 * Twin-peak mark (a mountain that doubles as the "A" of Elevate) plus a
 * lowercase Fraunces wordmark and a spaced-out sans subtitle.
 *
 * This is a hard-coded brand asset rather than CMS content on purpose: the
 * logo previously came from Sanity, which meant the site fell back to plain
 * text whenever Sanity was unreachable. A brand mark is a constant, not
 * editable content.
 *
 * Treatments:
 *   - "onLight" (default) — green mark, deep-green wordmark. For the cream
 *     header and any light surface.
 *   - "onDark" — all cream. The primary standalone treatment (cream on deep
 *     green), for dark sections, social avatars and merch.
 */

interface MarkProps {
  size?: number;
  color?: string;
  className?: string;
}

export function ElevateMark({ size = 40, color = "var(--primary)", className = "" }: MarkProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M100 16 L196 184 L140 184 L100 112 L60 184 L4 184 Z" />
      <path d="M100 132 L134 184 L66 184 Z" />
    </svg>
  );
}

interface BrandLogoProps {
  variant?: "onLight" | "onDark";
  markSize?: number;
  className?: string;
  /** Render as a link to the homepage. Set false when already inside a link. */
  asLink?: boolean;
  /**
   * Optional uploaded logo from Sanity (Site Settings → Site Logo, or Footer
   * Logo). When present it replaces the built-in mark and wordmark entirely.
   *
   * The built-in version stays as the fallback rather than being removed. An
   * earlier iteration fetched the logo from the CMS with no fallback, and the
   * site degraded to plain text whenever Sanity was unreachable — which has
   * happened, via a billing block. This way the logo is fully editable without
   * the brand disappearing during an outage.
   */
  src?: string;
  /** Alt text for an uploaded logo. Ignored by the built-in mark, which is
   *  decorative next to the wordmark it already spells out. */
  alt?: string;
}

export default function BrandLogo({
  variant = "onLight",
  markSize = 38,
  className = "",
  asLink = true,
  src,
  alt,
}: BrandLogoProps) {
  const isDark = variant === "onDark";
  const markColor = isDark ? "var(--surface)" : "var(--primary)";
  const wordColor = isDark ? "var(--surface)" : "var(--primary-deep)";
  const subColor = isDark ? "var(--border)" : "var(--muted-foreground)";

  const content = src ? (
    <span className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element --
          next/image needs known intrinsic dimensions or a `fill` container. An
          uploaded logo can be any aspect ratio, and the design constrains
          height while letting width follow. Sanity's CDN is already serving a
          height-capped, format-optimised asset, so next/image would add a
          second optimisation pass for no benefit. */}
      <img
        src={src}
        alt={alt ?? "Elevate Training Camps"}
        style={{ height: markSize * 1.25, width: "auto" }}
        className="object-contain"
      />
    </span>
  ) : (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ElevateMark size={markSize} color={markColor} />
      <span className="leading-none">
        <span
          className="block font-serif lowercase leading-none"
          style={{ color: wordColor, fontSize: markSize * 0.72 }}
        >
          elevate
        </span>
        <span
          className="mt-1 block uppercase leading-none"
          style={{ color: subColor, fontSize: markSize * 0.19, letterSpacing: "0.26em" }}
        >
          Training Camps
        </span>
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label="Elevate Training Camps — home" className="transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}
