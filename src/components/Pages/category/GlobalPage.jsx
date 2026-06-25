import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { newsService } from '../../../services/api';
import { fetchCategoryNews } from '../../../utils/newsUtils';
import CategoryLayout from '../../shared/CategoryLayout';

const GlobalPage = () => {
  const [news,    setNews]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryNews(newsService, 'global')
      .then(data => { setNews(data); setLoading(false); })
      .catch(()   => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-black italic animate-pulse text-slate-400 uppercase tracking-tighter">
          Loading Global...
        </div>
      </div>
    );
  }

  return <CategoryLayout name="Global" icon={Globe} news={news} />;
};

export default GlobalPage;