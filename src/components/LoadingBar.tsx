"use client";

import React from 'react';

interface LoadingBarProps {
  message?: string;
  subMessage?: string;
}

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