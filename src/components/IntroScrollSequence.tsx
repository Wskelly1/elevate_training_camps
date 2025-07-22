'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface IntroScrollSequenceProps {
  initialImage: string;
  secondImage: string;
  onSequenceComplete: () => void;
}

const IntroScrollSequence = ({
  initialImage,
  secondImage,
  onSequenceComplete,
}: IntroScrollSequenceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [hasTriggeredCallback, setHasTriggeredCallback] = useState(false);

  // Scroll animation for the sequence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Transform values for the second image
  const secondImageY = useTransform(
    scrollYProgress,
    [0, 0.5, 0.9, 1],
    ['100vh', '50vh', '0vh', '0vh']
  );

  const secondImageOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0.5, 1, 1]
  );

  // Check if sequence is complete
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      if (value >= 0.95) {
        setSequenceComplete(true);
      }
      
      // Trigger callback when sequence is complete and user continues scrolling
      if (sequenceComplete && value >= 0.99 && !hasTriggeredCallback) {
        setHasTriggeredCallback(true);
        onSequenceComplete();
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, sequenceComplete, hasTriggeredCallback, onSequenceComplete]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!sequenceComplete) {
        // Keep the user at the top of the sequence until it's complete
        if (window.scrollY > window.innerHeight * 1.5) {
          window.scrollTo(0, window.innerHeight * 1.5);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sequenceComplete]);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[200vh] overflow-hidden"
    >
      {/* Initial full-screen image (static) */}
      <div className="sticky top-0 h-screen w-full">
        <Image
          src={initialImage}
          alt="Initial background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Second image that slides up */}
      <motion.div 
        className="sticky top-0 h-screen w-full"
        style={{ 
          y: secondImageY,
          opacity: secondImageOpacity,
        }}
      >
        <Image
          src={secondImage}
          alt="Second image"
          fill
          className="object-cover rounded-t-3xl"
        />
      </motion.div>
    </div>
  );
};

export default IntroScrollSequence; 