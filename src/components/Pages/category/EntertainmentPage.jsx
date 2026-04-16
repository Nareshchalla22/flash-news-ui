import React, { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const EntertainmentPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Reset view and start loading
    window.scrollTo(0, 0);

    // 2. Fetch data from /api/entertainment
    newsService.getCategoryNews('entertainment')
      .then(res => {
        // Safety check: ensure news is always an array
        setNews(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Entertainment fetch error:", err);
        setLoading(false);
      });
  }, []);

  // 3. Modern Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-black italic animate-pulse text-slate-400 uppercase tracking-tighter">
          Loading Entertainment Pulse...
        </div>
      </div>
    );
  }

  // 4. Render with shared layout
  return (
    <CategoryLayout 
      name="Entertainment" 
      icon={Film} 
      news={news} 
    />
  );
};

export default EntertainmentPage;