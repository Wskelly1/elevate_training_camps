import Image from "next/image";
import Link from "next/link";
import { SiteSettings } from "../lib/queries";
import { urlFor } from "../lib/sanity";

interface LogoProps {
  className?: string;
  isFooter?: boolean;
  maxWidth?: number;
  siteSettings: SiteSettings | null;
}

/**
 * Logo - Displays the site logo, given siteSettings passed down from a
 * server-fetched parent (data is no longer fetched here directly, since
 * getSiteSettings() is cached server-side and can't run in the browser).
 *
 * @param {Object} props - Component props
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {boolean} [props.isFooter=false] - Whether to show footer logo variant
 * @param {number} [props.maxWidth] - Maximum width constraint for the logo
 * @param {SiteSettings|null} props.siteSettings - Site settings containing the logo image(s)
 */
export default function Logo({ className = "", isFooter = false, maxWidth, siteSettings }: LogoProps) {
  const logoImage = isFooter && siteSettings?.footerLogo ? siteSettings.footerLogo : siteSettings?.logo;

  const dimensions = logoImage?.asset?.metadata?.dimensions;

  if (!dimensions) {
    return (
      <Link href="/" className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
        <div className="font-bold text-lg">
          Elevate Training Camps
        </div>
      </Link>
    );
  }

  const logoUrl = urlFor(logoImage).url();
  let finalWidth = dimensions.width;
  let finalHeight = dimensions.height;

  if (maxWidth && maxWidth < finalWidth) {
    const aspectRatio = dimensions.height / dimensions.width;
    finalWidth = maxWidth;
    finalHeight = finalWidth * aspectRatio;
  }

  return (
    <Link href="/" className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <div className="logo-container">
        <Image
          src={logoUrl}
          alt="Elevate Training Camps Logo"
          width={finalWidth}
          height={finalHeight}
          style={{
            maxHeight: '60px',
            width: 'auto',
            objectFit: 'contain'
          }}
          priority
          className="opacity-100 transition-opacity duration-300"
        />
      </div>
    </Link>
  );
}
