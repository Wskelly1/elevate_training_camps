'use client';

import {
  useEffect,
  useRef,
  useState,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  onFullyExpanded?: () => void;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  onFullyExpanded,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [scrollStarted, setScrollStarted] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [hasTriggeredCallback, setHasTriggeredCallback] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset states when media type changes
  useEffect(() => {
    setScrollProgress(0);
    setMediaFullyExpanded(false);
    setScrollStarted(false);
    setVideoLoaded(false);
    setHasTriggeredCallback(false);
  }, [mediaType]);

  // Handle video playback when scrolling starts
  useEffect(() => {
    if (scrollStarted && videoRef.current && mediaType === 'video') {
      console.log('Attempting to play video...');
      
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          console.log('Video started playing successfully');
          setVideoLoaded(true);
        } catch (err) {
          console.error('Video play failed:', err);
          
          // Try again after a short delay
          setTimeout(async () => {
            try {
              await videoRef.current?.play();
              console.log('Video started playing on second attempt');
              setVideoLoaded(true);
            } catch (retryErr) {
              console.error('Video play retry failed:', retryErr);
            }
          }, 300);
        }
      };
      
      playVideo();
    }
  }, [scrollStarted, mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const sectionTop = sectionRef.current?.getBoundingClientRect().top;

      // If fully expanded and user scrolls up, collapse the media
      if (
        mediaFullyExpanded &&
        e.deltaY < 0 &&
        sectionTop !== undefined &&
        sectionTop >= 0
      ) {
        setMediaFullyExpanded(false);
        e.preventDefault();
        return;
      }

      // If fully expanded and user scrolls down, trigger callback
      if (
        mediaFullyExpanded &&
        e.deltaY > 0 &&
        onFullyExpanded &&
        !hasTriggeredCallback
      ) {
        setHasTriggeredCallback(true);
        onFullyExpanded();
        return; // Don't prevent default here to allow natural scrolling
      }

      if (!mediaFullyExpanded) {
        e.preventDefault();
        
        // Set scrollStarted to true on first scroll
        if (!scrollStarted && e.deltaY > 0) {
          setScrollStarted(true);
        }
        
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const sectionTop = sectionRef.current?.getBoundingClientRect().top;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      // If fully expanded and user swipes up, collapse the media
      if (
        mediaFullyExpanded &&
        deltaY < -20 &&
        sectionTop !== undefined &&
        sectionTop >= 0
      ) {
        setMediaFullyExpanded(false);
        e.preventDefault();
        return;
      }

      // If fully expanded and user swipes down, trigger callback
      if (
        mediaFullyExpanded &&
        deltaY > 20 &&
        onFullyExpanded &&
        !hasTriggeredCallback
      ) {
        setHasTriggeredCallback(true);
        onFullyExpanded();
        return; // Don't prevent default here to allow natural scrolling
      }

      if (!mediaFullyExpanded) {
        e.preventDefault();
        
        // Set scrollStarted to true on first downward touch movement
        if (!scrollStarted && deltaY > 0) {
          setScrollStarted(true);
        }
        
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, scrollStarted, onFullyExpanded, hasTriggeredCallback]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-hidden h-[100vh] max-h-[100vh]'
    >
      <section className='relative flex flex-col items-center justify-start h-[100vh] max-h-[100vh]'>
        <div className='relative w-full flex flex-col items-center h-[100vh] max-h-[100vh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-screen h-screen'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-black/10' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10 h-full'>
            <div className='flex flex-col items-center justify-center w-full h-full relative'>
              <div
                className='absolute z-0 top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              `autoplay=${scrollStarted ? '1' : '0'}&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1`
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              `?autoplay=${scrollStarted ? '1' : '0'}&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=` +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      {/* Always render the video but keep it hidden until needed */}
                      <video
                        ref={videoRef}
                        src={mediaSrc}
                        poster={posterSrc}
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className={`w-full h-full object-cover rounded-xl ${scrollStarted ? 'opacity-100' : 'opacity-0'}`}
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                        onLoadedData={() => console.log('Video loaded data')}
                        onCanPlay={() => console.log('Video can play')}
                        onPlay={() => console.log('Video play event fired')}
                        onError={(e) => console.error('Video error:', e)}
                      />
                      
                      {/* Show poster image until scrolling starts */}
                      <AnimatePresence>
                        {(!scrollStarted || !videoLoaded) && posterSrc && (
                          <motion.div 
                            className="absolute inset-0"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Image
                              src={posterSrc}
                              alt={title || 'Video thumbnail'}
                              width={1280}
                              height={720}
                              className='w-full h-full object-cover rounded-xl'
                              priority
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                  {date && (
                    <p
                      className='text-2xl text-blue-200'
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className='text-blue-200 font-medium text-center'
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-bold text-blue-200 transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-4xl md:text-5xl lg:text-6xl font-bold text-center text-blue-200 transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia; 