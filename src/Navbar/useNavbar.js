// src/Navbar/useNavbar.js
import { useState } from 'react';

export const useNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return { isExpanded, toggleNavbar };
};