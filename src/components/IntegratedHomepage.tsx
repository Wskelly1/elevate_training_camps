'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SanityHomePage, SanityContentSection } from '../lib/types';
import { urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';

interface IntegratedHomepageProps {
  data: SanityHomePage;
}

/**
 * IntegratedHomepage - Advanced interactive homepage component with scroll animations
 *
 * This component creates a dynamic, scroll-driven homepage experience with:
 * - Full-screen background image
 * - Video that expands on scroll
 * - Static content sections below
 */
const IntegratedHomepage: React.FC<IntegratedHomepageProps> = ({ data }) => {
  // Animation states
  const [initialPhase, setInitialPhase] = useState<boolean>(true); // Initial phase (video not visible yet)
  const [videoExpanded, setVideoExpanded] = useState<boolean>(false); // Whether video has reached full screen
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false); // Whether video has loaded
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0 to 1 for video expansion
  const [canScrollPage, setCanScrollPage] = useState<boolean>(false); // Whether regular page scrolling is enabled
  const [virtualScrollY, setVirtualScrollY] = useState<number>(0); // Virtual scroll position

  // Refs
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);

  // Window dimensions for responsive sizing
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Track last scroll position for direction detection
  const prevScrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const navDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastNavVisibility = useRef(true);

  // Function to emit custom event for navbar visibility
  const updateNavVisibility = (visible: boolean) => {
    // Only dispatch if there's a change to avoid unnecessary events
    if (lastNavVisibility.current !== visible) {
      const event = new CustomEvent('navVisibility', {
        detail: { visible }
      });
      window.dispatchEvent(event);
      lastNavVisibility.current = visible;
    }
  };

  // Debounced scroll direction handler
  const handleScrollDirectionChange = (scrollY: number) => {
    // Clear existing timer
    if (navDebounceTimer.current) {
      clearTimeout(navDebounceTimer.current);
    }

    // Get scroll direction
    const currentIsScrollingDown = scrollY > prevScrollY.current;

    // Only update if direction changed and we're not at the very top
    if (currentIsScrollingDown !== isScrollingDown && scrollY > 60) {
      setIsScrollingDown(currentIsScrollingDown);

      // For hiding the navbar (scrolling down), apply immediately
      if (currentIsScrollingDown) {
        updateNavVisibility(false);
      } else {
        // For showing navbar (scrolling up), debounce to prevent flicker
        navDebounceTimer.current = setTimeout(() => {
          updateNavVisibility(true);
        }, 150); // Short delay before showing navbar
      }
    } else if (scrollY <= 60) {
      // Always show navbar at the top of the page
      updateNavVisibility(true);
      setIsScrollingDown(false);
    }

    // Update previous scroll position
    prevScrollY.current = scrollY;
  };

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial setup
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Force scroll to top on component mount/page load - using useLayoutEffect for immediate execution
  useLayoutEffect(() => {
    // Reset to top of page on load - this runs synchronously before browser paint
    window.scrollTo(0, 0);

    // Reset all scroll-related states
    setInitialPhase(true);
    setVideoExpanded(false);
    setScrollProgress(0);
    setVirtualScrollY(0);
    setCanScrollPage(false);

    // Also handle beforeunload to store position state
    const handleBeforeUnload = () => {
      // This ensures the next page load starts fresh
      sessionStorage.removeItem('scrollPosition');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Handle wheel and touch events to control scrolling
  useEffect(() => {
    let ticking = false;

    const handleWheelEvent = (e: WheelEvent) => {
      if (!canScrollPage && !videoExpanded) {
        e.preventDefault();

        // Update virtual scroll position
        const newVirtualScrollY = Math.max(0, virtualScrollY + e.deltaY);
        setVirtualScrollY(newVirtualScrollY);

        // Calculate progress for video expansion (0 to 1)
        const expansionThreshold = windowDimensions.height;
        const progress = Math.min(1, newVirtualScrollY / expansionThreshold);
        setScrollProgress(progress);

        // Set video expanded when progress reaches 1
        if (progress >= 1 && !videoExpanded) {
          setVideoExpanded(true);
          setCanScrollPage(true);
          if (videoRef.current) {
            videoRef.current.play().catch(err => console.error('Video play failed:', err));
          }
          // Reset scroll position to top of page when video is fully expanded
          window.scrollTo(0, 0);
          updateNavVisibility(true);
        }

        // Update initial phase
        if (initialPhase && newVirtualScrollY > 10) {
          setInitialPhase(false);
        }
      } else if (canScrollPage) {
        // When regular scrolling is enabled, handle nav visibility
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            handleScrollDirectionChange(currentScrollY);
            ticking = false;
          });
          ticking = true;
        }
      }
    };

    // Handle regular scroll events (for after video is expanded)
    const handleScrollEvent = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (canScrollPage) {
            handleScrollDirectionChange(currentScrollY);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Passive: false is important to be able to prevent default scroll behavior
    window.addEventListener('wheel', handleWheelEvent, { passive: false });
    window.addEventListener('scroll', handleScrollEvent, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('scroll', handleScrollEvent);
      if (navDebounceTimer.current) {
        clearTimeout(navDebounceTimer.current);
      }
    };
  }, [initialPhase, videoExpanded, canScrollPage, virtualScrollY, windowDimensions.height, isScrollingDown]);

  // Handle touch events for mobile
  useEffect(() => {
    let touchStartY = 0;
    let ticking = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canScrollPage && !videoExpanded) {
        // Calculate touch movement
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        touchStartY = touchY;

        // Update virtual scroll position
        const newVirtualScrollY = Math.max(0, virtualScrollY + deltaY);
        setVirtualScrollY(newVirtualScrollY);

        // Calculate progress for video expansion (0 to 1)
        const expansionThreshold = windowDimensions.height;
        const progress = Math.min(1, newVirtualScrollY / expansionThreshold);
        setScrollProgress(progress);

        // Set video expanded when progress reaches 1
        if (progress >= 1 && !videoExpanded) {
          setVideoExpanded(true);
          setCanScrollPage(true);
          if (videoRef.current) {
            videoRef.current.play().catch(err => console.error('Video play failed:', err));
          }
          // Reset scroll position to top of page when video is fully expanded
          window.scrollTo(0, 0);
          updateNavVisibility(true);
        }

        // Update initial phase
        if (initialPhase && newVirtualScrollY > 10) {
          setInitialPhase(false);
        }

        // Prevent default to disable page scrolling during expansion
        e.preventDefault();
      } else if (canScrollPage) {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            handleScrollDirectionChange(currentScrollY);
            ticking = false;
          });
          ticking = true;
        }
      }
    };

    const handleTouchEnd = () => {
      if (canScrollPage) {
        // Handle any scroll momentum after touch ends
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            handleScrollDirectionChange(currentScrollY);
            ticking = false;
          });
          ticking = true;
        }
      }
    };

    // Add touch event listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [initialPhase, videoExpanded, canScrollPage, virtualScrollY, windowDimensions.height, isScrollingDown]);

  // Force navbar to be visible initially
  useEffect(() => {
    updateNavVisibility(true);
    return () => {
      // Make sure navbar is visible when component unmounts
      updateNavVisibility(true);
    };
  }, []);

  // Preload video
  useEffect(() => {
    if (videoRef.current && data.expandMediaType === 'video' && data.expandMediaSrc?.asset.url) {
      videoRef.current.preload = 'auto';
      videoRef.current.load();

      const handleCanPlayThrough = () => {
        setVideoLoaded(true);
      };

      videoRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        }
      };
    }
  }, [data.expandMediaType, data.expandMediaSrc?.asset.url]);

  // Video dimensions based on scroll progress
  const navBarHeight = 80; // Approximate height of nav bar
  const navBarMargin = 16; // Top margin (4 units = 16px)
  const totalNavSpace = navBarHeight + navBarMargin; // Total space taken by navbar
  const sideMargin = 32; // Side margins
  const topMargin = 48 + totalNavSpace; // Top margin including navbar space
  const bottomMargin = 32; // Bottom margin

  // Calculate maximum dimensions while maintaining aspect ratio
  const aspectRatio = 16 / 9; // Standard 16:9 video aspect ratio
  const maxVideoWidth = Math.min(windowDimensions.width - (sideMargin * 2), windowDimensions.height * aspectRatio * 0.8);
  const maxVideoHeight = maxVideoWidth / aspectRatio;

  // Calculate video dimensions maintaining aspect ratio
  const initialVideoWidth = 320;
  const initialVideoHeight = initialVideoWidth / aspectRatio; // Approx 180 for 16:9
  const videoWidth = initialVideoWidth + (scrollProgress * (maxVideoWidth - initialVideoWidth));
  const videoHeight = videoWidth / aspectRatio; // Maintain aspect ratio

  // Text animation based on scroll progress
  const textTranslateX = scrollProgress * 150;

  // Split title for animation effect
  const firstWord = data.expandTitle ? data.expandTitle.split(' ')[0] : '';
  const restOfTitle = data.expandTitle ? data.expandTitle.split(' ').slice(1).join(' ') : '';

  return (
    <>
      <style jsx global>{`
        body {
          overscroll-behavior-y: none; /* Prevents bounce on scroll */
        }
        .hero-section {
          height: 100vh; /* Just 100vh for the hero section */
          position: relative;
        }
        .video-container {
          padding-top: ${totalNavSpace}px; /* Add padding to account for navbar */
        }
      `}</style>
      <div ref={containerRef} className="relative">
        {/* Hero Section */}
        <div className="hero-section" ref={heroSectionRef}>
          {/* Main Sticky Container for all hero animations */}
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Layer 1: Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={urlFor(data.heroImage).url()}
                alt={data.heroHeading || 'Hero Image'}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Layer 2: All content that appears over the background */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center video-container">
              {/* Initial Hero Text - visible before scroll */}
              {initialPhase && (
                <div className="text-center px-4 text-white pointer-events-none">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                    Elevate Training Camps
                  </h1>
                  <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                    An elevated training experience for all athletes
                  </p>
                  <motion.div
                    className="absolute bottom-10 left-0 right-0 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-white text-xl font-medium animate-bounce pointer-events-auto">
                      Scroll to begin
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Animated content - visible after scroll starts */}
              {data.useScrollExpandMedia && !initialPhase && (
                <>
                  {/* Expanding media element */}
                  <div
                    className="rounded-2xl"
                    style={{
                      position: 'absolute',
                      width: videoWidth,
                      height: videoHeight,
                      overflow: 'hidden',
                      top: `calc(50% + ${totalNavSpace/2}px)`, // Center vertically, adjusted for navbar
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '90vw', // Ensure it doesn't go beyond screen width
                      maxHeight: `calc(90vh - ${totalNavSpace}px)`, // Ensure it doesn't go beyond screen height minus navbar
                    }}
                  >
                    {data.expandMediaType === 'video' ? (
                      <div className="relative w-full h-full pointer-events-none overflow-hidden rounded-xl">
                        <video
                          ref={videoRef}
                          src={data.expandMediaSrc?.asset.url}
                          poster={data.expandPosterSrc ? urlFor(data.expandPosterSrc).url() : undefined}
                          muted
                          loop
                          playsInline
                          preload="auto"
                          className={`w-full h-full object-cover rounded-xl ${
                            videoExpanded ? 'opacity-100' : 'opacity-80'
                          }`}
                          controls={false}
                          disablePictureInPicture
                          disableRemotePlayback
                          style={{
                            objectFit: 'cover',
                            transition: 'opacity 0.3s ease-in-out',
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-black/30 rounded-xl"
                          style={{
                            opacity: 0.5 - scrollProgress * 0.3,
                            transition: 'opacity 0.1s ease-out',
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={urlFor(data.expandMediaImage || data.heroImage).url()}
                          alt={data.expandTitle || 'Media content'}
                          fill
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div
                          className="absolute inset-0 bg-black/50 rounded-xl"
                          style={{
                            opacity: 0.7 - scrollProgress * 0.3,
                            transition: 'opacity 0.1s ease-out',
                          }}
                        />
                      </div>
                    )}

                    {/* Text on top of the media */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20">
                      {data.expandSubtitle && (
                        <p
                          className="text-2xl text-blue-200"
                          style={{
                            transform: `translateX(-${textTranslateX}px)`,
                            opacity: 1 - scrollProgress * 2,
                            transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
                          }}
                        >
                          {data.expandSubtitle}
                        </p>
                      )}
                      {!videoExpanded && data.scrollToExpandText && (
                        <p
                          className="text-blue-200 font-medium text-center"
                          style={{
                            transform: `translateX(${textTranslateX}px)`,
                            opacity: 1 - scrollProgress * 2,
                            transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
                          }}
                        >
                          {data.scrollToExpandText}
                        </p>
                      )}
                      {videoExpanded && (
                        <p className="text-blue-200 font-medium text-center animate-pulse">
                          Continue scrolling to explore
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fading Title */}
                  <div
                    className="flex items-center justify-center text-center gap-4 w-full flex-col mix-blend-difference"
                    style={{
                      position: 'absolute',
                      opacity: 1 - scrollProgress * 1.5,
                      transition: 'opacity 0.2s ease-out',
                      pointerEvents: 'none',
                    }}
                  >
                    <h2
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200"
                      style={{
                        transform: `translateX(-${textTranslateX}px)`,
                        transition: 'transform 0.1s ease-out',
                      }}
                    >
                      {firstWord}
                    </h2>
                    <h2
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200"
                      style={{
                        transform: `translateX(${textTranslateX}px)`,
                        transition: 'transform 0.1s ease-out',
                      }}
                    >
                      {restOfTitle}
                    </h2>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Static Content Sections */}
        <div
          ref={contentSectionRef}
          className={`content-section bg-white relative z-20 ${!canScrollPage ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: canScrollPage ? 'auto' : 'none'
          }}
        >
          {data.contentSections && data.contentSections.length > 0 && (
            <>
              {data.contentSections.map((section, index) => (
                <StaticContentSection
                  key={section._key}
                  section={section}
                  index={index}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * StaticContentSection - Static content section component
 */
const StaticContentSection = ({
  section,
  index
}: {
  section: SanityContentSection;
  index: number;
}) => {
  const sectionImage = section.image ? urlFor(section.image).url() : '';

  return (
    <section
      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
      style={{
        position: 'relative',
        zIndex: 20,
        padding: index === 0 ? '2rem 0 4rem' : '4rem 0', // Less padding for first section
      }}
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          {/* Image */}
          <div className="md:w-1/2">
            {sectionImage && (
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={sectionImage}
                  alt={section.heading || 'Content Image'}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              {section.heading}
            </h2>
            {section.subheading && (
              <h3 className="text-xl md:text-2xl mb-6 text-gray-600">
                {section.subheading}
              </h3>
            )}
            <div className="prose prose-lg max-w-none text-gray-700 mb-6">
              {section.text && <PortableText value={section.text} />}
            </div>
            {section.buttonText && section.buttonLink && (
              <a
                href={section.buttonLink}
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {section.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegratedHomepage;
