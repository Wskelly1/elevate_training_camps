import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <link rel="manifest" href="/api/manifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FaviconProvider />
        {children}
      </body>
    </html>
  );
}
