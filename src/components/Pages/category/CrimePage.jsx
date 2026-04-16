import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const CrimePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    newsService.getCategoryNews('crime')
      .then(res => { setNews(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-black italic">LOADING CRIME PULSE...</div>;
  return <CategoryLayout name="Crime" icon={ShieldAlert} news={news} />;
};
export default CrimePage;