import React, { useState, useEffect } from 'react';
import { Edit3, Database, Send, Trash2, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { tickerService } from '../../../services/api';

const TickerManager = () => {
  const [tickers,    setTickers]    = useState([]);
  const [editingId,  setEditingId]  = useState(null);
  const [tempMsg,    setTempMsg]    = useState('');
  const [newMsg,     setNewMsg]     = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [toast,      setToast]      = useState(null);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load all tickers ────────────────────────────────────────────────────────
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await tickerService.getAll();
      setTickers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch Error:', err);
      showToast('Failed to load tickers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── Post new headline ────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!newMsg.trim()) return;
    setIsLoading(true);
    try {
      await tickerService.create({
        message:  newMsg.trim(),
        active:   true,
        isActive: true,
        priority: 'High',
      });
      setNewMsg('');
      await loadData();
      showToast('Ticker posted live!');
    } catch (err) {
      console.error('POST ERROR:', err.response?.data || err.message);
      showToast('Post failed. Check API connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update existing ──────────────────────────────────────────────────────────
  const handleSave = async (id) => {
    if (!tempMsg.trim()) return;
    setIsLoading(true);
    try {
      await tickerService.update(id, {
        message:  tempMsg.trim(),
        isActive: true,
        priority: 'High',
      });
      setEditingId(null);
      await loadData();
      showToast('Ticker updated!');
    } catch (err) {
      console.error('Update Error:', err);
      showToast('Update failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      await tickerService.toggle(id);
      await loadData();
      showToast('Ticker toggled!');
    } catch (err) {
      console.error('Toggle Error:', err);
      showToast('Toggle failed.', 'error');
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await tickerService.delete(id);
      setDeleteId(null);
      await loadData();
      showToast('Ticker deleted.');
    } catch (err) {
      console.error('Delete Error:', err);
      showToast('Delete failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = tickers.filter(t => t.active || t.isActive).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-6">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg">
            <Database size={24} className={isLoading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
              Ticker <span className="text-red-600">Control</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {activeCount} active · {tickers.length} total
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all"
        >
          ↺ Refresh
        </button>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',    value: tickers.length,       color: 'bg-slate-900 text-white' },
          { label: 'Active',   value: activeCount,           color: 'bg-green-600 text-white' },
          { label: 'Inactive', value: tickers.length - activeCount, color: 'bg-slate-100 text-slate-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center shadow-sm`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── ADD FORM ── */}
      <div className="bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-800">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Plus size={12} /> New Headline
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="flex-1 bg-white/10 rounded-xl px-5 py-3.5 text-white font-bold italic outline-none border border-white/10 focus:border-red-500 transition-all placeholder:text-slate-600 text-sm"
            placeholder="ENTER BREAKING NEWS HEADLINE..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePost()}
          />
          <button
            onClick={handlePost}
            disabled={isLoading || !newMsg.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-black uppercase italic tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <Send size={16} />
            {isLoading ? 'Posting...' : 'Post Live'}
          </button>
        </div>
      </div>

      {/* ── TICKER LIST ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-800 uppercase italic tracking-tighter text-sm">
            All Headlines
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{tickers.length} records</span>
        </div>

        <div className="divide-y divide-slate-50">
          {tickers.length === 0 && !isLoading ? (
            <div className="text-center py-16 text-slate-300 font-black italic uppercase text-xl">
              📡 No Tickers Found
            </div>
          ) : isLoading && tickers.length === 0 ? (
            <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
              <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-red-500 animate-spin" />
              Loading...
            </div>
          ) : (
            tickers.map(t => {
              const isActive = t.active === true || t.isActive === true;
              return (
                <div
                  key={t.id}
                  className={`p-5 transition-colors ${isActive ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  {editingId === t.id ? (
                    /* ── EDIT MODE ── */
                    <div className="flex flex-col gap-3">
                      <textarea
                        className="w-full p-4 rounded-xl border-2 border-red-100 font-bold text-slate-700 italic outline-none focus:border-red-400 bg-white resize-none text-sm"
                        rows={2}
                        value={tempMsg}
                        onChange={e => setTempMsg(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(t.id)}
                          className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors"
                        >
                          ✓ Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-6 text-slate-400 font-bold uppercase text-xs hover:text-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: status dot + message */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            isActive
                              ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse'
                              : 'bg-slate-300'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 italic leading-tight text-sm line-clamp-2">
                            "{t.message}"
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold">
                              ID #{t.id}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              isActive ? 'text-green-500' : 'text-slate-400'
                            }`}>
                              {isActive ? '● LIVE' : '○ OFF'}
                            </span>
                            {t.priority && (
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {t.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Toggle */}
                        <button
                          onClick={() => handleToggle(t.id)}
                          title={isActive ? 'Deactivate' : 'Activate'}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                              : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {isActive
                            ? <ToggleRight size={18} />
                            : <ToggleLeft  size={18} />
                          }
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => { setEditingId(t.id); setTempMsg(t.message); }}
                          title="Edit"
                          className="p-2 bg-white hover:bg-blue-50 rounded-lg text-blue-500 shadow-sm border border-slate-100 transition-all hover:scale-105 cursor-pointer"
                        >
                          <Edit3 size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(t.id)}
                          title="Delete"
                          className="p-2 bg-white hover:bg-red-50 rounded-lg text-red-400 shadow-sm border border-slate-100 transition-all hover:scale-105 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-lg mb-2">Delete Ticker?</h3>
            <p className="text-slate-500 text-sm mb-6">
              This headline will be permanently removed from the live ticker feed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-6 right-4 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl min-w-[200px] flex items-center gap-2
          ${toast.type === 'error'
            ? 'bg-red-950 border border-red-800 text-red-300'
            : 'bg-green-950 border border-green-800 text-green-300'
          }`}
        >
          {toast.type === 'error' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}
    </div>
  );
};

export default TickerManager;