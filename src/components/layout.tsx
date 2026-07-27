import * as React from "react"
import { getSiteSettings, getAboutSections } from "../lib/queries";
import LayoutClient from "./LayoutClient";

interface LayoutProps {
  children?: React.ReactNode
  showNavigation?: boolean
  footerContent?: React.ReactNode
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
  footerContent
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
    >
      {children}
    </LayoutClient>
  );
}
