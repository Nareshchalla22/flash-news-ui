import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const TravelPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    newsService.getCategoryNews('travel')
      .then(res => { setNews(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-black italic">LOADING TRAVEL LOGS...</div>;
  return <CategoryLayout name="Travel" icon={Plane} news={news} />;
};
export default TravelPage;