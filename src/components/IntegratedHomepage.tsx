'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SanityHomePage, SanityContentSection } from '../lib/types';
import { urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';
import TestimonialsSection from './TestimonialsSection';

interface IntegratedHomepageProps {
  data: SanityHomePage;
}

/**
 * IntegratedHomepage - Advanced interactive homepage component with scroll animations
 */
const IntegratedHomepage: React.FC<IntegratedHomepageProps> = ({ data }) => {
  // Animation states
  const [initialPhase, setInitialPhase] = useState<boolean>(true);
  const [videoExpanded, setVideoExpanded] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [virtualScrollY, setVirtualScrollY] = useState<number>(0);

  // Refs
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    setVideoExpanded(false);
    setScrollProgress(0);
    setVirtualScrollY(0);

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
      if (!videoExpanded) {
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
          setVideoExpanded(true);
          updateNavVisibility(true);
          // Reset scroll position to top when video is fully expanded
          window.scrollTo(0, 0);
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
      if (videoExpanded && !ticking) {
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
  }, [initialPhase, videoExpanded, virtualScrollY, windowDimensions.height, isScrollingDown]);

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
      if (!videoExpanded) {
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
          setVideoExpanded(true);
          updateNavVisibility(true);
          // Reset scroll position to top when video is fully expanded
          window.scrollTo(0, 0);
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
  }, [initialPhase, videoExpanded, virtualScrollY, windowDimensions.height]);

  // Add an effect to handle auto-continuation of expansion if scrolling stops midway
  useEffect(() => {
    // Only run this effect if video is not yet expanded and we're past initial phase
    if (!videoExpanded && !initialPhase && scrollProgress > 0 && scrollProgress < 1) {
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
                  setVideoExpanded(true);
                  updateNavVisibility(true);
                  window.scrollTo(0, 0);
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
  }, [videoExpanded, initialPhase, scrollProgress, virtualScrollY, windowDimensions.height]);

  // Simple effect to prevent page scrolling during video expansion
  useEffect(() => {
    if (!videoExpanded) {
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
  }, [videoExpanded]);

  // Force navbar to be visible initially
  useEffect(() => {
    updateNavVisibility(true);
    return () => {
      // Make sure navbar is visible when component unmounts
      updateNavVisibility(true);
    };
  }, []);

  // Preload video - with better error handling
  useEffect(() => {
    if (videoRef.current && data.expandMediaType === 'video' && data.expandMediaSrc?.asset.url) {
      try {
        // Set multiple sources for better browser compatibility
        videoRef.current.preload = 'metadata'; // Start with metadata only to speed up initial load

        // Add error handling for video loading
        const handleError = (e: ErrorEvent) => {
          console.error('Video loading error:', e);
          setVideoLoaded(false);
          setVideoError(true); // Set videoError to true on error
        };

        // Listen for video errors
        videoRef.current.addEventListener('error', handleError as EventListener);

        // Start loading the video
        videoRef.current.load();

        const handleCanPlayThrough = () => {
          setVideoLoaded(true);
          console.log('Video preloaded successfully');

          // Once metadata is loaded, we can switch to auto preload for the full video
          if (videoRef.current) {
            videoRef.current.preload = 'auto';
          }
        };

        videoRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

        return () => {
          if (videoRef.current) {
            try {
              videoRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
              videoRef.current.removeEventListener('error', handleError as EventListener);
            } catch (err) {
              console.error('Error removing video event listeners:', err);
            }
          }
        };
      } catch (err) {
        console.error('Error preloading video:', err);
        setVideoLoaded(false);
      }
    }
  }, [data.expandMediaType, data.expandMediaSrc?.asset.url]);

  // Handle video playback when expanded
  useEffect(() => {
    if (!videoRef.current) return;

    // Reset video when component mounts
    videoRef.current.currentTime = 0;

    if (videoExpanded && !videoError) {
      try {
        // Set video quality options to reduce glitches
        if ('mediaSettings' in videoRef.current) {
          try {
            // @ts-ignore - This is a non-standard property
            videoRef.current.mediaSettings = {
              preferredVideoQuality: 'standard'
            };
          } catch (e) {
            console.log('Media settings not supported');
          }
        }

        // Unmute when expanded
        videoRef.current.muted = false;

        // Try to play the video when expanded
        const playPromise = videoRef.current.play();

        // Handle the play promise properly
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playback started successfully');
              setVideoLoaded(true);
            })
            .catch(err => {
              console.error('Error playing video:', err);

              // If autoplay is prevented, we'll try again with muted
              if (err.name === 'NotAllowedError') {
                console.log('Autoplay prevented. Trying with muted option...');
                videoRef.current!.muted = true;
                videoRef.current!.play().catch(e => {
                  console.error('Failed to play even with muted option:', e);
                  setVideoError(true);
                });
              } else {
                setVideoError(true);
              }
            });
        }
      } catch (err) {
        console.error('Exception during video playback:', err);
        setVideoError(true);
      }
    } else {
      // When not expanded, ensure video is muted and paused if needed
      if (videoRef.current) {
        videoRef.current.muted = true;

        // Only pause if it's actually playing
        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    }

    // Cleanup function
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
  }, [videoExpanded, videoError]);

  // Ensure loading indicator is hidden when video is playing
  useEffect(() => {
    if (videoRef.current) {
      const checkVideoPlaying = () => {
        if (videoRef.current && !videoRef.current.paused && videoRef.current.currentTime > 0) {
          setVideoLoaded(true);
        }
      };

      // Check immediately
      checkVideoPlaying();

      // Set up periodic checks
      const intervalId = setInterval(checkVideoPlaying, 500);

      return () => clearInterval(intervalId);
    }
  }, [videoExpanded]);

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
                        {!videoLoaded && !videoError && !videoRef.current?.currentTime && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                              <p>Loading video...</p>
                            </div>
                          </div>
                        )}
                        {videoError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <div className="text-white text-center">
                              <p>Failed to load video. Showing poster.</p>
                              <Image
                                src={data.expandPosterSrc ? urlFor(data.expandPosterSrc).url() : urlFor(data.heroImage).url()}
                                alt="Video Poster"
                                width={300}
                                height={200}
                                className="mt-4 rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                        <video
                          ref={videoRef}
                          poster={data.expandPosterSrc ? urlFor(data.expandPosterSrc).url() : undefined}
                          muted={!videoExpanded} // Only muted until expanded
                          loop
                          playsInline
                          preload="auto"
                          autoPlay={videoExpanded} // Autoplay when expanded
                          controls={videoExpanded} // Show native controls when expanded
                          className={`w-full h-full object-cover rounded-xl ${
                            videoExpanded ? 'opacity-100' : 'opacity-80'
                          }`}
                          disablePictureInPicture={false}
                          disableRemotePlayback={false}
                          style={{
                            objectFit: 'cover',
                            transition: 'opacity 0.3s ease-in-out',
                          }}
                          onLoadedData={() => {
                            setVideoLoaded(true);
                            console.log('Video loaded data successfully');
                          }}
                          onCanPlay={() => {
                            setVideoLoaded(true);
                            console.log('Video can play now');
                          }}
                          onError={(e) => {
                            console.error('Video error event:', e);
                            setVideoLoaded(false);
                            setVideoError(true); // Set videoError to true on error
                          }}
                        >
                          {/* Add source elements for better browser compatibility */}
                          <source src={data.expandMediaSrc?.asset.url} type="video/mp4" />
                          {/* Fallback text if video fails */}
                          Your browser does not support the video tag.
                        </video>
                        <div
                          className="absolute inset-0 bg-black/30 rounded-xl pointer-events-none"
                          style={{
                            opacity: 0.5 - scrollProgress * 0.3,
                            transition: 'opacity 0.1s ease-out',
                            display: videoExpanded ? 'none' : 'block', // Hide overlay when video is expanded
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
                      {videoExpanded && data.expandMediaType !== 'video' && (
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
          className={`content-section bg-white relative z-20 ${!videoExpanded ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: videoExpanded ? 'auto' : 'none'
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

          {/* Testimonials Section */}
          <TestimonialsSection testimonials={data.testimonials} />
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
