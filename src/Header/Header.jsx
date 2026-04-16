import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#020617] border-b-4 border-red-600 sticky top-0 z-[110] shadow-2xl overflow-hidden font-sans">
      {/* 1. 4K TEXT BACKGROUND DECOR (Subtle background text) */}
      <div className="absolute top-0 right-0 opacity-[0.03] select-none pointer-events-none">
        <h1 className="text-9xl font-black italic uppercase tracking-tighter text-white">AP13</h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 h-20 md:h-28 flex items-center justify-between relative z-10">
        
        {/* --- SECTION 1: THE BRAND (AP13 NEWS) --- */}
        <div className="flex flex-col gap-0">
          <div className="flex items-baseline gap-1 md:gap-2">
            <span className="text-4xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-red-600 drop-shadow-[0_2px_15px_rgba(220,38,38,0.5)] transform -skew-x-12">
              AP13
            </span>
            <span className="text-2xl md:text-4xl font-[900] italic uppercase tracking-tighter text-white transform -skew-x-12 ml-1">
              NEWS
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-[2px] w-6 md:w-10 bg-red-600"></div>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">FlashReport Network</span>
          </div>
        </div>

        {/* --- SECTION 2: STATUS & LIVE BLOCK --- */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* HD SIGNAL INDICATOR */}
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">4K Uplink</span>
            <div className="flex gap-1">
              <div className="h-1 w-3 bg-blue-600 rounded-full"></div>
              <div className="h-1 w-3 bg-blue-600 rounded-full"></div>
              <div className="h-1 w-3 bg-blue-600 rounded-full"></div>
              <div className="h-1 w-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* DYNAMIC LIVE BUTTON */}
          <div className="flex items-center bg-red-600 px-4 py-2 md:px-8 md:py-4 rounded-sm shadow-[0_0_25px_rgba(220,38,38,0.4)]">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-ping mr-2 md:mr-3"></div>
            <span className="text-sm md:text-2xl font-black italic uppercase text-white tracking-tighter">
              LIVE
            </span>
          </div>
          
          {/* YOUTUBE BRANDING */}
          <div className="hidden md:flex flex-col items-center bg-slate-900 border border-slate-800 px-4 py-2 rounded-sm">
             <span className="text-[9px] font-bold text-red-600 uppercase">YouTube</span>
             <span className="text-xs font-black text-white uppercase tracking-wider">AP13Live</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;