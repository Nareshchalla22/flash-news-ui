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
    /* Use w-screen and overflow-x-hidden to lock the width to the phone screen */
    <div className="w-full max-w-full overflow-x-hidden px-4 md:px-8 pb-24 space-y-10 md:space-y-16">
      
      {/* 1. TICKER: Wrap in a container that prevents it from stretching the page */}
      <div className="w-full max-w-full overflow-hidden">
        <CricketTicker />
      </div>

      {/* 2. HERO SECTION: Force Flex-Col on Mobile */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* Main Feature: Responsive Height */}
        <div className="w-full lg:col-span-8 relative h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            alt="Main Story"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 md:p-12 flex flex-col justify-end">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black w-fit mb-4 uppercase tracking-widest">Trending Now</span>
            <h2 className="text-white text-xl md:text-5xl font-black leading-tight italic uppercase tracking-tighter drop-shadow-2xl break-words">
              FlashReport: India's Tech Hub Expansion Creates 50,000 New Jobs
            </h2>
          </div>
        </div>

        {/* Sidebar: Now stacks underneath the hero on mobile */}
        <div className="w-full lg:col-span-4 flex flex-col gap-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="text-xs md:text-sm font-black uppercase italic text-slate-800 tracking-tighter">Stay Connected</h3>
          </div>
          
          {/* Ensure SocialStats is responsive internally */}
          <div className="w-full max-w-full overflow-hidden">
            <SocialStats />
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
             <h4 className="font-bold text-lg italic uppercase mb-3 text-blue-500">Flash Digest</h4>
             <p className="text-xs text-slate-400 mb-6 leading-relaxed">The only news you need to start your day.</p>
             <button className="w-full bg-blue-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Subscribe</button>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC SECTIONS: Forced stacking */}
      <div className="space-y-16 md:space-y-28">
        {sections.map((cat) => {
          const sectionNews = newsData.filter(n => n.category.toLowerCase() === cat.label.toLowerCase()).slice(0, 5);
          if (sectionNews.length === 0) return null;

          return (
            <section key={cat.label} className="w-full max-w-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg"><cat.icon size={20} /></div>
                  <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">{cat.label}</h2>
                </div>
                <Link to={`/category/${cat.label.toLowerCase()}`} className="text-[10px] font-black uppercase text-blue-600 hover:text-red-600 transition-colors">View All →</Link>
              </div>

              {/* Bento Grid: 1 column on mobile, 4 on Desktop */}
              <div className="flex flex-col lg:grid lg:grid-cols-4 gap-2 rounded-[2rem] overflow-hidden shadow-sm border border-slate-50">
                <Link to={`/category/${cat.label.toLowerCase()}`} className="lg:col-span-2 relative h-[250px] md:h-[400px] overflow-hidden group">
                  <img src={sectionNews[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="main" />
                  <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end text-white">
                    <h3 className="text-lg md:text-2xl font-black uppercase italic leading-tight">{sectionNews[0]?.title}</h3>
                  </div>
                </Link>

                <div className="lg:col-span-2 grid grid-cols-2 gap-2 h-[250px] md:h-[400px]">
                  {sectionNews.slice(1, 5).map((news, idx) => (
                    <Link key={idx} to={`/category/${cat.label.toLowerCase()}`} className="relative h-full overflow-hidden group">
                      <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="sub" />
                      <div className="absolute inset-0 bg-black/50 p-3 flex flex-col justify-end">
                        <h4 className="text-white text-[9px] md:text-[11px] font-black uppercase italic leading-tight line-clamp-2 group-hover:underline">{news.title}</h4>
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