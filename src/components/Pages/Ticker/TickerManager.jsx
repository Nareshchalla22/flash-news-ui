import React, { useState, useEffect } from 'react'; // Added useEffect import
import { Edit3, Database, Send } from 'lucide-react';
import { tickerService } from '../../../services/api'; 

const TickerManager = () => {
  const [tickers, setTickers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempMsg, setTempMsg] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. REUSABLE DATA LOADER ---
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await tickerService.getAll();
      setTickers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. THE HOOK TO LOAD DATA ON START ---
  useEffect(() => {
    loadData();
  }, []);

  // --- 3. POST NEW HEADLINE ---
  const handlePost = async () => {
    if (!newMsg.trim()) return;
    setIsLoading(true);
    try {
      const payload = {
        message: newMsg,
        isActive: true,
        priority: "High"
      };
      await tickerService.create(payload);
      setNewMsg("");
      await loadData();
    } catch (err) {
      console.error("Post Error:", err);
      alert("Post Failed - Check Backend Logs");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. UPDATE EXISTING ---
  const handleSave = async (id) => {
    if (!tempMsg.trim()) return;
    setIsLoading(true);
    try {
      await tickerService.update(id, {
        message: tempMsg,
        isActive: true,
        priority: "High"
      });
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 mt-10">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg">
          <Database size={24} className={isLoading ? 'animate-spin' : ''} />
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
          Ticker <span className="text-red-600">Control Room</span>
        </h2>
      </div>

      {/* ADD FORM */}
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl flex flex-col md:flex-row gap-4 border-4 border-slate-800">
        <input
          className="flex-1 bg-white/10 rounded-2xl px-6 py-4 text-white font-bold italic outline-none border border-white/5 focus:border-red-500 transition-all"
          placeholder="ENTER BREAKING NEWS HEADLINE..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button
          onClick={handlePost}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <Send size={18} /> {isLoading ? "Syncing..." : "Post Live"}
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="space-y-4">
          {tickers.map(t => (
            <div key={t.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3 hover:border-red-100 transition-all">
              {editingId === t.id ? (
                <div className="flex flex-col gap-4">
                  <textarea
                    className="p-5 rounded-2xl border-2 border-red-50 font-bold text-slate-700 italic outline-none focus:border-red-500 bg-white"
                    value={tempMsg}
                    onChange={(e) => setTempMsg(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => handleSave(t.id)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Update Satellite Feed</button>
                    <button onClick={() => setEditingId(null)} className="px-8 text-slate-400 font-bold uppercase text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${t.active || t.isActive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-300'}`} />
                    <p className="font-bold text-slate-800 text-lg italic leading-tight uppercase tracking-tight">
                      "{t.message}"
                    </p>
                  </div>
                  <button
                    onClick={() => { setEditingId(t.id); setTempMsg(t.message); }}
                    className="p-3 bg-white hover:bg-red-50 rounded-xl text-red-600 shadow-sm border border-slate-100 transition-all hover:scale-110"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {tickers.length === 0 && !isLoading && (
            <div className="text-center py-20 text-slate-300 font-black italic uppercase text-2xl">Signal Lost - No Data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TickerManager;