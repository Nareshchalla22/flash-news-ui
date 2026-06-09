import React, { useEffect, useState, useRef } from 'react';
import { tickerService } from '../../../services/api';
import { useLang } from '../../../i18n/LanguageContext';

const Ticker = () => {
  const { t } = useLang();
  const [tickerText, setTickerText] = useState("");
  const [loading, setLoading] = useState(true);
  const animRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await tickerService.getAll();
      if (res.data && Array.isArray(res.data)) {
        const active = res.data
          .filter(tick => tick.active === true)
          .map(tick => tick.message);
        setTickerText(
          active.length > 0
            ? active.join("   ⚡   ")
            : t("ticker.stayTuned")
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

  const displayText = loading ? t("ticker.stayTuned") : tickerText;

  return (
    <>
      <style>{`
  @keyframes ap13ticker {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  /* Mobile: normal speed */
  .ap13-ticker-track {
    animation: ap13ticker 30s linear infinite;
    white-space: nowrap;
    will-change: transform;
    display: inline-block;
  }

  /* Tablet and up */
  @media (min-width: 640px) {
    .ap13-ticker-track {
      animation-duration: 30s;
    }
  }

  /* Desktop: slower for long text */
  @media (min-width: 1024px) {
    .ap13-ticker-track {
      animation-duration: 40s;
    }
  }

  .ap13-ticker-track:hover {
    animation-play-state: paused;
  }
      `}</style>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
        background: 'rgba(255,255,255,0.28)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.38)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* ── BREAKING NEWS LABEL ── */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 14px',
          height: '100%',
          background: 'rgba(255,255,255,0.38)',
          backdropFilter: 'blur(8px)',
          borderRight: '1px solid rgba(255,255,255,0.3)',
          zIndex: 2,
          position: 'relative',
        }}>
          {/* Animated glow behind label */}
          <span style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: '0 0 20px rgba(239,68,68,0.5)',
            animation: 'pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Red live dot */}
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ef4444',
            flexShrink: 0,
            animation: 'pulse 1.2s ease-in-out infinite',
            display: 'block',
          }} />

          <span style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#dc2626',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
            fontFamily: 'system-ui, sans-serif',
            position: 'relative',
          }}>
            {t("ticker.breakingNews")}
          </span>
        </div>

        {/* ── SCROLLING TEXT AREA ── */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>

          {/* Left fade */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 24,
            background: 'linear-gradient(to right, rgba(255,255,255,0.3), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          {/* Right fade */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 24,
            background: 'linear-gradient(to left, rgba(255,255,255,0.3), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          {/* The scrolling track — text repeated twice for seamless loop */}
          <div
            ref={animRef}
            className="ap13-ticker-track"
          >
            {/* First copy */}
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1e293b',
              letterSpacing: '0.01em',
              fontFamily: 'system-ui, sans-serif',
              paddingRight: 80,
            }}>
              {displayText}
            </span>

            {/* Separator */}
            <span style={{
              fontSize: 14,
              color: '#ef4444',
              marginRight: 80,
              fontWeight: 900,
            }}>
              ●
            </span>

            {/* Second copy — seamless loop */}
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1e293b',
              letterSpacing: '0.01em',
              fontFamily: 'system-ui, sans-serif',
              paddingRight: 80,
            }}>
              {displayText}
            </span>

            {/* Separator */}
            <span style={{
              fontSize: 14,
              color: '#ef4444',
              marginRight: 80,
              fontWeight: 900,
            }}>
              ●
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticker;