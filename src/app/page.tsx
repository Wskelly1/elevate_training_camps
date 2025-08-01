'use client';

import { client } from '../lib/sanity';
import { homePageQuery } from '../lib/queries';
import { SanityHomePage } from '../lib/types';
import Layout from "../components/layout";
import { TestimonialCard } from '../components/TestimonialCard';
import React, { useState, useEffect } from 'react';
import { urlFor } from '../lib/sanity';
import IntegratedHomepage from '../components/IntegratedHomepage';

/**
 * Home - Main homepage component for Elevate Training Camps
 *
 * This component serves as the entry point for the website, displaying the integrated
 * homepage with scroll animations and a testimonials section. It fetches data from
 * Sanity CMS and manages the overall page state.
 *
 * Features:
 * - Dynamic content loading from Sanity CMS
 * - Integrated homepage with scroll-driven animations
 * - Interactive testimonials carousel
 * - Loading states and error handling
 * - Responsive design for all screen sizes
 *
 * @returns {JSX.Element} The complete homepage with animations and testimonials
 */
export default function Home() {
  const [homePageData, setHomePageData] = useState<SanityHomePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(homePageQuery);
        setHomePageData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const testimonials = homePageData?.testimonials || [];
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const totalTestimonials = testimonials.length;
  const goLeft = () => setCurrentTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  const goRight = () => setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
  const getPosition = (idx: number) => {
    if (idx === currentTestimonial) return 'front';
    if ((idx === (currentTestimonial - 1 + totalTestimonials) % totalTestimonials)) return 'left';
    if ((idx === (currentTestimonial + 1) % totalTestimonials)) return 'right';
    return 'hidden';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-screen"></div>
        </div>
      </Layout>
    );
  }

  if (!homePageData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>No content available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Integrated Homepage Component */}
      <IntegratedHomepage data={homePageData} />

      {/* Testimonials section */}
      <div className="relative h-screen w-full bg-[#f0ead6] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#755f4f' }}>
          Testimonials
        </h2>
        <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              id={idx}
              testimonial={testimonial.text}
              author={testimonial.name}
              imageUrl={testimonial.image ? urlFor(testimonial.image).url() : undefined}
              position={getPosition(idx)}
              handleShuffle={goRight}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
