import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../../services/api';

// ─── CATEGORIES CONFIG ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'global',        label: 'Global',        color: '#1DB954', emoji: '🌍' },
  { key: 'national',      label: 'National',       color: '#3b82f6', emoji: '🇮🇳' },
  { key: 'state',         label: 'State',          color: '#f59e0b', emoji: '📍' },
  { key: 'business',      label: 'Business',       color: '#8b5cf6', emoji: '💼' },
  { key: 'crime',         label: 'Crime',          color: '#ef4444', emoji: '🚨' },
  { key: 'entertainment', label: 'Entertainment',  color: '#ec4899', emoji: '🎬' },
  { key: 'sports',        label: 'Sports',         color: '#f97316', emoji: '🏆' },
  { key: 'health',        label: 'Health',         color: '#14b8a6', emoji: '❤️' },
  { key: 'politics',      label: 'Politics',       color: '#6366f1', emoji: '🏛️' },
  { key: 'travel',        label: 'Travel',         color: '#06b6d4', emoji: '✈️' },
  { key: 'technology',    label: 'Technology',     color: '#10b981', emoji: '💻' },
];

// ─── Extract universal fields ─────────────────────────────────────────────────
function extract(item, catKey) {
  if (!item) return { title: '', description: '', imageUrl: '' };
  return {
    title:
      item.title || item.matchTitle || item.movieTitle ||
      item.companyName || item.gadgetHead || item.headline || 'AP13 News Update',
    description:
      item.description || item.summary || item.analysis ||
      item.gossipContent || item.medicalAdvice || item.techReview ||
      item.globalReport || item.stockUpdate || '',
    imageUrl: item.imageUrl || item.image || '',
    id: item.id,
    catKey,
  };
}

// ─── Safe Image ───────────────────────────────────────────────────────────────
function SafeImg({ src, alt, style, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        style={{
          ...style,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
        }}
        className={className}
      >
        <span style={{ fontSize: 40, opacity: 0.2 }}>📰</span>
        <span style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          No Image
        </span>
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt || ''}
      style={style} className={className}
      onError={() => setErr(true)}
    />
  );
}

// ─── Single News Card ─────────────────────────────────────────────────────────
function NewsCard({ item, catConfig, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const { title, description, imageUrl } = extract(item, catConfig.key);
  const delay = (index % 5) * 60;

  return (
    <div
      ref={ref}
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <Link
        to={`/category/${catConfig.key}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <article
          style={{
            background: '#161616',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid #222',
            cursor: 'pointer',
            transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform     = 'translateY(-4px)';
            e.currentTarget.style.borderColor   = catConfig.color + '60';
            e.currentTarget.style.boxShadow     = `0 12px 40px ${catConfig.color}18`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform     = 'translateY(0)';
            e.currentTarget.style.borderColor   = '#222';
            e.currentTarget.style.boxShadow     = 'none';
          }}
        >
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#111' }}>
            <SafeImg
              src={imageUrl}
              alt={title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block', transition: 'transform 0.6s ease',
              }}
            />
            {/* Category badge */}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${catConfig.color}50`,
              padding: '4px 10px', borderRadius: 20,
            }}>
              <span style={{ fontSize: 10 }}>{catConfig.emoji}</span>
              <span style={{
                fontSize: 9, fontWeight: 800, color: catConfig.color,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                fontFamily: "'Oswald', sans-serif",
              }}>
                {catConfig.label}
              </span>
            </div>
            {/* Gradient overlay bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(to top, rgba(22,22,22,0.9), transparent)',
            }} />
          </div>

          {/* Text content */}
          <div style={{ padding: '14px 16px 16px' }}>
            <h3 style={{
              fontSize: 14, fontWeight: 800, color: '#f1f5f9',
              lineHeight: 1.4, margin: '0 0 8px',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
              fontFamily: "'Oswald', sans-serif",
              fontStyle: 'italic', textTransform: 'uppercase',
              letterSpacing: '0.01em',
            }}>
              {title}
            </h3>

            {description ? (
              <p style={{
                fontSize: 12, color: '#6b7280', lineHeight: 1.6,
                margin: 0,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                fontFamily: "'Source Serif 4', Georgia, serif",
              }}>
                {description}
              </p>
            ) : (
              <p style={{
                fontSize: 11, color: '#374151', lineHeight: 1.5,
                margin: 0, fontStyle: 'italic',
                fontFamily: "'Source Serif 4', Georgia, serif",
              }}>
                Read more on AP13 News →
              </p>
            )}

            {/* Bottom accent line */}
            <div style={{
              marginTop: 12, height: 2, borderRadius: 2,
              background: `linear-gradient(90deg, ${catConfig.color}, transparent)`,
              width: '40%',
            }} />
          </div>
        </article>
      </Link>
    </div>
  );
}

// ─── Category Section Header ──────────────────────────────────────────────────
function SectionHeader({ catConfig, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 20, paddingBottom: 12,
      borderBottom: `2px solid ${catConfig.color}`,
      position: 'sticky', top: 0, zIndex: 10,
      background: '#0f0f0f',
      paddingTop: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 22, lineHeight: 1,
          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))',
        }}>
          {catConfig.emoji}
        </span>
        <div>
          <h2 style={{
            fontSize: 22, fontWeight: 900, color: '#fff', margin: 0,
            fontFamily: "'Oswald', sans-serif", fontStyle: 'italic',
            letterSpacing: '0.03em', textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            {catConfig.label}
          </h2>
          <p style={{
            fontSize: 10, color: catConfig.color, margin: '2px 0 0',
            fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'Oswald', sans-serif",
          }}>
            {count} {count === 1 ? 'story' : 'stories'}
          </p>
        </div>
      </div>

      <Link
        to={`/category/${catConfig.key}`}
        style={{
          fontSize: 10, fontWeight: 800, color: catConfig.color,
          textDecoration: 'none', textTransform: 'uppercase',
          letterSpacing: '0.15em', fontFamily: "'Oswald', sans-serif",
          border: `1px solid ${catConfig.color}40`,
          padding: '5px 12px', borderRadius: 20,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = catConfig.color;
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = catConfig.color;
        }}
      >
        View All →
      </Link>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div style={{
      background: '#161616', borderRadius: 16, overflow: 'hidden', border: '1px solid #222',
    }}>
      <div style={{
        aspectRatio: '16/10',
        background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ height: 14, background: '#222', borderRadius: 4, marginBottom: 8, width: '90%' }} />
        <div style={{ height: 14, background: '#222', borderRadius: 4, marginBottom: 10, width: '70%' }} />
        <div style={{ height: 10, background: '#1a1a1a', borderRadius: 4, marginBottom: 6, width: '100%' }} />
        <div style={{ height: 10, background: '#1a1a1a', borderRadius: 4, width: '80%' }} />
      </div>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ activeFilter, onChange, counts }) {
  const scrollRef = useRef(null);
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(15,15,15,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #222',
      padding: '10px 20px',
    }}>
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          scrollbarWidth: 'none', maxWidth: 1200, margin: '0 auto',
        }}
      >
        {/* All button */}
        <button
          onClick={() => onChange('all')}
          style={{
            flexShrink: 0, padding: '6px 16px', borderRadius: 20,
            background: activeFilter === 'all' ? '#fff' : '#1a1a1a',
            border: `1px solid ${activeFilter === 'all' ? '#fff' : '#333'}`,
            color: activeFilter === 'all' ? '#000' : '#666',
            cursor: 'pointer', fontSize: 11, fontWeight: 800,
            fontFamily: "'Oswald', sans-serif",
            textTransform: 'uppercase', letterSpacing: '0.12em',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          All News {counts.total ? `(${counts.total})` : ''}
        </button>

        {CATEGORIES.map(cat => {
          const active = activeFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                background: active ? cat.color : '#1a1a1a',
                border: `1px solid ${active ? cat.color : '#333'}`,
                color: active ? '#000' : '#666',
                cursor: 'pointer', fontSize: 11, fontWeight: 800,
                fontFamily: "'Oswald', sans-serif",
                textTransform: 'uppercase', letterSpacing: '0.1em',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ fontSize: 12 }}>{cat.emoji}</span>
              {cat.label}
              {counts[cat.key] ? (
                <span style={{
                  background: active ? 'rgba(0,0,0,0.2)' : '#333',
                  borderRadius: 10, padding: '1px 6px',
                  fontSize: 9, fontWeight: 700,
                  color: active ? '#000' : '#666',
                }}>
                  {counts[cat.key]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AllNewsFeedPage() {
  const [allNews,      setAllNews]      = useState({});
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery,  setSearchQuery]  = useState('');

  // Fetch all categories in parallel
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = {};
      await Promise.allSettled(
        CATEGORIES.map(async cat => {
          try {
            const res = await newsService.getCategoryNews(cat.key);
            const d = res.data;
            results[cat.key] = Array.isArray(d) ? d
              : Array.isArray(d?.content) ? d.content
              : Array.isArray(d?.data)    ? d.data
              : [];
          } catch {
            results[cat.key] = [];
          }
        })
      );
      setAllNews(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Counts per category
  const counts = {
    total: Object.values(allNews).reduce((s, arr) => s + arr.length, 0),
    ...Object.fromEntries(CATEGORIES.map(c => [c.key, allNews[c.key]?.length || 0])),
  };

  // Which categories to show
  const visibleCats = activeFilter === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.key === activeFilter);

  // Search filter
  const filterItems = (items, catKey) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item => {
      const { title, description } = extract(item, catKey);
      return title.toLowerCase().includes(q) || description.toLowerCase().includes(q);
    });
  };

  const totalVisible = visibleCats.reduce((s, cat) => {
    return s + (filterItems(allNews[cat.key] || [], cat.key)).length;
  }, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:ital,wght@0,400;0,600;0,700;1,700;1,900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        article:hover img { transform: scale(1.04); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#e2e8f0' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #111 0%, #0f0f0f 100%)',
          borderBottom: '1px solid #222',
          padding: '28px 24px 20px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #1DB954, #ef4444, #3b82f6, #f59e0b, #1DB954)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 4s linear infinite',
          }} />

          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)',
              padding: '4px 12px', borderRadius: 20, marginBottom: 12,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1DB954', animation: 'pulse 1.5s infinite' }} />
              <span style={{
                fontSize: 9, fontWeight: 800, color: '#1DB954',
                textTransform: 'uppercase', letterSpacing: '0.2em',
                fontFamily: "'Oswald', sans-serif",
              }}>Live Feed · All Categories</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h1 style={{
                  fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, fontStyle: 'italic',
                  fontFamily: "'Oswald', sans-serif",
                  color: '#fff', margin: 0, lineHeight: 1,
                  letterSpacing: '-0.01em', textTransform: 'uppercase',
                }}>
                  Today's <span style={{ color: '#1DB954' }}>News</span> Feed
                </h1>
                <p style={{
                  color: '#4b5563', fontSize: 13, margin: '6px 0 0',
                  fontFamily: "'Source Serif 4', Georgia, serif",
                }}>
                  {loading ? 'Loading all categories...' : `${counts.total} stories across ${CATEGORIES.length} categories`}
                </p>
              </div>

              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#1a1a1a', border: '1px solid #333',
                borderRadius: 24, padding: '8px 16px',
                minWidth: 220,
              }}>
                <span style={{ fontSize: 14, color: '#4b5563' }}>🔍</span>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search all news..."
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: '#e2e8f0', fontSize: 13, fontWeight: 500,
                    width: '100%', fontFamily: "'Source Serif 4', Georgia, serif",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'none', border: 'none', color: '#4b5563',
                      cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1,
                    }}
                  >✕</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <FilterBar
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>

          {loading ? (
            /* Loading skeletons */
            <div>
              {[0, 1].map(si => (
                <div key={si} style={{ marginTop: 28 }}>
                  <div style={{ height: 32, background: '#1a1a1a', borderRadius: 8, width: 180, marginBottom: 20 }} />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}>
                    {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : totalVisible === 0 ? (
            /* Empty state */
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
              <h3 style={{
                fontSize: 24, fontWeight: 900, fontStyle: 'italic',
                color: '#374151', fontFamily: "'Oswald', sans-serif",
                textTransform: 'uppercase', marginBottom: 8,
              }}>
                {searchQuery ? `No results for "${searchQuery}"` : 'No News Available'}
              </h3>
              <p style={{ color: '#4b5563', fontSize: 13 }}>
                {searchQuery ? 'Try a different search term.' : 'Check back soon for the latest updates.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    marginTop: 16, padding: '8px 20px', borderRadius: 20,
                    background: '#1DB954', border: 'none', color: '#000',
                    fontWeight: 800, cursor: 'pointer', fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            /* Category sections */
            visibleCats.map(catConfig => {
              const rawItems = allNews[catConfig.key] || [];
              const items    = filterItems(rawItems, catConfig.key);
              if (!items.length) return null;

              return (
                <section key={catConfig.key} style={{ marginTop: 8, paddingTop: 4 }}>
                  <SectionHeader catConfig={catConfig} count={items.length} />

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                    marginBottom: 48,
                  }}>
                    {items.map((item, idx) => (
                      <NewsCard
                        key={item.id || idx}
                        item={item}
                        catConfig={catConfig}
                        index={idx}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>

        {/* ── BACK TO TOP ── */}
        {!loading && totalVisible > 0 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed', bottom: 90, right: 20, zIndex: 99,
              width: 44, height: 44, borderRadius: '50%',
              background: '#1DB954', border: 'none',
              color: '#000', fontSize: 18, fontWeight: 900,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(29,185,84,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow  = '0 8px 28px rgba(29,185,84,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = 'none';
              e.currentTarget.style.boxShadow  = '0 4px 20px rgba(29,185,84,0.4)';
            }}
            title="Back to top"
          >
            ↑
          </button>
        )}
      </div>
    </>
  );
}