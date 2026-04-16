import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { newsService } from '../../../services/api';
import CategoryLayout from '../../shared/CategoryLayout';

const PoliticsPage = () => {
  // 1. Get the category name from the URL (e.g., 'politics')
  const { name } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchPoliticsData = async () => {
      try {
        setLoading(true);
        // 2. Axios GET Request via newsService
        // This calls: http://localhost:8080/api/politics
        const response = await newsService.getCategoryNews(name || 'politics');
        
        console.log("Axios Response Received:", response.data);

        /** * 3. DATA NORMALIZATION
         * In Spring Boot, if you return a List, it's in response.data.
         * If you use Pagination, it's in response.data.content.
         */
        const cleanData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.content || []);

        setNews(cleanData);
      } catch (error) {
        console.error("Axios Fetch Error:", error.message);
        setNews([]); // Set empty array to prevent map errors
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticsData();
  }, [name]); // Re-run if category name changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-black italic animate-pulse text-slate-400 uppercase tracking-tighter">
          Loading {name || 'Politics'} Pulse...
        </div>
      </div>
    );
  }

  return (
    <CategoryLayout 
      name={name ? name.charAt(0).toUpperCase() + name.slice(1) : "Politics"} 
      icon={Landmark} 
      news={news} 
    />
  );
};

export default PoliticsPage;