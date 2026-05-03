import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CloudSun, Target, ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import SocialStats from '../Stats/SocialStats';

// ─── Universal field extractor ────────────────────────────────────────────────
function extractFields(item) {
  if (!item) return { title: '', description: '', imageUrl: '', date: '', reporterName: '' };

  const title =
    item.title       ||
    item.matchTitle  ||
    item.movieTitle  ||
    item.companyName ||
    item.gadgetHead  ||
    item.headline    ||
    'AP13 News Update';

  const description =
    item.description  ||
    item.summary      ||
    item.analysis     ||
    item.gossipContent||
    item.medicalAdvice||
    item.techReview   ||
    item.globalReport ||
    item.stockUpdate  ||
    '';

  const imageUrl =
    item.imageUrl ||
    item.image    ||
    '';

  const date =
    item.date        ||
    item.publishedAt ||
    item.createdAt   ||
    '';

  const reporterName =
    item.reporterName    ||
    item.doctorConsultant||
    item.sourceAgency    ||
    'AP13 Reporter';

  return { title, description, imageUrl, date, reporterName };
}

// ─── Format Date & Time ───────────────────────────────────────────────────────
function formatDateTime(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric',
      }),
      time: d.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      }),
    };
  } catch {
    return { date: dateStr, time: '' };
  }
}

// ─── Safe Image ───────────────────────────────────────────────────────────────
function SafeImage({ src, alt, className }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={`${className} bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center`}>
        <span className="text-5xl opacity-10">📰</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

// ─── Meta Row — Reporter + Date + Time ───────────────────────────────────────
function MetaRow({ date, reporterName }) {
  const fmt = formatDateTime(date);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
      {/* Reporter */}
      <div className="flex items-center gap-1.5">
        <User size={11} className="text-blue-500" />
        <span className="font-bold text-slate-700">{reporterName}</span>
      </div>

      {/* Date */}
      {fmt?.date && (
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-slate-400" />
          <span>{fmt.date}</span>
        </div>
      )}

      {/* Time */}
      {fmt?.time && (
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-slate-400" />
          <span>{fmt.time}</span>
        </div>
      )}

      {/* Live dot if no date */}
      {!fmt?.date && (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500 font-semibold">Just Now</span>
        </div>
      )}
    </div>
  );
}

// ─── News Card — Image TOP, everything below ──────────────────────────────────
function NewsCard({ item, index, featured = false }) {
  const f = extractFields(item);

  return (
    <div className="group cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">

      {/* ── IMAGE ── */}
      <div className={`relative overflow-hidden bg-slate-100 flex-shrink-0 ${featured ? 'h-72 md:h-96' : 'h-52 md:h-60'}`}>
        <SafeImage
          src={f.imageUrl}
          alt={f.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg tracking-widest
            ${index === 0 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
            {index === 0 ? '🔴 Breaking' : '📰 Latest'}
          </span>
        </div>
      </div>

      {/* ── CONTENT BELOW IMAGE ── */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Reporter + Date + Time */}
        <MetaRow date={f.date} reporterName={f.reporterName} />

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Title */}
        <h3 className={`font-black text-slate-900 leading-tight uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors
          ${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
          {f.title}
        </h3>

        {/* Full Description */}
        {f.description && (
          <p className="text-slate-500 text-sm leading-relaxed">
            {f.description}
          </p>
        )}

        {/* Read more */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-blue-600 text-xs font-black uppercase tracking-wider flex items-center gap-1">
            Read Full Story
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-semibold">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Category Layout ─────────────────────────────────────────────────────
const CategoryLayout = ({ name, icon: Icon, news = [] }) => {
  const featuredNews  = news[0];
  const topStories    = news.slice(1, 4);
  const latestNews    = news.slice(4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 bg-white min-h-screen font-sans">

      {/* ── HEADER ── */}
      <header className="border-b border-slate-100 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
              <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Home</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600">{name}</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="p-2.5 md:p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg flex-shrink-0">
                {Icon && <Icon size={24} strokeWidth={2.5} />}
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 capitalize tracking-tighter italic leading-none">
                  {name} <span className="text-blue-600">Pulse</span>
                </h1>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {news.length} stories • Updated just now
                </p>
              </div>
            </div>
          </div>

          {/* Weather & Stock */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 w-fit">
            <div className="flex items-center gap-2.5 pr-4 border-r border-slate-200">
              <CloudSun className="text-yellow-500" size={20} />
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Hyderabad</p>
                <p className="text-sm font-black text-slate-800">32°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <TrendingUp className="text-green-500" size={20} />
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Nifty</p>
                <p className="text-sm font-black text-slate-800">25,950</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {news.length > 0 ? (
        <>
          {/* ── FEATURED STORY — Image top, all content below ── */}
          {featuredNews && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-red-600" />
                <h2 className="text-lg font-black uppercase italic text-slate-900 tracking-tighter">
                  Featured Story
                </h2>
              </div>
              <NewsCard item={featuredNews} index={0} featured={true} />
            </section>
          )}

          {/* ── BREAKING TICKER ── */}
          <div className="flex items-center gap-3 bg-slate-900 rounded-xl px-4 py-2.5 overflow-hidden">
            <span className="bg-red-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded flex-shrink-0 tracking-widest">
              Live
            </span>
            <p className="text-white text-xs font-semibold truncate flex-1">
              {news.map(item => extractFields(item).title).join('  •  ')}
            </p>
          </div>

          {/* ── TOP STORIES GRID ── */}
          {topStories.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-blue-600" />
                <h2 className="text-lg font-black uppercase italic text-slate-900 tracking-tighter">
                  Top Stories
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topStories.map((item, idx) => (
                  <NewsCard key={item.id || idx} item={item} index={idx + 1} />
                ))}
              </div>
            </section>
          )}

          {/* ── LATEST STORIES + SIDEBAR ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

            {/* Latest News */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full bg-yellow-500" />
                  <h2 className="text-lg font-black uppercase italic text-slate-900 tracking-tighter">
                    Latest Stories
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  {latestNews.length} stories
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestNews.length > 0
                  ? latestNews.map((item, idx) => (
                      <NewsCard key={item.id || idx} item={item} index={idx + 4} />
                    ))
                  : topStories.map((item, idx) => (
                      <NewsCard key={item.id || idx} item={item} index={idx + 1} />
                    ))
                }
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">

              {/* Follow Us */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 className="font-black text-slate-900 uppercase italic border-b-4 border-red-600 inline-block mb-4 tracking-tighter text-sm">
                  Follow Us
                </h4>
                <SocialStats />
              </div>

              {/* Most Read */}
              <div className="bg-slate-900 p-5 rounded-2xl text-white">
                <h4 className="font-black uppercase italic border-b-4 border-yellow-500 inline-block mb-5 tracking-tighter text-sm">
                  Most Read
                </h4>
                <div className="space-y-5">
                  {news.slice(0, 5).map((item, idx) => {
                    const f   = extractFields(item);
                    const fmt = formatDateTime(f.date);
                    return (
                      <div key={item.id || idx} className="flex gap-3 group cursor-pointer">
                        <span className="text-2xl font-black text-slate-700 flex-shrink-0 leading-none">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="space-y-1.5">
                          {/* Title */}
                          <h5 className="text-[10px] font-black uppercase italic leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                            {f.title}
                          </h5>
                          {/* Description */}
                          {f.description && (
                            <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">
                              {f.description}
                            </p>
                          )}
                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1">
                              <User size={8} className="text-blue-400" />
                              <span className="text-[8px] text-slate-400">{f.reporterName}</span>
                            </div>
                            {fmt?.date && (
                              <div className="flex items-center gap-1">
                                <Calendar size={8} className="text-slate-500" />
                                <span className="text-[8px] text-slate-500">{fmt.date}</span>
                              </div>
                            )}
                            {fmt?.time && (
                              <div className="flex items-center gap-1">
                                <Clock size={8} className="text-slate-500" />
                                <span className="text-[8px] text-slate-500">{fmt.time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hot Topics */}
              <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={16} />
                  <h4 className="font-black uppercase italic tracking-tighter text-sm">Hot Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['#Hyderabad', '#Stocks', '#AI', '#Tech', '#Politics', '#Sports', '#Breaking', '#India'].map(tag => (
                    <span key={tag}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-full text-[9px] font-bold cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl text-white border border-slate-700">
                <h4 className="font-black uppercase italic text-sm mb-1 tracking-tighter">Stay Updated</h4>
                <p className="text-slate-400 text-xs mb-4">Get breaking news delivered to your inbox.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer">
                    Go
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </>
      ) : (
        /* ── EMPTY STATE ── */
        <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-6xl mb-4">📭</p>
          <h2 className="text-slate-300 font-black text-4xl uppercase italic mb-2">No News Yet</h2>
          <p className="text-slate-400 text-sm mb-6">No stories available in {name} right now.</p>
          <Link to="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-slate-700 transition-colors">
            <ArrowLeft size={14} />
            Return Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryLayout;