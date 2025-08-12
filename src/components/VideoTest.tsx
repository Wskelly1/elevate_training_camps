'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoTestProps {
  videoUrl?: string;
  posterUrl?: string;
}

/**
 * VideoTest - A simple component to test video playback
 * This component uses a native HTML5 video element with minimal configuration
 * to test if the video URL from Sanity can be played.
 */
const VideoTest: React.FC<VideoTestProps> = ({
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Default test video
  posterUrl
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Log the video URL
  console.log('VideoTest - Testing URL:', videoUrl);

  // Handle video errors
  const handleError = (e: any) => {
    console.error('Video error:', e);
    setError(`Error loading video: ${e.target.error?.message || 'Unknown error'}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Video Test Component</h2>
      <p className="mb-2">Testing video URL: <code className="bg-gray-100 px-1">{videoUrl}</code></p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          controls
          playsInline
          className="w-full h-full object-contain"
          onError={handleError}
          onLoadedData={() => {
            console.log('Video data loaded successfully');
            setIsLoaded(true);
          }}
        />

        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
              <p className="mt-2">Loading video...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Test Controls:</h3>
        <div className="flex gap-2 mt-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => {
                  console.error('Play failed:', e);
                  setError(`Play failed: ${e.message}`);
                });
              }
            }}
          >
            Play
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }}
          >
            Pause
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(e => {
                  console.error('Restart failed:', e);
                  setError(`Restart failed: ${e.message}`);
                });
              }
            }}
          >
            Restart
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Video Element Properties:</h3>
        <pre className="text-xs mt-2 overflow-auto max-h-40">
          {videoRef.current ? JSON.stringify({
            readyState: videoRef.current.readyState,
            networkState: videoRef.current.networkState,
            error: videoRef.current.error?.message || null,
            duration: videoRef.current.duration || 0,
            currentSrc: videoRef.current.currentSrc,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
          }, null, 2) : 'Video element not available'}
        </pre>
      </div>
    </div>
  );
};

export default VideoTest;
