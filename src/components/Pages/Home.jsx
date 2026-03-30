import React from 'react';
import { Link } from 'react-router-dom';
import CricketTicker from '../Stats/CricketTicker';
import SocialStats from '../Stats/SocialStats';
import { navItems } from '../../Navbar/navdata';
import { newsData } from '../Data/newsdata';

const Home = () => {
  // 1. Filter out non-news categories for the sections
  const sections = navItems.filter(item => 
    !['Home', 'Admin', 'Live TV', 'ID Card', 'Contact'].includes(item.label)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      
      {/* LIVE CRICKET WIDGET */}
      <CricketTicker />

      {/* HERO SECTION (Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feature Story */}
        <div className="lg:col-span-8 relative h-[500px] rounded-3xl overflow-hidden group shadow-2xl cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            alt="Main Story"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black w-fit mb-4 uppercase tracking-widest">Trending Now</span>
            <h2 className="text-white text-3xl md:text-5xl font-black leading-tight italic uppercase tracking-tighter drop-shadow-2xl">
              FlashReport: India's Tech Hub Expansion Creates 50,000 New Jobs
            </h2>
            <p className="text-slate-300 text-sm mt-4 font-medium max-w-2xl hidden md:block">
              Major investment announced for the Hyderabad IT corridor, promising a massive surge in infrastructure and employment...
            </p>
          </div>
        </div>

        {/* Community Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-l-4 border-blue-600 pl-3">
            <h3 className="text-sm font-black uppercase italic text-slate-800 tracking-tighter">Stay Connected</h3>
          </div>
          <SocialStats />
          
          {/* Newsletter Box */}
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <h4 className="font-bold text-xl leading-tight mb-2 italic uppercase">Flash Digest</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">The only news you need to start your day. Join our 1M+ subscribers.</p>
                <button className="w-full bg-blue-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all hover:scale-[1.02]">Subscribe Now</button>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
          </div>
        </div>
      </div>

      {/* DYNAMIC SECTIONS (Section-wise grids like the screenshot) */}
      <div className="space-y-24">
        {sections.map((cat) => {
          // Filter 5 items for the Bento grid in each section
          const sectionNews = newsData.filter(n => n.category.toLowerCase() === cat.label.toLowerCase()).slice(0, 5);
          
          if (sectionNews.length === 0) return null;

          return (
            <section key={cat.label}>
              {/* SECTION HEADER */}
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 text-white rounded-xl">
                    <cat.icon size={20} />
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">{cat.label}</h2>
                </div>
                <Link 
                  to={`/category/${cat.label.toLowerCase()}`} 
                  className="bg-teal-700 text-white text-[10px] font-black uppercase px-4 py-2 hover:bg-slate-900 transition-colors"
                >
                  View All {cat.label}
                </Link>
              </div>

              {/* SECTION BENTO GRID (5 News Items) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                {/* Big Story */}
                <Link to={`/category/${cat.label.toLowerCase()}`} className="lg:col-span-2 relative h-[400px] group overflow-hidden">
                  <img src={sectionNews[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="main" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-white text-2xl font-black uppercase italic leading-tight group-hover:text-blue-400 transition-colors">{sectionNews[0]?.title}</h3>
                    <p className="text-slate-300 text-[10px] font-bold uppercase mt-2">{sectionNews[0]?.date}</p>
                  </div>
                </Link>

                {/* 4 Small Stories */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-1 h-[400px]">
                  {sectionNews.slice(1, 5).map((news, idx) => (
                    <Link key={idx} to={`/category/${cat.label.toLowerCase()}`} className="relative group overflow-hidden">
                      <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="sub" />
                      <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                        <h4 className="text-white text-[11px] font-black uppercase italic leading-tight group-hover:underline">{news.title}</h4>
                      </div>
                    </Link>
                  ))}
                  {/* Fill empty spots if less than 5 items */}
                  {sectionNews.length < 5 && [...Array(5 - sectionNews.length)].map((_, i) => (
                    <div key={i} className="bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase italic">Upcoming Story</div>
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