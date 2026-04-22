import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CricketTicker from '../Stats/CricketTicker';
import SocialStats from '../Stats/SocialStats';
import { navItems } from '../../Navbar/navdata';
import { newsService } from '../../services/api';

const glass = "bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl";

const Home = () => {
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);

  const activeSections = navItems.filter(item =>
    ['Global', 'National', 'Business', 'Sports', 'Entertainment', 'Health', 'Politics', 'Crime','State'].includes(item.label)
  );

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const newsMap = {};

        await Promise.all(activeSections.map(async (cat) => {
          const endpoint = cat.label.toLowerCase();
          const res = await newsService.getCategoryNews(endpoint);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
        <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="tracking-widest text-sm text-red-400 animate-pulse">LOADING NEWS FEED...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 pb-20 space-y-16 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">

      {/* Cricket */}
      <div className={`rounded-2xl overflow-hidden ${glass}`}>
        <CricketTicker />
      </div>

      {/* Hero */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c"
            className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
          />
          <div className={`absolute inset-0 ${glass} flex flex-col justify-end p-8`}>
            <span className="bg-red-600 text-white px-4 py-1 text-xs rounded-full w-fit mb-3">Trending</span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900">
              AP13 Real-Time News Intelligence
            </h1>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className={glass + " p-4 rounded-2xl"}>
            <SocialStats />
          </div>

          <div className={`${glass} p-6 rounded-3xl`}>
            <h3 className="text-lg font-bold mb-3">AP13 Live</h3>
            <a href="https://www.youtube.com/@ap13news" target="_blank" rel="noreferrer">
              <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-500 transition">
                Subscribe YouTube
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Sections */}
      {activeSections.map((cat) => {
        const sectionNews = categoryNews[cat.label] || [];
        if (!sectionNews.length) return null;

        return (
          <section key={cat.label}>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-4xl font-bold">
                {cat.label}
              </h2>
              <Link to={`/category/${cat.label.toLowerCase()}`} className="text-sm text-red-500 hover:underline">
                View All
              </Link>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Big */}
              <Link to={`/category/${cat.label.toLowerCase()}`} className={`md:col-span-2 h-[300px] rounded-2xl overflow-hidden relative group ${glass}`}>
                <img
                  src={sectionNews[0]?.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute bottom-0 p-4 bg-white/40 backdrop-blur-lg w-full">
                  <h3 className="text-lg font-semibold line-clamp-2 text-slate-900">
                    {sectionNews[0]?.title}
                  </h3>
                </div>
              </Link>

              {/* Small */}
              {sectionNews.slice(1, 5).map((news, i) => (
                <Link key={i} to={`/category/${cat.label.toLowerCase()}`} className={`h-[140px] rounded-xl overflow-hidden relative group ${glass}`}>
                  <img src={news.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute bottom-0 p-2 bg-white/40 backdrop-blur-md w-full">
                    <p className="text-xs line-clamp-2 text-slate-900">{news.title}</p>
                  </div>
                </Link>
              ))}

            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Home;
