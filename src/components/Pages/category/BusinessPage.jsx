import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../../components/shared/CategoryLayout';

const BusinessPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    newsService.getCategoryNews('business')
      .then(res => { setNews(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-black italic">LOADING BUSINESS...</div>;
  return <CategoryLayout name="Business" icon={Briefcase} news={news} />;
};
export default BusinessPage;