import React, { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const SciencePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Reset scroll and initialize loading
    window.scrollTo(0, 0);

    // 2. Fetch from /api/science
    newsService.getCategoryNews('science')
      .then(res => {
        // Guard against null/undefined data
        setNews(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Science data fetch error:", err);
        setLoading(false);
      });
  }, []);

  // 3. Science-themed Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-black italic animate-pulse text-slate-400 uppercase tracking-tighter">
          Analyzing Science Pulse...
        </div>
      </div>
    );
  }

  // 4. Render Layout
  return (
    <CategoryLayout 
      name="Science" 
      icon={FlaskConical} 
      news={news} 
    />
  );
};

export default SciencePage;