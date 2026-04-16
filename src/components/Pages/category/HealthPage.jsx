import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const HealthPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Reset scroll position and show loader
    window.scrollTo(0, 0);

    // 2. API call to /api/health
    newsService.getCategoryNews('health')
      .then(res => {
        // Guard: ensure news is an array even if table is empty
        setNews(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Health news fetch failed:", err);
        setLoading(false);
      });
  }, []);

  // 3. Polished Loading View
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-black italic animate-pulse text-slate-400 uppercase tracking-tighter">
          Syncing Health Pulse...
        </div>
      </div>
    );
  }

  // 4. Shared Category View
  return (
    <CategoryLayout 
      name="Health" 
      icon={Activity} 
      news={news} 
    />
  );
};

export default HealthPage;