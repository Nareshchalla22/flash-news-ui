import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CloudSun, Target } from 'lucide-react';
import SocialStats from '../Stats/SocialStats';

const CategoryLayout = ({ name, icon: Icon, news = [] }) => {
  const mainFeature = news[0];
  const subFeatures = news.slice(1, 5);
  const remainingNews = news.slice(5);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 md:space-y-10 bg-white min-h-screen font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <header className="border-b border-slate-100 pb-6 md:pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
            Home › <span className="text-blue-600">{name}</span>
          </p>
          <div className="flex items-center gap-3 md:gap-5 mt-4">
             <div className="p-2 md:p-3 bg-slate-900 text-white rounded-xl shadow-lg">
               {Icon && <Icon size={24} strokeWidth={2.5} />}
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-slate-900 capitalize tracking-tighter italic leading-none">
               {name} <span className="text-blue-600">Pulse</span>
             </h1>
          </div>
        </div>
        {/* WEATHER & STOCK WIDGET */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 w-fit">
           <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <CloudSun className="text-yellow-500" size={18} />
              <div>
                 <p className="text-[8px] font-black uppercase text-slate-400">Hyderabad</p>
                 <p className="text-[10px] font-bold text-slate-800">32°C</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" size={18} />
              <div>
                 <p className="text-[8px] font-black uppercase text-slate-400">Nifty</p>
                 <p className="text-[10px] font-bold text-slate-800">25,950</p>
              </div>
           </div>
        </div>
      </header>

      {news.length > 0 ? (
        <>
          {/* BENTO GRID */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-1 rounded-xl md:rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
            {mainFeature && (
              <div className="lg:col-span-2 relative h-[250px] md:h-[480px] overflow-hidden group">
                <img src={mainFeature.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 md:p-10 text-white">
                   <span className="bg-red-600 w-fit px-2 py-0.5 text-[8px] font-black uppercase mb-2">Featured</span>
                   <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">{mainFeature.title}</h2>
                </div>
              </div>
            )}
            
            <div className="lg:col-span-2 grid grid-cols-2 gap-1 h-[250px] md:h-[480px]">
              {subFeatures.map((item) => (
                <div key={item.id} className="relative overflow-hidden group">
                  <img src={item.image} className="w-full h-full object-cover" alt="Sub" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-3 text-white text-center">
                    <h3 className="text-[9px] md:text-[11px] font-black uppercase italic leading-tight">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LIST FEED + SIDEBAR */}
          <section className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 pt-6 md:pt-12">
            <div className="lg:col-span-8 space-y-10 md:space-y-16">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-10 md:gap-y-16">
                {remainingNews.map((item) => (
                  <div key={item.id} className="space-y-4 group cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden rounded-xl md:rounded-[1.5rem] shadow-sm">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">{item.title}</h3>
                    <p className="text-slate-500 text-xs md:text-sm line-clamp-2">{item.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-10 md:space-y-14">
              <div>
                <h4 className="font-black text-slate-900 uppercase italic border-b-4 border-red-600 inline-block mb-6 tracking-tighter">Follow Us</h4>
                <SocialStats />
              </div>

              <div className="bg-blue-600 p-6 md:p-8 rounded-2xl md:rounded-[2rem] text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} />
                  <h4 className="font-black uppercase italic tracking-tighter text-base">Hot Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["#Hyderabad", "#Stocks", "#AI", "#Tech"].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-[9px] font-bold">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white">
                <h4 className="font-black uppercase italic border-b-4 border-yellow-500 inline-block mb-6 tracking-tighter">Most Read</h4>
                <div className="space-y-6">
                  {news.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="flex gap-3 group">
                      <span className="text-2xl font-black text-slate-700">0{idx + 1}</span>
                      <h5 className="text-[10px] font-black uppercase italic leading-tight group-hover:text-blue-400 transition-colors">{item.title}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100">
          <h2 className="text-slate-300 font-black text-4xl uppercase italic opacity-30">No News in {name}</h2>
          <Link to="/" className="mt-6 inline-block bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase">Return Home</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryLayout;