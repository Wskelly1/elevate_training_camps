'use client';

import { useEffect } from 'react';
import { urlFor } from '../lib/sanity';

interface FaviconProviderProps {
  favicon?: any;
}

/**
 * FaviconProvider - applies the site favicon client-side.
 *
 * The favicon image is fetched server-side (getSiteSettings() is cached
 * and can't run in the browser) and passed in as a prop.
 */
export default function FaviconProvider({ favicon }: FaviconProviderProps) {
  useEffect(() => {
    if (!favicon) return;

    const faviconUrl = urlFor(favicon).url();

    // Update or create favicon link
    let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = faviconUrl;
    faviconLink.type = 'image/png';
  }, [favicon]);

  return null; // This component doesn't render anything
}
