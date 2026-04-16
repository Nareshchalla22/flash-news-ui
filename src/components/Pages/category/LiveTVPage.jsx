import React from 'react';
import { Tv } from 'lucide-react';

const LiveTVPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-10">
        <Tv className="text-red-600" size={32} />
        <h1 className="text-4xl font-black italic uppercase">Live TV News</h1>
      </div>
      <div className="aspect-video bg-black rounded-[2rem] shadow-2xl flex items-center justify-center text-white">
        <p className="text-xl font-bold animate-pulse">Waiting for Stream Connection...</p>
      </div>
    </div>
  );
};
export default LiveTVPage;