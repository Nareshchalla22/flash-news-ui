import React from 'react';
import { Trophy } from 'lucide-react';

const CricketTicker = () => {
  return (
    <div className="bg-slate-900 text-white py-2 px-4 flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-slate-800">
      <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase animate-pulse">
        <Trophy size={12} /> Live
      </div>
      <div className="flex gap-8 whitespace-nowrap text-xs font-bold tracking-tight">
        <div className="flex items-center gap-2 border-r border-slate-700 pr-8">
          <span>IND 342/4</span> <span className="text-slate-500 text-[10px]">vs</span> <span>AUS</span>
          <span className="text-yellow-400 ml-2">Day 3, Session 2</span>
        </div>
        <div className="flex items-center gap-2">
          <span>MI 186/2 (18.2)</span> <span className="text-slate-500 text-[10px]">vs</span> <span>CSK</span>
          <span className="text-green-400 ml-2">MI needs 12 off 10</span>
        </div>
      </div>
    </div>
  );
};
export default CricketTicker;