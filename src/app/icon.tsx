import { getSiteSettings } from '../lib/queries';
import { urlFor } from '../lib/sanity';
import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
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