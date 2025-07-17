"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Types
export type TeamIntroduction = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

type AnimatedTeamIntroductionsProps = {
  introductions: TeamIntroduction[];
  autoplay?: boolean;
  autoplaySpeed?: number;
};

export function AnimatedTeamIntroductions({
  introductions,
  autoplay = false,
  autoplaySpeed = 5000,
}: AnimatedTeamIntroductionsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % introductions.length);
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, introductions.length]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  if (!introductions.length) {
    return null;
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Testimonial Cards */}
      <div className="relative h-[500px] overflow-hidden">
        {introductions.map((intro, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col md:flex-row items-center transition-all duration-700 ease-in-out ${
              index === activeIndex
                ? 'opacity-100 translate-x-0 z-10'
                : 'opacity-0 translate-x-full z-0'
            }`}
          >
            {/* Image */}
            <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={intro.src}
                  alt={intro.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-2/3 md:pl-8">
              <blockquote className="text-lg md:text-xl italic mb-4">
                "{intro.quote}"
              </blockquote>
              <div className="font-bold text-lg">{intro.name}</div>
              <div className="text-gray-600">{intro.designation}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {introductions.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 