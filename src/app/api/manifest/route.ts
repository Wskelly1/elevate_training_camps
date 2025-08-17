import { NextResponse } from 'next/server';
import { getSiteSettings } from '../../../lib/queries';
import { urlFor } from '../../../lib/sanity';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    const faviconUrl = settings.favicon ? urlFor(settings.favicon).url() : '/favicon.svg';

    const manifest = {
      name: settings.title || "Elevate Training Camps",
      short_name: "Elevate",
      description: settings.description || "High Altitude Training in Flagstaff, Arizona",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#427b4d",
      icons: [
        {
          src: faviconUrl,
          sizes: "any",
          type: "image/png"
        }
      ]
    };

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating manifest:', error);

    // Fallback manifest
    const fallbackManifest = {
      name: "Elevate Training Camps",
      short_name: "Elevate",
      description: "High Altitude Training in Flagstaff, Arizona",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#427b4d",
      icons: [
        {
          src: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml"
        }
      ]
    };

    return NextResponse.json(fallbackManifest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
