import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, Trash2, Megaphone } from 'lucide-react';

const NewsForm = ({ onPublish }) => {
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Breaking News");
  const [status, setStatus] = useState("idle"); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!headline.trim()) {
      setStatus("error");
      return;
    }

    // Logic for the live ticker
    const newEntry = {
      text: `${category.toUpperCase()}: ${headline}`,
      rawText: headline,
      label: category,
      timestamp: new Date().toLocaleTimeString(),
    };

    onPublish(newEntry);
    setHeadline("");
    setStatus("success");

    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleClear = () => {
    setHeadline("");
    setStatus("idle");
  };

  return (
    <div className="max-w-xl mx-auto my-6 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transition-all">
      {/* Header: Simplified for non-admin look */}
      <div className="bg-blue-900 p-4 flex items-center justify-between">
        <h2 className="text-white text-lg font-black flex items-center gap-2 tracking-tight">
          <Megaphone size={18} className="text-yellow-400" />
          TICKER CONTROL
        </h2>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Live Mode</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Label Selector */}
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">
              Ticker Label
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer font-bold"
            >
              <option value="Breaking News">Breaking News</option>
              <option value="Live Update">Live Update</option>
              <option value="Just In">Just In</option>
              <option value="Trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">
            Scrolling Message
          </label>
          <textarea 
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              if(status === 'error') setStatus('idle');
            }}
            placeholder="Type what you want to see scrolling..."
            className={`w-full h-24 bg-slate-50 border rounded-lg p-3 text-sm text-slate-800 outline-none transition-all resize-none font-medium
              ${status === 'error' ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center px-4 py-3 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
          
          <button 
            type="submit"
            disabled={status === 'success'}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all
              ${status === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer shadow-md'}`}
          >
            {status === 'success' ? (
              <><CheckCircle2 size={16} /> Updated!</>
            ) : (
              <><Send size={16} /> Push to Ticker</>
            )}
          </button>
        </div>

        {/* Error State */}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600 text-[10px] font-black justify-center uppercase tracking-tighter">
            <AlertCircle size={14} /> Headline cannot be empty!
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsForm;