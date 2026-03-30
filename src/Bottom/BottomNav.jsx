import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavbar } from "../Navbar/useNavbar";
import { navItems } from '../Navbar/navdata'; // 1. Import from your data file

const BottomNav = () => {
    const { isMobile } = useNavbar();

    if (!isMobile) return null;

    // 2. Logic: Filter to only show the key icons for the bottom bar
    // This looks for Home, Live TV, Trending, ID Card, and Login in your list
    const mobileMenu = navItems.filter(item => 
        ['Home', 'Live TV', 'Trending', 'ID Card', 'Admin'].includes(item.label)
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#000088] text-white border-t border-blue-900 z-[100] h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
            <div className="flex justify-around items-center h-full">
                {mobileMenu.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 transition-colors
                            ${isActive ? 'text-yellow-400 font-bold scale-110' : 'text-slate-300 opacity-80'}
                        `}
                    >
                        {/* 3. Render the icon from your navdata */}
                        <item.icon size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;