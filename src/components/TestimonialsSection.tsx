"use client";

import React from "react";
import { Carousel, TestimonialCard, iTestimonial } from "./ui/testimonials";
import { SanityTestimonial } from "../lib/types";
import { urlFor } from "../lib/sanity";

interface TestimonialsSectionProps {
  testimonials?: SanityTestimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = [] }) => {
  // Transform Sanity testimonials to the format expected by the carousel
  const transformedTestimonials: iTestimonial[] = testimonials.map((testimonial) => ({
    name: testimonial.name,
    designation: testimonial.designation || "Athlete", // Fallback if designation is missing
    description: testimonial.text,
    profileImage: urlFor(testimonial.image).url(),
  }));

  // Create testimonial cards
  const cards = transformedTestimonials.map((testimonial, index) => (
    <TestimonialCard
      key={testimonial.name}
      testimonial={testimonial}
      index={index}
      backgroundImage={urlFor(testimonial.profileImage).url()} // Use the same image as background
    />
  ));

  // Don't render if no testimonials
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-1 md:py-2 bg-[#fff9eb]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-2 md:mb-3">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
            What Our Athletes Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-1">
            Hear from the athletes who have transformed their performance through our high-altitude training programs in Flagstaff, Arizona.
          </p>
        </div>

        <Carousel items={cards} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
