import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useNavbar } from './useNavbar';
import { navItems } from './navdata';

const Navbar = () => {
  const { isExpanded, isMobile, toggleNavbar } = useNavbar();

  // STOPS rendering the sidebar on mobile 
  // because we are using BottomNav instead
  if (isMobile) return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 z-[70] justify-between">
       <div className="flex items-center gap-2">
          <Zap className="text-blue-500 fill-blue-500" size={18} />
          <span className="font-black text-white text-md uppercase italic tracking-tighter">FlashReport</span>
       </div>
       {/* You can add a profile icon or notification bell here */}
    </div>
  );

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 h-screen bg-slate-900 text-slate-300 
      transition-all duration-300 shadow-2xl border-r border-slate-800
      ${isExpanded ? 'w-64' : 'w-20'}
    `}>
      
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 h-[80px] border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Zap className="text-blue-500 fill-blue-500" size={20} />
            <span className="font-black text-white text-lg uppercase italic tracking-tighter">FlashReport</span>
          </div>
        )}
        <button onClick={toggleNavbar} className={`text-slate-500 hover:text-white transition-colors ${!isExpanded && 'mx-auto'}`}>
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="mt-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-3 py-3 rounded-xl transition-all group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 hover:text-white'}
              ${!isExpanded && 'justify-center'}
            `}
          >
            <item.icon size={22} className="min-w-[22px]" />
            {isExpanded && (
              <span className="font-bold text-sm tracking-tight whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Navbar;