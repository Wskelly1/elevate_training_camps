"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "../lib/queries";
import { urlFor } from "../lib/sanity";

interface LogoProps {
  className?: string;
  isFooter?: boolean;
  maxWidth?: number;
}

interface LogoData {
  url: string;
  width: number;
  height: number;
}

/**
 * Logo - Dynamic logo component that fetches logo data from Sanity CMS
 * 
 * This component displays the site logo with proper dimensions and responsive behavior.
 * It can show different logos for header and footer based on Sanity settings.
 * 
 * Features:
 * - Dynamically loads logo from Sanity CMS
 * - Supports different logos for header and footer
 * - Maintains proper aspect ratio
 * - Handles loading states and errors
 * - Allows customization of max width
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {boolean} [props.isFooter=false] - Whether to show footer logo variant
 * @param {number} [props.maxWidth] - Maximum width constraint for the logo
 */
export default function Logo({ className = "", isFooter = false, maxWidth }: LogoProps) {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    async function loadLogo() {
      try {
        const settings = await getSiteSettings();
        
        const logoImage = isFooter && settings.footerLogo ? settings.footerLogo : settings.logo;
        
        if (logoImage?.asset?.metadata?.dimensions) {
          const { dimensions } = logoImage.asset.metadata;
          const logoUrl = urlFor(logoImage).url();
          
          let finalWidth = dimensions.width;
          let finalHeight = dimensions.height;

          if (maxWidth && maxWidth < finalWidth) {
            const aspectRatio = dimensions.height / dimensions.width;
            finalWidth = maxWidth;
            finalHeight = finalWidth * aspectRatio;
          }

          setLogoData({
            url: logoUrl,
            width: finalWidth,
            height: finalHeight,
          });
        } else {
          console.warn("Logo image metadata missing or incomplete");
          setError("Logo metadata missing");
        }
      } catch (error) {
        console.error("Error loading logo:", error);
        setError(error instanceof Error ? error.message : "Unknown error loading logo");
      } finally {
        setIsLoading(false);
      }
    }

    loadLogo();
  }, [isFooter, maxWidth]);

  // Only render on client-side to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-12 w-[180px]"></div>;
  }

  // Display error message in development
  if (process.env.NODE_ENV === 'development' && error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading logo: {error}
      </div>
    );
  }

  if (isLoading) {
    return <div className="h-12 bg-gray-200 animate-pulse rounded-md" style={{ width: maxWidth || 180 }}></div>;
  }

  if (!logoData) {
    return (
      <Link href="/" className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
        <div className="font-bold text-lg">
          Elevate Training Camps
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <div className="logo-container">
        <Image 
          src={logoData.url} 
          alt="Elevate Training Camps Logo" 
          width={logoData.width}
          height={logoData.height}
          style={{ 
            maxHeight: '60px',
            width: 'auto',
            objectFit: 'contain'
          }}
          priority 
          className="opacity-100 transition-opacity duration-300"
        />
      </div>
    </Link>
  );
} 