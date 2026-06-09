import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, CloudSun, Target, Share2,
  Clock, User, Calendar, X, Copy, Check, ArrowLeft,
} from 'lucide-react';
import SocialStats from '../Stats/SocialStats';

// ─── Field extractor ──────────────────────────────────────────────────────────
function extractFields(item) {
  if (!item) return { title:'', description:'', imageUrl:'', reporterName:'', date:'', createdAt:'' };
  return {
    title:        item.title        || item.matchTitle   || item.movieTitle  ||
                  item.companyName  || item.gadgetHead   || item.headline    || 'AP13 News Update',
    description:  item.description  || item.summary      || item.analysis    ||
                  item.gossipContent|| item.medicalAdvice|| item.techReview  ||
                  item.globalReport || item.stockUpdate  || '',
    imageUrl:     item.imageUrl     || item.image        || '',
    reporterName: item.reporterName || '',
    date:         item.date         || '',
    createdAt:    item.createdAt    || item.publishedAt  || item.updatedAt   || '',
  };
}

// ─── Format date/time ─────────────────────────────────────────────────────────
function formatDateTime(createdAt, fallbackDate) {
  const raw = createdAt || fallbackDate;
  if (!raw) return null;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return { date: raw, time: null, relative: raw };
    const diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const relative =
      mins  < 1  ? 'Just now'     :
      mins  < 60 ? `${mins}m ago` :
      hrs   < 24 ? `${hrs}h ago`  :
      days  < 7  ? `${days}d ago` :
      d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    return {
      date:     d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      time:     d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      relative,
    };
  } catch { return { date: raw, time: null, relative: raw }; }
}

// ─── Safe Image ───────────────────────────────────────────────────────────────
function SafeImage({ src, alt, className, style }) {
  const [err, setErr] = useState(false);
  if (!src || err) return (
    <div className={className} style={{ ...style, background:'linear-gradient(135deg,#f1f5f9,#e2e8f0)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontSize:38, opacity:0.2 }}>📰</span>
    </div>
  );
  return (
    <img
      src={src} alt={alt || ''}
      className={className} style={style}
      onError={() => setErr(true)}
    />
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ item, catName, onClose }) {
  const { title, imageUrl } = extractFields(item);
  const [copied, setCopied] = useState(false);
  const pageUrl   = window.location.href;
  const shareText = `${title} — AP13 News`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const options = [
    { label:'WhatsApp', icon:'💬', color:'#25D366', bg:'#dcfce7', url:`https://wa.me/?text=${encodeURIComponent(shareText+'\n'+pageUrl)}`           },
    { label:'Twitter',  icon:'🐦', color:'#000000', bg:'#f1f5f9', url:`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}` },
    { label:'Facebook', icon:'📘', color:'#1877f2', bg:'#dbeafe', url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`  },
    { label:'Telegram', icon:'✈️', color:'#0088cc', bg:'#e0f2fe', url:`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`           },
    { label:'LinkedIn', icon:'💼', color:'#0a66c2', bg:'#dbeafe', url:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`                         },
    { label:'Email',    icon:'📧', color:'#ef4444', bg:'#fee2e2', url:`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText+'\n\n'+pageUrl)}`      },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Share2 size={17} className="text-red-500" />
            <span className="font-black text-[15px] text-slate-900">Share Story</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={14} className="text-slate-500" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
          {imageUrl && (
            <img src={imageUrl} alt="" className="w-14 h-11 object-cover rounded-lg flex-shrink-0" onError={e => e.target.style.display='none'} />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">{catName}</span>
            <p className="text-[11px] font-bold text-slate-700 line-clamp-2 mt-0.5 leading-snug">{title}</p>
          </div>
        </div>

        {/* Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {options.map(opt => (
              <a key={opt.label} href={opt.url} target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl no-underline hover:scale-105 transition-transform"
                style={{ background: opt.bg }}
              >
                <span className="text-xl">{opt.icon}</span>
                <span className="text-[9px] font-black" style={{ color: opt.color }}>{opt.label}</span>
              </a>
            ))}
          </div>

          {/* Copy */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 flex-1 truncate font-mono">{pageUrl}</span>
            <button onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-[10px] font-black transition-colors ${copied ? 'bg-green-500' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {copied ? <><Check size={11} />Copied!</> : <><Copy size={11} />Copy</>}
            </button>
          </div>

          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={() => navigator.share({ title: shareText, url: pageUrl }).catch(() => {})}
              className="w-full mt-2.5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-black rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={14} /> Share via Device
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reporter Meta ─────────────────────────────────────────────────────────────
function ReporterMeta({ item, onShare, catName, light = false }) {
  const { reporterName, date, createdAt } = extractFields(item);
  const dt = formatDateTime(createdAt, date);

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
      <div className="flex items-center gap-3 flex-wrap">
        {reporterName && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-[8px] font-black text-white flex-shrink-0">
              {reporterName.charAt(0).toUpperCase()}
            </div>
            <span className={`text-[10px] font-bold ${light ? 'text-white/80' : 'text-slate-600'}`}>{reporterName}</span>
          </div>
        )}
        {dt?.date && (
          <div className="flex items-center gap-1">
            <Calendar size={9} className={light ? 'text-white/50' : 'text-slate-400'} />
            <span className={`text-[9px] font-semibold ${light ? 'text-white/60' : 'text-slate-400'}`}>{dt.date}</span>
          </div>
        )}
        {dt?.time && (
          <div className="flex items-center gap-1">
            <Clock size={9} className={light ? 'text-white/50' : 'text-slate-400'} />
            <span className={`text-[9px] font-semibold ${light ? 'text-white/60' : 'text-slate-400'}`}>{dt.time}</span>
          </div>
        )}
        {dt?.relative && (
          <span className="text-[8px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{dt.relative}</span>
        )}
      </div>
      <button
        onClick={e => { e.stopPropagation(); onShare(item); }}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold transition-all hover:bg-red-600 hover:text-white hover:border-red-600
          ${light ? 'border-white/25 text-white/80' : 'border-slate-200 text-slate-500 bg-white'}`}
      >
        <Share2 size={10} /> Share
      </button>
    </div>
  );
}

// ─── Full Article Modal ────────────────────────────────────────────────────────
function ArticleModal({ item, catName, onClose, onShare }) {
  const f  = extractFields(item);
  const dt = formatDateTime(f.createdAt, f.date);

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slideUp flex flex-col max-h-screen sm:max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <span className="text-[9px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{catName}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 text-[10px] font-black rounded-lg transition-colors"
            >
              <Share2 size={11} /> Share
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero image */}
          {f.imageUrl && (
            <div className="w-full aspect-video bg-slate-100">
              <SafeImage
                src={f.imageUrl} alt={f.title}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
              />
            </div>
          )}

          <div className="px-5 py-5">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-3 uppercase italic tracking-tight">
              {f.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center flex-wrap gap-3 mb-4 pb-4 border-b border-slate-100">
              {f.reporterName && (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-[9px] font-black text-white">
                    {f.reporterName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{f.reporterName}</span>
                </div>
              )}
              {dt?.date && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar size={11} />
                  <span className="text-[10px] font-semibold">{dt.date}</span>
                </div>
              )}
              {dt?.time && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={11} />
                  <span className="text-[10px] font-semibold">{dt.time}</span>
                </div>
              )}
              {dt?.relative && (
                <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{dt.relative}</span>
              )}
            </div>

            {/* Full description */}
            {f.description ? (
              <div className="prose prose-sm max-w-none">
                {f.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-slate-700 text-[14px] leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm">No further details available.</p>
            )}

            {/* Share footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share this story</span>
              <button
                onClick={() => onShare(item)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black rounded-lg transition-colors"
              >
                <Share2 size={12} /> Share Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ item, catName, onShare, onRead }) {
  const f = extractFields(item);
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onRead(item)}
    >
      <div className="aspect-[16/10] overflow-hidden rounded-xl shadow-sm bg-slate-100 mb-3 relative">
        <SafeImage
          src={f.imageUrl} alt={f.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s', display:'block' }}
          className="group-hover:scale-105"
        />
        {/* Read overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wide shadow">
            Read Full Story
          </span>
        </div>
      </div>
      <h3 className="text-base font-black text-slate-900 leading-tight uppercase italic tracking-tight mb-1 group-hover:text-red-600 transition-colors">
        {f.title}
      </h3>
      {f.description && (
        <p className="text-slate-500 text-[12px] leading-relaxed mb-2 line-clamp-2">{f.description}</p>
      )}
      <ReporterMeta item={item} onShare={onShare} catName={catName} />
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
const CategoryLayout = ({ name, icon: Icon, news = [] }) => {
  const [shareItem, setShareItem] = useState(null);
  const [readItem,  setReadItem]  = useState(null);

  const mainFeature   = news[0];
  const subFeatures   = news.slice(1, 4);
  const remainingNews = news.slice(4);
  const main = extractFields(mainFeature);

  return (
    <>
      {/* Share Modal */}
      {shareItem && (
        <ShareModal item={shareItem} catName={name} onClose={() => setShareItem(null)} />
      )}

      {/* Full Article Modal */}
      {readItem && (
        <ArticleModal
          item={readItem}
          catName={name}
          onClose={() => setReadItem(null)}
          onShare={(item) => { setReadItem(null); setShareItem(item); }}
        />
      )}

      <div className="w-full max-w-7xl mx-auto px-4 py-6 bg-white min-h-screen font-sans">

        {/* ── Page Header ── */}
        <header className="border-b border-slate-100 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-2">
                <Link to="/" className="no-underline hover:text-red-600 transition-colors">Home</Link>
                {' › '}
                <span className="text-blue-600">{name}</span>
              </p>
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="p-2 bg-slate-900 text-white rounded-xl shadow">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 capitalize tracking-tighter italic leading-none">
                  {name} <span className="text-blue-600">Pulse</span>
                </h1>
              </div>
            </div>

            {/* Widgets */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 w-fit flex-shrink-0">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <CloudSun size={16} className="text-yellow-500" />
                <div>
                  <p className="text-[7px] font-black uppercase text-slate-400">Hyderabad</p>
                  <p className="text-[10px] font-bold text-slate-800">32°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                <div>
                  <p className="text-[7px] font-black uppercase text-slate-400">Nifty</p>
                  <p className="text-[10px] font-bold text-slate-800">25,950</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {news.length > 0 ? (
          <div className="space-y-10">

            {/* ── Hero ── */}
            {mainFeature && (
              <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* Main hero — clickable */}
                <div
                  className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 group cursor-pointer"
                  style={{ aspectRatio:'16/10' }}
                  onClick={() => setReadItem(mainFeature)}
                >
                  <SafeImage
                    src={main.imageUrl} alt={main.title}
                    style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.8s', display:'block' }}
                    className="group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Hover read badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/90 text-slate-900 text-[11px] font-black px-5 py-2.5 rounded-full uppercase tracking-wide shadow-lg">
                      Read Full Story
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                    <span className="bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded mb-2 inline-block">Featured</span>
                    <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight text-white leading-tight mb-2">{main.title}</h2>
                    {main.description && (
                      <p className="text-white/65 text-xs leading-relaxed line-clamp-2">{main.description}</p>
                    )}
                  </div>
                  {/* Share btn — separate click */}
                  <div className="absolute top-3 right-3 pointer-events-auto">
                    <button
                      onClick={e => { e.stopPropagation(); setShareItem(mainFeature); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[9px] font-black rounded-full hover:bg-white/40 transition-colors"
                    >
                      <Share2 size={10} /> Share
                    </button>
                  </div>
                </div>

                {/* Sub features — all clickable */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                  {subFeatures.map((item, idx) => {
                    const f  = extractFields(item);
                    const dt = formatDateTime(f.createdAt, f.date);
                    return (
                      <div
                        key={item.id || idx}
                        className="flex gap-3 group cursor-pointer p-3 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-all"
                        onClick={() => setReadItem(item)}
                      >
                        <div className="w-20 h-[60px] rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                          <SafeImage
                            src={f.imageUrl} alt={f.title}
                            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s', display:'block' }}
                            className="group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-black text-slate-900 uppercase italic leading-tight line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                            {f.title}
                          </h4>
                          {f.description && (
                            <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-1">{f.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {f.reporterName && (
                              <span className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                                <User size={8} /> {f.reporterName}
                              </span>
                            )}
                            {dt && (
                              <span className="flex items-center gap-1 text-[9px] text-slate-400">
                                <Clock size={8} /> {dt.relative}
                              </span>
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); setShareItem(item); }}
                              className="ml-auto p-1 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-400 transition-all"
                            >
                              <Share2 size={9} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── More Stories + Sidebar ── */}
            {remainingNews.length > 0 && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 border-t border-slate-100">

                {/* Article grid */}
                <div className="lg:col-span-8">
                  <h3 className="text-[15px] font-black text-slate-900 uppercase italic tracking-tight border-b-2 border-slate-200 pb-2.5 mb-5 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-600 rounded-full inline-block" />
                    More Stories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                    {remainingNews.map((item, idx) => (
                      <ArticleCard
                        key={item.id || idx}
                        item={item}
                        catName={name}
                        onShare={setShareItem}
                        onRead={setReadItem}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-6">

                  {/* Social */}
                  <div>
                    <h4 className="text-[12px] font-black text-slate-900 uppercase italic border-b-4 border-red-600 inline-block pb-1 mb-4 tracking-tight">
                      Follow Us
                    </h4>
                    <SocialStats />
                  </div>

                  {/* Hot topics */}
                  <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={14} />
                      <h4 className="font-black uppercase italic tracking-tight text-[12px]">Hot Topics</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['#Hyderabad','#Stocks','#AI','#Tech','#Politics','#Sports','#AP','#Telangana'].map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/20 rounded-full text-[9px] font-bold hover:bg-white/35 cursor-pointer transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Most Read — all clickable */}
                  <div className="bg-slate-900 p-4 rounded-2xl text-white">
                    <h4 className="text-[12px] font-black uppercase italic border-b-4 border-yellow-500 inline-block mb-4 tracking-tight">
                      Most Read
                    </h4>
                    <div className="space-y-4">
                      {news.slice(0, 5).map((item, idx) => {
                        const f  = extractFields(item);
                        const dt = formatDateTime(f.createdAt, f.date);
                        return (
                          <div
                            key={item.id || idx}
                            className="flex gap-3 group cursor-pointer"
                            onClick={() => setReadItem(item)}
                          >
                            <span className="text-xl font-black text-slate-700 flex-shrink-0 leading-none mt-0.5 group-hover:text-red-500 transition-colors">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black uppercase italic leading-tight group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">
                                {f.title}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                {f.reporterName && (
                                  <span className="flex items-center gap-1 text-[8px] text-slate-500 font-semibold">
                                    <User size={7} /> {f.reporterName}
                                  </span>
                                )}
                                {dt && (
                                  <span className="flex items-center gap-1 text-[8px] text-slate-600">
                                    <Clock size={7} /> {dt.relative}
                                  </span>
                                )}
                                <button
                                  onClick={e => { e.stopPropagation(); setShareItem(item); }}
                                  className="ml-auto p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                  <Share2 size={8} color="#64748b" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </section>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100">
            <p className="text-6xl mb-4">📭</p>
            <h2 className="text-slate-300 font-black text-3xl uppercase italic">No News in {name}</h2>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase no-underline hover:bg-slate-800 transition-colors">
              <ArrowLeft size={12} /> Return Home
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .animate-slideUp { animation: slideUp 0.22s ease both; }
        .line-clamp-1 { display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .scrollbar-none { scrollbar-width:none; }
        .scrollbar-none::-webkit-scrollbar { display:none; }
      `}</style>
    </>
  );
};

export default CategoryLayout;