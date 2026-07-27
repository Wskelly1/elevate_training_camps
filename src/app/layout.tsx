import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { getSiteSettings } from "../lib/queries";
import { urlFor } from "../lib/sanity";
import FaviconProvider from "../components/FaviconProvider";

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

  return {
    title: settings.title || "Elevate Training Camps",
    description: settings.description || "Elevate Training Camps - High Altitude Training in Flagstaff",
    icons: {
      icon: settings.favicon ? [
        { url: urlFor(settings.favicon).url(), type: 'image/png' },
      ] : [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { url: '/apple-touch-icon-precomposed.png', sizes: '180x180', type: 'image/png' },
      ],
    },
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
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <link rel="manifest" href="/api/manifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}
      >
        <FaviconProvider favicon={settings.favicon} />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
