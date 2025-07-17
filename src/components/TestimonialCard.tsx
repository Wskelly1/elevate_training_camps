import * as React from 'react';
import { motion } from 'framer-motion';

function getClientX(e: MouseEvent | TouchEvent | PointerEvent): number {
  if ('clientX' in e) return e.clientX;
  if ('touches' in e && e.touches.length > 0) return e.touches[0].clientX;
  if ('changedTouches' in e && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
  return 0;
}

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: 'front' | 'left' | 'right' | 'hidden';
  id: number;
  author: string;
  imageUrl?: string;
}

export function TestimonialCard({ handleShuffle, testimonial, position, id, author, imageUrl }: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  // Closer fan-out style logic
  let style: React.CSSProperties = {
    zIndex: position === "front" ? 3 : 2,
    opacity: position === "hidden" ? 0 : 1,
    pointerEvents: isFront ? 'auto' : 'none',
    transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  };

  let animate = {};
  if (position === 'front') {
    animate = {
      rotate: 0,
      scale: 1,
      y: 0,
      x: '-50%',
      opacity: 1,
      zIndex: 3,
      filter: 'none',
    };
  } else if (position === 'left') {
    animate = {
      rotate: -8,
      scale: 0.97,
      y: 18,
      x: '-80%',
      opacity: 1,
      zIndex: 2,
      filter: 'none',
    };
  } else if (position === 'right') {
    animate = {
      rotate: 8,
      scale: 0.97,
      y: 18,
      x: '-20%',
      opacity: 1,
      zIndex: 2,
      filter: 'none',
    };
  } else {
    animate = {
      opacity: 0,
      scale: 0.9,
      y: 40,
      zIndex: 1,
      filter: 'none',
    };
  }

  return (
    <motion.div
      style={style}
      animate={animate}
      drag={isFront}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e) => {
        dragRef.current = getClientX(e);
      }}
      onDragEnd={(e) => {
        if (dragRef.current - getClientX(e) > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`absolute select-none place-content-center space-y-6 rounded-2xl border-2 border-[#755f4f] bg-[#f8f5ee]/90 p-6 shadow-xl backdrop-blur-md h-[450px] w-[350px] ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div className="flex flex-col items-center mt-0 mb-2">
        <img
          src={imageUrl || `https://i.pravatar.cc/128?img=${id}`}
          alt={`Avatar of ${author}`}
          className="pointer-events-none mx-auto h-60 w-60 rounded-full border-2 border-[#755f4f] bg-[#e6e1d5] object-cover"
        />
      </div>
      <span className="block text-center text-lg italic text-[#7f6f51] mt-0">"{testimonial}"</span>
      <span className="block text-center text-sm font-medium text-green-700 mt-2">{author}</span>
    </motion.div>
  );
} 