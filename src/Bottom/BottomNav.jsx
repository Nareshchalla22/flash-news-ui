import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavbar } from "../Navbar/useNavbar";
import { navItems } from '../Navbar/navdata';

const BottomNav = () => {
    const { isMobile } = useNavbar();

    // Only render on mobile devices
    if (!isMobile) return null;

    // Filter to only show key navigation points in the bottom bar
    const mobileMenu = navItems.filter(item => 
        ['Home', 'Live TV', 'Trending', 'ID Card', 'Admin'].includes(item.label)
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 text-white border-t border-slate-800 z-[100] h-18 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
            <div className="flex justify-around items-end h-full px-2 pb-2">
                {mobileMenu.map((item) => {
                    // We make 'Trending' or 'Live TV' stand out as a central button
                    const isCenter = item.label === 'Trending';

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                                flex flex-col items-center justify-center gap-1 transition-all duration-300 relative
                                ${isCenter ? 'mb-4' : 'mb-1'}
                                ${isActive ? 'text-blue-500' : 'text-slate-400 opacity-90'}
                            `}
                        >
                            {/* Icon Wrapper */}
                            <div className={`
                                transition-all duration-500 flex items-center justify-center
                                ${isCenter 
                                    ? 'w-14 h-14 bg-blue-600 rounded-full border-4 border-slate-950 shadow-xl shadow-blue-900/40 -translate-y-2 text-white' 
                                    : 'p-2'}
                                ${!isCenter && 'group-active:scale-90'}
                            `}>
                                <item.icon size={isCenter ? 24 : 22} strokeWidth={2.5} />
                            </div>

                            {/* Label */}
                            <span className={`
                                text-[9px] uppercase font-black tracking-widest leading-none
                                ${isCenter ? 'mt-0' : 'mt-0.5'}
                            `}>
                                {item.label}
                            </span>

                            {/* Active Indicator Bar */}
                            {!isCenter && (
                                <div className="absolute -bottom-2 h-1 w-6 bg-blue-600 rounded-full scale-x-0 transition-transform aria-[current=page]:scale-x-100" />
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;