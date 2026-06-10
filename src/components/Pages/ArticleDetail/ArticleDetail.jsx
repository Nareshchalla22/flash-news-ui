import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft, Calendar, Clock, User, Copy, Check, X } from 'lucide-react';
import { newsService } from '../../../services/api';

const CAT_META = {
  global:        { color:'#2563eb', label:'WORLD',      tw:'bg-blue-600'   },
  national:      { color:'#16a34a', label:'INDIA',      tw:'bg-green-600'  },
  business:      { color:'#7c3aed', label:'BUSINESS',   tw:'bg-violet-600' },
  sports:        { color:'#ea580c', label:'SPORTS',     tw:'bg-orange-600' },
  entertainment: { color:'#db2777', label:'ENTERTAIN',  tw:'bg-pink-600'   },
  health:        { color:'#0d9488', label:'HEALTH',     tw:'bg-teal-600'   },
  politics:      { color:'#4f46e5', label:'POLITICAL',  tw:'bg-indigo-600' },
  crime:         { color:'#dc2626', label:'CRIME',      tw:'bg-red-600'    },
  state:         { color:'#d97706', label:'STATE',      tw:'bg-amber-600'  },
};

function extract(item) {
  if (!item) return { title:'', description:'', imageUrl:'', reporterName:'', date:'', createdAt:'' };
  return {
    title:        item.title        || item.matchTitle   || item.movieTitle  ||
                  item.companyName  || item.gadgetHead   || item.headline    || '',
    description:  item.description  || item.summary      || item.analysis    ||
                  item.gossipContent|| item.medicalAdvice|| item.techReview  ||
                  item.globalReport || item.stockUpdate  || '',
    imageUrl:     item.imageUrl     || item.image        || '',
    reporterName: item.reporterName || '',
    date:         item.date         || '',
    createdAt:    item.createdAt    || item.publishedAt  || item.updatedAt   || '',
  };
}

function fmtRelative(raw) {
  if (!raw) return '';
  try {
    const d    = new Date(raw);
    const diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins  < 1)  return 'Just now';
    if (mins  < 60) return `${mins}m ago`;
    if (hrs   < 24) return `${hrs}h ago`;
    if (days  < 7)  return `${days}d ago`;
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  } catch { return ''; }
}

function SafeImg({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) return (
    <div className={`${className} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
      <span className="text-4xl opacity-20">📰</span>
    </div>
  );
  return <img src={src} alt={alt||''} className={className} onError={() => setErr(true)} />;
}

// ── Share Panel ─────────────────────────────────────────────────────────────
function SharePanel({ title, url, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} — AP13 News`;

  const options = [
    { label:'WhatsApp', icon:'💬', color:'#25D366', bg:'#dcfce7', href:`https://wa.me/?text=${encodeURIComponent(text+'\n'+url)}`           },
    { label:'Twitter',  icon:'🐦', color:'#000',    bg:'#f1f5f9', href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { label:'Facebook', icon:'📘', color:'#1877f2', bg:'#dbeafe', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`  },
    { label:'Telegram', icon:'✈️', color:'#0088cc', bg:'#e0f2fe', href:`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`           },
    { label:'LinkedIn', icon:'💼', color:'#0a66c2', bg:'#dbeafe', href:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`                   },
    { label:'Email',    icon:'📧', color:'#ef4444', bg:'#fee2e2', href:`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text+'\n\n'+url)}`          },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ animation:'slideUp 0.22s ease' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-red-500"/>
            <span className="font-black text-[14px] text-slate-900">Share Story</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={14} className="text-slate-500"/>
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {options.map(o => (
              <a key={o.label} href={o.href} target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl no-underline hover:scale-105 transition-transform"
                style={{ background: o.bg }}
              >
                <span className="text-xl">{o.icon}</span>
                <span className="text-[9px] font-black" style={{ color: o.color }}>{o.label}</span>
              </a>
            ))}
          </div>
          {/* Copy link */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 flex-1 truncate font-mono">{url}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-[9px] font-black transition-colors ${copied ? 'bg-green-500' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {copied ? <><Check size={10}/>Done</> : <><Copy size={10}/>Copy</>}
            </button>
          </div>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={() => navigator.share({ title: text, url }).catch(() => {})}
              className="w-full mt-2.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={13}/> Share via Device
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Related Card ────────────────────────────────────────────────────────────
function RelatedCard({ item, cat }) {
  const navigate = useNavigate();
  const { title, imageUrl } = extract(item);
  const id   = item.id || item._id || '';
  const meta = CAT_META[cat] || { tw:'bg-red-600', label:cat };
  return (
    <button
      onClick={() => { navigate(`/category/${cat}/${id}`); window.scrollTo(0,0); }}
      className="text-left group w-full focus:outline-none"
    >
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="relative h-32 bg-slate-100">
          <SafeImg src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
          <div className="absolute top-2 left-2">
            <span className={`${meta.tw} text-white text-[8px] font-black px-1.5 py-[2px] rounded-sm uppercase tracking-widest`}>{meta.label}</span>
          </div>
        </div>
        <div className="p-2.5">
          <p className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">{title}</p>
        </div>
      </div>
    </button>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function ArticleDetail() {
  const { cat, id } = useParams();
  const navigate    = useNavigate();

  const [article,  setArticle]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sharing,  setSharing]  = useState(false);

  const meta       = CAT_META[cat?.toLowerCase()] || { color:'#e8192c', label:'NEWS', tw:'bg-red-600' };
  const articleUrl = `${window.location.origin}/category/${cat}/${id}`;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        // Fetch all news for this category, then find by id
        const res = await newsService.getCategoryNews(cat);
        if (res.data && Array.isArray(res.data)) {
          const found = res.data.find(
            item => String(item.id) === String(id) || String(item._id) === String(id)
          );
          if (found) {
            setArticle(found);
            setRelated(res.data.filter(i => String(i.id) !== String(id) && String(i._id) !== String(id)).slice(0, 6));
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (cat && id) load();
  }, [cat, id]);

  // Update page title & meta for sharing
  useEffect(() => {
    if (article) {
      const { title, description, imageUrl } = extract(article);
      document.title = `${title} — AP13 News`;
      // OG meta tags (helps WhatsApp/Facebook preview)
      const setMeta = (prop, content) => {
        let el = document.querySelector(`meta[property="${prop}"]`) || document.createElement('meta');
        el.setAttribute('property', prop);
        el.setAttribute('content', content);
        if (!el.parentNode) document.head.appendChild(el);
      };
      setMeta('og:title',       title);
      setMeta('og:description', description.slice(0, 200));
      setMeta('og:image',       imageUrl);
      setMeta('og:url',         articleUrl);
      setMeta('og:type',        'article');
    }
    return () => { document.title = 'AP13 News'; };
  }, [article, articleUrl]);

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-[#eef0f3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );

  // ── Not Found ──
  if (notFound || !article) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">📡</span>
      <h1 className="text-3xl font-black text-slate-600 uppercase italic tracking-tight">404 — Article Not Found</h1>
      <Link to={`/category/${cat}`} className="text-[11px] font-black text-green-500 no-underline hover:underline">
        ← Back to {cat?.toUpperCase()}
      </Link>
      <Link to="/" className="text-[11px] font-black text-slate-500 no-underline hover:underline">
        ← Return to Home
      </Link>
    </div>
  );

  const f  = extract(article);
  const dt = (() => {
    const raw = f.createdAt || f.date;
    if (!raw) return null;
    try {
      const d = new Date(raw);
      return {
        full:     d.toLocaleDateString('en-IN', { weekday:'long', day:'2-digit', month:'long', year:'numeric' }),
        time:     d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
        relative: fmtRelative(raw),
      };
    } catch { return null; }
  })();

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        .scrollbar-none { scrollbar-width:none; }
        .scrollbar-none::-webkit-scrollbar { display:none; }
        * { box-sizing:border-box; }
      `}</style>

      {sharing && (
        <SharePanel title={f.title} url={articleUrl} onClose={() => setSharing(false)}/>
      )}

      <div className="min-h-screen bg-[#eef0f3]" style={{ animation:'fadeIn 0.3s ease' }}>

        {/* ── Breadcrumb bar ── */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 hover:text-red-600 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={13}/> Back
            </button>
            <span className="text-slate-300 flex-shrink-0">›</span>
            <Link to="/" className="text-[10px] font-bold text-slate-400 hover:text-red-600 no-underline transition-colors flex-shrink-0">Home</Link>
            <span className="text-slate-300 flex-shrink-0">›</span>
            <Link to={`/category/${cat}`} className="text-[10px] font-bold no-underline transition-colors flex-shrink-0" style={{ color: meta.color }}>
              {meta.label}
            </Link>
            <span className="text-slate-300 flex-shrink-0">›</span>
            <span className="text-[10px] text-slate-400 truncate">{f.title}</span>
          </div>
          {/* Share button — always visible */}
          <button
            onClick={() => setSharing(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-lg transition-colors ml-3"
          >
            <Share2 size={11}/> Share
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

            {/* ── Main article ── */}
            <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">

              {/* Hero image */}
              {f.imageUrl && (
                <div className="w-full aspect-video bg-slate-100">
                  <SafeImg src={f.imageUrl} alt={f.title} className="w-full h-full object-cover"/>
                </div>
              )}

              <div className="px-5 sm:px-8 py-6">

                {/* Category + relative time */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${meta.tw} text-white text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest`}>
                    {meta.label}
                  </span>
                  {dt?.relative && (
                    <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {dt.relative}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4 uppercase italic tracking-tight">
                  {f.title}
                </h1>

                {/* Meta row */}
                <div className="flex items-center flex-wrap gap-4 pb-4 mb-5 border-b border-slate-100">
                  {f.reporterName && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                        {f.reporterName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">Reporter</p>
                        <p className="text-[12px] font-bold text-slate-700">{f.reporterName}</p>
                      </div>
                    </div>
                  )}
                  {dt?.full && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={12}/>
                      <span className="text-[11px] font-semibold">{dt.full}</span>
                    </div>
                  )}
                  {dt?.time && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={12}/>
                      <span className="text-[11px] font-semibold">{dt.time}</span>
                    </div>
                  )}
                  {/* Share inline */}
                  <button
                    onClick={() => setSharing(true)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600 text-slate-500 text-[10px] font-black rounded-lg transition-all"
                  >
                    <Share2 size={11}/> Share
                  </button>
                </div>

                {/* Article body */}
                <div className="prose max-w-none">
                  {f.description
                    ? f.description.split('\n').filter(Boolean).map((para, i) => (
                        <p key={i} className="text-slate-700 text-[15px] leading-relaxed mb-4">{para}</p>
                      ))
                    : <p className="text-slate-400 italic text-center py-8">No further details available for this article.</p>
                  }
                </div>

                {/* Share footer */}
                <div className="mt-8 pt-5 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Share this story</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label:'WhatsApp', icon:'💬', color:'#25D366', href:`https://wa.me/?text=${encodeURIComponent(f.title+' — AP13 News\n'+articleUrl)}`   },
                      { label:'Twitter',  icon:'🐦', color:'#000',    href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(f.title)}&url=${encodeURIComponent(articleUrl)}` },
                      { label:'Facebook', icon:'📘', color:'#1877f2', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`  },
                      { label:'Telegram', icon:'✈️', color:'#0088cc', href:`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(f.title)}`           },
                    ].map(o => (
                      <a key={o.label} href={o.href} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg no-underline text-[11px] font-black hover:scale-105 transition-transform"
                        style={{ background: o.color + '18', color: o.color }}
                      >
                        <span>{o.icon}</span> {o.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* ── Sidebar: Related ── */}
            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: meta.color }}>
                  <span className="w-1 h-4 rounded-full" style={{ background: meta.color }}/>
                  More from {meta.label}
                </h3>
                {related.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {related.map((item, i) => (
                      <RelatedCard key={item.id || i} item={item} cat={cat}/>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No related articles.</p>
                )}
              </div>

              {/* Back to category */}
              <Link
                to={`/category/${cat}`}
                className="flex items-center justify-between w-full bg-white rounded-2xl border border-slate-200 p-4 no-underline hover:shadow-md transition-shadow group"
              >
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Browse All</p>
                  <p className="text-[13px] font-black text-slate-800 group-hover:text-red-600 transition-colors">
                    {meta.label} News →
                  </p>
                </div>
                <span className={`${meta.tw} text-white text-xl w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  📰
                </span>
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}