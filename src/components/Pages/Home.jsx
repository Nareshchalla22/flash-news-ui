import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CricketTicker from '../Stats/CricketTicker';
import SocialStats from '../Stats/SocialStats';
import { navItems } from '../../Navbar/navdata';
import { newsService } from '../../services/api';

const Home = () => {
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Define active sections
  const activeSections = navItems.filter(item => 
    ['Global', 'National', 'Business', 'Sports', 'Entertainment', 'Health','Politics','Crime'].includes(item.label)
  );

  // 2. Fetch Logic
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const newsMap = {};
        
        await Promise.all(activeSections.map(async (cat) => {
          const endpoint = cat.label.toLowerCase(); 
          const res = await newsService.getCategoryNews(endpoint);
          
          // Ensure we match the backend data structure
          newsMap[cat.label] = Array.isArray(res.data) ? res.data.slice(0, 5) : [];
        }));

        setCategoryNews(newsMap);
        setLoading(false);
      } catch (err) {
        console.error("AP13 Network Sync Failed:", err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-red-600 font-black italic tracking-[0.3em] animate-pulse">SYNCING LIVE FEED...</p>
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 md:px-8 pb-24 space-y-10 md:space-y-16">
      
      {/* SECTION 1: CRICKET TICKER */}
      <div className="w-full overflow-hidden rounded-xl shadow-lg">
        <CricketTicker />
      </div>

      {/* SECTION 2: HERO SECTION */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="w-full lg:col-span-8 relative h-[350px] md:h-[550px] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" 
            alt="Main Story"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 md:p-12 flex flex-col justify-end">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit shadow-lg">Trending</span>
            <h2 className="text-white text-3xl md:text-6xl font-[1000] italic uppercase tracking-tighter transform -skew-x-6 drop-shadow-2xl">
              AP13 Exclusive: Real-Time Intelligence Now Live
            </h2>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:col-span-4 flex flex-col gap-6">
          <div className="border-l-8 border-red-600 pl-4">
            <h3 className="text-sm font-black uppercase italic text-slate-900 tracking-tighter">Stay Connected</h3>
          </div>
          <SocialStats />
          
          <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl border border-slate-900 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
            <h4 className="font-black text-2xl italic uppercase mb-2">AP13 <span className="text-red-600">Live</span></h4>
            <a href="https://www.youtube.com/@ap13news" target="_blank" rel="noreferrer" className="block w-full">
              <button className="w-full bg-red-600 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all active:scale-95">
                Subscribe YouTube
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 3: DYNAMIC BENTO GRIDS */}
      <div className="space-y-24">
        {activeSections.map((cat) => {
          const sectionNews = categoryNews[cat.label] || [];
          if (sectionNews.length === 0) return null;

          return (
            <section key={cat.label} className="w-full group">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8 border-b-2 border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-600 text-white rounded-2xl shadow-xl transition-transform group-hover:rotate-12">
                    {cat.icon && <cat.icon size={24} />}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter text-slate-950 leading-none">
                    {cat.label}
                  </h2>
                </div>
                <Link to={`/category/${cat.label.toLowerCase()}`} className="px-6 py-2 rounded-full border-2 border-slate-200 text-[10px] font-black uppercase text-slate-400 hover:bg-red-600 hover:text-white transition-all">
                  Explore All →
                </Link>
              </div>

              {/* Bento Grid Layout */}
              <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6">
                
                {/* 1. Large Main Bento Item */}
                <Link to={`/category/${cat.label.toLowerCase()}`} className="lg:col-span-2 relative h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden group shadow-xl bg-slate-100">
                  <img 
                    src={sectionNews[0]?.imageUrl || 'https://via.placeholder.com/800x500?text=No+Image'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                    alt="main" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=AP13+News'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                    <h3 className="text-white text-xl md:text-3xl font-black uppercase italic leading-none line-clamp-2">
                      {sectionNews[0]?.title}
                    </h3>
                  </div>
                </Link>

                {/* 2. Smaller Grid Items (Items 2-5) */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
                  {sectionNews.slice(1, 5).map((news, idx) => (
                    <Link key={idx} to={`/category/${cat.label.toLowerCase()}`} className="relative h-[140px] md:h-[240px] rounded-[1.5rem] overflow-hidden group shadow-lg bg-slate-100">
                      <img 
                        src={news.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt="sub" 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=AP13+News'; }}
                      />
                      <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end group-hover:bg-red-600/40 transition-colors">
                        <h4 className="text-white text-[10px] md:text-sm font-black uppercase italic leading-tight line-clamp-3">
                          {news.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Home;