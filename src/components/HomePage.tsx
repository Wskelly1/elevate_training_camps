"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { urlFor } from "../lib/sanity";
import { SanityHomePage } from '../lib/types';
import { PortableText } from "@portabletext/react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";

interface HomePageProps {
  data: SanityHomePage;
}

interface HeroImageData {
  url: string;
  width: number;
  height: number;
}

const FadeInSection = ({ children, direction = "up" }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  const [heroImage, setHeroImage] = useState<HeroImageData | null>(null);
  const [sectionImages, setSectionImages] = useState<{[key: number]: string}>({});

  // --- Testimonial slider state ---
  const testimonials = data?.testimonials || [];
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

  useEffect(() => {
    setMounted(true);
    
    if (data?.heroImage) {
      try {
        const imageUrl = urlFor(data.heroImage).url();
        if(imageUrl) {
          setHeroImage({ url: imageUrl, width: 1920, height: 1080 });
        }
      } catch (error) {
        console.error('Error loading hero image:', error);
      }
    }

    if (data?.contentSections) {
      const images = {};
      data.contentSections.forEach((section, index) => {
        if (section.image) {
          try {
            const imageUrl = urlFor(section.image).url();
            if (imageUrl) {
              images[index] = imageUrl;
            }
          } catch (error) {
            console.error(`Error loading section ${index} image:`, error);
          }
        }
      });
      setSectionImages(images);
    }
  }, [data]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-screen"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No content available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full -mt-[80px]"> {/* Negative margin to extend to the top */}
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-gray-900">
        {heroImage ? (
          <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            {/* Hero image */}
              <img 
              src={heroImage.url}
                alt={data.heroHeading || "Hero"} 
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1
              }}
              />
            {/* Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 2
            }} />
            {/* Text */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '0 1rem'
              }}
            >
          {data.heroHeading && (
            <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">
              {data.heroHeading}
            </h1>
          )}
          {data.heroSubheading && (
            <p className="text-xl md:text-2xl max-w-2xl">
              {data.heroSubheading}
            </p>
          )}
        </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
        )}
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {data.contentSections &&
        data.contentSections.map((section, index) => {
          const isEven = index % 2 === 0;
          const sectionImageUrl = sectionImages[index];
          return (
            <section
              key={index}
              className="py-16 md:py-24 px-4 md:px-8"
              style={{ backgroundColor: isEven ? '#fbf9f3' : '#f0ead6' }}
            >
              <div className="container mx-auto">
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
                  {/* Image Column */}
                  <div className="w-full md:w-1/2">
                    <FadeInSection direction={isEven ? "left" : "right"}>
                      <div className="relative rounded-lg overflow-hidden shadow-xl aspect-[4/3]">
                        {sectionImageUrl ? (
                          <Image
                            src={sectionImageUrl}
                            alt={section.heading}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="bg-gray-300 w-full h-full" />
                        )}
                      </div>
                    </FadeInSection>
                  </div>

                  {/* Content Column */}
                  <div className="w-full md:w-1/2">
                    <FadeInSection direction={isEven ? "right" : "left"}>
                      <div className="space-y-4">
                        {section.heading && (
                          <h2 className="text-3xl font-bold" style={{ color: '#755f4f' }}>
                            {section.heading}
                          </h2>
                        )}
                        {section.subheading && (
                          <h3 className="text-xl" style={{ color: '#7f6f51' }}>
                            {section.subheading}
                          </h3>
                        )}
                        <div className="prose prose-lg max-w-none">
                          {section.text && <PortableText value={section.text} />}
                        </div>
                        {section.buttonText && section.buttonLink && (
                          <div className="mt-6">
                            <Button
                              asChild
                              style={{
                                backgroundColor: '#755f4f',
                                color: 'white',
                              }}
                              className="hover:bg-[#583e2e] transition-colors"
                            >
                              <a href={section.buttonLink}>{section.buttonText}</a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </FadeInSection>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

      {/* Testimonial Section */}
      <section className="relative bg-[#fbf9f3] py-16 overflow-hidden min-h-[500px]">
        {/* Right half background for desktop - full viewport height and width */}
        <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1/2 h-full z-0" style={{ background: '#f0ead6' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 min-h-[500px]">
            {/* Left: Testimonial Card Slider */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative w-[350px] h-[450px] flex items-end justify-center mb-6 md:mb-0">
                {testimonials.length > 0 ? (
                  <>
                    {testimonials.map((testimonial, idx) => (
                      <TestimonialCard
                        key={idx}
                        handleShuffle={goRight}
                        testimonial={testimonial.text}
                        position={getPosition(idx)}
                        id={idx + 1}
                        author={testimonial.name}
                        imageUrl={testimonial.image ? urlFor(testimonial.image).url() : undefined}
                      />
                    ))}
                  </>
                ) : (
                  <span className="text-[#7f6f51]">No testimonials yet.</span>
                )}
                {/* Arrows below cards */}
                {testimonials.length > 1 && (
                  <div className="flex items-center justify-center gap-8 mt-2 absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <button
                      aria-label="Previous testimonial"
                      onClick={goLeft}
                      className="bg-[#e6e1d5] hover:bg-[#d6cfc2] rounded-full p-2 shadow"
                    >
                      <svg width="24" height="24" fill="none" stroke="#755f4f" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button
                      aria-label="Next testimonial"
                      onClick={goRight}
                      className="bg-[#e6e1d5] hover:bg-[#d6cfc2] rounded-full p-2 shadow"
                    >
                      <svg width="24" height="24" fill="none" stroke="#755f4f" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Right: Testimonials text, directly on background */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:pl-16">
              <h2 className="text-3xl font-bold mb-4 text-[#755f4f]">Testimonials</h2>
              <p className="text-lg text-[#7f6f51] mb-2">What our clients say about us</p>
              <blockquote className="italic text-[#7f6f51] text-base mt-4 border-l-4 border-[#755f4f] pl-4">
                "We are proud to have worked with so many inspiring athletes and families. Their stories are our greatest achievement."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 