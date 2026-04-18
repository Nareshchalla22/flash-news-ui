import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Zap, RefreshCcw } from 'lucide-react';
import { useNavbar } from './useNavbar';
import { navItems } from './navdata';

const Navbar = () => {
  const { isExpanded, isMobile, toggleNavbar } = useNavbar();

  if (isMobile) return null;

  return (
    <aside className={`
      hidden md:flex flex-col
      fixed inset-y-0 left-0 z-50 h-screen bg-slate-900 text-slate-300 
      transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-800
      ${isExpanded ? 'w-64' : 'w-20'}
    `}>
    

      
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 h-[80px] border-b border-blue-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-500 fill-blue-500" size={20} />
          {isExpanded && (
            <span className="font-black text-white text-lg uppercase italic tracking-tighter">
              FlashReport
            </span>
          )}
        </div>
        
        <button 
          onClick={toggleNavbar} 
          className="text-slate-500 hover:text-white ml-auto transition-colors mt-4"
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Scrollable Nav Items */}
      <nav className="mt-4 px-3 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all group
              ${isActive 
                ? 'bg-blue-600/10 text-blue-500' 
                : 'hover:bg-slate-800 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                {/* ACTIVE LEFT INDICATOR (Replaces Pulse) */}
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[4px_0_12px_rgba(59,130,246,0.5)]" />
                )}

                <item.icon 
                  size={22} 
                  className={`min-w-[22px] transition-transform duration-300 ${isActive ? 'scale-110 text-blue-500' : 'group-hover:scale-110'}`} 
                />
                
                {isExpanded && (
                  <span className={`font-bold text-sm tracking-tight transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Link */}
      <div className="mt-auto p-4 border-t border-slate-800">
        <Link 
          to="/update-data" 
          className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-blue-500 transition-all group"
        >
          <RefreshCcw size={22} className="min-w-[22px] group-hover:rotate-180 transition-transform duration-500" />
          {isExpanded && <span className="font-bold text-sm">System Update</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Navbar;