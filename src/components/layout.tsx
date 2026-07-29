import * as React from "react"
import { getSiteSettings, getAboutSections } from "../lib/queries";
import LayoutClient from "./LayoutClient";

interface LayoutProps {
  children?: React.ReactNode
  showNavigation?: boolean
  footerContent?: React.ReactNode
  /** Let a full-bleed hero run underneath the header. See LayoutClient. */
  transparentNav?: boolean
}

/**
 * Server Component wrapper for the site layout. Fetches siteSettings and
 * aboutSections here (cached — see REVALIDATE_SECONDS in lib/queries.ts)
 * instead of in the browser on every page mount, then hands them to
 * LayoutClient for the actual interactive header/nav/footer rendering.
 */
export default async function Layout({
  children,
  showNavigation = true,
  footerContent,
  transparentNav = false
}: LayoutProps) {
  const [siteSettings, aboutSections] = await Promise.all([
    getSiteSettings(),
    getAboutSections(),
  ]);

  return (
    <LayoutClient
      showNavigation={showNavigation}
      footerContent={footerContent}
      siteSettings={siteSettings}
      aboutSections={aboutSections}
      transparentNav={transparentNav}
    >
      {children}
    </LayoutClient>
  );
}
