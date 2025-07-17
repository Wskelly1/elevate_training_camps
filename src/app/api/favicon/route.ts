import { getSiteSettings } from '../../../lib/queries';
import { urlFor } from '../../../lib/sanity';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    
    if (settings?.favicon) {
      // Generate URL for favicon at 32x32 pixels
      const faviconUrl = urlFor(settings.favicon).width(32).height(32).format('png').url();
      
      // Fetch the favicon image
      const response = await fetch(faviconUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch favicon');
      }
      
      // Get the image as an array buffer
      const imageData = await response.arrayBuffer();
      
      // Return the image as a response
      return new Response(imageData, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    
    // If no favicon in Sanity, redirect to the icon endpoint
    return NextResponse.redirect(new URL('/icon', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error generating favicon:', error);
    // If error, redirect to the icon endpoint
    return NextResponse.redirect(new URL('/icon', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  }
} 