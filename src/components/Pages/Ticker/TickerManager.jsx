import React, { useState, useEffect } from 'react';
import { Edit3, Save, PlusCircle } from 'lucide-react';
import { newsService, tickerService } from '../../../services/api';

const TickerManager = () => {
  const [tickers, setTickers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempMsg, setTempMsg] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. REUSABLE DATA LOADER
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await tickerService.getTicker();
      // Ensure we always have an array even if the backend is empty
      setTickers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. SYNTAX-FIXED EFFECT (No more cascading render error)
  useEffect(() => {
    const initFetch = async () => {
      await loadData();
    };
    initFetch();
  }, []);

  // 3. POST NEW HEADLINE
  const handlePost = async () => {
    if (!newMsg.trim()) return;
    try {
      // Discrepancy Fix: Sending both variations of the boolean
      const payload = { 
        message: newMsg, 
        active: true, 
        isActive: true, 
        priority: "High" 
      };
      await newsService.createTicker(payload);
      setNewMsg("");
      await loadData();
      alert("Flash Headline Posted Live!");
    } catch (err) {
      console.error("Post Error:", err);
      alert("Post Failed - Check Java Console and CORS settings",err);
    }
  };

  // 4. UPDATE EXISTING
  const handleSave = async (id) => {
    if (!tempMsg.trim()) return;
    try {
      await newsService.updateTicker(id, { 
        message: tempMsg, 
        active: true, 
        isActive: true, 
        priority: "High" 
      });
      setEditingId(null);
      await loadData();
    } catch {
      alert("Update Failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* ADD FORM */}
      <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4">
        <input
          className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-white font-bold italic outline-none border border-white/5 focus:border-blue-500 transition-all"
          placeholder="Type new breaking news here..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button 
          onClick={handlePost} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95"
        >
          Post Live
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 min-h-[300px]">
        <div className="flex justify-between items-center mb-8 border-b-2 border-red-600 pb-2">
          <h2 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">
            Ticker Control Room
          </h2>
          {isLoading && <div className="text-[10px] font-bold text-blue-500 animate-pulse uppercase">Syncing...</div>}
        </div>

        <div className="space-y-4">
          {tickers.length === 0 && !isLoading && (
            <div className="text-center py-10 text-slate-300 font-bold italic uppercase">No Tickers Found</div>
          )}
          
          {tickers.map(t => (
            <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3 transition-all hover:shadow-md">
              {editingId === t.id ? (
                <div className="flex flex-col gap-3">
                  <textarea 
                    className="p-4 rounded-xl border-2 border-blue-100 font-bold text-slate-700 italic outline-none focus:border-blue-500" 
                    value={tempMsg} 
                    onChange={(e) => setTempMsg(e.target.value)} 
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(t.id)} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Feed</button>
                    <button onClick={() => setEditingId(null)} className="px-6 text-slate-400 font-bold text-[10px] uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${(t.active || t.isActive) ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <p className="font-bold text-slate-700 italic leading-snug">"{t.message}"</p>
                  </div>
                  <button 
                    onClick={() => { setEditingId(t.id); setTempMsg(t.message); }} 
                    className="p-2 bg-white hover:bg-blue-50 rounded-lg text-blue-600 shadow-sm border border-slate-100 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TickerManager;