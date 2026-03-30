import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useNavbar } from './useNavbar';
import { navItems } from './navdata';

const Navbar = () => {
  const { isExpanded, isMobile, toggleNavbar } = useNavbar();

  // 1. FILTER LOGIC: Remove items that belong in the BottomNav on mobile
  const filteredSidebarItems = navItems.filter((item) => {
    if (isMobile) {
      return !['Live TV', 'Trending', 'ID Card', 'Login'].includes(item.label);
    }
    return true; // Show everything on Desktop
  });

  return (
    <>
      {/* MOBILE TOGGLE (Fixed Top Left) */}
      {isMobile && (
        <button 
          onClick={toggleNavbar}
          className="fixed top-4 left-4 z-[70] p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          {isExpanded ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* THE FIXED NAVBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 h-screen bg-slate-900 text-slate-300 
        transition-all duration-300 shadow-2xl border-r border-slate-800
        ${isExpanded ? 'w-64 translate-x-0' : isMobile ? '-translate-x-full' : 'w-20'}
      `}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 h-[80px] border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          {(isExpanded || isMobile) && (
            <div className="flex items-center gap-2">
              <Zap className="text-blue-500 fill-blue-500" size={20} />
              <span className="font-black text-white text-lg uppercase italic tracking-tighter">FlashReport</span>
            </div>
          )}
          {!isMobile && (
            <button onClick={toggleNavbar} className="text-slate-500 hover:text-white transition-colors ml-auto">
              {isExpanded ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {/* Scrollable Nav Items (Using Filtered List) */}
        <nav className="mt-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          {filteredSidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => isMobile && toggleNavbar()} 
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={`min-w-[22px] ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                  {(isExpanded || isMobile) && (
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isMobile && isExpanded && (
        <div 
          onClick={toggleNavbar} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        />
      )}
    </>
  );
};

export default Navbar;