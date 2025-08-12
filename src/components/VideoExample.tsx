'use client';

import React from 'react';
import SanityVideo from './SanityVideo';

/**
 * VideoExample - Example component showing how to use the SanityVideo component
 *
 * This component demonstrates different usage patterns for the SanityVideo component,
 * including various configurations and options.
 */
const VideoExample: React.FC<{ data: any }> = ({ data }) => {
  // Example of handling video events
  const handleVideoPlay = () => {
    console.log('Video started playing');
  };

  const handleVideoError = (error: any) => {
    console.error('Video error occurred:', error);
  };

  return (
    <div className="space-y-12 py-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Video Player</h2>
        <div className="max-w-3xl mx-auto">
          {/* Basic usage with minimal props */}
          <SanityVideo
            videoSrc={data.expandMediaSrc}
            posterSrc={data.expandPosterSrc}
            title="Training Camp Introduction"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Video with Custom Controls</h2>
        <div className="max-w-3xl mx-auto">
          {/* Advanced usage with more options */}
          <SanityVideo
            videoSrc={data.expandMediaSrc}
            posterSrc={data.expandPosterSrc}
            fallbackImage={data.heroImage}
            title="Training Camp Activities"
            description="This video showcases the various activities available at our training camps."
            autoPlay={false}
            muted={true}
            loop={false}
            controls={true}
            lazy={true}
            objectFit="cover"
            className="rounded-xl shadow-lg"
            onPlay={handleVideoPlay}
            onError={handleVideoError}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Autoplay Video (Muted)</h2>
        <div className="max-w-3xl mx-auto">
          {/* Example with autoplay (must be muted to comply with browser policies) */}
          <SanityVideo
            videoSrc={data.expandMediaSrc}
            posterSrc={data.expandPosterSrc}
            title="Autoplay Example"
            autoPlay={true}
            muted={true}
            controls={true}
          />
          <p className="text-sm text-gray-500 mt-2">
            Note: Autoplay videos must be muted to comply with browser policies
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Video with Different Aspect Ratio</h2>
        <div className="max-w-3xl mx-auto">
          {/* Custom aspect ratio example */}
          <div className="aspect-[4/3] relative">
            <SanityVideo
              videoSrc={data.expandMediaSrc}
              posterSrc={data.expandPosterSrc}
              title="Custom Aspect Ratio"
              objectFit="contain"
              className="!pb-0 !h-full" // Override default aspect ratio
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoExample;
