import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/api';
import { navItems } from '../../Navbar/navdata';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ACTIVE_CATS = ['Global', 'National', 'Business', 'Sports', 'Entertainment', 'Health', 'Politics', 'Crime', 'State'];
const CAT_COLORS = {
  Global: '#3b82f6', National: '#10b981', Business: '#8b5cf6',
  Sports: '#f97316', Entertainment: '#ec4899', Health: '#14b8a6',
  Politics: '#6366f1', Crime: '#ef4444', State: '#f59e0b',
};

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      {' | '}
      {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
    </span>
  );
}

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = 200, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, #1e293b 25%, #263348 50%, #1e293b 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

// ─── NEWS CARD ────────────────────────────────────────────────────────────────
function NewsCard({ item, category, size = 'sm', style: extraStyle }) {
  const [imgErr, setImgErr] = useState(false);
  const color = CAT_COLORS[category] || '#ef4444';
  const path = `/category/${category?.toLowerCase()}`;

  const title = item?.title || item?.matchTitle || item?.movieTitle ||
    item?.companyName || item?.gadgetHead || 'AP13 News Update';
  const desc = item?.description || item?.summary || item?.analysis ||
    item?.gossipContent || item?.medicalAdvice || '';
  const img = item?.imageUrl;

  if (size === 'hero') {
    return (
      <Link to={path} style={{ textDecoration: 'none', display: 'block', ...extraStyle }}>
        <div style={{
          position: 'relative', height: '100%', minHeight: 480,
          borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        }}>
          {img && !imgErr ? (
            <img src={img} alt={title} onError={() => setImgErr(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transition: 'transform 0.8s ease',
              }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: color, borderRadius: 4,
              padding: '3px 10px', marginBottom: 12,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'blink 1.2s infinite' }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                Live · {category}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 800, color: '#fff',
              fontFamily: "'Oswald', sans-serif", fontStyle: 'italic',
              lineHeight: 1.15, letterSpacing: '-0.01em',
              margin: '0 0 10px', textTransform: 'uppercase',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>{title}</h2>
            {desc && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {desc}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (size === 'md') {
    return (
      <Link to={path} style={{ textDecoration: 'none' }}>
        <div className="news-card-hover" style={{
          background: '#0f172a', borderRadius: 12, overflow: 'hidden',
          border: '1px solid #1e293b', height: '100%',
          transition: 'transform 0.2s, border-color 0.2s',
        }}>
          <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
            {img && !imgErr ? (
              <img src={img} alt={title} onError={() => setImgErr(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${color}20, #0f172a)` }} />
            )}
            <div style={{ position: 'absolute', top: 8, left: 8 }}>
              <span style={{
                background: color, color: '#fff', fontSize: 8, fontWeight: 800,
                padding: '2px 7px', borderRadius: 3, letterSpacing: '0.15em',
                textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif",
              }}>{category}</span>
            </div>
          </div>
          <div style={{ padding: '12px 14px 14px' }}>
            <h3 style={{
              fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4,
              margin: 0, display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{title}</h3>
          </div>
        </div>
      </Link>
    );
  }

  // sm — list item
  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <div className="news-card-hover" style={{
        display: 'flex', gap: 10, padding: '10px 0',
        borderBottom: '1px solid #1e293b', transition: 'opacity 0.2s',
      }}>
        <div style={{ width: 64, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
          {img && !imgErr ? (
            <img src={img} alt={title} onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, opacity: 0.4 }}>📰</span>
            </div>
          )}
        </div>
        <p style={{
          fontSize: 12, fontWeight: 600, color: '#94a3b8', lineHeight: 1.5,
          margin: 0, display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{title}</p>
      </div>
    </Link>
  );
}

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
function CategorySection({ category, news }) {
  const color = CAT_COLORS[category] || '#ef4444';
  const path = `/category/${category.toLowerCase()}`;
  const [main, ...rest] = news;

  return (
    <section style={{ marginBottom: 48 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18, paddingBottom: 12,
        borderBottom: `2px solid ${color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 22, background: color, borderRadius: 2 }} />
          <h2 style={{
            fontSize: 22, fontWeight: 900, color: '#f1f5f9', margin: 0,
            fontFamily: "'Oswald', sans-serif", fontStyle: 'italic',
            letterSpacing: '0.02em', textTransform: 'uppercase',
          }}>{category}</h2>
        </div>
        <Link to={path} style={{
          fontSize: 10, fontWeight: 800, color: color, textDecoration: 'none',
          textTransform: 'uppercase', letterSpacing: '0.15em',
          fontFamily: "'Oswald', sans-serif",
          border: `1px solid ${color}40`, padding: '4px 10px', borderRadius: 4,
          transition: 'background 0.2s',
        }}>View All →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Main feature */}
        {main && (
          <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
            <NewsCard item={main} category={category} size="hero"
              style={{ height: '100%', minHeight: 280 }} />
          </div>
        )}

        {/* Side cards */}
        <div style={{ gridColumn: '2 / 4', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {rest.slice(0, 4).map((item, i) => (
            <NewsCard key={i} item={item} category={category} size="md" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PILL ──────────────────────────────────────────────────────────────
function SocialPill({ icon, label, count, url, color }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: 10,
      background: '#0f172a', border: '1px solid #1e293b',
      textDecoration: 'none', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 12,
        }}>{icon}</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{label}</span>
      </div>
      <span style={{
        fontSize: 14, fontWeight: 900, color: '#f1f5f9',
        fontFamily: "'Oswald', sans-serif", fontStyle: 'italic'
      }}>{count}</span>
    </a>
  );
}

// ─── TRENDING SIDEBAR ─────────────────────────────────────────────────────────
function TrendingSidebar({ allNews }) {
  const trending = Object.entries(allNews)
    .flatMap(([cat, items]) => items.slice(0, 2).map(item => ({ ...item, cat })))
    .slice(0, 8);

  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid #1e293b',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.08), transparent)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'blink 1.2s infinite' }} />
        <span style={{
          fontSize: 11, fontWeight: 800, color: '#ef4444',
          textTransform: 'uppercase', letterSpacing: '0.15em',
          fontFamily: "'Oswald', sans-serif"
        }}>Trending Now</span>
      </div>
      <div style={{ padding: '4px 16px 8px' }}>
        {trending.map((item, i) => {
          const title = item?.title || item?.matchTitle || item?.movieTitle || item?.companyName || 'AP13 Update';
          const color = CAT_COLORS[item.cat] || '#ef4444';
          return (
            <Link key={i} to={`/category/${item.cat?.toLowerCase()}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', gap: 10, padding: '10px 0',
                borderBottom: i < trending.length - 1 ? '1px solid #1e293b' : 'none',
                alignItems: 'flex-start',
              }}>
                <span style={{
                  fontSize: 18, fontWeight: 900, fontStyle: 'italic',
                  color: '#1e293b', fontFamily: "'Oswald', sans-serif",
                  lineHeight: 1, flexShrink: 0, minWidth: 24,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{
                    fontSize: 8, fontWeight: 800, color: color,
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                    fontFamily: "'Oswald', sans-serif", marginBottom: 3,
                  }}>{item.cat}</div>
                  <p style={{
                    fontSize: 12, fontWeight: 600, color: '#94a3b8',
                    margin: 0, lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── WEATHER WIDGET ───────────────────────────────────────────────────────────
function WeatherWidget() {
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 14, padding: '16px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Hyderabad</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', fontFamily: "'Oswald', sans-serif", lineHeight: 1 }}>34°</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>C</span>
          </div>
          <p style={{ fontSize: 11, color: '#475569', margin: '4px 0 0' }}>Partly Cloudy</p>
        </div>
        <span style={{ fontSize: 40 }}>⛅</span>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
        {[{ label: 'Humidity', val: '68%' }, { label: 'Wind', val: '14 km/h' }, { label: 'UV', val: 'High' }].map(w => (
          <div key={w.label} style={{ flex: 1 }}>
            <p style={{ fontSize: 9, color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{w.label}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: 0 }}>{w.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN HOME PAGE ───────────────────────────────────────────────────────────
export default function Home() {
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const tickerRef = useRef(null);

  const activeSections = navItems.filter(i => ACTIVE_CATS.includes(i.label));

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const newsMap = {};
        await Promise.all(activeSections.map(async (cat) => {
          try {
            const res = await newsService.getCategoryNews(cat.label.toLowerCase());
            newsMap[cat.label] = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
          } catch { newsMap[cat.label] = []; }
        }));
        setCategoryNews(newsMap);
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // Hero items from first 3 categories with data
  const heroItems = Object.entries(categoryNews)
    .filter(([, items]) => items?.length > 0)
    .slice(0, 3)
    .map(([cat, items]) => ({ cat, item: items[0] }));

  const tabs = ['All', ...ACTIVE_CATS];
  const displaySections = activeTab === 'All'
    ? activeSections
    : activeSections.filter(s => s.label === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:ital,wght@0,400;0,600;0,700;1,700;1,900&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker  { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
        .news-card-hover:hover { opacity: 0.88; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#020617',
        fontFamily: "'Source Serif 4', Georgia, serif",
        color: '#e2e8f0', paddingBottom: 80,
      }}>

        {/* ── TOP META BAR ── */}
        <div style={{
          background: '#0a0f1e', borderBottom: '1px solid #1e293b',
          padding: '6px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: '#334155', fontFamily: "'Oswald', sans-serif",
          letterSpacing: '0.05em',
        }}>
          <LiveClock />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>● LIVE</span>
            <span>Hyderabad · TS · India</span>
            <span style={{ color: '#ef4444' }}>Breaking News 24/7</span>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px 0' }}>

          {/* ── HERO GRID ── */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 40 }}>
              <Skeleton h={480} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Skeleton h={228} /> <Skeleton h={228} />
              </div>
            </div>
          ) : heroItems.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: heroItems.length === 1 ? '1fr' : '2fr 1fr',
              gap: 16, marginBottom: 40,
              animation: 'fadeUp 0.6s ease',
            }}>
              {/* Main hero */}
              {heroItems[0] && (
                <NewsCard item={heroItems[0].item} category={heroItems[0].cat} size="hero" />
              )}
              {/* Side heroes */}
              {heroItems.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {heroItems.slice(1).map(({ cat, item }, i) => (
                    <NewsCard key={i} item={item} category={cat} size="hero"
                      style={{ flex: 1, minHeight: 0 }} />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* ── CATEGORY TABS ── */}
          <div style={{
            display: 'flex', gap: 4, overflowX: 'auto',
            marginBottom: 32, paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {tabs.map(tab => {
              const active = activeTab === tab;
              const color = CAT_COLORS[tab] || '#ef4444';
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '6px 14px', borderRadius: 6, flexShrink: 0,
                  background: active ? color : '#0f172a',
                  border: `1px solid ${active ? color : '#1e293b'}`,
                  color: active ? '#fff' : '#64748b',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  fontFamily: "'Oswald', sans-serif",
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  transition: 'all 0.2s',
                }}>{tab}</button>
              );
            })}
          </div>

          {/* ── MAIN CONTENT + SIDEBAR ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

            {/* Content */}
            <div>
              {loading ? (
                [1, 2, 3].map(i => <Skeleton key={i} h={300} style={{ marginBottom: 40 }} />)
              ) : (
                displaySections.map(cat => {
                  const news = categoryNews[cat.label] || [];
                  if (!news.length) return null;
                  return (
                    <CategorySection key={cat.label} category={cat.label} news={news} />
                  );
                })
              )}
            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Weather */}
              <WeatherWidget />

              {/* Trending */}
              {!loading && Object.keys(categoryNews).length > 0 && (
                <TrendingSidebar allNews={categoryNews} />
              )}

              {/* Social stats */}
              <div style={{
                background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#475569',
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                    fontFamily: "'Oswald', sans-serif"
                  }}>Follow AP13</span>
                </div>
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <SocialPill icon="▶" label="YouTube" count="8.5K" url="https://youtube.com/@ap13news" color="#ef4444" />
                  <SocialPill icon="f" label="Facebook" count="1.2M" url="https://facebook.com/apnewslocal" color="#1877f2" />
                  <SocialPill icon="📸" label="Instagram" count="420K" url="https://instagram.com/ap13news_telugu" color="#e1306c" />
                </div>
              </div>

              {/* Join reporter CTA */}
              <Link to="/join" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: 14, padding: '18px 16px',
                  position: 'relative', overflow: 'hidden', cursor: 'pointer',
                }}>
                  <div style={{
                    position: 'absolute', top: -20, right: -20,
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                  }} />
                  <p style={{
                    fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                    fontFamily: "'Oswald', sans-serif", margin: '0 0 6px'
                  }}>Now Recruiting</p>
                  <p style={{
                    fontSize: 18, fontWeight: 900, fontStyle: 'italic',
                    color: '#fff', fontFamily: "'Oswald', sans-serif",
                    margin: '0 0 8px', lineHeight: 1.2
                  }}>
                    Become an AP13 Reporter
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    Join Hyderabad's fastest-growing digital news network.
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#fff', color: '#ef4444',
                    borderRadius: 6, padding: '6px 14px',
                    fontSize: 11, fontWeight: 800,
                    fontFamily: "'Oswald', sans-serif",
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>Apply Now ⚡</div>
                </div>
              </Link>

              {/* YouTube embed */}
              <div style={{
                background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'blink 1.2s infinite' }} />
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#ef4444',
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                    fontFamily: "'Oswald', sans-serif"
                  }}>Live on YouTube</span>
                </div>
                <div style={{ padding: 12 }}>
                  <a href="https://www.youtube.com/@ap13news" target="_blank" rel="noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: 120, background: '#020617', borderRadius: 8,
                    textDecoration: 'none', flexDirection: 'column', gap: 8, border: '1px solid #1e293b',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: '#ef4444', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>▶</div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#64748b',
                      fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em'
                    }}>Watch AP13 Live</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}