import React, { useEffect, useState } from 'react';
import { tickerService } from '../../../services/api';

const Ticker = () => {
  const [scrollingText, setScrollingText] = useState("FLASHREPORT: Stay Tuned...");
  const [loading, setLoading] = useState(true);

  const fetchDisplayData = async () => {
    try {
      const res = await tickerService.getAll();

      if (res.data && Array.isArray(res.data)) {
        const activeMsgs = res.data
          .filter(t => t.active === true)
          .map(t => t.message);

        setScrollingText(
          activeMsgs.length > 0
            ? activeMsgs.join("    |    ")
            : "FLASHREPORT: Stay Tuned for Updates."
        );
      }
    } catch (err) {
      // Don't update text on error — keep existing text
      console.error("Ticker fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisplayData();
    const timer = setInterval(fetchDisplayData, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex items-center h-10 overflow-hidden rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg">

      {/* Label */}
      <div className="relative bg-white/40 backdrop-blur-md px-6 h-full flex items-center font-bold text-red-600 text-xs md:text-sm whitespace-nowrap border-r border-white/30">
        <span className="absolute inset-0 rounded-2xl animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.6)] opacity-70"></span>
        <span className="relative flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
          Breaking News
        </span>
      </div>

      {/* Marquee */}
      <div className="flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-slate-900 font-semibold text-xs md:text-sm">
          {scrollingText} <span className="mx-16">|</span> {scrollingText}
        </div>
      </div>

    </div>
  );
};

export default Ticker;