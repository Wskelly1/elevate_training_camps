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
 * @property {function} [onPlay] - Callback when video starts playing
 * @property {function} [onPause] - Callback when video is paused
 * @property {function} [onEnded] - Callback when video playback ends
 * @property {function} [onError] - Callback when video encounters an error
 * @property {function} [onLoadedData] - Callback when video data is loaded
 */
interface SanityVideoProps {
  videoSrc: {
    asset: {
      _id: string;
      url: string;
    };
  };
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

  // Log the video URL for debugging
  console.log('Video source:', videoSrc);
  console.log('MP4 URL:', mp4Url);

  // Check if the URL is valid and exists
  const hasValidUrl = mp4Url && mp4Url.startsWith('http');

  // If no valid URL, show error
  useEffect(() => {
    if (!hasValidUrl && mp4Url !== '') {
      console.error('Invalid video URL:', mp4Url);
      setHasError(true);
    }
  }, [mp4Url, hasValidUrl]);

  // Extract WebM URL if available (assuming Sanity might provide alternative formats)
  const webmUrl = hasValidUrl ? mp4Url.replace(/\.mp4$/, '.webm') : '';

  // Poster image URL
  const posterUrl = posterSrc ? urlFor(posterSrc).url() : '';
  console.log('Poster URL:', posterUrl);

  // Fallback image URL
  const fallbackUrl = fallbackImage ? urlFor(fallbackImage).url() : (posterSrc ? urlFor(posterSrc).url() : '');

  // Effect to handle autoplay capability detection
  useEffect(() => {
    // Function to check if autoplay is supported
    const checkAutoplaySupport = async () => {
      if (!videoRef.current) return;

      try {
        // Create a test video element
        const video = document.createElement('video');
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.src = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAAAAG1wNDJtcDQxaXNvbWF2YzEAAATKbW9vdgAAAGxtdmhkAAAAANLEP5XSxD+VAAB1MAAAdU4AAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAABCAgIAQAE////9//w6AgIAEAAAAAQAABDV0cmFrAAAAXHRraGQAAAAH0sQ/ldLEP5UAAAABAAAAAAAAdU4AAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAFsAAABLAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAABdQAABQAAAAABtG1kaWEAAAAgbWRoZAAAAADSxD+V0sQ/lQAAVcQAAEuVVcQAAAAAADdoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAThtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAD4c3RibAAAAJhzdHNkAAAAAAAAAAEAAACIYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAFsASwBIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAXmF2Y0MBQsAN/+EAFWdCwArZCXnnhAAAD6QAAu4APEiZIAEABWjLg8sgAAAAHHV1aWRraEDyXYlAs0BAQFkIEQAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAEHN0c2MAAAAAAAAAAgAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAUc3RjbwAAAAAAAAAeAAAF4gAABCcAAAQ3AAAE0wAAA+gAAAO5AAADdgAAA7kAAAQIAAAD5wAAA+gAAAFAAAAAFHN0c3oAAAAAAAAAAAAAAADFAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABRzdGNvAAAAAAAAAB4AAAOA////7gAAAOb///+7////5gAAAO7///+7////5gAAAPj////SAAAA0gAAALv////mAAAA9v///+YAAADm////u////9IAAAAeAAAAHgAAAB4AAAA8AAAAWQAAADwAAAA8AAAAmQAAADwAAABkAAAAkgAAAEkAAABJAAAAWQAAAHcAAAB3AAAAnAAAAFkAAABkAAAAqQAAAIcAAACHAAAAaQAAAKkAAABSAAAAhwAAAFIAAABSAAAAUgAAAFIAAABSAAAAUgAAAJIAAACSAAAAUgAAAFIAAABSAAAAUgAAAFIAAABSAAAAUgAAAFIAAABSAAAAUgAAAFIAAABSAAAAUgAAAMUAAADF';

        // Try to play the test video
        await video.play();

        // If we get here, autoplay is supported
        setCanAutoPlay(true);
      } catch (error) {
        // Autoplay is not supported
        console.log('Autoplay not supported by this browser/device');
        setCanAutoPlay(false);
      }
    };

    checkAutoplaySupport();
  }, []);

  // Effect to handle initial video setup
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Set initial attributes
    video.muted = muted;

    // For Safari compatibility
    video.playsInline = true;

    // Preload strategy based on lazy loading preference
    video.preload = lazy ? 'metadata' : 'auto';

    // Event handlers
    const handleLoadedData = () => {
      setIsLoaded(true);
      if (onLoadedData) onLoadedData();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      console.error('Video element:', videoRef.current);
      console.error('Video source:', mp4Url);
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

    // Attach event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Handle autoplay with browser compatibility
    if (autoPlay && canAutoPlay) {
      // Try to play with muted as fallback for browser policies
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
            setIsPlaying(true);
            setShowPlayButton(false);
          })
          .catch(error => {
            // Autoplay was prevented
            console.warn('Autoplay prevented:', error);

            // If not already muted, try again with muted
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

    // Cleanup function
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);

      // Ensure video is paused when component unmounts
      if (!video.paused) {
        video.pause();
      }
    };
  }, [autoPlay, canAutoPlay, muted, lazy, onLoadedData, onError, onPlay, onPause, onEnded]);

  // Function to handle play button click
  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      // Try to play the video
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Play failed:', error);

          // If autoplay is blocked, try with muted
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

  return (
    <div
      ref={containerRef}
      className={`sanity-video-container relative w-full h-0 pb-[56.25%] ${className}`}
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
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        poster={posterUrl || undefined}
        controls={controls && isLoaded}
        muted={muted}
        loop={loop}
        playsInline
        style={videoStyle}
        aria-hidden={!isLoaded || hasError}
      >
        {/* WebM source for browsers that support it */}
        {webmUrl && <source src={webmUrl} type="video/webm" />}

        {/* MP4 source as fallback */}
        {hasValidUrl ? (
          <source src={mp4Url} type="video/mp4" />
        ) : (
          // Fallback to a known working video if no valid URL is provided
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
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
