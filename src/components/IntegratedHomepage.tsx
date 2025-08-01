'use client';

import { useRef, useState, useEffect } from 'react';
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
  const [isExpanding, setIsExpanding] = useState<boolean>(false); // Whether video is currently expanding

  // Refs
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Window dimensions for responsive sizing
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

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

  // Handle scroll events
  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;
    let scrollLocked = false;
    let expansionStartY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If we're in the locked expansion phase, prevent actual page scrolling
      if (scrollLocked) {
        // Force the page back to the expansion start position
        window.scrollTo(0, expansionStartY);
        return;
      }

      // Calculate how far we've scrolled within the hero section
      const heroHeight = windowDimensions.height; // Hero section is 100vh
      const scrollThreshold = heroHeight * 0.2; // Start expansion at 20% scroll

      // Check if we've reached the expansion trigger point
      if (currentScrollY > scrollThreshold && currentScrollY < heroHeight && !scrollLocked && !videoExpanded) {
        // We've hit the expansion trigger point - lock scroll and start expansion
        scrollLocked = true;
        expansionStartY = scrollThreshold;
        document.body.classList.add('video-expanding');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollThreshold}px`;
        setIsExpanding(true);

        // Exit initial phase once expansion begins
        if (initialPhase) {
          setInitialPhase(false);
        }

        // Start the controlled expansion animation
        startExpansionAnimation();
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Normal scroll behavior outside expansion zone
          if (currentScrollY < scrollThreshold) {
            setScrollProgress(0);
            setIsExpanding(false);
          } else if (currentScrollY >= heroHeight && !videoExpanded) {
            // User has scrolled past the hero section before expansion completes
            // This shouldn't happen with our lock, but handle it just in case
            completeExpansion();
          }

          ticking = false;
        });

        ticking = true;
      }

      lastScrollY = currentScrollY;
    };

    // Function to animate the video expansion
    const startExpansionAnimation = () => {
      let progress = 0;
      const duration = 1000; // 1 second expansion
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        progress = Math.min(elapsed / duration, 1);

        setScrollProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          completeExpansion();
        }
      };

      requestAnimationFrame(animate);
    };

    // Function to complete the expansion and unlock scrolling
    const completeExpansion = () => {
      scrollLocked = false;
      setScrollProgress(1);
      setIsExpanding(false);
      setVideoExpanded(true);

      // Unlock the scroll
      document.body.classList.remove('video-expanding');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';

      // Restore scroll position to after the hero section
      const heroHeight = windowDimensions.height;
      window.scrollTo(0, heroHeight);

      // Play the video
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.error("Video play failed:", err));
      }
    };

    // Handle wheel events - completely prevent during expansion
    const handleWheel = (event: WheelEvent) => {
      if (isExpanding || scrollLocked) {
        event.preventDefault();
        return false;
      }
    };

    // Handle touch events for mobile
    const handleTouchMove = (event: TouchEvent) => {
      if (isExpanding || scrollLocked) {
        event.preventDefault();
      }
    };

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isExpanding || scrollLocked) {
        // Prevent arrow keys, space, page up/down during expansion
        if (['ArrowDown', 'ArrowUp', ' ', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    // Initial call to set correct state based on current scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);

      // Clean up any locks that might be active
      document.body.classList.remove('video-expanding');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [initialPhase, videoExpanded, windowDimensions.height, isExpanding]);

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
  const sideMargin = 32; // Side margins
  const topMargin = 48; // Top margin
  const bottomMargin = 32; // Bottom margin

  const maxVideoWidth = windowDimensions.width - (sideMargin * 2);
  const maxVideoHeight = windowDimensions.height - navBarHeight - topMargin - bottomMargin;

  // Calculate video dimensions
  const initialVideoWidth = 300;
  const initialVideoHeight = 400;
  const videoWidth = initialVideoWidth + (scrollProgress * (maxVideoWidth - initialVideoWidth));
  const videoHeight = initialVideoHeight + (scrollProgress * (maxVideoHeight - initialVideoHeight));

  // Text animation based on scroll progress
  const textTranslateX = scrollProgress * 150;

  // Split title for animation effect
  const firstWord = data.expandTitle ? data.expandTitle.split(' ')[0] : '';
  const restOfTitle = data.expandTitle ? data.expandTitle.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <div className="hero-section" ref={heroSectionRef}>
        {/* Background Image */}
        <div className="hero-background">
          <Image
            src={urlFor(data.heroImage).url()}
            alt={data.heroHeading || "Hero Image"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          {/* Initial instruction to scroll */}
          {initialPhase && (
            <motion.div
              className="absolute bottom-10 left-0 right-0 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white text-xl font-medium animate-bounce">
                Scroll to begin
              </p>
            </motion.div>
          )}

          {/* Initial Hero Text - Only visible before scrolling starts */}
          {initialPhase && (
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                Elevate Training Camps
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                An elevated training experience for all athletes
              </p>
            </div>
          )}

          {/* Video Container - Appears on scroll */}
          {data.useScrollExpandMedia && !initialPhase && (
            <div
              className="absolute z-10 rounded-2xl media-container"
              style={{
                width: videoWidth,
                height: videoHeight,
                top: `${navBarHeight + topMargin + (windowDimensions.height - navBarHeight - topMargin - bottomMargin - videoHeight) / 2}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                overflow: 'hidden'
              }}
            >
              {data.expandMediaType === 'video' ? (
                <div className="relative w-full h-full pointer-events-none overflow-hidden rounded-xl">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    src={data.expandMediaSrc?.asset.url}
                    poster={data.expandPosterSrc ? urlFor(data.expandPosterSrc).url() : undefined}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className={`w-full h-full object-cover rounded-xl ${videoExpanded ? 'opacity-100' : 'opacity-80'}`}
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    style={{
                      objectFit: 'cover',
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />

                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-black/30 rounded-xl"
                    style={{
                      opacity: 0.5 - scrollProgress * 0.3,
                      transition: 'opacity 0.1s ease-out'
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
                      transition: 'opacity 0.1s ease-out'
                    }}
                  />
                </div>
              )}

              {/* Video Title Text */}
              <div className="flex flex-col items-center text-center relative z-10 mt-4">
                {data.expandSubtitle && (
                  <p
                    className="text-2xl text-blue-200"
                    style={{
                      transform: `translateX(-${textTranslateX}px)`,
                      transition: 'transform 0.1s ease-out'
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
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    {data.scrollToExpandText}
                  </p>
                )}

                {/* Expansion progress indicator */}
                {isExpanding && !videoExpanded && (
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center text-blue-200">
                      <span className="text-sm mb-2">Expanding video...</span>
                      <div className="w-32 h-1 bg-blue-200/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-200 rounded-full"
                          style={{ width: `${scrollProgress * 100}%` }}
                        />
                      </div>
                      <span className="text-xs mt-2 opacity-75">
                        Please wait
                      </span>
                    </div>
                  </motion.div>
                )}

                {videoExpanded && (
                  <p className="text-blue-200 font-medium text-center animate-pulse">
                    Continue scrolling
                  </p>
                )}

                {/* Scroll indicator when video expansion is complete */}
                {videoExpanded && (
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex flex-col items-center text-blue-200">
                      <span className="text-sm mb-1 font-bold">Video Expanded</span>
                      <span className="text-sm mb-1">Scroll to continue</span>
                      <motion.div
                        className="w-6 h-10 border-2 border-blue-200 rounded-full flex justify-center"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <motion.div
                          className="w-1 h-3 bg-blue-200 rounded-full mt-2"
                          animate={{ y: [0, 12, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Title Animation */}
          {data.useScrollExpandMedia && !initialPhase && (
            <div
              className="flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col mix-blend-difference"
              style={{
                opacity: 1 - scrollProgress,
                transition: 'opacity 0.2s ease-out'
              }}
            >
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200"
                style={{
                  transform: `translateX(-${textTranslateX}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {firstWord}
              </h2>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200"
                style={{
                  transform: `translateX(${textTranslateX}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {restOfTitle}
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* Static Content Sections */}
      {data.contentSections && data.contentSections.length > 0 && (
        <div className="content-section">
          {data.contentSections.map((section, index) => (
            <StaticContentSection
              key={section._key}
              section={section}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
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
        padding: index === 0 ? '2rem 0 4rem' : '4rem 0' // Less padding for first section
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
