import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/api';
import { navItems } from '../../Navbar/navdata';
import { useLang } from '../../i18n/LanguageContext';

const ACTIVE_CATS = ['Global','National','Business','Sports','Entertainment','Health','Politics','Crime','State'];

const CAT_META = {
  Global:        { color:'#2563eb', tw:'bg-blue-600',    label:'WORLD',         key:'nav.global'        },
  National:      { color:'#16a34a', tw:'bg-green-600',   label:'INDIA',         key:'nav.national'      },
  Business:      { color:'#7c3aed', tw:'bg-violet-600',  label:'BUSINESS',      key:'nav.business'      },
  Sports:        { color:'#ea580c', tw:'bg-orange-600',  label:'SPORTS',        key:'nav.sports'        },
  Entertainment: { color:'#db2777', tw:'bg-pink-600',    label:'ENTERTAIN',     key:'nav.entertainment' },
  Health:        { color:'#0d9488', tw:'bg-teal-600',    label:'HEALTH',        key:'nav.health'        },
  Politics:      { color:'#4f46e5', tw:'bg-indigo-600',  label:'POLITICAL',     key:'nav.politics'      },
  Crime:         { color:'#dc2626', tw:'bg-red-600',     label:'CRIME',         key:'nav.crime'         },
  State:         { color:'#d97706', tw:'bg-amber-600',   label:'STATE',         key:'nav.state'         },
};

/* ── helpers ── */
function extract(item) {
  if (!item) return { title:'', description:'', imageUrl:'' };
  return {
    title:       item.title||item.matchTitle||item.movieTitle||item.companyName||item.headline||'',
    description: item.description||item.summary||item.analysis||item.gossipContent||'',
    imageUrl:    item.imageUrl||item.image||'',
  };
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function SafeImg({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) return (
    <div className={`${className} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
      <span className="text-2xl opacity-20">📰</span>
    </div>
  );
  return <img src={src} alt={alt||''} className={`${className} object-cover`} onError={() => setErr(true)} />;
}

function CatBadge({ category, tiny }) {
  const meta = CAT_META[category] || { tw:'bg-red-600', label: category||'' };
  return (
    <span className={`inline-block ${meta.tw} text-white font-black uppercase tracking-widest rounded-[2px] ${tiny ? 'text-[8px] px-1.5 py-[2px]' : 'text-[9px] px-2 py-[2px]'}`}>
      {meta.label}
    </span>
  );
}

/* ── Skeleton ── */
function Sk({ className = 'h-32 rounded-lg' }) {
  return <div className={`${className} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer`} />;
}

/* ── Avatar strip ── */
function AvatarStrip({ allNews }) {
  const items = Object.values(allNews).flat().slice(0, 14);
  if (!items.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 flex items-center gap-3 overflow-x-auto scrollbar-none">
      {items.map((item, i) => {
        const { imageUrl, title } = extract(item);
        return (
          <div key={i} className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 border-slate-200 hover:border-red-400 transition-colors">
            <SafeImg src={imageUrl} alt={title} className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
}

/* ── Hero Slider ── */
function HeroSlider({ items, category }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!items.length) return;
    timer.current = setInterval(() => setIdx(p => (p + 1) % items.length), 4500);
    return () => clearInterval(timer.current);
  }, [items.length]);

  if (!items.length) return null;
  const { title, imageUrl, date } = { ...extract(items[idx]), date: items[idx]?.date };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-200 shadow-lg" style={{ aspectRatio:'16/10' }}>
      <SafeImg src={imageUrl} alt={title} className="w-full h-full" />

      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* arrows */}
      {[{ dir:-1, side:'left-2', sym:'‹' }, { dir:1, side:'right-2', sym:'›' }].map(({ dir, side, sym }) => (
        <button
          key={sym}
          onClick={() => setIdx(p => (p + dir + items.length) % items.length)}
          className={`absolute top-1/2 -translate-y-1/2 ${side} w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white text-xl font-black flex items-center justify-center transition-colors`}
        >{sym}</button>
      ))}

      {/* content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CatBadge category={category} />
          {date && <span className="text-[9px] text-white/60 font-semibold">{fmtDate(date)}</span>}
        </div>
        <h2 className="text-white font-black text-[15px] leading-snug line-clamp-3 drop-shadow-lg">{title}</h2>
        <span className="inline-block mt-2 text-[10px] font-bold text-white/80 border border-white/30 rounded px-2.5 py-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
          పూర్తి కథనం చదవండి →
        </span>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {items.slice(0, 6).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Side List ── */
function SideList({ items }) {
  return (
    <div className="divide-y divide-slate-100">
      {items.map((item, i) => {
        const { title, imageUrl } = extract(item);
        const cat = item._cat;
        return (
          <Link key={i} to={`/category/${cat?.toLowerCase()}`} className="no-underline group">
            <div className="flex gap-2.5 py-2.5 items-start">
              <div className="w-[68px] h-[52px] rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                <SafeImg src={imageUrl} alt={title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                {cat && <CatBadge category={cat} tiny />}
                <p className="text-[11px] font-bold text-slate-800 mt-1 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">{title}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ── Latest Grid ── */
function LatestGrid({ allNews }) {
  const { t } = useLang();
  const items = Object.entries(allNews)
    .flatMap(([cat, arr]) => arr.slice(0, 4).map(item => ({ ...item, _cat:cat })))
    .slice(0, 12);
  if (!items.length) return null;
  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-red-600">
        <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-5 bg-red-600 rounded-full inline-block" />
          Latest Updates
        </h2>
        <Link to="/" className="text-[10px] font-black text-red-600 no-underline uppercase tracking-widest border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
          {t("home.viewAll") || 'All News'} ›
        </Link>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const { title, imageUrl } = extract(item);
          const cat = item._cat;
          const meta = CAT_META[cat] || { color:'#dc2626', label:'' };
          return (
            <Link key={i} to={`/category/${cat?.toLowerCase()}`} className="no-underline group">
              <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="relative h-28 bg-slate-100">
                  <SafeImg src={imageUrl} alt={title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-1.5 left-1.5">
                    <CatBadge category={cat} tiny />
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors mb-1.5">{title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">{fmtDate(item.date)}</span>
                    <span className="text-[8px] font-black uppercase tracking-wider" style={{ color:meta.color }}>{meta.label}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Category Section (filtered view) ── */
function CategorySection({ category, news }) {
  const { t } = useLang();
  const meta = CAT_META[category] || { tw:'bg-red-600', label:category, key:'' };
  if (!news?.length) return null;
  const [hero, ...rest] = news;
  return (
    <section className="mb-8">
      {/* section header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{ borderColor: CAT_META[category]?.color || '#dc2626' }}>
        <div className="flex items-center gap-2">
          <span className={`w-1 h-5 rounded-full ${meta.tw}`} />
          <span className="text-[14px] font-black text-slate-800 uppercase tracking-wide">
            {meta.key ? t(meta.key) : category}
          </span>
          <span className={`text-[9px] font-black text-white ${meta.tw} px-1.5 py-0.5 rounded-full`}>{news.length}</span>
        </div>
        <Link to={`/category/${category.toLowerCase()}`}
          className="text-[9px] font-black uppercase tracking-widest no-underline border px-2.5 py-1 rounded transition-colors hover:text-white"
          style={{ color: CAT_META[category]?.color, borderColor: CAT_META[category]?.color }}
        >
          {t("home.viewAll") || 'View All'} ›
        </Link>
      </div>

      {/* hero */}
      <div className="mb-3">
        <HeroSlider items={[hero]} category={category} />
      </div>

      {/* 2-col grid */}
      {rest.length >= 2 && (
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {rest.slice(0,2).map((item, i) => {
            const { title, imageUrl } = extract(item);
            return (
              <Link key={i} to={`/category/${category.toLowerCase()}`} className="no-underline group">
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="relative h-24 bg-slate-100">
                    <SafeImg src={imageUrl} alt={title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">{title}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* list rows */}
      <div className="bg-white rounded-lg border border-slate-200 px-3 divide-y divide-slate-100">
        {rest.slice(2,5).map((item, i) => {
          const { title, imageUrl } = extract(item);
          return (
            <Link key={i} to={`/category/${category.toLowerCase()}`} className="no-underline group">
              <div className="flex gap-2.5 py-2.5 items-center">
                <div className="w-14 h-11 rounded overflow-hidden flex-shrink-0 bg-slate-100">
                  <SafeImg src={imageUrl} alt={title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{title}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ── Filter Tabs ── */
function FilterTabs({ active, onChange }) {
  const { t } = useLang();
  const tabs = ['All', ...ACTIVE_CATS];
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 mb-5">
      {tabs.map(tab => {
        const isActive = active === tab;
        const meta = CAT_META[tab];
        const label = tab === 'All'
          ? (t("home.allNews") || '✦ All')
          : `${meta?.key ? t(meta.key) : tab}`;
        return (
          <button key={tab} onClick={() => onChange(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wide transition-all whitespace-nowrap
              ${isActive
                ? 'text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-700'
              }`}
            style={isActive ? { background: tab === 'All' ? '#e8192c' : (meta?.color || '#e8192c') } : {}}
          >{label}</button>
        );
      })}
    </div>
  );
}

/* ── Join CTA ── */
function JoinCTA() {
  const { t } = useLang();
  return (
    <Link to="/join" className="no-underline block mb-5">
      <div className="bg-gradient-to-r from-[#1a2744] to-[#243460] rounded-xl p-4 flex items-center justify-between gap-3 border border-[#2d3d6e] hover:shadow-lg transition-shadow">
        <div>
          <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">{t("home.nowRecruiting")||'Now Recruiting'}</p>
          <p className="text-[15px] font-black text-white leading-tight mb-0.5">{t("home.becomeReporter")||'Become a Reporter'}</p>
          <p className="text-[10px] text-white/55">{t("home.joinNetwork")||'Join the AP13 News network'}</p>
        </div>
        <div className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wide whitespace-nowrap transition-colors">
          {t("home.applyNow")||'Apply Now'} ⚡
        </div>
      </div>
    </Link>
  );
}

/* ── Social Strip ── */
function SocialStrip() {
  const { t } = useLang();
  const socials = [
    { icon:'▶', label:'YouTube',   count:'8.5K', url:'https://youtube.com/@ap13news',         color:'#ef4444', bg:'bg-red-600'   },
    { icon:'f',  label:'Facebook',  count:'1.2M', url:'https://facebook.com/apnewslocal',      color:'#1877f2', bg:'bg-blue-600'  },
    { icon:'📸', label:'Instagram', count:'420K', url:'https://instagram.com/ap13news_telugu', color:'#e1306c', bg:'bg-pink-600'  },
  ];
  return (
    <div className="mb-5">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-2">
        <span className="w-1 h-4 bg-red-600 rounded-full" />
        {t("home.followAP13")||'Follow AP13'}
      </p>
      <div className="flex gap-2.5">
        {socials.map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
            className="flex-1 flex flex-col items-center gap-1.5 py-3 bg-white border border-slate-200 rounded-xl no-underline hover:shadow-md hover:-translate-y-0.5 transition-all"
            style={{ borderTop:`3px solid ${s.color}` }}
          >
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center text-white text-sm font-black`}>{s.icon}</div>
            <span className="text-[13px] font-black text-slate-800">{s.count}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Home() {
  const { t } = useLang();
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const activeSections = navItems.filter(i => ACTIVE_CATS.includes(i.label));

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const map = {};
        await Promise.allSettled(activeSections.map(async cat => {
          try {
            const res = await newsService.getCategoryNews(cat.label.toLowerCase());
            map[cat.label] = Array.isArray(res.data) ? res.data.slice(0, 8) : [];
          } catch { map[cat.label] = []; }
        }));
        setCategoryNews(map);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allTagged = Object.entries(categoryNews)
    .flatMap(([cat, arr]) => arr.map(item => ({ ...item, _cat:cat })));

  const heroCategory = activeTab === 'All'
    ? (Object.keys(categoryNews).find(k => categoryNews[k]?.length > 0) || 'National')
    : activeTab;
  const heroItems  = categoryNews[heroCategory] || [];
  const leftItems  = allTagged.filter(i => i._cat !== heroCategory).slice(0, 5);
  const rightItems = allTagged.filter(i => i._cat !== heroCategory).slice(5, 10);

  const displaySections = activeTab === 'All' ? activeSections : activeSections.filter(s => s.label === activeTab);

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .animate-shimmer   { animation: shimmer 1.5s infinite; }
        .animate-fadeUp    { animation: fadeUp 0.4s ease both; }
        .scrollbar-none    { scrollbar-width:none; }
        .scrollbar-none::-webkit-scrollbar { display:none; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        * { box-sizing:border-box; }
      `}</style>

      <div className="min-h-screen bg-[#eef0f3]">
        <div className="max-w-5xl mx-auto px-3 pt-4 pb-24">

          {loading ? (
            /* ── Skeletons ── */
            <div className="animate-fadeUp">
              <Sk className="h-10 rounded-lg mb-3" />
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="space-y-2"><Sk className="h-16 rounded-lg" /><Sk className="h-16 rounded-lg" /><Sk className="h-16 rounded-lg" /></div>
                <Sk className="h-52 rounded-xl" />
                <div className="space-y-2"><Sk className="h-16 rounded-lg" /><Sk className="h-16 rounded-lg" /><Sk className="h-16 rounded-lg" /></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_,i) => <Sk key={i} className="h-40 rounded-lg" />)}
              </div>
            </div>
          ) : (
            <div className="animate-fadeUp">

              {/* Avatar strip */}
              {Object.keys(categoryNews).length > 0 && <AvatarStrip allNews={categoryNews} />}

              {/* Filter tabs */}
              <FilterTabs active={activeTab} onChange={setActiveTab} />

              {/* ── 3-col hero layout (desktop) / stacked (mobile) ── */}
              {activeTab === 'All' && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-3 mb-5">
                  {/* Left sidebar */}
                  <div className="hidden md:block bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Stories</p>
                    <SideList items={leftItems} />
                  </div>
                  {/* Hero slider */}
                  <div>
                    <HeroSlider items={heroItems.slice(0,6)} category={heroCategory} />
                  </div>
                  {/* Right sidebar */}
                  <div className="hidden md:block bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">More News</p>
                    <SideList items={rightItems} />
                  </div>
                </div>
              )}

              {/* Social */}
              <SocialStrip />

              {/* CTA */}
              <JoinCTA />

              {/* ── All categories or filtered ── */}
              {activeTab === 'All' ? (
                <>
                  {/* Latest grid */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6">
                    <LatestGrid allNews={categoryNews} />
                  </div>

                  {/* Per-category sections */}
                  {displaySections.map(cat => (
                    <CategorySection key={cat.label} category={cat.label} news={categoryNews[cat.label]||[]} />
                  ))}
                </>
              ) : (
                /* Filtered view */
                <CategorySection category={activeTab} news={categoryNews[activeTab]||[]} />
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {['← Prev','1','2','3','Next →'].map((p,i) => (
                  <button key={i} className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors
                    ${p==='1'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-red-400 hover:text-red-600'
                    }`}>{p}</button>
                ))}
                <span className="text-[10px] text-slate-400 ml-1">Page 1 of 5</span>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}