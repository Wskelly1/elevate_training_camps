'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SanityHomePage, SanityContentSection } from '../lib/types';
import { urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';
import TestimonialsSection from './TestimonialsSection';
import SanityVideo from './SanityVideo';

interface IntegratedHomepageProps {
  data: SanityHomePage;
}

/**
 * IntegratedHomepage - Advanced interactive homepage component with scroll animations
 */
const IntegratedHomepage: React.FC<IntegratedHomepageProps> = ({ data }) => {
  // Animation states
  const [initialPhase, setInitialPhase] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [virtualScrollY, setVirtualScrollY] = useState<number>(0);
  const [isVideoExpanded, setIsVideoExpanded] = useState<boolean>(false);

  // Debug log the video data
  console.log('Homepage data:', data);
  console.log('Video source data:', data.expandMediaSrc);
  console.log('Video type:', data.expandMediaType);

  // Refs
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const lastScrollDeltaRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);

  // Track last scroll position for direction detection
  const prevScrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const navDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastNavVisibility = useRef(true);

  // Window dimensions for responsive sizing
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

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
        }, 150);
      }
    } else if (scrollY <= 60) {
      // Always show navbar at the top of the page
      updateNavVisibility(true);
      setIsScrollingDown(false);
    }

    // Update previous scroll position
    prevScrollY.current = scrollY;
  };

  // Add explicit check for control elements to prevent scroll handling from interfering
  const isControlElement = (element: HTMLElement | null): boolean => {
    if (!element) return false;

    // Check if element is a navigation link or control
    const isNavLink = element.tagName === 'A' ||
                     element.closest('a') !== null ||
                     element.closest('[role="menuitem"]') !== null ||
                     element.closest('[data-radix-navigation-menu-item]') !== null;

    const isVideoControl = element.tagName === 'VIDEO' ||
                          element.classList.contains('video-control') ||
                          element.closest('video') !== null ||
                          element.tagName === 'BUTTON' ||
                          element.tagName === 'INPUT';

    const isHeaderElement = element.closest('header') !== null ||
                           element.closest('[role="banner"]') !== null;

    return isNavLink || isVideoControl || isHeaderElement;
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
    setScrollProgress(0);
    setVirtualScrollY(0);
    setIsVideoExpanded(false);

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
      // Don't interfere with navigation or controls
      if (isControlElement(e.target as HTMLElement)) {
        return;
      }

      // If video isn't fully expanded, handle video expansion
      if (!isVideoExpanded) {
        e.preventDefault();

        // Mark that we're actively scrolling
        isScrollingRef.current = true;

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Store the direction and magnitude of scroll
        lastScrollDeltaRef.current = e.deltaY;

        // Update virtual scroll position
        const newVirtualScrollY = Math.max(0, virtualScrollY + e.deltaY);
        setVirtualScrollY(newVirtualScrollY);

        // Calculate progress for video expansion (0 to 1)
        const expansionThreshold = windowDimensions.height;
        const progress = Math.min(1, newVirtualScrollY / expansionThreshold);
        setScrollProgress(progress);

        // Update initial phase
        if (initialPhase && newVirtualScrollY > 10) {
          setInitialPhase(false);
        }

        // Set video expanded when progress reaches 1
        if (progress >= 1) {
          setIsVideoExpanded(true);
          updateNavVisibility(true);
          // Reset scroll position to top when video is fully expanded
          window.scrollTo(0, 0);
          // Allow scrolling when video is expanded
          document.body.style.overflow = 'auto';
        }

        // Set a timeout to detect when scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      } else {
        // Video is expanded, allow normal scrolling with navbar management
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

    // Handle regular scroll events - just for navbar control when video is expanded
    const handleScrollEvent = () => {
      if (isVideoExpanded && !ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          handleScrollDirectionChange(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('wheel', handleWheelEvent, { passive: false });
    window.addEventListener('scroll', handleScrollEvent, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('scroll', handleScrollEvent);
      if (navDebounceTimer.current) {
        clearTimeout(navDebounceTimer.current);
      }
    };
  }, [initialPhase, isVideoExpanded, virtualScrollY, windowDimensions.height, isScrollingDown]);

  // Handle touch events for mobile
  useEffect(() => {
    let touchStartY = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      // Don't interfere with navigation or controls
      if (isControlElement(e.target as HTMLElement)) {
        return;
      }
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Don't interfere with navigation or controls
      if (isControlElement(e.target as HTMLElement)) {
        return;
      }

      const currentTouchY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;

      // If video isn't fully expanded, handle video expansion
      if (!isVideoExpanded) {
        e.preventDefault();

        // Mark that we're actively scrolling
        isScrollingRef.current = true;

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Store the direction and magnitude of scroll
        lastScrollDeltaRef.current = deltaY;

        // Update virtual scroll position
        const newVirtualScrollY = Math.max(0, virtualScrollY + deltaY);
        setVirtualScrollY(newVirtualScrollY);

        // Calculate progress for video expansion (0 to 1)
        const expansionThreshold = windowDimensions.height;
        const progress = Math.min(1, newVirtualScrollY / expansionThreshold);
        setScrollProgress(progress);

        // Update initial phase
        if (initialPhase && newVirtualScrollY > 10) {
          setInitialPhase(false);
        }

        // Set video expanded when progress reaches 1
        if (progress >= 1) {
          setIsVideoExpanded(true);
          updateNavVisibility(true);
          // Reset scroll position to top when video is fully expanded
          window.scrollTo(0, 0);
          // Allow scrolling when video is expanded
          document.body.style.overflow = 'auto';
        }

        // Set a timeout to detect when scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [initialPhase, isVideoExpanded, virtualScrollY, windowDimensions.height]);

  // Add an effect to handle auto-continuation of expansion if scrolling stops midway
  useEffect(() => {
    // Only run this effect if video is not yet expanded and we're past initial phase
    if (!isVideoExpanded && !initialPhase && scrollProgress > 0 && scrollProgress < 1) {
      // Set up a check to see if scrolling has stopped but expansion isn't complete
      const continueExpansionTimeout = setTimeout(() => {
        if (!isScrollingRef.current && scrollProgress < 1) {
          // If we were scrolling down (positive delta), continue expanding
          if (lastScrollDeltaRef.current > 0) {
            // Calculate how much more virtual scroll is needed to complete
            const expansionThreshold = windowDimensions.height;
            const remainingScroll = expansionThreshold - virtualScrollY;

            // Animate the remaining expansion over time
            const animateExpansion = () => {
              setVirtualScrollY(prev => {
                const newValue = prev + 10; // Increment by small amount each frame
                const progress = Math.min(1, newValue / expansionThreshold);
                setScrollProgress(progress);

                // Check if we're done expanding
                if (progress >= 1) {
                  setIsVideoExpanded(true);
                  updateNavVisibility(true);
                  window.scrollTo(0, 0);
                  // Allow scrolling when video is expanded
                  document.body.style.overflow = 'auto';
                  return newValue;
                }

                // Continue animation if not done
                if (newValue < expansionThreshold) {
                  requestAnimationFrame(animateExpansion);
                }

                return newValue;
              });
            };

            // Start the animation
            requestAnimationFrame(animateExpansion);
        }
        }
      }, 500); // Wait a bit to ensure user has actually stopped scrolling

      return () => clearTimeout(continueExpansionTimeout);
    }
  }, [isVideoExpanded, initialPhase, scrollProgress, virtualScrollY, windowDimensions.height]);

  // Simple effect to prevent page scrolling during video expansion
  useEffect(() => {
    if (!isVideoExpanded) {
      // Prevent any scroll during video expansion
      document.body.style.overflow = 'hidden';
    } else {
      // Allow scrolling when video is expanded
      document.body.style.overflow = 'auto';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVideoExpanded]);

  // Force navbar to be visible initially
  useEffect(() => {
    updateNavVisibility(true);
    return () => {
      // Make sure navbar is visible when component unmounts
      updateNavVisibility(true);
    };
  }, []);

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
                      <div className="relative w-full h-full overflow-hidden rounded-xl">
                        <SanityVideo
                          videoSrc={data.expandMediaSrc}
                          posterSrc={data.expandPosterSrc}
                          fallbackImage={data.heroImage}
                          title={data.expandTitle || 'Training Camp Video'}
                          autoPlay={false}
                          muted={!isVideoExpanded} // Muted until expanded
                          loop={true}
                          controls={isVideoExpanded} // Show controls when expanded
                          lazy={true}
                          objectFit="cover"
                          className="!pb-0 !h-full !w-full"
                          onLoadedData={() => {
                            console.log('Video loaded data successfully');
                          }}
                          onError={(e) => {
                            console.error('Video error event:', e);
                          }}
                          onPlay={() => {
                            console.log('Video started playing');
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-black/30 rounded-xl pointer-events-none"
                          style={{
                            opacity: 0.5 - scrollProgress * 0.3,
                            transition: 'opacity 0.1s ease-out',
                            display: isVideoExpanded ? 'none' : 'block', // Hide overlay when video is expanded
                          }}
                        />
                      </div>
                    ) : (
                      // Existing image rendering code...
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 pointer-events-none">
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
                      {!isVideoExpanded && data.scrollToExpandText && (
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
                      {isVideoExpanded && data.expandMediaType !== 'video' && (
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

            {/* Scroll to begin text - positioned at bottom of hero image */}
            {initialPhase && (
              <motion.div
                className="absolute bottom-8 left-0 right-0 text-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white text-xl font-medium animate-bounce pointer-events-auto">
                  Scroll to begin
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Static Content Sections */}
        <div
          ref={contentSectionRef}
          className={`content-section relative z-20 ${!isVideoExpanded ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: isVideoExpanded ? 'auto' : 'none'
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
          {/* Testimonials Section wrapped with alternating cream background */}
          <section
            className="bg-[#fff9eb]"
            style={{ position: 'relative', zIndex: 20, padding: '4rem 0' }}
          >
            <div className="container mx-auto px-4">
              <TestimonialsSection testimonials={data.testimonials} />
            </div>
          </section>
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
      className={`${(() => {
        const creams = ['bg-[#fff9eb]', 'bg-[#f2f0eb]', 'bg-[#f7f2e7]', 'bg-[#f0ead6]'];
        const defaultBg = creams[index % creams.length];
        const heading = (section?.heading as string | undefined)?.toLowerCase?.() || '';
        if (heading.includes('who we serve')) {
          return 'bg-[#fff9eb]';
        }
        return defaultBg;
      })()}`}
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
