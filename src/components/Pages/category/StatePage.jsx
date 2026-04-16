import React, { useEffect, useState } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const StatePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    newsService.getCategoryNews('state')
      .then(res => { setNews(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-black italic">LOADING STATE UPDATES...</div>;
  return <CategoryLayout name="State" icon={MapIcon} news={news} />;
};
export default StatePage;