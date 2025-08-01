import { getSiteSettings } from '../lib/queries';
import { urlFor } from '../lib/sanity';
import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

/**
 * Favicon size configuration
 *
 * Defines the dimensions for the generated favicon image.
 * Standard favicon size is 32x32 pixels.
 *
 * @type {Object} Size configuration object
 */
export const size = {
  width: 32,
  height: 32,
};

/**
 * Favicon content type
 *
 * Specifies the MIME type for the generated favicon image.
 *
 * @type {string} PNG image content type
 */
export const contentType = 'image/png';

/**
 * Icon - Dynamic favicon generator for the website
 *
 * This component generates a dynamic favicon for the website by fetching
 * the favicon image from Sanity CMS. It provides fallback options if
 * the favicon is not available or if there's an error.
 *
 * Features:
 * - Dynamic favicon generation from Sanity CMS
 * - Proper image sizing and formatting
 * - Fallback favicon with site initials
 * - Error handling with graceful degradation
 * - Edge runtime for optimal performance
 *
 * @returns {Promise<ImageResponse>} Generated favicon image response
 * @throws {Error} If favicon generation fails (handled internally)
 */
export default async function Icon() {
  try {
    const settings = await getSiteSettings();

    if (settings.favicon) {
      // Generate URL for favicon at 32x32 pixels
      const faviconUrl = urlFor(settings.favicon).width(32).height(32).format('png').url();

      // Fetch the favicon image
      const response = await fetch(faviconUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch favicon');
      }

      // Get the image as an array buffer
      const imageData = await response.arrayBuffer();

      // Return the image response
      return new ImageResponse(
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(data:image/png;base64,${Buffer.from(imageData).toString('base64')})`,
            backgroundSize: 'cover',
          }}
        />,
        { ...size }
      );
    }

    // Default favicon if none in Sanity
    return new ImageResponse(
      (
        <div
          style={{
            background: '#755f4f',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          SF
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error('Error generating favicon:', error);

    // Fallback favicon on error
    return new ImageResponse(
      (
        <div
          style={{
            background: '#755f4f',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          SF
        </div>
      ),
      { ...size }
    );
  }
}
