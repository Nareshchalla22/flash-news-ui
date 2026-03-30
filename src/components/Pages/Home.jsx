import React from 'react';
import { Link } from 'react-router-dom';
import CricketTicker from '../Stats/CricketTicker';
import SocialStats from '../Stats/SocialStats';
import { navItems } from '../../Navbar/navdata';
import { newsData } from '../Data/newsdata';

const Home = () => {
  const sections = navItems.filter(item => 
    !['Home', 'Admin', 'Live TV', 'ID Card', 'Contact'].includes(item.label)
  );

  return (
    // 'max-w-full' and 'px-2' ensures it fits the phone screen perfectly
    <div className="w-full max-w-full mx-auto space-y-6 md:space-y-12 pb-20 px-2 md:px-4 overflow-hidden">
      
      <CricketTicker />

      {/* HERO SECTION: Force single column on mobile */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-8">
        
        {/* Main Feature: Flexible height */}
        <div className="w-full lg:col-span-8 relative h-[280px] md:h-[500px] rounded-2xl overflow-hidden group shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            alt="Main Story"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 md:p-10 flex flex-col justify-end">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black w-fit mb-2 md:mb-4 uppercase tracking-widest">Trending</span>
            <h2 className="text-white text-lg md:text-5xl font-black leading-tight italic uppercase tracking-tighter">
              FlashReport: India's Tech Hub Expansion Creates 50,000 New Jobs
            </h2>
          </div>
        </div>

        {/* Sidebar: Becomes a standard section on mobile */}
        <div className="w-full lg:col-span-4 space-y-6">
          <div className="border-l-4 border-blue-600 pl-3">
            <h3 className="text-xs md:text-sm font-black uppercase italic text-slate-800 tracking-tighter">Stay Connected</h3>
          </div>
          <SocialStats />
          
          <div className="bg-slate-900 p-6 md:p-8 rounded-2xl text-white shadow-xl">
             <h4 className="font-bold text-lg italic uppercase mb-2">Flash Digest</h4>
             <button className="w-full bg-blue-600 py-3 rounded-xl text-[10px] font-black uppercase">Subscribe Now</button>
          </div>
        </div>
      </div>

      {/* DYNAMIC SECTIONS */}
      <div className="space-y-12 md:space-y-24">
        {sections.map((cat) => {
          const sectionNews = newsData.filter(n => n.category.toLowerCase() === cat.label.toLowerCase()).slice(0, 5);
          if (sectionNews.length === 0) return null;

          return (
            <section key={cat.label} className="w-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-900 text-white rounded-lg"><cat.icon size={16} /></div>
                  <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">{cat.label}</h2>
                </div>
                <Link to={`/category/${cat.label.toLowerCase()}`} className="text-[9px] font-black uppercase text-blue-600">View All →</Link>
              </div>

              {/* BENTO GRID: Stacks vertically on mobile */}
              <div className="flex flex-col lg:grid lg:grid-cols-4 gap-1 rounded-xl overflow-hidden shadow-md">
                
                {/* Big Story */}
                <Link to={`/category/${cat.label.toLowerCase()}`} className="w-full lg:col-span-2 relative h-[220px] md:h-[400px] overflow-hidden">
                  <img src={sectionNews[0]?.image} className="w-full h-full object-cover" alt="main" />
                  <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-white">
                    <h3 className="text-base md:text-2xl font-black uppercase italic leading-tight">{sectionNews[0]?.title}</h3>
                  </div>
                </Link>

                {/* 4 Small Stories: Shown as a simple scrollable row or stacked on mobile */}
                <div className="w-full lg:col-span-2 grid grid-cols-2 gap-1 h-[220px] md:h-[400px]">
                  {sectionNews.slice(1, 5).map((news, idx) => (
                    <Link key={idx} to={`/category/${cat.label.toLowerCase()}`} className="relative h-full overflow-hidden">
                      <img src={news.image} className="w-full h-full object-cover" alt="sub" />
                      <div className="absolute inset-0 bg-black/50 p-2 flex flex-col justify-end">
                        <h4 className="text-white text-[8px] md:text-[11px] font-black uppercase italic leading-tight line-clamp-2">{news.title}</h4>
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