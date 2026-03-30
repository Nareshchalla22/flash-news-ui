import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsData } from '../../Data/newsdata';
import { navItems } from '../../../Navbar/navdata';
import SocialStats from '../../Stats/SocialStats';
import { TrendingUp, CloudSun, Target, Award } from 'lucide-react'; // New Icons

const CategoryPage = () => {
  const { name } = useParams();

  const filteredNews = newsData.filter(
    item => item.category.toLowerCase() === name.toLowerCase()
  );

  const categoryInfo = navItems.find(
    item => item.label.toLowerCase() === name.toLowerCase()
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  const mainFeature = filteredNews[0];
  const subFeatures = filteredNews.slice(1, 5);
  const remainingNews = filteredNews.slice(5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10 bg-white min-h-screen font-sans">
      
      {/* 1. DYNAMIC HEADER */}
      <header className="border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
            Home › <span className="text-blue-600">{name}</span>
          </p>
          <div className="flex items-center gap-5 mt-4">
             <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg">
               {categoryInfo && <categoryInfo.icon size={28} strokeWidth={2.5} />}
             </div>
             <h1 className="text-5xl font-black text-slate-900 capitalize tracking-tighter italic leading-none">
               {name} <span className="text-blue-600 text-3xl md:text-5xl">Pulse</span>
             </h1>
          </div>
        </div>

        {/* WIDGET 1: MINI WEATHER/MARKET (Small Horizontal) */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <CloudSun className="text-yellow-500" size={20} />
              <div>
                 <p className="text-[9px] font-black uppercase text-slate-400">Hyderabad</p>
                 <p className="text-xs font-bold text-slate-800">32°C, Sunny</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" size={20} />
              <div>
                 <p className="text-[9px] font-black uppercase text-slate-400">Nifty 50</p>
                 <p className="text-xs font-bold text-slate-800">25,950 <span className="text-green-500">+1.2%</span></p>
              </div>
           </div>
        </div>
      </header>

      {filteredNews.length > 0 ? (
        <>
          {/* 2. BENTO MOSAIC */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-1 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
             {/* ... (Existing Bento Grid Code) ... */}
             {mainFeature && (
              <div className="lg:col-span-2 relative h-[480px] overflow-hidden group">
                <img src={mainFeature.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10 text-white">
                   <span className="bg-red-600 w-fit px-3 py-1 text-[9px] font-black uppercase mb-4 tracking-widest">Featured</span>
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter drop-shadow-2xl">{mainFeature.title}</h2>
                   <p className="text-[10px] mt-6 opacity-60 font-bold uppercase">{mainFeature.date}</p>
                </div>
              </div>
            )}
            <div className="lg:col-span-2 grid grid-cols-2 gap-1 h-[480px]">
              {subFeatures.map((news) => (
                <div key={news.id} className="relative overflow-hidden group">
                  <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sub" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-5 text-white text-center">
                    <h3 className="text-[11px] font-black leading-tight uppercase group-hover:underline italic">{news.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. LIST FEED + MULTIPLE WIDGET SIDEBAR */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
            
            <div className="lg:col-span-8 space-y-16">
               {/* Main Article List... (Same as before) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
                {remainingNews.map((news) => (
                  <div key={news.id} className="space-y-5 group cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] shadow-sm group-hover:shadow-xl transition-all">
                      <img src={news.image} className="w-full h-full object-cover" alt={news.title} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight hover:text-blue-600 uppercase italic tracking-tighter">
                      {news.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3">{news.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDEBAR WITH NEW WIDGETS */}
            <aside className="lg:col-span-4 space-y-14">
              
              {/* WIDGET 2: SOCIAL (Medium Square) */}
              <div>
                <h4 className="font-black text-slate-900 uppercase italic border-b-4 border-red-600 inline-block mb-8 tracking-tighter text-lg">Follow Us</h4>
                <SocialStats />
              </div>

              {/* WIDGET 3: TRENDING TAGS (Medium sized - Topic Cloud) */}
              <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
                <div className="flex items-center gap-2 mb-6">
                  <Target size={20} className="text-white" />
                  <h4 className="font-black uppercase italic tracking-tighter text-lg">Hot Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["#HyderabadTech", "#StockMarket", "#IPL2026", "#AIRevolution", "#Future", "#Finance"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold hover:bg-white hover:text-blue-600 cursor-pointer transition-all">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* WIDGET 4: MOST READ (Large Vertical - Numbered List) */}
              <div className="sticky top-24 bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                <h4 className="font-black uppercase italic border-b-4 border-yellow-500 inline-block mb-8 tracking-tighter text-lg">Most Read</h4>
                <div className="space-y-8 relative z-10">
                  {filteredNews.slice(0, 3).map((news, idx) => (
                    <div key={news.id} className="flex gap-4 group cursor-pointer">
                      <span className="text-4xl font-black text-slate-700 group-hover:text-yellow-500 transition-colors">0{idx + 1}</span>
                      <div>
                        <h5 className="text-xs font-black uppercase italic leading-snug group-hover:text-blue-400">
                          {news.title}
                        </h5>
                        <div className="flex items-center gap-2 mt-2">
                           <Award size={12} className="text-yellow-500" />
                           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Editors Choice</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Background decorative element */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
              </div>

            </aside>
          </section>
        </>
      ) : (
        /* Empty state code... */
        <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
          <h2 className="text-slate-300 font-black text-6xl uppercase italic tracking-tighter opacity-30 mb-4">No Data</h2>
          <Link to="/" className="mt-10 inline-block bg-slate-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl">Return Home</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;