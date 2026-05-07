import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/api';
import { navItems } from '../../Navbar/navdata';
import { useLang } from '../../i18n/LanguageContext';

const ACTIVE_CATS = ['Global','National','Business','Sports','Entertainment','Health','Politics','Crime','State'];

const CAT_META = {
  Global:        { color:'#1DB954', emoji:'🌍', key:'nav.global'        },
  National:      { color:'#3b82f6', emoji:'🇮🇳', key:'nav.national'      },
  Business:      { color:'#8b5cf6', emoji:'💼', key:'nav.business'      },
  Sports:        { color:'#f97316', emoji:'🏆', key:'nav.sports'        },
  Entertainment: { color:'#ec4899', emoji:'🎬', key:'nav.entertainment' },
  Health:        { color:'#14b8a6', emoji:'❤️', key:'nav.health'        },
  Politics:      { color:'#6366f1', emoji:'🏛️', key:'nav.politics'      },
  Crime:         { color:'#ef4444', emoji:'🚨', key:'nav.crime'         },
  State:         { color:'#f59e0b', emoji:'📍', key:'nav.state'         },
};

const BG='#0f0f0f', CARD='#181818', LINE='#282828', MUTED='#6b7280', GREEN='#1DB954';

function extract(item) {
  if (!item) return { title:'', description:'', imageUrl:'' };
  return {
    title: item.title||item.matchTitle||item.movieTitle||item.companyName||item.gadgetHead||item.headline||'',
    description: item.description||item.summary||item.analysis||item.gossipContent||item.medicalAdvice||item.techReview||item.globalReport||item.stockUpdate||'',
    imageUrl: item.imageUrl||item.image||'',
  };
}

function SafeImg({ src, alt, style }) {
  const [err, setErr] = useState(false);
  if (!src||err) return (
    <div style={{ ...style, background:'linear-gradient(135deg,#1a1a1a,#222)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <span style={{ fontSize:24, opacity:0.18 }}>📰</span>
    </div>
  );
  return <img src={src} alt={alt||''} style={{ ...style, objectFit:'cover', display:'block' }} onError={() => setErr(true)} />;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const id=setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(id); },[]);
  return <span>{time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})} · {time.toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</span>;
}

function Sk({ h=180, r=10, mb=0 }) {
  return <div style={{ width:'100%', height:h, borderRadius:r, marginBottom:mb, background:`linear-gradient(90deg,${CARD} 25%,#222 50%,${CARD} 75%)`, backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />;
}

function HeroCard({ item, category }) {
  const { t } = useLang();
  const meta = CAT_META[category]||{color:GREEN,emoji:'📰',key:''};
  const { title, description, imageUrl } = extract(item);
  return (
    <Link to={`/category/${category.toLowerCase()}`} style={{ textDecoration:'none', display:'block' }}>
      <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:14, overflow:'hidden', background:CARD }}>
        <SafeImg src={imageUrl} alt={title} style={{ width:'100%', height:'100%' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.25) 60%,transparent 100%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'14px 12px' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:meta.color, borderRadius:20, padding:'3px 9px', marginBottom:7, fontSize:9, fontWeight:800, color:'#000', textTransform:'uppercase', letterSpacing:'0.12em' }}>
            {meta.emoji} {meta.key ? t(meta.key) : category}
          </span>
          <h2 style={{ fontSize:15, fontWeight:800, color:'#fff', margin:0, lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textShadow:'0 1px 6px rgba(0,0,0,0.9)' }}>{title}</h2>
          {description && <p style={{ fontSize:11, color:'rgba(255,255,255,0.58)', margin:'5px 0 0', lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{description}</p>}
        </div>
      </div>
    </Link>
  );
}

function GridCard({ item, category }) {
  const meta = CAT_META[category]||{color:GREEN,emoji:'📰'};
  const { title, imageUrl } = extract(item);
  return (
    <Link to={`/category/${category.toLowerCase()}`} style={{ textDecoration:'none' }}>
      <div style={{ background:CARD, borderRadius:10, overflow:'hidden', border:`1px solid ${LINE}` }}>
        <div style={{ position:'relative', aspectRatio:'4/3', background:'#222' }}>
          <SafeImg src={imageUrl} alt={title} style={{ width:'100%', height:'100%' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.75),transparent 55%)' }} />
          <span style={{ position:'absolute', top:5, left:5, background:meta.color, borderRadius:4, padding:'2px 5px', fontSize:8, fontWeight:800, color:'#000' }}>{meta.emoji}</span>
        </div>
        <div style={{ padding:'7px 9px 9px' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#e2e8f0', margin:0, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{title}</p>
        </div>
      </div>
    </Link>
  );
}

function ListCard({ item, category }) {
  const { title, imageUrl } = extract(item);
  return (
    <Link to={`/category/${category.toLowerCase()}`} style={{ textDecoration:'none' }}>
      <div style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:`1px solid ${LINE}`, alignItems:'center' }}>
        <div style={{ width:68, height:52, borderRadius:8, overflow:'hidden', flexShrink:0, background:'#222' }}>
          <SafeImg src={imageUrl} alt={title} style={{ width:'100%', height:'100%' }} />
        </div>
        <p style={{ fontSize:12, fontWeight:700, color:'#d1d5db', margin:0, lineHeight:1.4, flex:1, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{title}</p>
      </div>
    </Link>
  );
}

function CategorySection({ category, news }) {
  const { t } = useLang();
  const meta = CAT_META[category]||{color:GREEN,emoji:'📰',key:''};
  if (!news||!news.length) return null;
  const [hero,...rest] = news;
  const catLabel = meta.key ? t(meta.key) : category;
  return (
    <section style={{ marginBottom:34 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:11, paddingBottom:8, borderBottom:`2px solid ${meta.color}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:15 }}>{meta.emoji}</span>
          <span style={{ fontSize:15, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'0.03em', fontStyle:'italic' }}>{catLabel}</span>
          <span style={{ fontSize:9, fontWeight:800, color:meta.color, background:meta.color+'18', border:`1px solid ${meta.color}40`, borderRadius:10, padding:'1px 6px' }}>{news.length}</span>
        </div>
        <Link to={`/category/${category.toLowerCase()}`} style={{ fontSize:9, fontWeight:800, color:meta.color, textDecoration:'none', textTransform:'uppercase', letterSpacing:'0.12em', border:`1px solid ${meta.color}40`, padding:'4px 10px', borderRadius:20 }}>
          {t("home.viewAll")}
        </Link>
      </div>
      <div style={{ marginBottom:8 }}><HeroCard item={hero} category={category} /></div>
      {rest.length>=2 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:8 }}>
          {rest.slice(0,2).map((item,i)=><GridCard key={item.id||i} item={item} category={category} />)}
        </div>
      )}
      {rest.slice(2,5).map((item,i)=><ListCard key={item.id||i} item={item} category={category} />)}
    </section>
  );
}

function TrendingStrip({ allNews }) {
  const { t } = useLang();
  const items = Object.entries(allNews).flatMap(([cat,arr])=>arr.slice(0,2).map(item=>({...item,_cat:cat}))).slice(0,12);
  if (!items.length) return null;
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:GREEN, animation:'pulse 1.5s infinite' }} />
        <span style={{ fontSize:10, fontWeight:800, color:GREEN, textTransform:'uppercase', letterSpacing:'0.15em' }}>{t("home.trendingNow")}</span>
      </div>
      <div style={{ display:'flex', gap:9, overflowX:'auto', scrollbarWidth:'none', paddingBottom:4 }}>
        {items.map((item,i)=>{
          const catLabel=item._cat.charAt(0).toUpperCase()+item._cat.slice(1);
          const meta=CAT_META[catLabel]||{color:GREEN,emoji:'📰'};
          const { title, imageUrl }=extract(item);
          return (
            <Link key={i} to={`/category/${item._cat}`} style={{ textDecoration:'none', flexShrink:0, width:130 }}>
              <div style={{ background:CARD, borderRadius:10, overflow:'hidden', border:`1px solid ${LINE}` }}>
                <div style={{ position:'relative', height:84, background:'#222' }}>
                  <SafeImg src={imageUrl} alt={title} style={{ width:'100%', height:'100%' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)' }} />
                  <span style={{ position:'absolute', bottom:4, left:5, fontSize:8, fontWeight:800, color:meta.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{meta.emoji} {catLabel}</span>
                </div>
                <div style={{ padding:'5px 7px 7px' }}>
                  <p style={{ fontSize:10, fontWeight:700, color:'#d1d5db', margin:0, lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SocialStrip() {
  const { t } = useLang();
  const socials=[
    {icon:'▶',label:'YouTube',  count:'8.5K',url:'https://youtube.com/@ap13news',        color:'#ef4444'},
    {icon:'f',label:'Facebook', count:'1.2M',url:'https://facebook.com/apnewslocal',     color:'#1877f2'},
    {icon:'📸',label:'Instagram',count:'420K',url:'https://instagram.com/ap13news_telugu',color:'#e1306c'},
  ];
  return (
    <div style={{ marginBottom:20 }}>
      <p style={{ fontSize:10, fontWeight:800, color:MUTED, textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 9px' }}>{t("home.followAP13")}</p>
      <div style={{ display:'flex', gap:7 }}>
        {socials.map(s=>(
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'9px 4px', background:CARD, border:`1px solid ${LINE}`, borderRadius:10, textDecoration:'none' }}>
            <div style={{ width:30, height:30, borderRadius:7, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff' }}>{s.icon}</div>
            <span style={{ fontSize:12, fontWeight:900, color:'#fff' }}>{s.count}</span>
            <span style={{ fontSize:8, color:MUTED, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function JoinCTA() {
  const { t } = useLang();
  return (
    <Link to="/join" style={{ textDecoration:'none', display:'block', marginBottom:24 }}>
      <div style={{ background:`linear-gradient(135deg,${GREEN},#17a349)`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <p style={{ fontSize:8, fontWeight:800, color:'rgba(0,0,0,0.5)', textTransform:'uppercase', letterSpacing:'0.2em', margin:'0 0 3px' }}>{t("home.nowRecruiting")}</p>
          <p style={{ fontSize:15, fontWeight:900, color:'#000', margin:'0 0 3px', fontStyle:'italic' }}>{t("home.becomeReporter")}</p>
          <p style={{ fontSize:11, color:'rgba(0,0,0,0.52)', margin:0, lineHeight:1.4 }}>{t("home.joinNetwork")}</p>
        </div>
        <div style={{ flexShrink:0, background:'#000', color:GREEN, borderRadius:20, padding:'7px 12px', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap' }}>
          {t("home.applyNow")} ⚡
        </div>
      </div>
    </Link>
  );
}

function FilterTabs({ active, onChange }) {
  const { t } = useLang();
  const tabs = ['All',...ACTIVE_CATS];
  return (
    <div style={{ display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', paddingBottom:2, marginBottom:18 }}>
      {tabs.map(tab=>{
        const isActive=active===tab;
        const meta=CAT_META[tab];
        const color=meta?.color||'#fff';
        const label=tab==='All' ? t("home.allNews") : `${meta?.emoji||''} ${meta?.key ? t(meta.key) : tab}`;
        return (
          <button key={tab} onClick={()=>onChange(tab)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:20, background:isActive?(tab==='All'?'#fff':color):CARD, border:`1px solid ${isActive?(tab==='All'?'#fff':color):LINE}`, color:isActive?'#000':MUTED, cursor:'pointer', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', transition:'all 0.2s', whiteSpace:'nowrap' }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const activeSections = navItems.filter(i=>ACTIVE_CATS.includes(i.label));

  useEffect(()=>{
    const fetchAll=async()=>{
      setLoading(true);
      try {
        const map={};
        await Promise.allSettled(activeSections.map(async cat=>{
          try { const res=await newsService.getCategoryNews(cat.label.toLowerCase()); map[cat.label]=Array.isArray(res.data)?res.data.slice(0,8):[]; }
          catch { map[cat.label]=[]; }
        }));
        setCategoryNews(map);
      } catch(e){ console.error(e); } finally { setLoading(false); }
    };
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const displaySections = activeTab==='All' ? activeSections : activeSections.filter(s=>s.label===activeTab);
  const heroItems = Object.entries(categoryNews).filter(([,arr])=>arr?.length>0).slice(0,2).map(([cat,arr])=>({cat,item:arr[0]}));

  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;}::-webkit-scrollbar{display:none;}
      `}</style>
      <div style={{ minHeight:'100vh', background:BG, color:'#e2e8f0' }}>
        <div style={{ background:'#0a0a0a', borderBottom:`1px solid ${LINE}`, padding:'5px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:10, color:'#4b5563' }}>
          <LiveClock />
          <span style={{ color:GREEN, fontWeight:700, fontSize:9 }}>● {t("header.live")} · {t("common.breakingNews")} 24/7</span>
        </div>
        <div style={{ maxWidth:680, margin:'0 auto', padding:'14px 14px 100px' }}>
          {loading ? (
            <div style={{ marginBottom:22 }}><Sk h={210} r={14} mb={8} /><Sk h={180} r={14} /></div>
          ) : heroItems.length>0 ? (
            <div style={{ marginBottom:22, animation:'fadeUp 0.5s ease' }}>
              {heroItems.map(({cat,item},i)=>(
                <div key={cat} style={{ marginBottom:i<heroItems.length-1?8:0 }}><HeroCard item={item} category={cat} /></div>
              ))}
            </div>
          ) : null}
          {!loading&&Object.keys(categoryNews).length>0&&<TrendingStrip allNews={categoryNews} />}
          <SocialStrip />
          <JoinCTA />
          <FilterTabs active={activeTab} onChange={setActiveTab} />
          {loading ? (
            [1,2,3].map(i=>(
              <div key={i} style={{ marginBottom:32 }}>
                <Sk h={14} r={4} mb={10} /><Sk h={190} r={12} mb={7} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:7 }}><Sk h={140} r={10} /><Sk h={140} r={10} /></div>
              </div>
            ))
          ) : (
            displaySections.map(cat=>(
              <CategorySection key={cat.label} category={cat.label} news={categoryNews[cat.label]||[]} />
            ))
          )}
        </div>
      </div>
    </>
  );
}