import { useState, useEffect } from 'react';

export const useNavbar = () => {
  // 1. Initial state check: Is the screen narrower than 768px?
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobileStatus = window.innerWidth < 768;
      setIsMobile(mobileStatus);

      // Optional: Auto-collapse the sidebar when switching to mobile
      if (mobileStatus) {
        setIsExpanded(false);
      }
    };

    // 2. Listen for window resize events
    window.addEventListener('resize', handleResize);

    // 3. Clean up the listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleNavbar = () => {
    setIsExpanded((prev) => !prev);
  };

  return { isExpanded, isMobile, toggleNavbar };
};