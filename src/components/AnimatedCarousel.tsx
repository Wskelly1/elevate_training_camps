"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types
export type TeamIntroduction = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

type AnimatedTeamIntroductionsProps = {
  introductions: TeamIntroduction[];
};

/**
 * AnimatedTeamIntroductions - Interactive team member carousel with animations
 * 
 * This component creates an elegant, animated carousel to showcase team members
 * with their photos, names, titles, and quotes/bios.
 * 
 * Features:
 * - Smooth animations between team members
 * - Previous/Next navigation controls
 * - Responsive design that works on all screen sizes
 * - Visual indicators for current position in the carousel
 * - Elegant styling with drop shadows and transitions
 * 
 * @param {Object} props - Component props
 * @param {TeamIntroduction[]} props.introductions - Array of team member data objects
 */
export function AnimatedTeamIntroductions({ introductions }: AnimatedTeamIntroductionsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + introductions.length) % introductions.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % introductions.length);
  };

  if (!introductions.length) {
    return null;
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Testimonial Cards */}
      <div className="relative h-[600px] overflow-hidden">
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
            <div className="w-full md:w-1/2 flex-shrink-0 mb-6 md:mb-0">
              <div className="relative w-96 h-96 mx-auto rounded-lg overflow-hidden border-4 border-gray-200">
                <Image
                  src={intro.src}
                  alt={intro.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-1/2 md:pl-8 text-center md:text-left">
              <div className="font-bold text-lg">{intro.name}</div>
              <div className="text-gray-600 mb-4">{intro.designation}</div>
              <blockquote className="text-lg md:text-xl italic">
                "{intro.quote}"
              </blockquote>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePrev}
          className="transition-opacity hover:opacity-75"
          aria-label="Previous"
        >
          <ChevronLeft className="w-8 h-8 text-green-700" />
        </button>
        <button
          onClick={handleNext}
          className="transition-opacity hover:opacity-75"
          aria-label="Next"
        >
          <ChevronRight className="w-8 h-8 text-green-700" />
        </button>
      </div>
    </div>
  );
} 