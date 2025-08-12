'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '../lib/sanity';

/**
 * SanityVideoProps - Props for the SanityVideo component
 *
 * @property {Object} videoSrc - Sanity file reference for the video
 * @property {Object} [posterSrc] - Optional Sanity image reference for the poster
 * @property {Object} [fallbackImage] - Optional Sanity image reference for fallback if video fails
 * @property {string} [title] - Optional title for the video (used for accessibility)
 * @property {string} [description] - Optional description for the video (used for accessibility)
 * @property {boolean} [autoPlay=false] - Whether to attempt to autoplay the video
 * @property {boolean} [muted=true] - Whether the video should be muted
 * @property {boolean} [loop=false] - Whether the video should loop
 * @property {boolean} [controls=true] - Whether to show video controls
 * @property {boolean} [lazy=true] - Whether to use lazy loading
 * @property {'cover' | 'contain' | 'fill'} [objectFit='cover'] - How the video should fit its container
 * @property {string} [className] - Additional CSS classes
 * @property {string} [captionSrc] - URL to WebVTT captions file
 * @property {boolean} [fillContainer] - Whether to fill the parent container instead of using aspect-ratio padding
 * @property {boolean} [pauseWhenOutOfView] - Whether to pause the video when it's out of view or the page is hidden
 * @property {function} [onPlay] - Callback when video starts playing
 * @property {function} [onPause] - Callback when video is paused
 * @property {function} [onEnded] - Callback when video playback ends
 * @property {function} [onError] - Callback when video encounters an error
 * @property {function} [onLoadedData] - Callback when video data is loaded
 */
interface SanityVideoProps {
  videoSrc?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  lowQualitySrc?: { asset: { _id: string; url: string } } | null;
  hlsSrc?: string;
  posterSrc?: any;
  fallbackImage?: any;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  lazy?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  className?: string;
  captionSrc?: string;
  fillContainer?: boolean;
  pauseWhenOutOfView?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  onLoadedData?: () => void;
}

/**
 * SanityVideo - A robust, cross-browser compatible video player for Sanity CMS videos
 *
 * This component provides a modern HTML5 video player with:
 * - Cross-browser compatibility (Chrome, Firefox, Safari, Edge, mobile browsers)
 * - Responsive design that maintains aspect ratio
 * - Support for MP4 and WebM formats
 * - Accessibility features including captions and ARIA attributes
 * - Error handling with fallback display
 * - Optimized loading strategies
 * - Browser-compliant autoplay behavior
 */
const SanityVideo: React.FC<SanityVideoProps> = ({
  videoSrc,
  lowQualitySrc,
  hlsSrc,
  posterSrc,
  fallbackImage,
  title = '',
  description = '',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  lazy = true,
  objectFit = 'cover',
  className = '',
  captionSrc,
  fillContainer = false,
  pauseWhenOutOfView = true,
  onPlay,
  onPause,
  onEnded,
  onError,
  onLoadedData,
}) => {
  // State to track loading and error states
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPlayButton, setShowPlayButton] = useState<boolean>(!autoPlay);
  const [canAutoPlay, setCanAutoPlay] = useState<boolean>(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine video sources - try to extract WebM URL if available
  const mp4Url = videoSrc?.asset?.url || '';
  const lowUrl = lowQualitySrc?.asset?.url || '';

  // Log the video URL for debugging
  console.log('Video source:', videoSrc);
  console.log('MP4 URL:', mp4Url);

  // Check if the URL is valid and exists
  const hasValidUrl = mp4Url && mp4Url.startsWith('http');
  const hasLowUrl = lowUrl && lowUrl.startsWith('http');

  // If no valid URL, show error
  useEffect(() => {
    if (!hlsSrc) {
      if (!videoSrc) {
        console.error('SanityVideo: videoSrc prop is missing');
      }
      if (!hasValidUrl) {
        console.warn('SanityVideo: Missing or invalid video URL. Falling back to sample video. Provided url:', mp4Url);
      }
    }
  }, [videoSrc, mp4Url, hasValidUrl, hlsSrc]);

  // Do not guess alternate formats. Use the provided URL only.
  const webmUrl = '';

  // Poster image URL
  const posterUrl = posterSrc ? urlFor(posterSrc).url() : '';
  console.log('Poster URL:', posterUrl);

  // Fallback image URL
  const fallbackUrl = fallbackImage ? urlFor(fallbackImage).url() : (posterSrc ? urlFor(posterSrc).url() : '');

  // Effect to handle autoplay capability detection
  useEffect(() => {
    if (!autoPlay) {
      setCanAutoPlay(false);
      return;
    }
    // Function to check if autoplay is supported
    const checkAutoplaySupport = async () => {
      if (!videoRef.current) return;

      try {
        // Create a test video element
        const video = document.createElement('video');
        video.muted = true;
        video.setAttribute('playsinline', '');
        // A tiny silent mp4 data URI
        video.src = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAAAAG1wNDJtcDQxaXNvbWF2YzEAAATKbW9vdgAAAGxtdmhkAAAAANLEP5XSxD+VAAB1MAAAdU4AAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAABCAgIAQAE////9//w6AgIAEAAAAAQAABDV0cmFrAAAAXHRraGQAAAAH0sQ/ldLEP5UAAAABAAAAAAAAdU4AAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAFsAAABLAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAABdQAABQAAAAABtG1kaWEAAAAgbWRoZAAAAADSxD+V0sQ/lQAAVcQAAEuVVcQAAAAAADdoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAATg=';

        await video.play();
        setCanAutoPlay(true);
      } catch (error) {
        console.log('Autoplay not supported by this browser/device');
        setCanAutoPlay(false);
      }
    };

    checkAutoplaySupport();
  }, [autoPlay]);

  // Effect to handle initial video setup
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let stallCount = 0;
    let usingLow = false;
    let hls: any | null = null;

    // Set initial attributes
    video.muted = muted;
    video.playsInline = true; // Safari compatibility
    video.preload = lazy ? 'metadata' : 'auto';
    video.crossOrigin = 'anonymous';

    // Event handlers
    const handleWaitingOrStalled = () => {
      stallCount += 1;
      console.warn('Video stall/waiting detected. Count:', stallCount);
      // If we have a low-quality source and we stalled twice early, switch
      if (!hlsSrc && !usingLow && hasLowUrl && stallCount >= 2) {
        usingLow = true;
        const currentTime = video.currentTime || 0;
        console.warn('Switching to low-quality source due to stalls');
        // Swap source to low
        const sources = Array.from(video.querySelectorAll('source')) as HTMLSourceElement[];
        sources.forEach(s => video.removeChild(s));
        const s = document.createElement('source');
        s.src = lowUrl;
        s.type = 'video/mp4';
        video.appendChild(s);
        // Reload and resume near the same time
        video.load();
        video.currentTime = currentTime;
        const p = video.play();
        if (p) {
          p.catch(err => console.warn('Play after low-quality switch failed:', err));
        }
      }
    };

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      onLoadedData && onLoadedData();
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (onLoadedData) onLoadedData();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      console.error('Video element:', videoRef.current);
      console.error('Video source:', mp4Url || hlsSrc);
      setHasError(true);
      if (onError) onError(e);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
      if (onPause) onPause();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
      if (onEnded) onEnded();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('waiting', handleWaitingOrStalled);
    video.addEventListener('stalled', handleWaitingOrStalled);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Initialize HLS if provided
    const setupHls = async () => {
      if (!hlsSrc) return;
      try {
        if (video.canPlayType('application/vnd.apple.mpegURL')) {
          // Native HLS (Safari)
          video.src = hlsSrc;
          video.load();
        } else {
          const mod = await import('hls.js');
          const Hls = mod.default;
          if (Hls?.isSupported()) {
            hls = new Hls({ capLevelToPlayerSize: true });
            hls.loadSource(hlsSrc);
            hls.attachMedia(video);
          } else {
            console.warn('HLS is not supported; falling back to MP4 sources if available');
          }
        }
      } catch (err) {
        console.warn('Failed to initialize HLS:', err);
      }
    };

    setupHls();

    // Handle autoplay with browser compatibility
    if (autoPlay && canAutoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowPlayButton(false);
          })
          .catch(error => {
            console.warn('Autoplay prevented:', error);
            if (!muted) {
              video.muted = true;
              video.play().catch(e => {
                console.error('Autoplay failed even with muted option:', e);
                setShowPlayButton(true);
              });
            } else {
              setShowPlayButton(true);
            }
          });
      }
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('waiting', handleWaitingOrStalled);
      video.removeEventListener('stalled', handleWaitingOrStalled);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);

      if (!video.paused) {
        video.pause();
      }
      if (hls && typeof hls.destroy === 'function') {
        try { hls.destroy(); } catch {}
      }
    };
  }, [autoPlay, canAutoPlay, muted, lazy, onLoadedData, onError, onPlay, onPause, onEnded, mp4Url, lowUrl, hasLowUrl, hlsSrc]);

  // Function to handle play button click
  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Play failed:', error);
          if (error.name === 'NotAllowedError' && !videoRef.current!.muted) {
            videoRef.current!.muted = true;
            videoRef.current!.play().catch(e => {
              console.error('Play failed even with muted option:', e);
            });
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  };

  // Object-fit style based on prop
  const videoStyle: React.CSSProperties = {
    objectFit,
    width: '100%',
    height: '100%',
  };

  // Pause when out of view or page hidden (without resetting currentTime)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !pauseWhenOutOfView) return;

    let observer: IntersectionObserver | null = null;

    const handleVisibility = () => {
      if (document.hidden && !video.paused) {
        try { video.pause(); } catch {}
      }
    };

    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !video.paused) {
              try { video.pause(); } catch {}
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(video);
    } catch {}

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [pauseWhenOutOfView]);

  return (
    <div
      ref={containerRef}
      className={`sanity-video-container relative w-full ${fillContainer ? 'h-full' : 'h-0 pb-[56.25%]'} ${className}`}
      style={{ overflow: 'hidden' }}
      aria-labelledby={title ? 'video-title' : undefined}
      aria-describedby={description ? 'video-description' : undefined}
    >
      {/* Accessibility title and description (visually hidden) */}
      {title && (
        <h2 id="video-title" className="sr-only">{title}</h2>
      )}
      {description && (
        <p id="video-description" className="sr-only">{description}</p>
      )}

      {/* Loading spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Error state with fallback image */}
      {hasError && fallbackUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-center max-w-md px-4">
            <p className="mb-4">
              {!hasValidUrl
                ? "The video URL from Sanity is missing or invalid. Please check your Sanity content and make sure the video file is properly uploaded."
                : "Unable to play this video. Please try again later."}
            </p>
            <Image
              src={fallbackUrl}
              alt={title || "Video thumbnail"}
              width={400}
              height={225}
              className="rounded-lg mx-auto"
            />
            <p className="mt-4 text-sm opacity-75">
              {!hasValidUrl
                ? "This could be due to: 1) Missing video file in Sanity, 2) CORS configuration issues, or 3) Video file permissions."
                : "There was a problem loading the video. Check your connection or try a different browser."}
            </p>
          </div>
        </div>
      )}

      {/* Custom play button overlay */}
      {showPlayButton && isLoaded && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
          onClick={handlePlayClick}
          role="button"
          aria-label="Play video"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlayClick();
            }
          }}
        >
          <div className="rounded-full bg-black/40 p-5 hover:bg-black/60 transition-all transform hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        key={mp4Url || 'fallback-video'}
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        poster={posterUrl || undefined}
        controls={controls && isLoaded}
        muted={muted}
        loop={loop}
        playsInline
        style={videoStyle}
        aria-hidden={!isLoaded || hasError}
        crossOrigin="anonymous"
        onWaiting={() => console.log('Video event: waiting')}
        onStalled={() => console.warn('Video event: stalled')}
        onProgress={() => console.log('Video event: progress', videoRef.current?.buffered?.length)}
        onSuspend={() => console.log('Video event: suspend')}
        onAbort={() => console.warn('Video event: abort')}
      >
        {/* Only include MP4 sources when not using HLS */}
        {!hlsSrc && hasValidUrl && <source src={mp4Url} type="video/mp4" />}
        {!hlsSrc && hasLowUrl && <source data-low src={lowUrl} type="video/mp4" />}

        {/* Secondary fallback source to ensure playback during debugging */}
        {!hlsSrc && (
          <source data-debug-fallback src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        )}

        {/* Captions if available */}
        {captionSrc && (
          <track
            kind="captions"
            src={captionSrc}
            srcLang="en"
            label="English"
            default
          />
        )}

        {/* Fallback text */}
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};

export default SanityVideo;
