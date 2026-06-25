import React, { useEffect, useState } from 'react';
import { tickerService } from '../../../services/api';
import { useLang } from '../../../i18n/LanguageContext';

const Ticker = () => {
  const { t } = useLang();
  const [tickerText, setTickerText] = useState('');
  const [loading, setLoading]       = useState(true);

  const fetchData = async () => {
    try {
      const res = await tickerService.getAll();
      if (Array.isArray(res.data)) {
        const active = res.data
          .filter(tick => tick.active === true)
          .map(tick => tick.message);
        setTickerText(
          active.length > 0
            ? active.join('   ⚡   ')
            : t('ticker.stayTuned') || 'AP13 News — Stay tuned for breaking news'
        );
      }
    } catch {
      // keep existing text on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayText = loading
    ? (t('ticker.stayTuned') || 'AP13 News — Loading...')
    : tickerText;

  // ── Calculate animation duration based on text length ─────────────────────
  // Longer text = more time so speed stays consistent across all lengths
  const duration = Math.max(20, Math.min(60, displayText.length * 0.35));

  return (
    <>
      <style>{`
        @keyframes ap13TickerScroll {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ap13-ticker-inner {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          animation: ap13TickerScroll var(--ticker-duration, 35s) linear infinite;
        }
        .ap13-ticker-inner:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
      `}</style>

      <div style={{
        display:        'flex',
        alignItems:     'center',
        height:         38,
        background:     '#f5c518',
        overflow:       'hidden',
        position:       'relative',
        borderTop:      '1px solid #e0b800',
        borderBottom:   '1px solid #e0b800',
      }}>

        {/* ── BREAKING label ── */}
        <div style={{
          flexShrink:   0,
          background:   '#e8192c',
          height:       '100%',
          display:      'flex',
          alignItems:   'center',
          padding:      '0 14px',
          gap:          6,
          zIndex:       2,
        }}>
          {/* Pulsing dot */}
          <span style={{
            width:        7,
            height:       7,
            borderRadius: '50%',
            background:   '#fff',
            display:      'block',
            flexShrink:   0,
            animation:    'pulse 1.2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize:      11,
            fontWeight:    900,
            color:         '#fff',
            whiteSpace:    'nowrap',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily:    'system-ui, sans-serif',
          }}>
            {t('ticker.breakingNews') || 'BREAKING'}
          </span>
        </div>

        {/* Arrow divider */}
        <div style={{
          width:        0,
          height:       0,
          borderTop:    '19px solid transparent',
          borderBottom: '19px solid transparent',
          borderLeft:   '10px solid #e8192c',
          flexShrink:   0,
        }} />

        {/* ── Scrolling text area ── */}
        <div style={{
          flex:        1,
          overflow:    'hidden',
          height:      '100%',
          display:     'flex',
          alignItems:  'center',
          position:    'relative',
        }}>
          {/* Left fade */}
          <div style={{
            position:   'absolute', left: 0, top: 0, bottom: 0, width: 20,
            background: 'linear-gradient(to right, #f5c518, transparent)',
            zIndex:     1, pointerEvents: 'none',
          }} />

          {/* Right fade */}
          <div style={{
            position:   'absolute', right: 0, top: 0, bottom: 0, width: 20,
            background: 'linear-gradient(to left, #f5c518, transparent)',
            zIndex:     1, pointerEvents: 'none',
          }} />

          {/* Scrolling track — text repeated twice for seamless loop */}
          <div
            className="ap13-ticker-inner"
            style={{ '--ticker-duration': `${duration}s` }}
          >
            <span style={{
              fontSize:      13,
              fontWeight:    700,
              color:         '#111',
              fontFamily:    'system-ui, sans-serif',
              paddingLeft:   16,
              paddingRight:  60,
            }}>
              {displayText}
            </span>
            <span style={{ color: '#e8192c', fontWeight: 900, paddingRight: 60 }}>●</span>
            {/* Second copy for seamless loop */}
            <span style={{
              fontSize:      13,
              fontWeight:    700,
              color:         '#111',
              fontFamily:    'system-ui, sans-serif',
              paddingRight:  60,
            }}>
              {displayText}
            </span>
            <span style={{ color: '#e8192c', fontWeight: 900, paddingRight: 60 }}>●</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticker;