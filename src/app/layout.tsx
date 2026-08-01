import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { getSiteSettings } from "../lib/queries";
import { urlFor } from "../lib/sanity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Display face for headings and nav — Instrument Serif, chosen at
 * Checkpoint A1 (option B) for the high-contrast editorial register.
 * Body copy stays on Geist Sans.
 *
 * Note: this family ships weight 400 only. Headings must NOT carry
 * font-bold/font-semibold or the browser synthesises a faux bold, which
 * smears the high-contrast strokes. The base layer pins h1-h4 to 400 and
 * the utility classes were stripped accordingly.
 *
 * The CSS variable is deliberately font-agnostic (--font-display) so a
 * future face swap touches this file only.
 */
const displaySerif = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Generates dynamic metadata for the website
 *
 * This function fetches site settings from Sanity CMS and generates
 * appropriate metadata for SEO purposes, including title, description,
 * and favicon information.
 *
 * @returns {Promise<Metadata>} Metadata object for Next.js
 * @throws {Error} If the Sanity API request fails
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  /**
   * The single source of the site icon.
   *
   * There used to be four competing mechanisms — this function, a hardcoded
   * <head> block below, a client component that re-injected <link> tags at
   * runtime, and two route handlers (/api/favicon and /icon, the latter on the
   * edge runtime, which disabled static generation for that route). They partly
   * contradicted each other, so changing the icon in one place did not reliably
   * change what a browser showed.
   *
   * Now: upload a favicon in Site Settings and it wins; otherwise the static
   * brand asset in public/ is used. One path, still fully CMS-editable.
   */
  const icon = settings.favicon
    ? [
        { url: urlFor(settings.favicon).width(32).height(32).format('png').url(), sizes: '32x32', type: 'image/png' },
        { url: urlFor(settings.favicon).width(64).height(64).format('png').url(), sizes: '64x64', type: 'image/png' },
        { url: urlFor(settings.favicon).width(192).height(192).format('png').url(), sizes: '192x192', type: 'image/png' },
      ]
    : [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ];

  return {
    title: settings.title || "Elevate Training Camps",
    description: settings.description || "Elevate Training Camps - High Altitude Training in Flagstaff",
    icons: {
      icon,
      apple: settings.favicon
        ? [{ url: urlFor(settings.favicon).width(180).height(180).format('png').url(), sizes: '180x180', type: 'image/png' }]
        : [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
            { url: '/apple-touch-icon-precomposed.png', sizes: '180x180', type: 'image/png' },
          ],
    },
    manifest: '/api/manifest',
  };
}

/**
 * RootLayout - Main layout component for the entire application
 *
 * This component provides the root HTML structure for all pages in the application.
 * It sets up fonts, metadata, and the basic HTML structure that wraps all content.
 *
 * Features:
 * - Dynamic metadata generation from Sanity CMS
 * - Google Fonts integration (Geist Sans and Geist Mono)
 * - Proper HTML structure with language attribute
 * - Favicon configuration
 * - Antialiased text rendering for better readability
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render within the layout
 * @returns {JSX.Element} The root HTML structure for the application
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // No hardcoded <head> icon links here. generateMetadata above owns the
  // favicon and the manifest, so a CMS upload is not silently overridden by a
  // static tag that Next renders after it.
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}
      >
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
