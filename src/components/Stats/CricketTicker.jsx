import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Calendar } from 'lucide-react';

const CricketTicker = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const APILAYER_KEY = "879e4ab0-8c69-4ffd-9805-8c6a5de6554f"; 

  const fetchScores = useCallback(async () => {
    try {
      const response = await fetch("https://api.apilayer.com/cricket/matches", {
        method: 'GET',
        headers: { 'apikey': APILAYER_KEY }
      });
      
      const result = await response.json();

      if (result && result.data) {
        // Sort/Filter to prioritize Live then Scheduled matches for April 18
        const processedMatches = result.data
          .filter(match => match.status !== 'Finished') // Focus on active/upcoming
          .slice(0, 6)
          .map(match => ({
            id: match.id,
            home: match.homeTeamAbbreviation || match.homeTeamName?.substring(0, 3).toUpperCase() || 'TBD',
            away: match.awayTeamAbbreviation || match.awayTeamName?.substring(0, 3).toUpperCase() || 'TBD',
            // If it's not live, show the start time or status
            score: match.status === 'In play' ? 'LIVE' : (match.startTime ? new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : match.status),
            status: match.leagueName || 'IPL 2026',
            live: match.status === 'In play',
            upcoming: match.status === 'Scheduled' || match.status === 'Upcoming'
          }));

        setMatches(processedMatches);
      }
      setLoading(false);
    } catch (error) {
      console.error("Score Sync Error:", error);
    }
  }, [APILAYER_KEY]);

  useEffect(() => {
    const initFetch = async () => { await fetchScores(); };
    initFetch();

    const interval = setInterval(() => { fetchScores(); }, 300000); 
    return () => clearInterval(interval);
  }, [fetchScores]);

  if (loading && matches.length === 0) return null;

  return (
    <div className="bg-slate-950 text-white py-2 px-4 flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-slate-800 shadow-inner">
      {/* 1. DYNAMIC BADGE */}
      <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded text-[10px] font-black uppercase shrink-0">
        {matches.some(m => m.live) ? (
          <><Trophy size={12} className="animate-pulse" /> Live Now</>
        ) : (
          <><Calendar size={12} /> Upcoming</>
        )}
      </div>

      {/* 2. MATCH LIST */}
      <div className="flex gap-8 whitespace-nowrap text-xs font-bold tracking-tight py-1">
        {matches.map((match) => (
          <div key={match.id} className="flex items-center gap-3 border-r border-slate-800 pr-8 last:border-0">
            <div className="flex items-center gap-1.5">
              <span className={match.live ? "text-white" : "text-slate-400"}>{match.home}</span>
              <span className="text-slate-600 text-[10px]">vs</span>
              <span className={match.live ? "text-white" : "text-slate-400"}>{match.away}</span>
            </div>
            
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter ${
              match.live ? "bg-red-600 text-white animate-pulse" : "bg-slate-800 text-blue-400"
            }`}>
              {match.score}
            </span>

            <span className="text-[10px] text-slate-500 font-medium italic">
              {match.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CricketTicker;