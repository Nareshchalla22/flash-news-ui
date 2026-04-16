import { useState, useEffect } from 'react';
import { newsService } from '../services/api';
import * as LucideIcons from 'lucide-react';

export const useNavData = () => {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const response = await newsService.getNavigation();
        
        // Transform the raw data to include the actual Icon Component
        const transformedData = response.data.map(item => ({
          ...item,
          icon: LucideIcons[item.iconName] || LucideIcons.HelpCircle
        }));

        setNavItems(transformedData);
      } catch (error) {
        console.error("Error loading navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNav();
  }, []);

  return { navItems, loading };
};