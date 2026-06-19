import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { newsService, adsService } from '../../services/api';
import { navItems } from '../../Navbar/navdata';
import { useLang } from '../../i18n/LanguageContext';
import { Share2, X, Copy, Check, Clock, Calendar, User, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// AD CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

// Google AdSense — replace with your real publisher ID when you get it
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXXX';
const ADSENSE_READY  = ADSENSE_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXXX';

// Ads are now loaded from backend via adsService.getActive()
// Manage them at /ads-dashboard


// ─── ADSENSE SLOT COMPONENT ───────────────────────────────────────────────────
function AdSenseSlot({ slot, format = 'auto', style = {} }) {
  useEffect(() => {
    if (!ADSENSE_READY) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);

  if (!ADSENSE_READY) return null;

  return (
    <div style={{ overflow: 'hidden', textAlign: 'center', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── CLIENT BANNER AD ────────────────────────────────────────────────────────
function ClientBanner({ ad }) {
  if (!ad) return null;

  // Support both backend field names (accentColor/bgColor) and legacy (accent/bg)
  const accent   = ad.accentColor || ad.accent || '#3b82f6';
  const bg       = ad.bgColor     || ad.bg     || '#0a1628';
  const imgUrl   = ad.imageUrl    || ad.image  || '';

  const typeIcon =
    ad.type === 'school'   ? '🏫' :
    ad.type === 'college'  ? '🎓' :
    ad.type === 'shopping' ? '🛍️' : '📢';

  const ctaLabel =
    ad.type === 'school'   ? 'Enquire →'  :
    ad.type === 'college'  ? 'Apply Now →' :
    ad.type === 'shopping' ? 'Visit Now →' : 'Learn More →';

  const handleClick = () => {
    // Track click on backend
    if (ad.id) {
      adsService.trackClick(ad.id).catch(() => {});
    }
  };

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className="block no-underline rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-0.5"
      style={{ background: bg, border: `1.5px solid ${accent}40` }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${ad.accent}, ${ad.accent}44)` }} />

      <div className="flex items-center gap-3 px-4 py-3 relative">

        {/* Ad tag — top right */}
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          <span className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{ background: `${ad.accent}25`, color: ad.accent }}>
            {ad.tag}
          </span>
        </div>

        {/* Logo / icon */}
        <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center border-2"
          style={{ background: `${ad.accent}18`, borderColor: `${ad.accent}40` }}>
          {ad.image
            ? <img src={ad.image} alt={ad.title} className="w-full h-full object-cover"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            : null
          }
          <div className="w-full h-full flex items-center justify-center text-2xl" style={{ display: ad.image ? 'none' : 'flex' }}>
            {typeIcon}
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 pr-2">
          {/* Badge */}
          <span className="inline-block text-[8px] font-black px-2 py-0.5 rounded-full mb-1"
            style={{ background: `${ad.accent}20`, color: ad.accent }}>
            {ad.badge || typeIcon}
          </span>

          {/* Title */}
          <p className="text-[13px] font-black text-white leading-tight mb-0.5 line-clamp-1">
            {ad.title}
          </p>

          {/* Subtitle */}
          <p className="text-[10px] leading-snug line-clamp-2" style={{ color: '#94a3b8' }}>
            {ad.subtitle}
          </p>

          {/* Phone number */}
          {ad.phone && (
            <p className="text-[9px] font-black mt-1" style={{ color: ad.accent }}>
              📞 {ad.phone}
            </p>
          )}
        </div>

        {/* CTA button */}
        <div className="flex-shrink-0 text-[9px] font-black text-black px-3 py-2 rounded-lg uppercase tracking-wide whitespace-nowrap text-center leading-tight"
          style={{ background: ad.accent, minWidth: 56 }}>
          {ctaLabel}
        </div>
      </div>
    </a>
  );
}

// ─── ROTATING CLIENT AD ───────────────────────────────────────────────────────
function RotatingClientAd({ ads = [] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (ads.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % ads.length), 7000);
    return () => clearInterval(id);
  }, [ads.length]);
  if (!ads.length) return null;
  return <ClientBanner ad={ads[idx]} />;
}

// ─── COMBINED AD BLOCK ────────────────────────────────────────────────────────
// Shows AdSense if ID is configured, else shows rotating client ad
function AdBlock({ slot, className = '', ads = [] }) {
  return (
    <div className={`my-4 ${className}`}>
      {ADSENSE_READY
        ? <AdSenseSlot slot={slot} />
        : <RotatingClientAd ads={ads} />
      }
    </div>
  );
}

// ─── ADVERTISE CTA ────────────────────────────────────────────────────────────
function AdvertiseCTA() {
  return (
    <a href="mailto:ads@ap13news.in" className="block no-underline mb-4">
      <div className="rounded-xl p-4 flex items-center justify-between gap-3 border border-blue-900/30 hover:shadow-md transition-shadow"
        style={{ background: 'linear-gradient(135deg,#0a1628,#0f1f3d)' }}>
        <div>
          <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">📢 Advertise with us</p>
          <p className="text-[13px] font-black text-white mb-0.5">Reach 1M+ Telugu Readers</p>
          <p className="text-[10px] text-slate-400">Contact: ads@ap13news.in</p>
        </div>
        <div className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-wide whitespace-nowrap transition-colors">
          Book Ad →
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING COMPONENTS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

const ACTIVE_CATS = ['Global','National','Business','Sports','Entertainment','Health','Politics','Crime','State'];

const CAT_META = {
  Global:        { color:'#2563eb', tw:'bg-blue-600',   label:'WORLD',     key:'nav.global'        },
  National:      { color:'#16a34a', tw:'bg-green-600',  label:'INDIA',     key:'nav.national'      },
  Business:      { color:'#7c3aed', tw:'bg-violet-600', label:'BUSINESS',  key:'nav.business'      },
  Sports:        { color:'#ea580c', tw:'bg-orange-600', label:'SPORTS',    key:'nav.sports'        },
  Entertainment: { color:'#db2777', tw:'bg-pink-600',   label:'ENTERTAIN', key:'nav.entertainment' },
  Health:        { color:'#0d9488', tw:'bg-teal-600',   label:'HEALTH',    key:'nav.health'        },
  Politics:      { color:'#4f46e5', tw:'bg-indigo-600', label:'POLITICAL', key:'nav.politics'      },
  Crime:         { color:'#dc2626', tw:'bg-red-600',    label:'CRIME',     key:'nav.crime'         },
  State:         { color:'#d97706', tw:'bg-amber-600',  label:'STATE',     key:'nav.state'         },
};

function extract(item) {
  if (!item) return { title:'', description:'', imageUrl:'', reporterName:'', date:'', createdAt:'' };
  return {
    title:        item.title||item.matchTitle||item.movieTitle||item.companyName||item.headline||'',
    description:  item.description||item.summary||item.analysis||item.gossipContent||item.medicalAdvice||'',
    imageUrl:     item.imageUrl||item.image||'',
    reporterName: item.reporterName||'',
    date:         item.date||'',
    createdAt:    item.createdAt||item.publishedAt||item.updatedAt||'',
  };
}

function fmtDate(d) {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return '';
    const diff = Date.now() - dt;
    const mins = Math.floor(diff/60000);
    const hrs  = Math.floor(diff/3600000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs  < 24) return `${hrs}h ago`;
    return dt.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  } catch { return ''; }
}

function SafeImg({ src, alt, className, style }) {
  const [err, setErr] = useState(false);
  if (!src || err) return (
    <div className={`${className||''} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`} style={style}>
      <span className="text-2xl opacity-20">📰</span>
    </div>
  );
  return <img src={src} alt={alt||''} className={className} style={style} onError={() => setErr(true)} />;
}

function CatBadge({ category, tiny }) {
  const meta = CAT_META[category] || { tw:'bg-red-600', label: category||'' };
  return (
    <span className={`inline-block ${meta.tw} text-white font-black uppercase tracking-widest rounded-sm
      ${tiny ? 'text-[7px] px-1.5 py-[1px]' : 'text-[9px] px-2 py-[2px]'}`}>
      {meta.label}
    </span>
  );
}

function ShareModal({ item, onClose }) {
  const { title, imageUrl } = extract(item);
  const [copied, setCopied] = useState(false);
  const cat  = item._cat || item.category || '';
  const id   = item.id   || item._id      || '';
  const url  = id && cat
    ? `${window.location.origin}/category/${cat.toLowerCase()}/${id}`
    : cat
      ? `${window.location.origin}/category/${cat.toLowerCase()}`
      : window.location.href;
  const text = `${title} — AP13 News`;
  const options = [
    { label:'WhatsApp', icon:'💬', color:'#25D366', bg:'#dcfce7', href:`https://wa.me/?text=${encodeURIComponent(text+'\n'+url)}`           },
    { label:'Twitter',  icon:'🐦', color:'#000',    bg:'#f1f5f9', href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { label:'Facebook', icon:'📘', color:'#1877f2', bg:'#dbeafe', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`  },
    { label:'Telegram', icon:'✈️', color:'#0088cc', bg:'#e0f2fe', href:`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`           },
  ];
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-slideUp" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2"><Share2 size={16} className="text-red-500"/><span className="font-black text-[14px] text-slate-900">Share Story</span></div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><X size={13} className="text-slate-500"/></button>
        </div>
        <div className="flex gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
          {imageUrl && <img src={imageUrl} alt="" className="w-12 h-10 object-cover rounded-lg flex-shrink-0" onError={e=>e.target.style.display='none'}/>}
          <p className="text-[11px] font-bold text-slate-700 line-clamp-2 leading-snug">{title}</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {options.map(o => (
              <a key={o.label} href={o.href} target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl no-underline hover:scale-105 transition-transform"
                style={{ background:o.bg }}>
                <span className="text-lg">{o.icon}</span>
                <span className="text-[8px] font-black" style={{ color:o.color }}>{o.label}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 flex-1 truncate font-mono">{url}</span>
            <button onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-[9px] font-black transition-colors ${copied?'bg-green-500':'bg-red-600 hover:bg-red-700'}`}>
              {copied ? <><Check size={10}/>Done</> : <><Copy size={10}/>Copy</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleModal({ item, catName, onClose, onShare }) {
  const f = extract(item);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slideUp flex flex-col"
        style={{ maxHeight:'calc(100vh - 56px)', marginTop:'56px' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300"/>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 flex-shrink-0">
          <CatBadge category={catName} />
          <div className="flex items-center gap-2">
            <button onClick={() => onShare(item)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 text-[10px] font-black rounded-lg transition-colors">
              <Share2 size={10}/> Share
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors" aria-label="Close">
              <X size={15} className="text-slate-500"/>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-none overscroll-contain">
          {f.imageUrl && (
            <div className="w-full aspect-video bg-slate-100">
              <SafeImg src={f.imageUrl} alt={f.title} className="w-full h-full object-cover"/>
            </div>
          )}
          <div className="px-5 py-5">
            <h1 className="text-xl font-black text-slate-900 leading-tight mb-3 uppercase italic tracking-tight">{f.title}</h1>
            <div className="flex items-center flex-wrap gap-3 mb-4 pb-4 border-b border-slate-100">
              {f.reporterName && (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-black text-white">{f.reporterName.charAt(0).toUpperCase()}</div>
                  <span className="text-[11px] font-bold text-slate-700">{f.reporterName}</span>
                </div>
              )}
              {f.date && <span className="flex items-center gap-1 text-[10px] text-slate-400"><Calendar size={10}/>{new Date(f.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>}
              {f.createdAt && <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{fmtDate(f.createdAt)}</span>}
            </div>

            {/* ── In-article ad ── */}
            <AdBlock slot="5555555555" className="mb-4" ads={[]} />

            {f.description ? (
              f.description.split('\n').filter(Boolean).map((p,i) => (
                <p key={i} className="text-slate-700 text-[14px] leading-relaxed mb-3">{p}</p>
              ))
            ) : (
              <p className="text-slate-400 italic text-sm text-center py-8">No further details available.</p>
            )}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Share this story</span>
              <button onClick={()=>onShare(item)} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black rounded-lg transition-colors">
                <Share2 size={11}/> Share Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sk({ className = 'h-32 rounded-xl' }) {
  return <div className={`${className} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer`}/>;
}

function AvatarStrip({ allNews, onRead }) {
  const items = Object.values(allNews).flat().slice(0,14);
  if (!items.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
      {items.map((item,i) => {
        const { imageUrl, title } = extract(item);
        return (
          <button key={i} onClick={() => onRead(item, item._cat)}
            className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 border-slate-200 hover:border-red-500 transition-colors focus:outline-none">
            <SafeImg src={imageUrl} alt={title} className="w-full h-full object-cover"/>
          </button>
        );
      })}
    </div>
  );
}

function HeroSlider({ items, category, mixedItems, onRead }) {
  const slides = mixedItems
    ? mixedItems
    : (items || []).map(i => ({ ...i, _cat: i._cat || category }));
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  useEffect(() => {
    if (!slides.length) return;
    setIdx(0);
    timer.current = setInterval(() => setIdx(p => (p + 1) % slides.length), 4500);
    return () => clearInterval(timer.current);
  }, [slides.length]);
  if (!slides.length) return null;
  const slide    = slides[idx];
  const slideCat = slide._cat || category || '';
  const { title, imageUrl } = extract(slide);
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-200 shadow-md cursor-pointer group" style={{ aspectRatio:'16/10' }}
      onClick={() => onRead(slide, slideCat)}>
      <SafeImg key={idx} src={imageUrl} alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        style={{ animation:'heroFade 0.5s ease' }}/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-transparent"/>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="bg-white/90 text-slate-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">Read Full Story</span>
      </div>
      {slides.length > 1 && [
        { sym:'‹', dir:-1, pos:'left-2' },
        { sym:'›', dir:1,  pos:'right-2' },
      ].map(({ sym, dir, pos }) => (
        <button key={sym}
          onClick={e => { e.stopPropagation(); setIdx(p => (p + dir + slides.length) % slides.length); }}
          className={`absolute top-1/2 -translate-y-1/2 ${pos} w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white text-xl font-black flex items-center justify-center transition-colors z-10`}
        >{sym}</button>
      ))}
      <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
        {slideCat && <CatBadge category={slideCat}/>}
        <h2 className="text-white font-black text-[14px] leading-snug mt-1.5 line-clamp-2 drop-shadow">{title}</h2>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-2.5 right-3 flex gap-1 z-10">
          {slides.slice(0,8).map((_,i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
              className={`rounded-full transition-all ${i===idx?'w-4 h-1.5 bg-white':'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}/>
          ))}
        </div>
      )}
    </div>
  );
}

function SideList({ items, onRead }) {
  return (
    <div className="divide-y divide-slate-100">
      {items.map((item,i) => {
        const { title, imageUrl } = extract(item);
        const cat = item._cat;
        return (
          <button key={i} onClick={() => onRead(item, cat)} className="w-full text-left group focus:outline-none">
            <div className="flex gap-2.5 py-2.5 items-start">
              <div className="w-[64px] h-[48px] rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                <SafeImg src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
              </div>
              <div className="flex-1 min-w-0">
                {cat && <CatBadge category={cat} tiny/>}
                <p className="text-[11px] font-bold text-slate-800 mt-1 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">{title}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function LatestGrid({ allNews, onRead }) {
  const { t } = useLang();
  const items = Object.entries(allNews)
    .flatMap(([cat,arr]) => arr.slice(0,4).map(item=>({...item,_cat:cat})))
    .slice(0,12);
  if (!items.length) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-red-600">
        <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-5 bg-red-600 rounded-full"/>Latest Updates
        </h2>
        <Link to="/" className="text-[9px] font-black text-red-600 no-underline uppercase tracking-widest border border-red-600 px-2.5 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
          {t("home.viewAll")||'All News'} ›
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item,i) => {
          const { title, imageUrl } = extract(item);
          const cat  = item._cat;
          const meta = CAT_META[cat] || { color:'#dc2626', label:'' };
          return (
            <button key={i} onClick={() => onRead(item, cat)} className="text-left group focus:outline-none">
              <div className="bg-white rounded-lg overflow-hidden border border-slate-200 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200">
                <div className="relative h-28 bg-slate-100">
                  <SafeImg src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute top-1.5 left-1.5"><CatBadge category={cat} tiny/></div>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors mb-1.5">{title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-slate-400">{fmtDate(item.createdAt||item.date)}</span>
                    <span className="text-[7px] font-black uppercase tracking-wider" style={{color:meta.color}}>{meta.label}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategorySection({ category, news, onRead, onShare, adAfter, ads = [] }) {
  const { t } = useLang();
  const meta = CAT_META[category] || { tw:'bg-red-600', label:category, key:'', color:'#dc2626' };
  if (!news?.length) return null;
  const [hero,...rest] = news;
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{ borderColor: meta.color }}>
        <div className="flex items-center gap-2">
          <span className={`w-1 h-5 rounded-full ${meta.tw}`}/>
          <span className="text-[14px] font-black text-slate-800 uppercase tracking-wide">{meta.key ? t(meta.key) : category}</span>
          <span className={`text-[8px] font-black text-white ${meta.tw} px-1.5 py-0.5 rounded-full`}>{news.length}</span>
        </div>
        <Link to={`/category/${category.toLowerCase()}`}
          className="text-[9px] font-black no-underline uppercase tracking-widest border px-2.5 py-1 rounded transition-colors hover:text-white"
          style={{ color:meta.color, borderColor:meta.color }}
          onMouseEnter={e=>{e.currentTarget.style.background=meta.color;e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.color=meta.color;}}
        >
          {t("home.viewAll")||'View All'} ›
        </Link>
      </div>

      <div className="mb-3">
        <HeroSlider items={[hero,...rest.slice(0,2)]} category={category} onRead={onRead}/>
      </div>

      {rest.length >= 2 && (
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {rest.slice(0,2).map((item,i) => {
            const { title, imageUrl } = extract(item);
            return (
              <button key={i} onClick={() => onRead(item, category)} className="text-left group focus:outline-none">
                <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="relative h-24 bg-slate-100">
                    <SafeImg src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"/>
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">{title}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {rest.length > 2 && (
        <div className="bg-white rounded-lg border border-slate-200 px-3 divide-y divide-slate-100">
          {rest.slice(2,5).map((item,i) => {
            const { title, imageUrl } = extract(item);
            return (
              <button key={i} onClick={() => onRead(item, category)} className="w-full text-left group focus:outline-none">
                <div className="flex gap-2.5 py-2.5 items-center">
                  <div className="w-14 h-11 rounded overflow-hidden flex-shrink-0 bg-slate-100">
                    <SafeImg src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{title}</p>
                    <ArrowRight size={12} className="text-slate-300 group-hover:text-red-500 flex-shrink-0 transition-colors"/>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Ad after every 3rd section */}
      {adAfter && <AdBlock slot="6666666666" className="mt-4" ads={ads} />}
    </section>
  );
}

function FilterTabs({ active, onChange }) {
  const { t } = useLang();
  const tabs = ['All', ...ACTIVE_CATS];
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 mb-5">
      {tabs.map(tab => {
        const isActive = active === tab;
        const meta = CAT_META[tab];
        const label = tab === 'All' ? (t("home.allNews")||'All') : (meta?.key ? t(meta.key) : tab);
        return (
          <button key={tab} onClick={() => onChange(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wide transition-all whitespace-nowrap
              ${isActive ? 'text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-700'}`}
            style={isActive ? { background: tab==='All' ? '#e8192c' : (meta?.color||'#e8192c') } : {}}
          >{label}</button>
        );
      })}
    </div>
  );
}

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

function SocialStrip() {
  const { t } = useLang();
  const socials = [
    { icon:'▶', label:'YouTube',   count:'8.5K', url:'https://youtube.com/@ap13news',         color:'#ef4444' },
    { icon:'f',  label:'Facebook',  count:'1.2M', url:'https://facebook.com/apnewslocal',      color:'#1877f2' },
    { icon:'📸', label:'Instagram', count:'420K', url:'https://instagram.com/ap13news_telugu', color:'#e1306c' },
  ];
  return (
    <div className="mb-5">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-2">
        <span className="w-1 h-4 bg-red-600 rounded-full"/>
        {t("home.followAP13")||'Follow AP13'}
      </p>
      <div className="flex gap-2.5">
        {socials.map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
            className="flex-1 flex flex-col items-center gap-1.5 py-3 bg-white border border-slate-200 rounded-xl no-underline hover:shadow-md hover:-translate-y-0.5 transition-all"
            style={{ borderTop:`3px solid ${s.color}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black" style={{ background:s.color }}>{s.icon}</div>
            <span className="text-[13px] font-black text-slate-800">{s.count}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN HOME ────────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useLang();
  const [categoryNews, setCategoryNews] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('All');
  const [readItem,     setReadItem]     = useState(null);
  const [shareItem,    setShareItem]    = useState(null);
  const [clientAds,    setClientAds]    = useState({ school:[], college:[], shopping:[], all:[] });
  const activeSections = navItems.filter(i => ACTIVE_CATS.includes(i.label));

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch news + ads in parallel
        const map = {};
        const [,adsRes] = await Promise.all([
          Promise.allSettled(activeSections.map(async cat => {
            try {
              const res = await newsService.getCategoryNews(cat.label.toLowerCase());
              map[cat.label] = Array.isArray(res.data) ? res.data.slice(0,8) : [];
            } catch { map[cat.label] = []; }
          })),
          adsService.getActive().catch(() => ({ data: [] })),
        ]);
        setCategoryNews(map);

        // Organise ads by type
        const ads = Array.isArray(adsRes?.data) ? adsRes.data : [];
        setClientAds({
          school:   ads.filter(a => a.type === 'school'),
          college:  ads.filter(a => a.type === 'college'),
          shopping: ads.filter(a => a.type === 'shopping'),
          all:      ads,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allTagged = Object.entries(categoryNews)
    .flatMap(([cat,arr]) => arr.map(item => ({ ...item, _cat:cat })));

  const shuffledHeroSlides = React.useMemo(() => {
    const picks = Object.entries(categoryNews)
      .flatMap(([cat, arr]) => arr.slice(0,2).map(item => ({ ...item, _cat: cat })));
    for (let i = picks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [picks[i], picks[j]] = [picks[j], picks[i]];
    }
    return picks.slice(0,10);
  }, [categoryNews]);

  const heroCategory = activeTab === 'All'
    ? (Object.keys(categoryNews).find(k => categoryNews[k]?.length > 0) || 'National')
    : activeTab;
  const heroItems  = categoryNews[heroCategory] || [];
  const leftItems  = allTagged.filter(i => i._cat !== heroCategory).slice(0,5);
  const rightItems = allTagged.filter(i => i._cat !== heroCategory).slice(5,10);

  const displaySections = activeTab === 'All'
    ? activeSections
    : activeSections.filter(s => s.label === activeTab);

  const handleRead  = (item, cat) => setReadItem({ item, cat: cat || item._cat || '' });
  const handleShare = (item)      => setShareItem(item);

  return (
    <>
      <style>{`
        @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroFade  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .animate-shimmer     { animation:shimmer 1.5s infinite; }
        .animate-fadeUp      { animation:fadeUp 0.4s ease both; }
        .animate-slideUp     { animation:slideUp 0.22s ease both; }
        .scrollbar-none      { scrollbar-width:none; }
        .scrollbar-none::-webkit-scrollbar { display:none; }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        * { box-sizing:border-box; }
      `}</style>

      {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)}/>}
      {readItem  && (
        <ArticleModal
          item={readItem.item}
          catName={readItem.cat}
          onClose={() => setReadItem(null)}
          onShare={(item) => { setReadItem(null); setShareItem(item); }}
        />
      )}

      <div className="min-h-screen bg-[#eef0f3]">
        <div className="max-w-5xl mx-auto px-3 pt-4 pb-24">

          {loading ? (
            <div className="animate-fadeUp space-y-3">
              <Sk className="h-10 rounded-xl"/>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Sk className="h-16 rounded-lg"/><Sk className="h-16 rounded-lg"/><Sk className="h-16 rounded-lg"/></div>
                <Sk className="h-52 rounded-xl"/>
                <div className="space-y-2"><Sk className="h-16 rounded-lg"/><Sk className="h-16 rounded-lg"/><Sk className="h-16 rounded-lg"/></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_,i) => <Sk key={i} className="h-40 rounded-lg"/>)}
              </div>
            </div>
          ) : (
            <div className="animate-fadeUp">

              {/* Avatar strip */}
              {Object.keys(categoryNews).length > 0 && (
                <AvatarStrip
                  allNews={Object.fromEntries(Object.entries(categoryNews).map(([k,v])=>[k,v.map(i=>({...i,_cat:k}))]))}
                  onRead={handleRead}
                />
              )}

              {/* ── TOP BANNER AD ── */}
              <AdBlock slot="1111111111" ads={clientAds.all} />

              {/* Filter tabs */}
              <FilterTabs active={activeTab} onChange={setActiveTab}/>

              {/* 3-col hero desktop */}
              {activeTab === 'All' && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-3 mb-5">
                  <div className="hidden md:block bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-red-600 rounded-full inline-block"/>TOP STORIES</p>
                    <SideList items={leftItems} onRead={handleRead}/>
                  </div>
                  <HeroSlider mixedItems={shuffledHeroSlides} onRead={handleRead}/>
                  <div className="hidden md:block bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><span className="w-1 h-3 bg-blue-600 rounded-full inline-block"/>MORE NEWS</p>
                    <SideList items={rightItems} onRead={handleRead}/>
                  </div>
                </div>
              )}

              {activeTab !== 'All' && heroItems.length > 0 && (
                <div className="mb-5"><HeroSlider items={heroItems.slice(0,6)} category={heroCategory} onRead={handleRead}/></div>
              )}

              {/* ── SCHOOL ADS ── */}
              {clientAds.school.length > 0 && (
                <div className="mb-4 space-y-2.5">
                  {clientAds.school.slice(0,2).map(ad => <ClientBanner key={ad.id} ad={ad} />)}
                </div>
              )}

              {/* Social + CTA */}
              <SocialStrip/>
              <JoinCTA/>

              {/* ── COLLEGE ADS ── */}
              {clientAds.college.length > 0 && (
                <div className="mb-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span>🎓</span> College Admissions
                  </p>
                  <div className="space-y-2.5">
                    {clientAds.college.slice(0,3).map(ad => <ClientBanner key={ad.id} ad={ad} />)}
                  </div>
                </div>
              )}

              {/* ── ADVERTISE WITH US CTA ── */}
              <AdvertiseCTA />

              {/* Latest grid */}
              {activeTab === 'All' && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6">
                  <LatestGrid allNews={categoryNews} onRead={handleRead}/>
                </div>
              )}

              {/* ── MID PAGE AD ── */}
              <AdBlock slot="2222222222" ads={clientAds.all} />

              {/* Category sections with ads every 3rd */}
              {displaySections.map((cat, idx) => (
                <CategorySection
                  key={cat.label}
                  category={cat.label}
                  news={categoryNews[cat.label]||[]}
                  onRead={handleRead}
                  onShare={handleShare}
                  adAfter={idx % 3 === 2}
                  ads={clientAds.all}
                />
              ))}

              {/* ── SHOPPING COMPLEX ADS ── */}
              {clientAds.shopping.length > 0 && (
                <div className="mb-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span>🛍️</span> New Openings Near You
                  </p>
                  <div className="space-y-2.5">
                    {clientAds.shopping.slice(0,3).map(ad => <ClientBanner key={ad.id} ad={ad} />)}
                  </div>
                </div>
              )}

              {/* ── BOTTOM ADSENSE ── */}
              <AdBlock slot="3333333333" ads={clientAds.all} />

              {/* Pagination */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {['← Prev','1','2','3','Next →'].map((p,i) => (
                  <button key={i} className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors
                    ${p==='1' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-red-400 hover:text-red-600'}`}>
                    {p}
                  </button>
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