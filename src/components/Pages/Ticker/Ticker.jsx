import React, { useEffect, useState } from 'react';
import { newsService } from '../../../services/api';

const Ticker = () => {
  const [scrollingText, setScrollingText] = useState("Loading Live Feed...");

  const fetchDisplayData = async () => {
    try {
      const res = await newsService.getTicker();
      // Filter for items where isActive OR active is true
      const activeMsgs = res.data
        .filter(t => t.active === true || t.isActive === true)
        .map(t => t.message);

      setScrollingText(activeMsgs.length > 0 ? activeMsgs.join("    |    ") : "FLASHREPORT: Stay Tuned for Updates.");
    } catch {
      setScrollingText("FLASHREPORT: System checking for updates...");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDisplayData();
    })();
    const timer = setInterval(fetchDisplayData, 60000); // Refresh every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-red-600 flex items-center h-8 md:h-10 overflow-hidden shadow-md relative z-[100]">
      <div className="relative bg-yellow-400 px-4 md:px-10 h-full flex items-center font-black text-red-700 z-20 skew-x-[-15deg] -ml-2">
        <span className="skew-x-[15deg] uppercase italic text-[10px] md:text-sm whitespace-nowrap">Breaking News</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-white font-bold text-xs md:text-sm italic">
          {scrollingText} <span className="mx-20">|</span> {scrollingText}
        </div>
      </div>
    </div>
  );
};

export default Ticker;