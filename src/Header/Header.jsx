import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserMenu from '../auth/UserMenu';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLang } from '../i18n/LanguageContext';
import { tickerService } from '../services/api';

// ── Logo path — save your logo image to /public/logo.png ─────────────────────
const LOGO_SRC = '/logo.png';

// ─── TEXT LOGO FALLBACK (matches real logo design exactly) ───────────────────
function TextLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
      {/* Top: AP13 | NEWS */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{
          background: '#e8192c',
          padding: '6px 14px',
          borderRadius: '6px 0 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 900, fontStyle: 'italic',
            color: '#fff', lineHeight: 1,
            letterSpacing: '-0.03em', textTransform: 'uppercase',
          }}>AP13</span>
        </div>
        <div style={{
          background: '#1a1a1a',
          padding: '6px 14px',
          borderRadius: '0 6px 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #2a2a2a', borderLeft: 'none', borderBottom: 'none',
        }}>
          <span style={{
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 900, fontStyle: 'italic',
            color: '#f1f1f1', lineHeight: 1,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
          }}>NEWS</span>
        </div>
      </div>

      {/* Bottom tagline bar */}
      <div style={{
        background: '#111',
        padding: '4px 10px',
        borderRadius: '0 0 6px 6px',
        border: '1px solid #2a2a2a', borderTop: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6,
      }}>
        <span style={{ fontSize: 'clamp(8px, 1.1vw, 10px)', fontWeight: 700, color: '#d1d5db', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          తెలుగు
        </span>
        <span style={{
          fontSize: 'clamp(7px, 1vw, 9px)', fontWeight: 900,
          background: '#e8192c', color: '#fff',
          padding: '1px 5px', borderRadius: 3,
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>న్యూస్</span>
        <span style={{ fontSize: 'clamp(8px, 1.1vw, 10px)', fontWeight: 700, color: '#d1d5db', whiteSpace: 'nowrap' }}>
          చానల్
        </span>
        <span style={{ fontSize: 'clamp(8px, 1.1vw, 10px)', fontWeight: 900, color: '#f5c518', whiteSpace: 'nowrap' }}>
          24/7
        </span>
        <span style={{ color: '#444', fontSize: 10 }}>|</span>
        <span style={{ fontSize: 'clamp(7px, 1vw, 9px)', fontWeight: 700, color: '#9ca3af', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
          నిజం.. <span style={{ color: '#f5c518' }}>జనం..</span> ముందుకు....
        </span>
      </div>
    </div>
  );
}

// ─── LOGO COMPONENT — image with text fallback ────────────────────────────────
function Logo({ height = 72 }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {!imgErr ? (
        <img
          src={LOGO_SRC}
          alt="AP13 NEWS"
          style={{
            height: height,
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 2px 10px rgba(232,25,44,0.25))',
          }}
          onError={() => setImgErr(true)}
        />
      ) : (
        <TextLogo />
      )}
    </Link>
  );
}

// ─── TICKER BAR ───────────────────────────────────────────────────────────────
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
    <div style={{
      background: '#f5c518',
      height: 34,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      borderTop: '1px solid #e0b800',
      borderBottom: '1px solid #e0b800',
    }}>
      {/* BREAKING */}
      <div style={{
        flexShrink: 0, background: '#e8192c', height: '100%',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 5,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'block', animation: 'ap13LivePing 1s infinite', flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {t('ticker.breakingNews') || 'BREAKING'}
        </span>
      </div>

      {/* Arrow */}
      <div style={{ width: 0, height: 0, borderTop: '17px solid transparent', borderBottom: '17px solid transparent', borderLeft: '9px solid #e8192c', flexShrink: 0 }} />

      {/* Scrolling text */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <span className="ap13-ticker-anim" style={{ fontSize: 13, fontWeight: 700, color: '#111', paddingLeft: 14 }}>
          {text}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  );
}

// ─── MAIN HEADER ──────────────────────────────────────────────────────────────
const Header = () => {
  const { t }    = useLang();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home')          || 'Home',          path: '/'                  },
    { label: t('nav.andhra')        || 'Andhra (AP)',    path: '/category/state'    },
    { label: t('nav.telangana')     || 'Telangana',      path: '/category/national' },
    { label: t('nav.national')      || 'National',       path: '/national'          },
    { label: t('nav.crime')         || 'Crime',          path: '/crime'             },
    { label: t('nav.politics')      || 'Politics',       path: '/category/politics' },
    { label: t('nav.entertainment') || 'Entertainment',  path: '/entertainment'     },
    { label: t('nav.sports')        || 'Sports',         path: '/sports'            },
    { label: t('nav.business')      || 'Business',       path: '/business'          },
    { label: t('nav.health')        || 'Health',         path: '/health'            },
    { label: 'News Feed',                                path: '/news-feed'         },
  ];

  return (
    <>
      <style>{`
        @keyframes ap13LivePing {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(1.4); }
        }
        @keyframes ap13HdPulse {
          0%,100% { opacity:0.35; }
          50%     { opacity:1; }
        }
        @keyframes ap13TickerScroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }

        .ap13-ticker-anim {
          animation: ap13TickerScroll 38s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }
        .ap13-ticker-anim:hover { animation-play-state: paused; cursor: pointer; }

        /* NAV LINKS */
        .ap13-nav-link {
          flex-shrink: 0; padding: 0 12px; height: 100%;
          display: flex; align-items: center;
          font-size: 13px; font-weight: 700; color: #e2e8f0;
          text-decoration: none; white-space: nowrap;
          border-bottom: 3px solid transparent;
          letter-spacing: 0.01em;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .ap13-nav-link:hover { color:#fff; background:rgba(255,255,255,0.06); border-bottom-color:#f5c518; }
        .ap13-nav-link.active { color:#fff; border-bottom-color:#e8192c; background:rgba(232,25,44,0.1); }

        /* MOBILE MENU */
        .ap13-mob-menu { display:none; flex-direction:column; background:#0d1320; border-top:2px solid #e8192c; overflow:hidden; max-height:0; transition:max-height 0.3s ease; }
        .ap13-mob-menu.open { display:flex; max-height:700px; }
        .ap13-mob-link { padding:12px 20px; font-size:14px; font-weight:700; color:#cbd5e1; text-decoration:none; border-bottom:1px solid #1e293b; transition:background 0.15s,color 0.15s; }
        .ap13-mob-link:hover, .ap13-mob-link.active { background:rgba(232,25,44,0.12); color:#fff; padding-left:26px; }

        @media (max-width: 767px) {
          .ap13-ticker-anim { animation-duration: 26s; }
          .ap13-desk-only { display: none !important; }
        }
        @media (min-width: 768px) {
          .ap13-mob-only { display: none !important; }
        }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 110, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* ══ TOP BAR ══ */}
        <div style={{ background: '#0a0a0a', borderBottom: '3px solid #e8192c' }}>
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            padding: '0 14px',
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}>

            {/* LEFT — site identity (desktop only) */}
            <div className="ap13-desk-only" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', minWidth: 130 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#f1f5f9' }}>AP13 News</span>
              <span style={{ fontSize: 8, fontWeight: 600, color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
                Independent &amp; Trusted Journalism
              </span>
            </div>

            {/* CENTER — Full logo with tagline */}
            <Logo height={70} />

            {/* RIGHT — controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

              {/* 4K HD — desktop only */}
              <div className="ap13-desk-only" style={{ display:'flex', flexDirection:'column', alignItems:'center', background:'#111', border:'1px solid #222', padding:'5px 9px', borderRadius:4, gap:3 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:9, fontWeight:900, color:'#3b82f6', letterSpacing:'0.1em' }}>4K</span>
                  <span style={{ fontSize:8, fontWeight:700, color:'#6b7280' }}>HD</span>
                </div>
                <div style={{ display:'flex', gap:2 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ height:3, width:9, background:'#3b82f6', borderRadius:2, opacity:i===3?0.4:1, animation:i===3?'ap13HdPulse 1s ease-in-out infinite':'none' }} />
                  ))}
                </div>
              </div>

              {/* AP13LIVE — desktop only */}
              <div className="ap13-desk-only" style={{ display:'flex', flexDirection:'column', alignItems:'center', background:'#111', border:'1px solid #222', padding:'5px 9px', borderRadius:4, gap:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:10, fontWeight:900, color:'#e8192c' }}>▶</span>
                  <span style={{ fontSize:10, fontWeight:900, color:'#f1f1f1', letterSpacing:'0.04em', textTransform:'uppercase' }}>AP13LIVE</span>
                </div>
                <span style={{ fontSize:7, fontWeight:700, color:'#6b7280', letterSpacing:'0.1em', textTransform:'uppercase' }}>YouTube</span>
              </div>

              {/* Language Switcher — BOTH mobile & desktop */}
              <LanguageSwitcher />

              {/* LIVE TV — desktop only */}
              <Link to="/live-tv" className="ap13-desk-only" style={{
                display:'flex', alignItems:'center', gap:6,
                background:'#e8192c', padding:'7px 13px',
                borderRadius:4, textDecoration:'none',
                boxShadow:'0 0 16px rgba(232,25,44,0.35)',
                flexShrink:0, transition:'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#fff', display:'block', animation:'ap13LivePing 1s ease-in-out infinite', flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:900, fontStyle:'italic', color:'#fff', letterSpacing:'0.02em', textTransform:'uppercase' }}>LIVE TV</span>
              </Link>

              {/* User Menu — desktop only */}
              <div className="ap13-desk-only">
                <UserMenu />
              </div>

              {/* Hamburger — mobile only */}
              <button
                className="ap13-mob-only"
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: '#1a1a1a', border: '1px solid #333',
                  borderRadius: 6, padding: '7px 11px',
                  cursor: 'pointer', color: '#e2e8f0',
                  fontSize: 18, lineHeight: 1,
                }}
                aria-label="Open menu"
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* ══ YELLOW TICKER ══ */}
        <TickerBar />

        {/* ══ BLUE NAV — desktop only ══ */}
        <nav className="ap13-desk-only" style={{ background: '#1a2744', borderBottom: '1px solid #243350' }}>
          <div style={{
            maxWidth: 1400, margin: '0 auto',
            padding: '0 16px', height: 42,
            display: 'flex', alignItems: 'center', overflowX: 'auto',
          }}>
            {navLinks.map((item, i) => (
              <Link key={i} to={item.path} className={`ap13-nav-link${location.pathname === item.path ? ' active' : ''}`}>
                {item.label}
              </Link>
            ))}
            <Link to="/id-card" className="ap13-nav-link" style={{ marginLeft: 'auto', color: '#f5c518' }}>
              🪪 PRESS ID
            </Link>
          </div>
        </nav>

        {/* ══ MOBILE DROPDOWN ══ */}
        <div className={`ap13-mob-menu${menuOpen ? ' open' : ''}`}>
          {/* User + Live TV row */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserMenu />
            <Link to="/live-tv" style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#e8192c', padding: '6px 12px',
              borderRadius: 4, textDecoration: 'none',
              fontSize: 12, fontWeight: 900, color: '#fff',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }} onClick={() => setMenuOpen(false)}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'block', animation: 'ap13LivePing 1s infinite' }} />
              LIVE TV
            </Link>
          </div>

          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`ap13-mob-link${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/id-card" className="ap13-mob-link" style={{ color: '#f5c518' }} onClick={() => setMenuOpen(false)}>
            🪪 Press ID Card
          </Link>
        </div>

      </header>
    </>
  );
};

export default Header;