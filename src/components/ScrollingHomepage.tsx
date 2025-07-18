'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef, forwardRef } from 'react';
import { SanityHomePage } from '../lib/types';
import { urlFor } from '../lib/sanity';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

const HeroSection: React.FC<SectionProps & { data: SanityHomePage }> = ({ scrollYProgress, data }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  const heroImage = data.heroImage ? urlFor(data.heroImage).url() : '';

  return (
    <motion.section
      style={{ scale, rotate }}
      className='sticky font-semibold top-0 h-screen bg-gradient-to-t to-[#dadada] from-[#ebebeb] flex flex-col items-center justify-center text-black'
    >
      {heroImage && (
        <Image
          src={heroImage}
          alt={data.heroHeading || 'Hero Image'}
          layout='fill'
          objectFit='cover'
          className='absolute z-0'
        />
      )}
      <div className='relative z-10 text-center text-white'>
        <h1 className='2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]'>
          {data.heroHeading}
        </h1>
        <p className='text-xl md:text-2xl max-w-2xl mx-auto mt-4'>{data.heroSubheading}</p>
      </div>
    </motion.section>
  );
};

const ContentSection: React.FC<SectionProps & { section: SanityHomePage['contentSections'][0], index: number }> = ({ scrollYProgress, section, index }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  const sectionImage = section.image ? urlFor(section.image).url() : '';

  return (
    <motion.section
      style={{ scale, rotate }}
      className='relative h-screen bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white flex items-center justify-center'
    >
       {sectionImage && (
        <Image
          src={sectionImage}
          alt={section.heading || 'Content Image'}
          layout='fill'
          objectFit='cover'
          className='absolute z-0'
        />
      )}
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      <article className='container mx-auto relative z-10 text-center'>
        <h1 className='text-6xl leading-[100%] py-10 font-semibold tracking-tight'>{section.heading}</h1>
        <div className='prose prose-lg max-w-none text-white'>
          {section.text && <PortableText value={section.text} />}
        </div>
      </article>
    </motion.section>
  );
};

const ScrollingHomepage = ({ data }: { data: SanityHomePage }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const numSections = (data.contentSections?.length || 0) + 1;

  return (
    <>
      <main ref={container} className={`relative h-[${numSections * 100}vh] bg-black`}>
        <HeroSection scrollYProgress={scrollYProgress} data={data} />
        {data.contentSections?.map((section, index) => (
          <ContentSection scrollYProgress={scrollYProgress} section={section} index={index} key={index} />
        ))}
      </main>
    </>
  );
};

export default ScrollingHomepage; 