import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

const CricketTicker = () => {
  const [matches, setMatches] = useState([
    { id: 1, home: 'MI', away: 'PBKS', score: 'Starts at 19:30', status: 'IPL 2026 - Match 24', live: false },
    { id: 2, home: 'RCB', away: 'LSG', score: 'RCB won by 5 wickets', status: 'Match 23 Result', live: false }
  ]);

  // Use this function to plug in your real API
  const fetchScores = async () => {
    try {
      // Example API: replace with your actual endpoint
      // const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=YOUR_KEY');
      // const data = await response.json();
      // setMatches(data.matches);
      
      console.log("Fetching latest scores for April 16, 2026...");
    } catch (error) {
      console.error("Score fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 text-white py-2 px-4 flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-slate-800 shadow-inner">
      {/* Live Badge - Only shows if any match is truly live */}
      <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase animate-pulse shrink-0">
        <Trophy size={12} /> {matches.some(m => m.live) ? 'Live Now' : 'IPL 2026'}
      </div>

      <div className="flex gap-8 whitespace-nowrap text-xs font-bold tracking-tight py-1">
        {matches.map((match) => (
          <div key={match.id} className="flex items-center gap-3 border-r border-slate-800 pr-8 last:border-0">
            <div className="flex items-center gap-1.5">
              <span className={match.live ? "text-white" : "text-slate-400"}>{match.home}</span>
              <span className="text-slate-600 text-[10px]">vs</span>
              <span className={match.live ? "text-white" : "text-slate-400"}>{match.away}</span>
            </div>
            
            <span className={`px-2 py-0.5 rounded ${match.live ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-400"}`}>
              {match.score}
            </span>

            <span className="text-[10px] text-slate-500 font-medium">
              {match.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CricketTicker;