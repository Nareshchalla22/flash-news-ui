import React, { useEffect, useState } from 'react';
import { tickerService } from '../../../services/api';
import { useLang } from '../../../i18n/LanguageContext';

export default function Ticker() {
  const { t } = useLang();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tickerService.getAll();
        if (res.data && Array.isArray(res.data)) {
          const active = res.data
            .filter(tick => tick.active === true)
            .map(tick => tick.message);
          setText(active.length > 0
            ? active.join('   ⚡   ')
            : t('ticker.stayTuned'));
        }
      } catch {
        // keep existing
      } finally {
        setLoading(false);
      }
    };
    fetch();
    const id = setInterval(fetch, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = loading ? (t('ticker.stayTuned') || 'Loading...') : text;

  return (
    <div className="flex items-stretch bg-[#111] border-b border-[#222] overflow-hidden h-9">

      {/* BREAKING label */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 px-3"
        style={{ clipPath:'polygon(0 0,100% 0,90% 100%,0 100%)', paddingRight:20 }}
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping flex-shrink-0" />
        <span className="text-[10px] font-black text-white tracking-[0.15em] uppercase whitespace-nowrap">
          {t('ticker.breakingNews') || 'BREAKING'}
        </span>
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden flex items-center relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none" />

        <div
          className="whitespace-nowrap inline-flex items-center gap-0"
          style={{ animation:'tickerRun 35s linear infinite' }}
        >
          {/* Repeated twice for seamless loop */}
          {[0, 1].map(copy => (
            <span key={copy} className="inline-flex items-center">
              <span className="text-[12px] font-semibold text-[#f1f1f1] tracking-[0.01em] pl-8">
                {display}
              </span>
              <span className="text-red-500 font-black text-sm mx-8">●</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerRun {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Mobile: faster */
        @media (max-width: 640px) {
          div[style*="tickerRun"] > div,
          div[style*="animation"] {
            animation-duration: 22s !important;
          }
        }
        /* Desktop: slower */
        @media (min-width: 1024px) {
          div[style*="tickerRun"] {
            animation-duration: 45s !important;
          }
        }
      `}</style>
    </div>
  );
}