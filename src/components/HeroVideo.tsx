'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * HeroVideo — full-bleed ambient background video.
 *
 * Deliberately minimal, modelled on the Under Canvas treatment the owner
 * pointed at: autoplay, muted, looping, object-cover, and crucially
 * NO native browser controls. The existing SanityVideo component is not
 * reused here because it carries a play-button overlay, a loading spinner
 * and native controls — all correct for a *player*, all wrong for a
 * background.
 *
 * The page scrolls normally. This component never touches document scroll.
 *
 * Accessibility: honours prefers-reduced-motion by not autoplaying, and
 * exposes a small pause/play affordance (WCAG 2.2.2 — auto-playing motion
 * lasting more than 5s needs a mechanism to stop it).
 */

interface HeroVideoProps {
  playbackId: string;
  poster?: string;
  className?: string;
}

export default function HeroVideo({ playbackId, poster, className = '' }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  const src = `https://stream.mux.com/${playbackId}.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReduced);

    let hls: import('hls.js').default | null = null;

    const setup = async () => {
      // Order matters: try hls.js FIRST, native HLS only as the fallback.
      // Chrome answers `canPlayType('application/vnd.apple.mpegurl')` with
      // "maybe" and then fails the load with MEDIA_ERR_SRC_NOT_SUPPORTED, so
      // a native-first check silently breaks the video everywhere but Safari.
      const mod = await import('hls.js');
      const Hls = mod.default;

      if (Hls.isSupported()) {
        hls = new Hls({ capLevelToPlayerSize: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari / iOS: MSE-free native HLS.
        video.src = src;
      }

      if (!prefersReduced) {
        try {
          await video.play();
          setPlaying(true);
        } catch {
          // Autoplay refused (rare when muted) — leave the poster showing.
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
    };

    setup();

    return () => {
      if (hls) {
        try { hls.destroy(); } catch {}
      }
    };
  }, [src]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        className="absolute bottom-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45"
      >
        {playing ? (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
            <rect x="0" y="0" width="4" height="14" rx="1" />
            <rect x="8" y="0" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
            <path d="M0 0 L12 7 L0 14 Z" />
          </svg>
        )}
      </button>
      {reduced && (
        <span className="sr-only">
          Background video paused because your system requests reduced motion.
        </span>
      )}
    </div>
  );
}
