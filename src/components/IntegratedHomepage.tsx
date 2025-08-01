'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
 * - Animated hero section with expandable media (video or image)
 * - Scroll-based animations and transitions
 * - Content sections that appear as the user scrolls
 * - Responsive navigation visibility based on scroll position
 *
 * Features:
 * - Multi-phase animation sequence (entry, expand, exit)
 * - Custom scroll handling for both mouse wheel and touch events
 * - Dynamic navigation visibility control via custom events
 * - Smooth transitions between animation states
 * - Support for both video and image media types
 *
 * @param {Object} props - Component props
 * @param {SanityHomePage} props.data - Homepage data from Sanity CMS
 */
const IntegratedHomepage: React.FC<IntegratedHomepageProps> = ({ data }) => {
  // Animation phases
  const [initialPhase, setInitialPhase] = useState<boolean>(true); // Initial phase (media not visible yet)
  const [entryProgress, setEntryProgress] = useState<number>(0); // Progress of entry animation (0 to 1)
  const [entryComplete, setEntryComplete] = useState<boolean>(false); // Entry animation complete

  // Scroll-expand functionality states
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollStarted, setScrollStarted] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  // Content sections integration states
  const [contentSectionsVisible, setContentSectionsVisible] = useState<boolean>(false);
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);

  // Refs for the different sections
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollProgressRef = useRef<number>(0); // Track previous scroll position for direction detection
  const lastContentScrollTopRef = useRef<number>(0); // Track content section scroll position

  // Check initial scroll position on page load
  useEffect(() => {
    const handleInitialScrollPosition = () => {
      // If page is loaded scrolled down, set all animations to completed state
      if (window.scrollY > window.innerHeight / 2) {
        // Set all animation phases to completed
        setInitialPhase(false);
        setEntryProgress(1);
        setEntryComplete(true);
        setScrollProgress(EXIT_END);
        setScrollStarted(true);
        setContentSectionsVisible(true);
        setAnimationCompleted(true);

        // Also make sure video is in correct state if it's a video
        if (videoRef.current && data.expandMediaType === 'video') {
          videoRef.current.currentTime = 0;
          setVideoLoaded(true);
        }

        // Allow normal page scrolling
        document.body.style.overflow = 'auto';
      }
    };

    // Run on initial load
    handleInitialScrollPosition();

    // Also run when page is resized (in case user resizes while scrolled down)
    window.addEventListener('resize', handleInitialScrollPosition);

    return () => {
      window.removeEventListener('resize', handleInitialScrollPosition);
    };
  }, [data.expandMediaType]);

  // Animation constants
  const EXPAND_END = 1;
  const STICK_DURATION = 0; // Removed stickiness for a smooth transition
  const EXIT_DURATION = 1;
  const STICK_END = EXPAND_END + STICK_DURATION;
  const EXIT_END = STICK_END + EXIT_DURATION;

  // Derived animation values from scrollProgress
  const expansionProgress = Math.min(scrollProgress, EXPAND_END);
  const hasStartedExiting = scrollProgress > STICK_END;
  const exitProgress = hasStartedExiting
    ? (scrollProgress - STICK_END) / EXIT_DURATION
    : 0;

  // Media dimensions based on scroll progress
  const mediaWidth = 300 + expansionProgress * 1250;
  const mediaHeight = 400 + expansionProgress * 400;
  const textTranslateX = expansionProgress * 150;

  // Entry animation positions (for sliding up from bottom)
  const entryTranslateY = initialPhase ? 100 - (entryProgress * 100) : 0;

  // Media position based on exit progress (for scrolling up and off screen)
  const mediaTranslateY = -100 * exitProgress;

  // Content sections position (slide up from bottom as video exits)
  const contentSectionsTranslateY = contentSectionsVisible
    ? 0
    : hasStartedExiting
    ? 100 - exitProgress * 100
    : 100;

  const contentSectionsOpacity = contentSectionsVisible
    ? 1
    : hasStartedExiting
    ? exitProgress
    : 0;

  // Ensure content sections align with the main page when animation is completed
  const finalContentSectionsTranslateY = animationCompleted ? 0 : contentSectionsTranslateY;

  // Split title for animation effect
  const firstWord = data.expandTitle ? data.expandTitle.split(' ')[0] : '';
  const restOfTitle = data.expandTitle ? data.expandTitle.split(' ').slice(1).join(' ') : '';

  // Scroll animation for content sections
  const { scrollYProgress } = useScroll({
    target: contentSectionsRef,
    container: scrollableContainerRef,
    offset: ['start start', 'end end'],
  });

  // Handle all animation and scroll events
  useEffect(() => {
    // --- Wheel Handler ---
    const handleWheel = (e: WheelEvent) => {
      const scrollDelta = e.deltaY;

      // 1. Page Scroll Mode
      if (animationCompleted) {
        if (scrollDelta < 0) {
          const heroRect = heroSectionRef.current?.getBoundingClientRect();
          if (heroRect && heroRect.top >= -10) {
            e.preventDefault();
            setAnimationCompleted(false);
            setContentSectionsVisible(true);
            // Ensure we're at the bottom of content sections
            setTimeout(() => {
              if (scrollableContainerRef.current) {
                scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
              }
            }, 0);
          }
        }
        return;
      }

      // 2. Content Sections Scroll Mode
      if (contentSectionsVisible) {
        const container = scrollableContainerRef.current;
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Small buffer for smooth transition

          if (scrollDelta > 0 && isAtBottom) {
            // Transition to main page scroll when we're at the bottom of content
            setAnimationCompleted(true);
            return;
          } else if (scrollDelta < 0 && scrollTop <= 0) {
            e.preventDefault();
            setContentSectionsVisible(false);
            setScrollProgress(EXIT_END);
          } else {
            // Allow normal scrolling within the container
            return;
          }
        }
        return;
      }

      e.preventDefault();

      // 3. Main Animation Sequence (Entry -> Expand -> Stick -> Exit)
      if (initialPhase) {
        // Handle entry
        const newEntryProgress = entryProgress + scrollDelta * 0.0007; // Faster synchronized speed
        const clampedEntry = Math.min(Math.max(newEntryProgress, 0), 1);
        setEntryProgress(clampedEntry);

        if (clampedEntry >= 1) {
          setInitialPhase(false);
          setEntryComplete(true);
          setScrollProgress(0);
        }
      } else {
        // Handle expand, stick, and exit
        if (!scrollStarted && scrollDelta > 0 && scrollProgress < EXPAND_END) {
          setScrollStarted(true);
        }

        const newProgress = scrollProgress + scrollDelta * 0.0007; // Faster synchronized speed

        if (newProgress >= EXIT_END) {
          setScrollProgress(EXIT_END);
          setContentSectionsVisible(true);
        } else if (newProgress < 0) {
          setScrollProgress(0);
          setInitialPhase(true);
          setEntryProgress(1);
          setScrollStarted(false);
        } else {
          setScrollProgress(newProgress);
        }
      }
    };

    // --- Touch Handler ---
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const scrollDelta = touchStartY - touchY; // Positive for scroll down

       // 1. Page Scroll Mode
      if (animationCompleted) {
        if (scrollDelta < 0) {
          const heroRect = heroSectionRef.current?.getBoundingClientRect();
          if (heroRect && heroRect.top >= -10) {
            e.preventDefault();
            setAnimationCompleted(false);
            setContentSectionsVisible(true);
            // Ensure we're at the bottom of content sections
            setTimeout(() => {
              if (scrollableContainerRef.current) {
                scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
              }
            }, 0);
          }
        }
        touchStartY = touchY;
        return;
      }

      // 2. Content Sections Scroll Mode
      if (contentSectionsVisible) {
        const container = scrollableContainerRef.current;
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Small buffer for smooth transition

          if (scrollDelta > 0 && isAtBottom) {
            // Transition to main page scroll when we're at the bottom of content
            setAnimationCompleted(true);
            return;
          } else if (scrollDelta < 0 && scrollTop <= 0) {
            e.preventDefault();
            setContentSectionsVisible(false);
            setScrollProgress(EXIT_END);
          } else {
            // Allow normal scrolling within the container
            return;
          }
        }
        touchStartY = touchY;
        return;
      }

      e.preventDefault();

      // 3. Main Animation Sequence (Entry -> Expand -> Stick -> Exit)
      if (initialPhase) {
        // Handle entry
        const newEntryProgress = entryProgress + scrollDelta * 0.0007; // Faster synchronized speed
        const clampedEntry = Math.min(Math.max(newEntryProgress, 0), 1);
        setEntryProgress(clampedEntry);

        if (clampedEntry >= 1) {
          setInitialPhase(false);
          setEntryComplete(true);
          setScrollProgress(0);
        }
      } else {
        // Handle expand, stick, and exit
        if (!scrollStarted && scrollDelta > 0 && scrollProgress < EXPAND_END) {
          setScrollStarted(true);
        }

        const newProgress = scrollProgress + scrollDelta * 0.0007; // Faster synchronized speed

        if (newProgress >= EXIT_END) {
          setScrollProgress(EXIT_END);
          setContentSectionsVisible(true);
        } else if (newProgress < 0) {
          setScrollProgress(0);
          setInitialPhase(true);
          setEntryProgress(1);
          setScrollStarted(false);
        } else {
          setScrollProgress(newProgress);
        }
      }
      touchStartY = touchY;
    };

    // --- Add Listeners ---
    const options = { passive: false };
    window.addEventListener('wheel', handleWheel, options);
    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [
    scrollProgress,
    scrollStarted,
    data.useScrollExpandMedia,
    initialPhase,
    entryProgress,
    contentSectionsVisible,
    animationCompleted,
  ]);

  // Effect to lock body scroll during animation
  useEffect(() => {
    if (!animationCompleted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [animationCompleted]);

  // Handle video playback when scrolling starts
  useEffect(() => {
    if (scrollStarted && videoRef.current && data.expandMediaType === 'video') {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setVideoLoaded(true);
        } catch (err) {
          console.error('Video play failed:', err);

          // Try again after a short delay
          setTimeout(async () => {
            try {
              await videoRef.current?.play();
              setVideoLoaded(true);
            } catch (retryErr) {
              console.error('Video play retry failed:', retryErr);
            }
          }, 300);
        }
      };

      playVideo();
    }
  }, [scrollStarted, data.expandMediaType]);

  // Control navigation visibility based on scroll state
  useEffect(() => {
    // Create custom event for nav visibility
    const createNavVisibilityEvent = (visible: boolean) => {
      const event = new CustomEvent('navVisibility', {
        detail: { visible }
      });
      window.dispatchEvent(event);
    };

    // Determine scroll direction
    const isScrollingUp = scrollProgress < previousScrollProgressRef.current;

    // Function to check content section scroll direction
    const checkContentSectionScroll = () => {
      if (contentSectionsVisible && scrollableContainerRef.current) {
        const currentScrollTop = scrollableContainerRef.current.scrollTop;
        const isScrollingUpInContent = currentScrollTop < lastContentScrollTopRef.current;

        // Update last scroll position
        lastContentScrollTopRef.current = currentScrollTop;

        // Show navbar when scrolling up in content sections
        if (isScrollingUpInContent) {
          createNavVisibilityEvent(true);
        } else {
          createNavVisibilityEvent(false);
        }
      }
    };

    // Add scroll event listener to content sections container
    if (contentSectionsVisible && scrollableContainerRef.current) {
      scrollableContainerRef.current.addEventListener('scroll', checkContentSectionScroll);

      // Clean up
      return () => {
        if (scrollableContainerRef.current) {
          scrollableContainerRef.current.removeEventListener('scroll', checkContentSectionScroll);
        }
      };
    }

    // Initial state - show navbar
    if (initialPhase) {
      createNavVisibilityEvent(true);
    }
    // When video is expanding - show navbar
    else if (!initialPhase && scrollProgress < EXPAND_END) {
      createNavVisibilityEvent(true);
    }
    // When scrolling down and video has exited - hide the nav
    else if (hasStartedExiting && exitProgress > 0.1 && !isScrollingUp) {
      createNavVisibilityEvent(false);
    }
    // When scrolling up - immediately show navbar
    else if (isScrollingUp) {
      createNavVisibilityEvent(true);
    }
    // When content sections are visible but not scrolling up - keep nav hidden
    else if (contentSectionsVisible && !isScrollingUp) {
      createNavVisibilityEvent(false);
    }
    // When animation is complete (regular page scroll) - show nav
    else if (animationCompleted) {
      createNavVisibilityEvent(true);
    }

    // Update the previous scroll position after all checks
    previousScrollProgressRef.current = scrollProgress;

  }, [initialPhase, entryProgress, hasStartedExiting, exitProgress, scrollProgress, contentSectionsVisible, animationCompleted, EXPAND_END, EXIT_END]);

  // Handle navigation visibility for the main page scroll
  useEffect(() => {
    if (!animationCompleted) return;

    // Track window scroll for the main page
    let lastWindowScrollY = window.scrollY;

    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastWindowScrollY;

      // Create custom event for nav visibility
      const createNavVisibilityEvent = (visible: boolean) => {
        const event = new CustomEvent('navVisibility', {
          detail: { visible }
        });
        window.dispatchEvent(event);
      };

      // Show navbar when scrolling up, hide when scrolling down
      if (isScrollingUp) {
        createNavVisibilityEvent(true);
      } else if (currentScrollY > 100) { // Only hide when scrolled down a bit
        createNavVisibilityEvent(false);
      }

      lastWindowScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [animationCompleted]);

  // Calculate current media dimensions based on animation state
  const currentMediaWidth = mediaWidth;

  const currentMediaHeight = mediaHeight;

  return (
    <div className="relative">
      {/* Hero Section with integrated content sections */}
      <div
        ref={heroSectionRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Background Image (fixed in place) - Always visible */}
        <div className="absolute inset-0 z-0">
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
          {initialPhase && entryProgress < 0.2 && (
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

          {/* Media Container */}
          {data.useScrollExpandMedia && (
            <motion.div
              className="absolute z-0 left-1/2 transform -translate-x-1/2 transition-none rounded-2xl"
              style={{
                width: `${currentMediaWidth}px`,
                height: `${currentMediaHeight}px`,
                maxWidth: '95vw',
                maxHeight: '85vh',
                boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                top: initialPhase ? `calc(55% + ${entryTranslateY}vh)` : `calc(55% + ${mediaTranslateY}vh)`,
                translateY: '-50%',
                opacity: initialPhase ? entryProgress : (1 - exitProgress),
                display: (scrollProgress >= EXIT_END || animationCompleted) ? 'none' : 'block'
              }}
            >
              {data.expandMediaType === 'video' ? (
                <div className="relative w-full h-full pointer-events-none">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    src={data.expandMediaSrc?.asset.url}
                    poster={data.expandPosterSrc ? urlFor(data.expandPosterSrc).url() : undefined}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className={`w-full h-full object-cover rounded-xl ${scrollStarted ? 'opacity-100' : 'opacity-0'}`}
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                  />

                  {/* Poster Image */}
                  {(!scrollStarted || !videoLoaded) && data.expandPosterSrc && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: scrollStarted && videoLoaded ? 0 : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={urlFor(data.expandPosterSrc).url()}
                        alt={data.expandTitle || 'Video thumbnail'}
                        fill
                        className="object-cover rounded-xl"
                        priority
                      />
                    </motion.div>
                  )}

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/30 rounded-xl"
                    initial={{ opacity: 0.7 }}
                    animate={{
                      opacity: 0.5 - expansionProgress * 0.3
                    }}
                    transition={{ duration: 0.2 }}
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

                  <motion.div
                    className="absolute inset-0 bg-black/50 rounded-xl"
                    initial={{ opacity: 0.7 }}
                    animate={{
                      opacity: 0.7 - expansionProgress * 0.3
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}

              {/* Media Text */}
              <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                {data.expandSubtitle && (
                  <motion.p
                    className="text-2xl text-blue-200"
                    style={{
                      transform: initialPhase
                        ? `translateY(${entryTranslateY * 0.5}vh)`
                        : `translateX(-${textTranslateX}vw)`,
                      opacity: initialPhase ? entryProgress : 1
                    }}
                  >
                    {data.expandSubtitle}
                  </motion.p>
                )}
                {data.scrollToExpandText && scrollProgress < EXPAND_END && !initialPhase && (
                  <motion.p
                    className="text-blue-200 font-medium text-center"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {data.scrollToExpandText}
                  </motion.p>
                )}
                {initialPhase && entryProgress > 0.5 && (
                  <motion.p
                    className="text-blue-200 font-medium text-center"
                    style={{ opacity: (entryProgress - 0.5) * 2 }}
                  >
                    Keep scrolling
                  </motion.p>
                )}
                {scrollProgress >= EXPAND_END && scrollProgress < STICK_END && (
                  <p className="text-blue-200 font-medium text-center animate-bounce">
                    Scroll to continue
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Title Animation for ScrollExpandMedia */}
          {data.useScrollExpandMedia && (
            <motion.div
              className="flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col mix-blend-difference"
              style={{
                opacity: initialPhase ? entryProgress : (1 - exitProgress),
                transform: initialPhase
                  ? `translateY(${entryTranslateY * 0.5}vh)`
                  : 'none',
                display: (scrollProgress >= EXIT_END || animationCompleted) ? 'none' : 'flex'
              }}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200 transition-none"
                style={{
                  transform: !initialPhase
                    ? `translateX(-${textTranslateX}vw)`
                    : 'none'
                }}
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200 transition-none"
                style={{
                  transform: !initialPhase
                    ? `translateX(${textTranslateX}vw)`
                    : 'none'
                }}
              >
                {restOfTitle}
              </motion.h2>
            </motion.div>
          )}

          {/* Regular Hero Content (visible when ScrollExpandMedia is disabled or media has exited) */}
          {(!data.useScrollExpandMedia || (scrollProgress >= EXIT_END && !contentSectionsVisible)) && (
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
                {data.heroHeading}
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                {data.heroSubheading}
              </p>
              {scrollProgress >= EXIT_END && !contentSectionsVisible && (
                <motion.p
                  className="text-blue-200 mt-8 animate-bounce"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Scroll up to go back
                </motion.p>
              )}
            </div>
          )}

          {/* Integrated Content Sections */}
          <motion.div
            ref={scrollableContainerRef}
            className="absolute inset-0 z-20"
            style={{
              transform: `translateY(${finalContentSectionsTranslateY}vh)`,
              opacity: contentSectionsOpacity,
              pointerEvents: contentSectionsVisible ? 'auto' : 'none',
              overflowY: contentSectionsVisible && !animationCompleted ? 'scroll' : 'hidden',
              scrollBehavior: 'smooth',
              overscrollBehavior: animationCompleted ? 'auto' : 'contain',
            }}
          >
            <div
              ref={contentSectionsRef}
              className="relative"
            >
              {data.contentSections?.map((section, index) => (
                <ContentSection
                  key={section._key}
                  section={section}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Content Section Component (original scrolling homepage logic)
const ContentSection = ({
  section,
  index,
  scrollYProgress
}: {
  section: SanityContentSection;
  index: number;
  scrollYProgress: any;
}) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  const sectionImage = section.image ? urlFor(section.image).url() : '';

  return (
    <motion.section
      style={{ scale, rotate }}
      className='relative h-screen bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white flex items-center justify-center'
    >
      {sectionImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionImage}
            alt={section.heading || 'Content Image'}
            fill
            className='object-cover'
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      <article className='container mx-auto relative z-10 text-center px-4'>
        <h1 className='text-5xl md:text-6xl leading-[100%] py-10 font-semibold tracking-tight'>{section.heading}</h1>
        {section.subheading && (
          <h2 className='text-2xl md:text-3xl mb-6'>{section.subheading}</h2>
        )}
        <div className='prose prose-lg max-w-none text-white'>
          {section.text && <PortableText value={section.text} />}
        </div>
        {section.buttonText && section.buttonLink && (
          <a
            href={section.buttonLink}
            className='mt-8 inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            {section.buttonText}
          </a>
        )}
      </article>
    </motion.section>
  );
};

export default IntegratedHomepage;
