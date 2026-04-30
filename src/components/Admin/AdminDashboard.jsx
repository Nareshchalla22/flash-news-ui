import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:8080/api"
  : "https://18.61.229.102.nip.io/api";

const CATEGORIES = {
  global:        { label: "Global",        color: "indigo",  fields: ["title", "description", "imageUrl", "date"] },
  national:      { label: "National",      color: "emerald", fields: ["title", "description", "imageUrl", "date"] },
  state:         { label: "State",         color: "amber",   fields: ["title", "description", "imageUrl", "date"] },
  business:      { label: "Business",      color: "cyan",    fields: ["companyName", "headline", "analysis", "stockUpdate"] },
  crime:         { label: "Crime",         color: "red",     fields: ["title", "description", "imageUrl", "date"] },
  entertainment: { label: "Entertainment", color: "purple",  fields: ["movieTitle", "celebrityName", "gossipContent"] },
  sports:        { label: "Sports",        color: "orange",  fields: ["matchTitle", "scoreUpdate", "summary", "imageUrl"] },
  health:        { label: "Health",        color: "teal",    fields: ["title", "topic", "medicalAdvice", "doctorConsultant", "imageUrl"] },
  politics:      { label: "Politics",      color: "blue",    fields: ["title", "description", "imageUrl", "reporterName", "date"] },
  travel:        { label: "Travel",        color: "lime",    fields: ["title", "description", "imageUrl", "date"] },
  technology:    { label: "Technology",    color: "violet",  fields: ["gadgetHead", "techReview", "version", "imageUrl"] },
};

const FIELD_META = {
  title:            { label: "Title",           type: "text" },
  description:      { label: "Description",     type: "textarea" },
  imageUrl:         { label: "Image",           type: "image" },
  date:             { label: "Date",             type: "date" },
  companyName:      { label: "Company Name",     type: "text" },
  headline:         { label: "Headline",         type: "text" },
  analysis:         { label: "Market Analysis",  type: "textarea" },
  stockUpdate:      { label: "Stock Update",     type: "text" },
  movieTitle:       { label: "Movie Title",      type: "text" },
  celebrityName:    { label: "Celebrity",        type: "text" },
  gossipContent:    { label: "Content",          type: "textarea" },
  matchTitle:       { label: "Match",            type: "text" },
  scoreUpdate:      { label: "Score",            type: "text" },
  summary:          { label: "Summary",          type: "textarea" },
  topic:            { label: "Topic",            type: "text" },
  medicalAdvice:    { label: "Advice",           type: "textarea" },
  doctorConsultant: { label: "Expert",           type: "text" },
  reporterName:     { label: "Reporter",         type: "text" },
  gadgetHead:       { label: "Gadget",           type: "text" },
  techReview:       { label: "Review",           type: "textarea" },
  version:          { label: "Model",            type: "text" },
};

const COLOR_MAP = {
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/30",  text: "text-indigo-400",  dot: "bg-indigo-500",  btn: "bg-indigo-600 hover:bg-indigo-700"  },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-500", btn: "bg-emerald-600 hover:bg-emerald-700" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-400",   dot: "bg-amber-500",   btn: "bg-amber-600 hover:bg-amber-700"   },
  cyan:    { bg: "bg-cyan-500/10",    border: "border-cyan-500/30",    text: "text-cyan-400",    dot: "bg-cyan-500",    btn: "bg-cyan-600 hover:bg-cyan-700"    },
  red:     { bg: "bg-red-500/10",     border: "border-red-500/30",     text: "text-red-400",     dot: "bg-red-500",     btn: "bg-red-600 hover:bg-red-700"     },
  purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/30",  text: "text-purple-400",  dot: "bg-purple-500",  btn: "bg-purple-600 hover:bg-purple-700"  },
  orange:  { bg: "bg-orange-500/10",  border: "border-orange-500/30",  text: "text-orange-400",  dot: "bg-orange-500",  btn: "bg-orange-600 hover:bg-orange-700"  },
  teal:    { bg: "bg-teal-500/10",    border: "border-teal-500/30",    text: "text-teal-400",    dot: "bg-teal-500",    btn: "bg-teal-600 hover:bg-teal-700"    },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/30",    text: "text-blue-400",    dot: "bg-blue-500",    btn: "bg-blue-600 hover:bg-blue-700"    },
  lime:    { bg: "bg-lime-500/10",    border: "border-lime-500/30",    text: "text-lime-400",    dot: "bg-lime-500",    btn: "bg-lime-600 hover:bg-lime-700"    },
  violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/30",  text: "text-violet-400",  dot: "bg-violet-500",  btn: "bg-violet-600 hover:bg-violet-700"  },
};

// ─── API ──────────────────────────────────────────────────────────────────────
async function apiFetch(path, method = "GET", body = null) {
  const token = localStorage.getItem("ap13_token");
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}/${path}`, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return method === "DELETE" ? null : res.json();
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
async function uploadImage(file) {
  const token = localStorage.getItem("ap13_token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "news");

  const res = await fetch(`${BASE_URL}/media/upload`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.url;
}

// ─── IMAGE UPLOAD FIELD ───────────────────────────────────────────────────────
function ImageUploadField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(value || "");
  const [error, setError]         = useState("");
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
      setPreview(url);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="w-full h-32 rounded-xl border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-950 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden">
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover absolute inset-0" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Click to change</span>
            </div>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-blue-400 animate-spin" />
            <span className="text-xs text-slate-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">📷</span>
            <span className="text-xs text-slate-500 font-semibold">Click to upload image</span>
            <span className="text-xs text-slate-700">JPG, PNG, WebP (max 10MB)</span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {/* URL input as fallback */}
      <input
        type="text"
        value={value || ""}
        onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
        placeholder="Or paste image URL directly..."
        className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs outline-none focus:border-slate-600 transition-colors"
      />

      {error && (
        <p className="text-red-400 text-xs mt-1 font-semibold">⚠ {error}</p>
      )}
    </div>
  );
}

// ─── NEW ENTRY MODAL ──────────────────────────────────────────────────────────
function NewEntryModal({ category, catKey, onClose, onSuccess }) {
  const fields = CATEGORIES[catKey]?.fields || [];
  const [form,    setForm]    = useState(Object.fromEntries(fields.map(f => [f, ""])));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const colors = COLOR_MAP[CATEGORIES[catKey]?.color] || COLOR_MAP.indigo;

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch(catKey, "POST", form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className={`px-5 py-4 border-b border-slate-800 flex items-center justify-between ${colors.bg}`}>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">New Entry</p>
            <h3 className={`text-lg font-black italic ${colors.text}`}>
              {category} <span className="text-slate-100">Record</span>
            </h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex flex-col gap-4">
            {fields.map(field => {
              const meta = FIELD_META[field];
              if (!meta) return null;
              return (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {meta.label}
                  </label>

                  {/* Image Upload Field */}
                  {meta.type === "image" ? (
                    <ImageUploadField
                      value={form[field]}
                      onChange={setVal(field)}
                    />
                  ) : meta.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={form[field]}
                      onChange={set(field)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm outline-none focus:border-slate-600 resize-none transition-colors"
                    />
                  ) : (
                    <input
                      type={meta.type}
                      value={form[field]}
                      onChange={set(field)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm outline-none focus:border-slate-600 transition-colors"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 font-bold text-sm transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-[2] py-3 rounded-xl text-white font-black italic text-sm uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${colors.btn}`}>
              {loading
                ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
                : "⚡ Publish Entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-4xl text-center mb-3">🗑</div>
        <h3 className="text-slate-100 font-bold text-base text-center mb-2">Delete this record?</h3>
        <p className="text-slate-500 text-sm text-center mb-5">This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 font-bold text-sm transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeCategory, setActiveCategory] = useState("global");
  const [records,        setRecords]        = useState([]);
  const [counts,         setCounts]         = useState({});
  const [loading,        setLoading]        = useState(false);
  const [search,         setSearch]         = useState("");
  const [showModal,      setShowModal]      = useState(false);
  const [deleteId,       setDeleteId]       = useState(null);
  const [toast,          setToast]          = useState(null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRecords = useCallback(async (cat = activeCategory) => {
    setLoading(true);
    try {
      const data = await apiFetch(cat);
      const list = Array.isArray(data) ? data : (data?.content || []);
      setRecords(list);
      setCounts(prev => ({ ...prev, [cat]: list.length }));
    } catch (e) {
      showToast("Failed to load: " + e.message, "error");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleDelete = async (id) => {
    try {
      await apiFetch(`${activeCategory}/${id}`, "DELETE");
      showToast("Record deleted successfully");
      fetchRecords();
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    } finally {
      setDeleteId(null);
    }
  };

  const switchCategory = (cat) => {
    setActiveCategory(cat);
    setSidebarOpen(false);
    setSearch("");
  };

  const catConfig     = CATEGORIES[activeCategory];
  const colors        = COLOR_MAP[catConfig.color] || COLOR_MAP.indigo;
  const fields        = catConfig.fields;
  const displayFields = fields.slice(0, 3);

  const filtered = records.filter(r =>
    !search || fields.some(f =>
      String(r[f] || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(v => !v)}
            className="lg:hidden w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center cursor-pointer">
            ☰
          </button>
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-black italic text-white text-lg flex-shrink-0">
            F
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-black italic text-white uppercase">FlashReport</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Admin Engine</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reporter Applications Button */}
          <a href="/admin/applications"
            className="hidden sm:flex h-9 px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-bold text-xs uppercase tracking-wider items-center gap-1.5 cursor-pointer transition-colors">
            📋 Applications
          </a>
          <button onClick={() => fetchRecords()}
            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-sm">
            ↺
          </button>
          <button onClick={() => setShowModal(true)}
            className={`h-9 px-4 rounded-lg text-white font-black italic text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${colors.btn}`}>
            + New
          </button>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-56px)]">

        {/* ── SIDEBAR OVERLAY ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed top-14 left-0 bottom-0 w-56 bg-slate-900 border-r border-slate-800
          overflow-y-auto z-45 p-3 transition-transform duration-250
          lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:translate-x-0 lg:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">
            Categories
          </p>
          {Object.entries(CATEGORIES).map(([key, cfg]) => {
            const c = COLOR_MAP[cfg.color];
            const isActive = activeCategory === key;
            return (
              <button key={key} onClick={() => switchCategory(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl mb-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
                  ${isActive
                    ? `${c.bg} ${c.text} border ${c.border}`
                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`}>
                <span>{cfg.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}

          {/* Reporter Applications Link in Sidebar */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">
              Management
            </p>
            <a href="/admin/applications"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl mb-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20">
              <span>📋 Applications</span>
            </a>
            <a href="/ticker-control"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl mb-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20">
              <span>⚡ Ticker Control</span>
            </a>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">

          {/* Mobile category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden">
            {Object.entries(CATEGORIES).map(([key, cfg]) => {
              const c = COLOR_MAP[cfg.color];
              const isActive = activeCategory === key;
              return (
                <button key={key} onClick={() => switchCategory(key)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 cursor-pointer transition-all
                    ${isActive ? `${c.bg} ${c.border} ${c.text}` : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-1 h-6 rounded-full ${colors.dot}`} />
                <h2 className={`text-3xl sm:text-4xl font-black italic ${colors.text}`}>
                  {catConfig.label} <span className="text-slate-600">Arena</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-semibold pl-3">
                {records.length} record{records.length !== 1 ? "s" : ""} in database
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter results..."
                className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 text-slate-300 text-sm outline-none focus:border-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest w-16">ID</th>
                    {displayFields.map(f => (
                      <th key={f} className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest">
                        {FIELD_META[f]?.label || f}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-widest w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={displayFields.length + 2}>
                        <div className="flex flex-col items-center gap-3 py-16">
                          <div className="w-7 h-7 rounded-full border-2 border-slate-800 border-t-blue-400 animate-spin" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                            Loading from server…
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={displayFields.length + 2}>
                        <div className="py-16 text-center text-slate-700 text-sm font-bold uppercase tracking-widest">
                          {search ? `No results for "${search}"` : "No data yet — click + New to add"}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr key={r.id}
                        className={`border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? 'bg-slate-950/50' : ''}`}>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${colors.bg} ${colors.text}`}>
                            #{r.id}
                          </span>
                        </td>
                        {displayFields.map(f => (
                          <td key={f} className="px-4 py-3">
                            {f === "imageUrl" ? (
                              <div className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-600 text-xs">
                                {r[f]
                                  ? <img src={r[f]} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
                                  : "📷"
                                }
                              </div>
                            ) : (
                              <span className="block max-w-[180px] truncate text-xs text-slate-400" title={r[f] || ""}>
                                {r[f] || <span className="text-slate-700">—</span>}
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteId(r.id)}
                            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 flex items-center justify-center text-xs transition-all cursor-pointer ml-auto">
                            🗑
                          </button>
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

      {/* ── MODALS ── */}
      {showModal && (
        <NewEntryModal
          category={catConfig.label}
          catKey={activeCategory}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchRecords();
            showToast(`New ${catConfig.label} entry published!`);
          }}
        />
      )}

      {deleteId && (
        <DeleteConfirm
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-6 right-4 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl min-w-[200px]
          ${toast.type === "success"
            ? "bg-green-950 border border-green-800 text-green-300"
            : "bg-red-950 border border-red-800 text-red-300"}`}>
          {toast.type === "success" ? "✓ " : "⚠ "}{toast.msg}
        </div>
      )}
    </div>
  );
}