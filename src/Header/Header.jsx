import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserMenu from '../auth/UserMenu';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLang } from '../i18n/LanguageContext';
import { tickerService } from '../services/api';

// ─── TICKER BAR (yellow like Varta Prapancham) ────────────────────────────────
function TickerBar() {
  const { t } = useLang();
  const [text, setText] = useState(
    t('ticker.stayTuned') || 'AP13 News — Breaking news from Andhra Pradesh & Telangana, 24/7 Live Coverage'
  );

  useEffect(() => {
    const load = () => {
      tickerService.getAll?.()
        .then(res => {
          if (Array.isArray(res?.data) && res.data.length > 0) {
            const active = res.data.filter(x => x.active).map(x => x.message);
            if (active.length > 0) setText(active.join('   ⚡   '));
          }
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes ap13TickerScroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .ap13-ticker-text {
          animation: ap13TickerScroll 38s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }
        .ap13-ticker-text:hover { animation-play-state: paused; cursor: pointer; }
        @media (max-width: 640px) {
          .ap13-ticker-text { animation-duration: 28s; }
        }
      `}</style>

      <div style={{
        background: '#f5c518',
        height: 36,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid #e0b800',
        borderBottom: '1px solid #e0b800',
      }}>
        {/* BREAKING badge */}
        <div style={{
          flexShrink: 0,
          background: '#e8192c',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 6,
          zIndex: 2,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#fff', display: 'block',
            animation: 'livePing 1s infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 11, fontWeight: 900,
            color: '#fff', letterSpacing: '0.1em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {t('ticker.breakingNews') || 'BREAKING'}
          </span>
        </div>

        {/* Divider arrow */}
        <div style={{
          width: 0, height: 0,
          borderTop: '18px solid transparent',
          borderBottom: '18px solid transparent',
          borderLeft: '10px solid #e8192c',
          flexShrink: 0,
        }} />

        {/* Scrolling text */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <span className="ap13-ticker-text" style={{
            fontSize: 13, fontWeight: 700,
            color: '#111', paddingLeft: 16,
          }}>
            {text}
            &nbsp;&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;&nbsp;
            {text}
          </span>
        </div>
      </div>
    </>
  );
}

// ─── MAIN HEADER ──────────────────────────────────────────────────────────────
const Header = () => {
  const { t }    = useLang();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home')          || 'Home',          path: '/'                      },
    { label: t('nav.andhra')        || 'Andhra (AP)',    path: '/category/state'        },
    { label: t('nav.telangana')     || 'Telangana',      path: '/category/national'     },
    { label: t('nav.national')      || 'National',       path: '/national'              },
    { label: t('nav.crime')         || 'Crime',          path: '/crime'                 },
    { label: t('nav.politics')      || 'Politics',       path: '/category/politics'     },
    { label: t('nav.entertainment') || 'Entertainment',  path: '/entertainment'         },
    { label: t('nav.sports')        || 'Sports',         path: '/sports'                },
    { label: t('nav.business')      || 'Business',       path: '/business'              },
    { label: t('nav.health')        || 'Health',         path: '/health'                },
    { label: 'News Feed',                                path: '/news-feed'             },
  ];

  return (
    <>
      <style>{`
        @keyframes livePing {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.45; transform:scale(1.4); }
        }
        @keyframes hdPulse {
          0%,100% { opacity:0.35; }
          50%     { opacity:1; }
        }

        /* ── NAV LINKS ── */
        .ap13-nav-link {
          flex-shrink: 0;
          padding: 0 13px;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          letter-spacing: 0.01em;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .ap13-nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
          border-bottom-color: #f5c518;
        }
        .ap13-nav-link.active {
          color: #fff;
          border-bottom-color: #e8192c;
          background: rgba(232,25,44,0.1);
        }

        /* ── MOBILE MENU ── */
        .ap13-mobile-menu {
          display: none;
          flex-direction: column;
          background: #111827;
          border-top: 2px solid #e8192c;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .ap13-mobile-menu.open {
          display: flex;
          max-height: 600px;
        }
        .ap13-mobile-link {
          padding: 11px 20px;
          font-size: 13px;
          font-weight: 700;
          color: #cbd5e1;
          text-decoration: none;
          border-bottom: 1px solid #1e293b;
          transition: background 0.15s, color 0.15s;
        }
        .ap13-mobile-link:hover, .ap13-mobile-link.active {
          background: rgba(232,25,44,0.12);
          color: #fff;
        }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 110, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* ══ TOP BAR ══ */}
        <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            padding: '0 16px', height: 68,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
          }}>

            {/* LEFT — Site identity */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: 'clamp(13px, 1.8vw, 17px)',
                fontWeight: 900, color: '#f1f5f9',
                letterSpacing: '-0.01em',
              }}>
                AP13 News
              </span>
              <span style={{
                fontSize: 8, fontWeight: 600,
                color: '#4b5563', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginTop: 2,
              }}>
                Independent &amp; Trusted Journalism
              </span>
            </div>

            {/* CENTER — Logo (Varta Prapancham style) */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
              {/* Red AP13 box */}
              <div style={{
                background: '#e8192c',
                padding: '8px 12px',
                borderRadius: '5px 0 0 5px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(232,25,44,0.3)',
              }}>
                <span style={{
                  fontSize: 'clamp(22px, 3.5vw, 34px)',
                  fontWeight: 900, fontStyle: 'italic',
                  color: '#fff', lineHeight: 1,
                  letterSpacing: '-0.03em', textTransform: 'uppercase',
                }}>AP13</span>
              </div>
              {/* Dark NEWS box */}
              <div style={{
                background: '#181818',
                padding: '8px 12px',
                borderRadius: '0 5px 5px 0',
                border: '1px solid #2a2a2a', borderLeft: 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 'clamp(17px, 2.8vw, 27px)',
                  fontWeight: 900, fontStyle: 'italic',
                  color: '#f1f1f1', lineHeight: 1,
                  letterSpacing: '-0.02em', textTransform: 'uppercase',
                }}>NEWS</span>
                <span style={{
                  fontSize: 'clamp(7px, 1vw, 9px)',
                  fontWeight: 700, color: '#6b7280',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  marginTop: 2, whiteSpace: 'nowrap',
                }}>
                  {t('header.network') || 'లైవ్ 24/7 న్యూస్'}
                </span>
              </div>
            </Link>

            {/* RIGHT — Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

              {/* 4K HD badge — desktop only */}
              <div className="hidden sm:flex" style={{
                flexDirection: 'column', alignItems: 'center',
                background: '#111', border: '1px solid #222',
                padding: '5px 10px', borderRadius: 4, gap: 3,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: '#3b82f6', letterSpacing: '0.1em' }}>4K</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em' }}>HD</span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{
                      height: 3, width: 10, background: '#3b82f6', borderRadius: 2,
                      opacity: i === 3 ? 0.4 : 1,
                      animation: i === 3 ? 'hdPulse 1s ease-in-out infinite' : 'none',
                    }} />
                  ))}
                </div>
              </div>

              {/* AP13LIVE YouTube — desktop only */}
              <div className="hidden md:flex" style={{
                flexDirection: 'column', alignItems: 'center',
                background: '#111', border: '1px solid #222',
                padding: '5px 10px', borderRadius: 4, gap: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#e8192c' }}>▶</span>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#f1f1f1', letterSpacing: '0.04em', textTransform: 'uppercase' }}>AP13LIVE</span>
                </div>
                <span style={{ fontSize: 7, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>YouTube</span>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* LIVE TV button */}
              <Link to="/live-tv" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#e8192c', padding: '8px 14px',
                borderRadius: 4, textDecoration: 'none',
                boxShadow: '0 0 18px rgba(232,25,44,0.4)',
                flexShrink: 0, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#fff', display: 'block',
                  animation: 'livePing 1s ease-in-out infinite', flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 'clamp(11px, 1.8vw, 15px)',
                  fontWeight: 900, fontStyle: 'italic',
                  color: '#fff', letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}>
                  LIVE TV
                </span>
              </Link>

              {/* User Menu (LOGIN button if not logged in) */}
              <UserMenu />

              {/* Hamburger — mobile only */}
              <button
                className="md:hidden"
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: 4, padding: '7px 10px',
                  cursor: 'pointer', color: '#e2e8f0', fontSize: 17,
                  lineHeight: 1,
                }}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* ══ YELLOW TICKER BAR ══ */}
        <TickerBar />

        {/* ══ BLUE NAV BAR — desktop ══ */}
        <nav className="hidden md:block" style={{
          background: '#1a2744',
          borderBottom: '1px solid #243350',
        }}>
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            padding: '0 16px', height: 42,
            display: 'flex', alignItems: 'center',
            overflowX: 'auto',
          }}>
            {navLinks.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className={`ap13-nav-link${location.pathname === item.path ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}

            {/* Press ID — right aligned */}
            <Link
              to="/id-card"
              className="ap13-nav-link"
              style={{ marginLeft: 'auto', color: '#f5c518' }}
            >
              🪪 PRESS ID
            </Link>
          </div>
        </nav>

        {/* ══ MOBILE DROPDOWN MENU ══ */}
        <div className={`ap13-mobile-menu${menuOpen ? ' open' : ''}`}>
          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`ap13-mobile-link${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/id-card" className="ap13-mobile-link" style={{ color: '#f5c518' }} onClick={() => setMenuOpen(false)}>
            🪪 Press ID Card
          </Link>
        </div>

      </header>
    </>
  );
};

export default Header;