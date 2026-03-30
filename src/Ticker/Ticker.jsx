import React from 'react'; 

// Receive 'scrollingText' as a prop
const Ticker = ({ scrollingText }) => {
  return (
    <div className="bg-red-600 flex items-center h-10 overflow-hidden shadow-md">
      <div className="bg-yellow-400 px-30 h-full flex items-center font-black text-red-700 z-10 skew-x-[-15deg] -ml-2">
        <span className="skew-x-[15deg] uppercase italic text-sm">Breaking News</span>
      </div>
      
      {/* The animate-marquee class will scroll whatever text is in the state */}
      <div className="flex-1 animate-marquee whitespace-nowrap text-white font-medium pl-4">
        {scrollingText}
      </div>
    </div>
  );
};

export default Ticker;