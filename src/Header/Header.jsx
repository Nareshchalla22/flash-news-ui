import React from 'react';
import UserMenu from '../auth/UserMenu';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLang } from '../i18n/LanguageContext';

const Header = () => {
  const { t } = useLang();

  return (
    <header className="bg-[#020617] border-b-4 border-red-600 sticky top-0 z-[110] shadow-2xl overflow-visible font-sans">
      {/* Background decor */}
      <div className="absolute top-0 right-0 opacity-[0.03] select-none pointer-events-none">
        <h1 className="text-9xl font-black italic uppercase tracking-tighter text-white">AP13</h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-20 md:h-28 flex items-center justify-between relative z-10 gap-3">

        {/* ── BRAND ── */}
        <div className="flex flex-col gap-0 flex-shrink-0">
          <div className="flex items-baseline gap-1 md:gap-2">
            <span className="text-3xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-red-600 drop-shadow-[0_2px_15px_rgba(220,38,38,0.5)] transform -skew-x-12">
              AP13
            </span>
            <span className="text-xl md:text-4xl font-[900] italic uppercase tracking-tighter text-white transform -skew-x-12 ml-1">
              NEWS
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-[2px] w-5 md:w-10 bg-red-600" />
            <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
              {t("header.network")}
            </span>
          </div>
        </div>

        {/* ── RIGHT SECTION ── */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* 4K Uplink — hidden on small screens */}
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">
              {t("header.uplink")}
            </span>
            <div className="flex gap-1">
              <div className="h-1 w-3 bg-blue-600 rounded-full" />
              <div className="h-1 w-3 bg-blue-600 rounded-full" />
              <div className="h-1 w-3 bg-blue-600 rounded-full" />
              <div className="h-1 w-3 bg-blue-600 rounded-full animate-pulse" />
            </div>
          </div>

          {/* LIVE button */}
          <div className="flex items-center bg-red-600 px-2.5 py-1.5 md:px-6 md:py-3 rounded-sm shadow-[0_0_25px_rgba(220,38,38,0.4)] flex-shrink-0">
            <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping mr-1.5 md:mr-2" />
            <span className="text-sm md:text-xl font-black italic uppercase text-white tracking-tighter">
              {t("header.live")}
            </span>
          </div>

          {/* YouTube — hidden on mobile */}
          <div className="hidden md:flex flex-col items-center bg-slate-900 border border-slate-800 px-4 py-2 rounded-sm">
            <span className="text-[9px] font-bold text-red-600 uppercase">{t("header.youtube")}</span>
            <span className="text-xs font-black text-white uppercase tracking-wider">AP13Live</span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;