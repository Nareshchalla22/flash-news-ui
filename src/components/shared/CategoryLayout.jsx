import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, CloudSun, Target, Share2,
  Clock, User, Calendar, X, Copy, Check,
} from 'lucide-react';
import SocialStats from '../Stats/SocialStats';
import { useSEO } from '../..//hooks/useSEO';

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
    const d    = new Date(raw);
    if (isNaN(d.getTime())) return { date: raw, time: null, relative: raw };
    const diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const relative =
      mins  < 1  ? 'Just now'      :
      mins  < 60 ? `${mins}m ago`  :
      hrs   < 24 ? `${hrs}h ago`   :
      days  < 7  ? `${days}d ago`  :
      d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    return {
      date:     d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      time:     d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      relative,
    };
  } catch { return { date: raw, time: null, relative: raw }; }
}

// ─── SHARE MODAL ──────────────────────────────────────────────────────────────
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

  const handleNative = () => {
    if (navigator.share) {
      navigator.share({
        title: shareText,
        text:  shareText,
        url:   pageUrl,
      }).catch(() => {});
    }
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
    <div style={{ position:'fixed', inset:0, zIndex:99999, background:'rgba(0,0,0,0.72)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={onClose}>
      <style>{`@keyframes shareUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background:'#fff', borderRadius:22, width:'100%', maxWidth:420, overflow:'hidden', boxShadow:'0 28px 80px rgba(0,0,0,0.45)', animation:'shareUp 0.22s ease' }}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid #f1f5f9' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Share2 size={18} color="#ef4444" />
            <span style={{ fontWeight:800, fontSize:15, color:'#0f172a' }}>Share Story</span>
          </div>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <X size={15} color="#64748b" />
          </button>
        </div>

        {/* Article preview */}
        <div style={{ display:'flex', gap:10, padding:'12px 18px', background:'#fafafa', borderBottom:'1px solid #f1f5f9' }}>
          {imageUrl && (
            <img src={imageUrl} alt="" style={{ width:64, height:52, objectFit:'cover', borderRadius:8, flexShrink:0 }} onError={e=>e.target.style.display='none'} />
          )}
          <div style={{ flex:1, overflow:'hidden' }}>
            <span style={{ fontSize:9, fontWeight:800, color:'#ef4444', textTransform:'uppercase', letterSpacing:'0.1em' }}>{catName}</span>
            <p style={{ fontSize:12, fontWeight:700, color:'#334155', margin:'3px 0 0', lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{title}</p>
          </div>
        </div>

        {/* Share grid */}
        <div style={{ padding:'16px 18px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
            {options.map(opt => (
              <a key={opt.label} href={opt.url} target="_blank" rel="noreferrer"
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'10px 6px', borderRadius:12, background:opt.bg, textDecoration:'none', transition:'transform 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <span style={{ fontSize:22 }}>{opt.icon}</span>
                <span style={{ fontSize:10, fontWeight:800, color:opt.color }}>{opt.label}</span>
              </a>
            ))}
          </div>

          {/* Copy link */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'#f8fafc', borderRadius:12, border:'1px solid #e2e8f0', marginBottom: navigator.share ? 10 : 0 }}>
            <span style={{ fontSize:11, color:'#64748b', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'monospace' }}>{pageUrl}</span>
            <button onClick={handleCopy} style={{ flexShrink:0, padding:'5px 12px', borderRadius:8, border:'none', background:copied?'#22c55e':'#ef4444', color:'#fff', fontWeight:800, fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'background 0.2s' }}>
              {copied ? <><Check size={12}/>Copied!</> : <><Copy size={12}/>Copy</>}
            </button>
          </div>

          {/* Native share */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button onClick={handleNative} style={{ width:'100%', padding:'11px', borderRadius:12, border:'none', background:'#0f172a', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Share2 size={15}/> Share via Device
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Safe Image ───────────────────────────────────────────────────────────────
function SafeImage({ src, alt, style, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) return (
    <div className={className} style={{ ...style, background:'linear-gradient(135deg,#1a1a2e,#16213e)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontSize:38, opacity:0.13 }}>📰</span>
    </div>
  );
  return <img src={src} alt={alt||''} className={className} style={style} onError={()=>setErr(true)} />;
}

// ─── Reporter Meta Strip ───────────────────────────────────────────────────────
function ReporterMeta({ item, onShare, light = false }) {
  const { reporterName, date, createdAt } = extractFields(item);
  const dt    = formatDateTime(createdAt, date);
  const muted = light ? 'rgba(255,255,255,0.6)' : '#94a3b8';
  const text  = light ? '#fff' : '#475569';

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6, marginTop:6 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        {reporterName && (
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg,#ef4444,#dc2626)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff', flexShrink:0 }}>
              {reporterName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:text }}>{reporterName}</span>
          </div>
        )}
        {dt?.date && (
          <div style={{ display:'flex', alignItems:'center', gap:3 }}>
            <Calendar size={10} color={muted}/>
            <span style={{ fontSize:10, color:muted, fontWeight:600 }}>{dt.date}</span>
          </div>
        )}
        {dt?.time && (
          <div style={{ display:'flex', alignItems:'center', gap:3 }}>
            <Clock size={10} color={muted}/>
            <span style={{ fontSize:10, color:muted, fontWeight:600 }}>{dt.time}</span>
          </div>
        )}
        {dt?.relative && (
          <span style={{ fontSize:9, fontWeight:800, color:'#ef4444', background:'#fee2e2', padding:'2px 7px', borderRadius:20 }}>
            {dt.relative}
          </span>
        )}
      </div>
      <button
        onClick={() => onShare(item)}
        style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 11px', borderRadius:20, border:`1px solid ${light?'rgba(255,255,255,0.25)':'#e2e8f0'}`, background:light?'rgba(255,255,255,0.1)':'#fff', color:light?'#fff':'#475569', fontWeight:700, fontSize:10, cursor:'pointer', transition:'all 0.18s' }}
        onMouseEnter={e=>{ e.currentTarget.style.background='#ef4444'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#ef4444'; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=light?'rgba(255,255,255,0.1)':'#fff'; e.currentTarget.style.color=light?'#fff':'#475569'; e.currentTarget.style.borderColor=light?'rgba(255,255,255,0.25)':'#e2e8f0'; }}
      >
        <Share2 size={11}/> Share
      </button>
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ item, catName, onShare }) {
  const f = extractFields(item);
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[16/10] overflow-hidden rounded-xl md:rounded-2xl shadow-sm bg-slate-100 mb-3">
        <SafeImage src={f.imageUrl} alt={f.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease', display:'block' }} className="group-hover:scale-105" />
      </div>
      <h3 className="text-lg font-black text-slate-900 leading-tight uppercase italic tracking-tighter mb-1">{f.title}</h3>
      {f.description && (
        <p className="text-slate-600 text-sm leading-relaxed mb-2">{f.description}</p>
      )}
      <ReporterMeta item={item} onShare={onShare} />
    </div>
  );
}

// ─── MAIN LAYOUT ──────────────────────────────────────────────────────────────
const CategoryLayout = ({ name, icon: Icon, news = [] }) => {
  const [shareItem, setShareItem] = useState(null);

  const mainFeature   = news[0];
  const subFeatures   = news.slice(1, 4);
  const remainingNews = news.slice(4);
  const main          = extractFields(mainFeature);

  // ── Inject OG meta tags so WhatsApp/Telegram show image on share ──
  useSEO({
    title:       main.title,
    description: main.description,
    image:       main.imageUrl,
    url:         window.location.href,
    type:        'article',
  });

  return (
    <>
      {shareItem && <ShareModal item={shareItem} catName={name} onClose={() => setShareItem(null)} />}

      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 bg-white min-h-screen font-sans overflow-x-hidden">

        {/* ── PAGE HEADER ── */}
        <header className="border-b border-slate-100 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
              Home › <span className="text-blue-600">{name}</span>
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="p-2 md:p-3 bg-slate-900 text-white rounded-xl shadow-lg">
                {Icon && <Icon size={22} strokeWidth={2.5} />}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 capitalize tracking-tighter italic leading-none">
                {name} <span className="text-blue-600">Pulse</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 w-fit">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <CloudSun className="text-yellow-500" size={17}/>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400">Hyderabad</p>
                <p className="text-[10px] font-bold text-slate-800">32°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" size={17}/>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400">Nifty</p>
                <p className="text-[10px] font-bold text-slate-800">25,950</p>
              </div>
            </div>
          </div>
        </header>

        {news.length > 0 ? (
          <>
            {/* ── HERO ── */}
            {mainFeature && (
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Main hero */}
                  <div className="lg:col-span-3">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 group" style={{ aspectRatio:'16/10' }}>
                      <SafeImage src={main.imageUrl} alt={main.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.8s ease', display:'block' }} className="group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7 text-white">
                        <span className="bg-red-600 w-fit px-2 py-0.5 text-[8px] font-black uppercase mb-2 rounded">Featured</span>
                        <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter leading-tight mb-2">{main.title}</h2>
                        {main.description && (
                          <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-3 line-clamp-3">{main.description}</p>
                        )}
                        <ReporterMeta item={mainFeature} onShare={setShareItem} light />
                      </div>
                    </div>
                  </div>

                  {/* Sub features */}
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    {subFeatures.map((item, idx) => {
                      const f  = extractFields(item);
                      const dt = formatDateTime(f.createdAt, f.date);
                      return (
                        <div key={item.id||idx} className="flex gap-3 group cursor-pointer p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                            <SafeImage src={f.imageUrl} alt={f.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s' }} className="group-hover:scale-105" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-slate-900 uppercase italic leading-tight line-clamp-2 mb-1">{f.title}</h4>
                            {f.description && <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2 mb-1">{f.description}</p>}
                            <div className="flex items-center gap-2 flex-wrap">
                              {f.reporterName && <span className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold"><User size={8}/>{f.reporterName}</span>}
                              {dt && <span className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold"><Clock size={8}/>{dt.relative}</span>}
                              <button onClick={()=>setShareItem(item)} className="ml-auto p-1 rounded-full bg-slate-100 hover:bg-red-100 transition-all"><Share2 size={9} color="#64748b"/></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ── MORE NEWS + SIDEBAR ── */}
            {remainingNews.length > 0 && (
              <section className="flex flex-col lg:grid lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-8">
                  <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter border-b-2 border-slate-200 pb-3 mb-6">More Stories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {remainingNews.map((item, idx) => (
                      <ArticleCard key={item.id||idx} item={item} catName={name} onShare={setShareItem} />
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-8">
                  <div>
                    <h4 className="font-black text-slate-900 uppercase italic border-b-4 border-red-600 inline-block mb-5 tracking-tighter text-sm">Follow Us</h4>
                    <SocialStats />
                  </div>
                  <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-3"><Target size={16}/><h4 className="font-black uppercase italic tracking-tighter text-sm">Hot Topics</h4></div>
                    <div className="flex flex-wrap gap-2">
                      {['#Hyderabad','#Stocks','#AI','#Tech','#Politics','#Sports'].map(tag=>(
                        <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-[9px] font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Most Read */}
                  <div className="bg-slate-900 p-5 rounded-2xl text-white">
                    <h4 className="font-black uppercase italic border-b-4 border-yellow-500 inline-block mb-5 tracking-tighter text-sm">Most Read</h4>
                    <div className="space-y-4">
                      {news.slice(0,5).map((item, idx) => {
                        const f  = extractFields(item);
                        const dt = formatDateTime(f.createdAt, f.date);
                        return (
                          <div key={item.id||idx} className="flex gap-3 group">
                            <span className="text-xl font-black text-slate-700 flex-shrink-0 leading-none mt-0.5">{String(idx+1).padStart(2,'0')}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black uppercase italic leading-tight group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">{f.title}</p>
                              {f.description && <p className="text-[9px] text-slate-500 leading-relaxed line-clamp-2 mb-1">{f.description}</p>}
                              <div className="flex items-center gap-2 flex-wrap">
                                {f.reporterName && <span className="flex items-center gap-1 text-[8px] text-slate-500 font-semibold"><User size={7}/>{f.reporterName}</span>}
                                {dt && <span className="flex items-center gap-1 text-[8px] text-slate-600 font-semibold"><Clock size={7}/>{dt.relative}</span>}
                                <button onClick={()=>setShareItem(item)} className="ml-auto p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-all"><Share2 size={8} color="#64748b"/></button>
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
          </>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100">
            <p className="text-6xl mb-4">📭</p>
            <h2 className="text-slate-300 font-black text-4xl uppercase italic opacity-30">No News in {name}</h2>
            <Link to="/" className="mt-6 inline-block bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase">Return Home</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryLayout;