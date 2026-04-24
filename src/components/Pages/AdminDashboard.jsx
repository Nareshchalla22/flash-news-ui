import React, { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
const BASE_URL = isLocal ? "http://localhost:8080/api" : "https://apnews.onrender.com/api";

const CATEGORIES = {
  global: { label: "Global", color: "bg-indigo-600", border: "border-indigo-600", text: "text-indigo-400", fields: ["title", "description", "imageUrl", "date"] },
  national: { label: "National", color: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-400", fields: ["title", "description", "imageUrl", "date"] },
  state: { label: "State", color: "bg-amber-500", border: "border-amber-500", text: "text-amber-400", fields: ["title", "description", "imageUrl", "date"] },
  business: { label: "Business", color: "bg-cyan-500", border: "border-cyan-500", text: "text-cyan-400", fields: ["companyName", "headline", "analysis", "stockUpdate"] },
  crime: { label: "Crime", color: "bg-rose-600", border: "border-rose-600", text: "text-rose-400", fields: ["title", "description", "imageUrl", "date"] },
  entertainment: { label: "Entertainment", color: "bg-fuchsia-500", border: "border-fuchsia-500", text: "text-fuchsia-400", fields: ["movieTitle", "celebrityName", "gossipContent"] },
  sports: { label: "Sports", color: "bg-orange-500", border: "border-orange-500", text: "text-orange-400", fields: ["matchTitle", "scoreUpdate", "summary", "imageUrl"] },
  health: { label: "Health", color: "bg-teal-500", border: "border-teal-500", text: "text-teal-400", fields: ["title", "topic", "medicalAdvice", "doctorConsultant", "imageUrl"] },
  politics: { label: "Politics", color: "bg-blue-600", border: "border-blue-600", text: "text-blue-400", fields: ["title", "description", "imageUrl", "reporterName", "date"] },
  travel: { label: "Travel", color: "bg-lime-500", border: "border-lime-500", text: "text-lime-400", fields: ["title", "description", "imageUrl", "date"] },
  technology: { label: "Technology", color: "bg-violet-600", border: "border-violet-600", text: "text-violet-400", fields: ["gadgetHead", "techReview", "version", "imageUrl"] },
};

const FIELD_META = {
  title: { label: "Title", type: "text" },
  description: { label: "Description", type: "textarea" },
  imageUrl: { label: "Image URL", type: "text" },
  date: { label: "Date", type: "date" },
  companyName: { label: "Company Name", type: "text" },
  headline: { label: "Headline", type: "text" },
  analysis: { label: "Market Analysis", type: "textarea" },
  stockUpdate: { label: "Stock Update", type: "text" },
  movieTitle: { label: "Movie Title", type: "text" },
  celebrityName: { label: "Celebrity", type: "text" },
  gossipContent: { label: "Content", type: "textarea" },
  matchTitle: { label: "Match", type: "text" },
  scoreUpdate: { label: "Score", type: "text" },
  summary: { label: "Summary", type: "textarea" },
  topic: { label: "Topic", type: "text" },
  medicalAdvice: { label: "Advice", type: "textarea" },
  doctorConsultant: { label: "Expert", type: "text" },
  reporterName: { label: "Reporter", type: "text" },
  gadgetHead: { label: "Gadget", type: "text" },
  techReview: { label: "Review", type: "textarea" },
  version: { label: "Model", type: "text" },
};

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function apiFetch(path, method = "GET", body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}/${path}`, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return method === "DELETE" ? null : res.json();
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

const Icon = ({ name }) => {
  const icons = {
    plus: <path d="M12 5v14M5 12h14" />,
    refresh: <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />,
    trash: <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />,
    edit: <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 00 2 2h14a2 2 0 00 2-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />,
    search: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>
  };
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
};

export default function AdminDashboard() {
  const [activeCategory, setActiveCategory] = useState("global");
  const [records, setRecords] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchRecords = useCallback(async (cat = activeCategory) => {
    setLoading(true);
    try {
      const data = await apiFetch(cat);
      const list = Array.isArray(data) ? data : (data?.content || []);
      setRecords(list);
      setCounts(prev => ({ ...prev, [cat]: list.length }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const catConfig = CATEGORIES[activeCategory];

  return (
    <div className="min-h-screen bg-[#cbe771] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl italic">F</span>
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter text-white italic">FlashReport</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase">Live Node</span>
          </div>
          <button 
            onClick={() => fetchRecords()}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <Icon name="refresh" />
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 ${catConfig.color} text-white text-xs font-black uppercase italic rounded-lg hover:scale-105 transition-transform shadow-lg shadow-indigo-500/10`}>
            <Icon name="plus" /> New Entry
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:block border-r border-slate-800 p-4 h-[calc(100vh-64px)] sticky top-16">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Navigation</p>
          <div className="space-y-1">
            {Object.entries(CATEGORIES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                  activeCategory === key 
                    ? `${config.color} text-white shadow-lg` 
                    : "hover:bg-slate-800/50 text-slate-400"
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-tight ${activeCategory === key ? "italic" : ""}`}>
                  {config.label}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  activeCategory === key ? "bg-white/20 text-white" : "bg-slate-800 text-slate-500"
                }`}>
                  {counts[key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-1 h-6 ${catConfig.color} rounded-full`} />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  {catConfig.label} <span className="text-slate-600">Arena</span>
                </h2>
              </div>
              <p className="text-sm text-slate-500 font-medium">Manage and deploy {catConfig.label} updates in real-time.</p>
            </div>

            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                <Icon name="search" />
              </div>
              <input
                type="text"
                placeholder="Filter results..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                    {catConfig.fields.slice(0, 3).map(f => (
                      <th key={f} className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {FIELD_META[f]?.label || f}
                      </th>
                    ))}
                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className={`w-8 h-8 border-4 border-t-transparent ${catConfig.border} rounded-full animate-spin`} />
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Syncing with AWS...</p>
                        </div>
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-20 text-center text-slate-600 font-bold uppercase text-xs italic">
                        No Data Detected in Sector
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded bg-slate-800 ${catConfig.text}`}>
                            #{r.id}
                          </span>
                        </td>
                        {catConfig.fields.slice(0, 3).map(f => (
                          <td key={f} className="p-4 text-xs font-semibold text-slate-300 max-w-[200px] truncate">
                            {f === 'imageUrl' ? (
                               <div className="w-10 h-8 bg-slate-800 rounded overflow-hidden border border-slate-700">
                                 {r[f] && <img src={r[f]} alt="" className="w-full h-full object-cover" />}
                               </div>
                            ) : r[f] || "—"}
                          </td>
                        ))}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors">
                              <Icon name="edit" />
                            </button>
                            <button className="p-2 bg-slate-800 text-slate-400 hover:text-rose-500 rounded-lg transition-colors">
                              <Icon name="trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}