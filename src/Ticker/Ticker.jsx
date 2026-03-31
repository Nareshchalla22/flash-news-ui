import React from 'react'; 

const Ticker = ({ scrollingText }) => {
  return (
    <div className="bg-red-600 flex items-center h-8 md:h-10 overflow-hidden shadow-md relative">
      {/* 1. THE LABEL: Reduced padding for mobile (px-4) vs Desktop (md:px-10) */}
      <div className="relative bg-yellow-400 px-4 md:px-10 h-full flex items-center font-black text-red-700 z-20 skew-x-[-15deg] -ml-2 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
        <span className="skew-x-[15deg] uppercase italic text-[10px] md:text-sm whitespace-nowrap">
          Breaking News
        </span>
      </div>
      
      {/* 2. THE SCROLLING TEXT CONTAINER */}
      <div className="flex-1 relative h-full flex items-center bg-red-600">
        <div className="animate-marquee whitespace-nowrap text-white font-bold text-xs md:text-sm tracking-wide pl-4 italic">
          {scrollingText}
          {/* Duplicate the text for a seamless loop effect if your marquee supports it */}
          <span className="mx-10 opacity-50 text-white/50">|</span>
          {scrollingText}
        </div>
      </div>

      {/* 3. Subtle Gradient Overlay to prevent text from "clashing" with the edge */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-600 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default Ticker;