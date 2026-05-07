import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tv, Zap, Contact2, Newspaper } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const BOTTOM_ITEMS = [
  { labelKey: "nav.home",     path: '/',          icon: Home      },
  { labelKey: "nav.feed",     path: '/news-feed', icon: Newspaper },
  { labelKey: "nav.liveTV",   path: '/live-tv',   icon: Tv        },
  { labelKey: "nav.trending", path: '/trending',  icon: Zap       },
  { labelKey: "nav.idCard",   path: '/id-card',   icon: Contact2  },
];

const BottomNav = () => {
  const { t } = useLang();

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-slate-950/95 backdrop-blur-md text-white border-t border-slate-800 z-[100] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-16 md:h-20 px-2">
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group
              ${isActive ? 'text-[#1DB954] active-link' : 'text-slate-400 hover:text-slate-100'}
            `}
          >
            <div className="flex items-center justify-center p-2 rounded-2xl transition-all duration-300 group-active:scale-90">
              <item.icon size={22} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5 leading-none">
              {t(item.labelKey)}
            </span>
            <div className="absolute bottom-1 w-5 h-1 bg-[#1DB954] rounded-full opacity-0 scale-x-0 transition-all duration-300 group-[.active-link]:opacity-100 group-[.active-link]:scale-x-100 shadow-[0_0_8px_rgba(29,185,84,0.6)]" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;