'use client';

import { useEffect } from 'react';
import { getSiteSettings } from '../lib/queries';
import { urlFor } from '../lib/sanity';

export default function FaviconProvider() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const settings = await getSiteSettings();
        if (settings.favicon) {
          const faviconUrl = urlFor(settings.favicon).url();

          // Update or create favicon link
          let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
          }
          faviconLink.href = faviconUrl;
          faviconLink.type = 'image/png';
        }
      } catch (error) {
        console.error('Error updating favicon:', error);
      }
    };

    updateFavicon();
  }, []);

  return null; // This component doesn't render anything
}
