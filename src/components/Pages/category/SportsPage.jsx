import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';

// 1. Import the missing Layout and Data
import CategoryLayout from '../../shared/CategoryLayout'; 
import { newsData } from '../../Data/newsdata';

const SportsPage = () => {
  // 2. Filter data to show ONLY sports
  const filteredNews = newsData.filter(
    item => item.category.toLowerCase() === 'sports'
  );

  // 3. Scroll to top when the user enters the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <CategoryLayout 
      name="Sports" 
      icon={Trophy} 
      news={filteredNews} 
    />
  );
};

export default SportsPage;