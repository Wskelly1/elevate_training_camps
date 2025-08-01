"use client";

import React from 'react';

interface LoadingBarProps {
  message?: string;
  subMessage?: string;
}

/**
 * LoadingBar - Full-screen loading indicator component
 *
 * This component displays a loading screen with a message, animated progress bar,
 * and optional subtext. It's designed to provide visual feedback during data fetching
 * or other asynchronous operations.
 *
 * Features:
 * - Animated progress bar with smooth transitions
 * - Customizable messages
 * - Styled to match the site's color scheme
 * - Full-screen overlay for consistent user experience
 *
 * @param {Object} props - Component props
 * @param {string} [props.message="Loading..."] - Primary loading message
 * @param {string} [props.subMessage="Please wait while we prepare your experience"] - Secondary explanatory message
 */
const LoadingBar: React.FC<LoadingBarProps> = ({
  message = "Loading...",
  subMessage = "Please wait while we prepare your experience"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0ead6]">
      <div className="text-3xl font-bold mb-8 text-[#2E5631]">{message}</div>
      <div className="w-64 h-2 bg-[#D6CBB4] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2E5631] animate-pulse"
          style={{
            width: '100%',
            animation: 'loading 2s infinite ease-in-out'
          }}
        />
      </div>
      <div className="mt-4 text-sm text-[#755f4f]">{subMessage}</div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingBar;
