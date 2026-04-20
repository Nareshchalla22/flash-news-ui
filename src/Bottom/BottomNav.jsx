import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../Navbar/navdata';

const BottomNav = () => {
    const menuItems = navItems.filter(item => 
        ['Home', 'Live TV', 'Trending', 'ID Card', 'Admin'].includes(item.label)
    );

    return (
        /* Changed 'fixed' to 'sticky' */
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-slate-950/95 backdrop-blur-md text-white border-t border-slate-800 z-[100] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-4xl mx-auto flex justify-around items-center h-16 md:h-20 px-2">
                {menuItems.map((item) => {
                    // eslint-disable-next-line no-unused-vars
                    const isCenter = item.label === 'Trending';

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                                flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group
                                ${isActive ? 'text-blue-500 active-link' : 'text-slate-400 hover:text-slate-100'}
                            `}
                        >
                            {/* Unified Icon Wrapper */}
                            <div className="flex items-center justify-center p-2 rounded-2xl transition-all duration-300 group-active:scale-90">
                                <item.icon 
                                    size={24} 
                                    strokeWidth={2.5} 
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                                />
                            </div>

                            {/* Aligned Label */}
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                                {item.label}
                            </span>

                            {/* Active Indicator Bar */}
                            <div className="absolute bottom-1 w-6 h-1 bg-blue-600 rounded-full opacity-0 scale-x-0 transition-all duration-300 group-[.active-link]:opacity-100 group-[.active-link]:scale-x-100 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;