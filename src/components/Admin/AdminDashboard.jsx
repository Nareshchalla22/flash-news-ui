import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:8080/api"
  : "https://ap13news.in/api";

const CATEGORIES = {
  global:        { label: "Global",        color: "indigo",  fields: ["title", "description", "imageUrl", "date", "reporterName"] },
  national:      { label: "National",      color: "emerald", fields: ["title", "description", "imageUrl", "date", "reporterName"] },
  state:         { label: "State",         color: "amber",   fields: ["title", "description", "imageUrl", "date", "reporterName"] },
  business:      { label: "Business",      color: "cyan",    fields: ["companyName", "headline", "analysis", "stockUpdate", "reporterName"] },
  crime:         { label: "Crime",         color: "red",     fields: ["title", "description", "imageUrl", "date", "reporterName"] },
  entertainment: { label: "Entertainment", color: "purple",  fields: ["movieTitle", "celebrityName", "gossipContent", "reporterName"] },
  sports:        { label: "Sports",        color: "orange",  fields: ["matchTitle", "scoreUpdate", "summary", "imageUrl", "reporterName"] },
  health:        { label: "Health",        color: "teal",    fields: ["title", "topic", "medicalAdvice", "doctorConsultant", "imageUrl", "reporterName"] },
  politics:      { label: "Politics",      color: "blue",    fields: ["title", "description", "imageUrl", "reporterName", "date"] },
  travel:        { label: "Travel",        color: "lime",    fields: ["title", "description", "imageUrl", "date", "reporterName"] },
  technology:    { label: "Technology",    color: "violet",  fields: ["gadgetHead", "techReview", "version", "imageUrl", "reporterName"] },
};

const FIELD_META = {
  title:            { label: "Title",           type: "text"     },
  description:      { label: "Description",     type: "textarea" },
  imageUrl:         { label: "Image",           type: "image"    },
  date:             { label: "Date",            type: "date"     },
  companyName:      { label: "Company Name",    type: "text"     },
  headline:         { label: "Headline",        type: "text"     },
  analysis:         { label: "Market Analysis", type: "textarea" },
  stockUpdate:      { label: "Stock Update",    type: "text"     },
  movieTitle:       { label: "Movie Title",     type: "text"     },
  celebrityName:    { label: "Celebrity",       type: "text"     },
  gossipContent:    { label: "Content",         type: "textarea" },
  matchTitle:       { label: "Match Title",     type: "text"     },
  scoreUpdate:      { label: "Score Update",    type: "text"     },
  summary:          { label: "Summary",         type: "textarea" },
  topic:            { label: "Topic",           type: "text"     },
  medicalAdvice:    { label: "Medical Advice",  type: "textarea" },
  doctorConsultant: { label: "Expert / Doctor", type: "text"     },
  reporterName:     { label: "Reporter Name",   type: "text"     },
  gadgetHead:       { label: "Gadget Name",     type: "text"     },
  techReview:       { label: "Tech Review",     type: "textarea" },
  version:          { label: "Model / Version", type: "text"     },
};

const COLOR_MAP = {
  indigo:  { bg:"bg-indigo-500/10",  border:"border-indigo-500/30",  text:"text-indigo-400",  dot:"bg-indigo-500",  btn:"bg-indigo-600 hover:bg-indigo-700"  },
  emerald: { bg:"bg-emerald-500/10", border:"border-emerald-500/30", text:"text-emerald-400", dot:"bg-emerald-500", btn:"bg-emerald-600 hover:bg-emerald-700" },
  amber:   { bg:"bg-amber-500/10",   border:"border-amber-500/30",   text:"text-amber-400",   dot:"bg-amber-500",   btn:"bg-amber-600 hover:bg-amber-700"   },
  cyan:    { bg:"bg-cyan-500/10",    border:"border-cyan-500/30",    text:"text-cyan-400",    dot:"bg-cyan-500",    btn:"bg-cyan-600 hover:bg-cyan-700"    },
  red:     { bg:"bg-red-500/10",     border:"border-red-500/30",     text:"text-red-400",     dot:"bg-red-500",     btn:"bg-red-600 hover:bg-red-700"     },
  purple:  { bg:"bg-purple-500/10",  border:"border-purple-500/30",  text:"text-purple-400",  dot:"bg-purple-500",  btn:"bg-purple-600 hover:bg-purple-700"  },
  orange:  { bg:"bg-orange-500/10",  border:"border-orange-500/30",  text:"text-orange-400",  dot:"bg-orange-500",  btn:"bg-orange-600 hover:bg-orange-700"  },
  teal:    { bg:"bg-teal-500/10",    border:"border-teal-500/30",    text:"text-teal-400",    dot:"bg-teal-500",    btn:"bg-teal-600 hover:bg-teal-700"    },
  blue:    { bg:"bg-blue-500/10",    border:"border-blue-500/30",    text:"text-blue-400",    dot:"bg-blue-500",    btn:"bg-blue-600 hover:bg-blue-700"    },
  lime:    { bg:"bg-lime-500/10",    border:"border-lime-500/30",    text:"text-lime-400",    dot:"bg-lime-500",    btn:"bg-lime-600 hover:bg-lime-700"    },
  violet:  { bg:"bg-violet-500/10",  border:"border-violet-500/30",  text:"text-violet-400",  dot:"bg-violet-500",  btn:"bg-violet-600 hover:bg-violet-700"  },
};

const ROLE_COLORS = {
  ADMIN:    "bg-red-500/20 text-red-300 border-red-500/40",
  REPORTER: "bg-green-500/20 text-green-300 border-green-500/40",
  EDITOR:   "bg-blue-500/20 text-blue-300 border-blue-500/40",
  VIEWER:   "bg-slate-500/20 text-slate-300 border-slate-500/40",
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

async function uploadToS3(file) {
  const token = localStorage.getItem("ap13_token");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "news");
  const res = await fetch(`${BASE_URL}/media/upload`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  return data.url || data.imageUrl || data.s3Url || "";
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── IMAGE UPLOAD FIELD ───────────────────────────────────────────────────────
function ImageUploadField({ value, onChange }) {
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [error,      setError]      = useState("");
  const [dragOver,   setDragOver]   = useState(false);
  const [uploadMode, setUploadMode] = useState("upload");
  const fileRef = useRef(null);

  const processFile = async (file) => {
    if (!file.type.startsWith("image/")) { setError("Only image files allowed"); return; }
    if (file.size > 10 * 1024 * 1024)   { setError("File too large. Max 10MB."); return; }
    setError(""); setUploading(true); setProgress(10);
    try { const p = await toBase64(file); onChange(p); } catch (_) {}
    const tick = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 250);
    try {
      const s3Url = await uploadToS3(file);
      clearInterval(tick); setProgress(100);
      onChange(s3Url);
      setTimeout(() => setProgress(0), 800);
    } catch (e) {
      clearInterval(tick); setProgress(0);
      setError("⚠ S3 not configured — using preview only.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleFileInput = (e) => { const f = e.target.files?.[0]; if (f) processFile(f); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };
  const handleRemove = () => { onChange(""); setError(""); setProgress(0); };

  const isS3Url  = value && value.startsWith("http");
  const isBase64 = value && value.startsWith("data:");
  const hasImage = isS3Url || isBase64;

  return (
    <div>
      <div className="flex gap-1 mb-2 p-0.5 bg-slate-950 rounded-lg w-fit">
        {["upload","url"].map(m => (
          <button key={m} type="button" onClick={() => setUploadMode(m)}
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
              ${uploadMode === m ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            {m === "upload" ? "📁 Upload File" : "🔗 Paste URL"}
          </button>
        ))}
      </div>

      {uploadMode === "url" ? (
        <div className="space-y-2">
          <input type="text" value={value || ""} onChange={e => { onChange(e.target.value); setError(""); }}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm outline-none focus:border-slate-600 transition-colors"/>
          {hasImage && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-700">
              <img src={value} alt="Preview" className="w-full h-full object-cover"
                onError={e => { e.target.style.display = "none"; setError("Invalid image URL"); }}/>
              <button type="button" onClick={handleRemove}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center cursor-pointer hover:bg-red-700">✕</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden"/>
          {hasImage ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
              <img src={value} alt="Uploaded" className="w-full h-44 object-cover" onError={e => { e.target.src = ""; }}/>
              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="px-3 py-1.5 bg-white/90 text-slate-900 rounded-lg text-xs font-bold cursor-pointer hover:bg-white">🔄 Change</button>
                <button type="button" onClick={handleRemove}
                  className="px-3 py-1.5 bg-red-600/90 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-red-600">🗑 Remove</button>
              </div>
              {isS3Url  && <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-600/90 rounded text-[9px] font-bold text-white uppercase tracking-wider">✓ S3 Uploaded</div>}
              {isBase64 && <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-yellow-600/90 rounded text-[9px] font-bold text-white uppercase tracking-wider">⚠ Local Preview</div>}
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileRef.current?.click()}
              className={`relative w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all
                ${dragOver ? "border-blue-400 bg-blue-500/10" : "border-slate-700 hover:border-slate-500 bg-slate-950 hover:bg-slate-900/50"}
                ${uploading ? "cursor-wait" : "cursor-pointer"}`}>
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-slate-700 border-t-blue-400 animate-spin" style={{ border:'3px solid', borderTopColor:'#60a5fa' }}/>
                  <p className="text-xs font-bold text-slate-400">Uploading to S3...</p>
                  <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width:`${progress}%` }}/>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">{dragOver ? "📥" : "🖼️"}</div>
                  <div className="text-center px-4">
                    <p className="text-sm font-bold text-slate-300 mb-1">{dragOver ? "Drop image here" : "Click to upload or drag & drop"}</p>
                    <p className="text-xs text-slate-600">JPG, PNG, WebP, GIF — max 10MB</p>
                  </div>
                </>
              )}
            </div>
          )}
          {hasImage && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="mt-2 w-full py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-slate-300 text-xs font-bold cursor-pointer transition-colors bg-slate-900 hover:bg-slate-800">
              📁 Upload Different Image
            </button>
          )}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-yellow-400 font-semibold flex items-start gap-1.5"><span>⚠</span><span>{error}</span></p>}
    </div>
  );
}

// ─── FORM FIELDS ──────────────────────────────────────────────────────────────
function FormFields({ fields, form, onChange, autoReporterName }) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map(field => {
        const meta = FIELD_META[field];
        if (!meta) return null;
        const isReporter = field === "reporterName";
        const isImage    = meta.type === "image";
        return (
          <div key={field}>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {meta.label}
              {isReporter && <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded normal-case tracking-normal">Auto-filled</span>}
              {isImage    && <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded normal-case tracking-normal">Upload</span>}
            </label>
            {isImage ? (
              <ImageUploadField value={form[field] || ""} onChange={url => onChange(field, url)} />
            ) : meta.type === "textarea" ? (
              <textarea rows={3} value={form[field] || ""} onChange={e => onChange(field, e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm outline-none focus:border-slate-600 resize-none transition-colors"/>
            ) : (
              <input type={meta.type} value={form[field] || ""} onChange={e => onChange(field, e.target.value)}
                placeholder={isReporter ? autoReporterName || "" : ""}
                className={`w-full px-3 py-2.5 rounded-lg bg-slate-950 border text-slate-200 text-sm outline-none focus:border-slate-600 transition-colors
                  ${isReporter ? "border-green-500/30 focus:border-green-500/60" : "border-slate-800"}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CREATE MODAL ─────────────────────────────────────────────────────────────
function CreateModal({ category, catKey, onClose, onSuccess, reporterName }) {
  const fields = CATEGORIES[catKey]?.fields || [];
  const [form,    setForm]    = useState(Object.fromEntries(fields.map(f => [f, f === "reporterName" ? reporterName || "" : ""])));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const colors = COLOR_MAP[CATEGORIES[catKey]?.color] || COLOR_MAP.indigo;

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try { await apiFetch(catKey, "POST", form); onSuccess("Entry published!"); onClose(); }
    catch (e) { setError(e.message || "Failed to create."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className={`px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 ${colors.bg}`}>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">New Entry</p>
            <h3 className={`text-lg font-black italic ${colors.text}`}>{category} <span className="text-slate-100">Record</span></h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">✕</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <FormFields fields={fields} form={form} onChange={(f,v) => setForm(p=>({...p,[f]:v}))} autoReporterName={reporterName}/>
          {error && <div className="mt-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">⚠ {error}</div>}
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 font-bold text-sm cursor-pointer">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className={`flex-[2] py-3 rounded-xl text-white font-black italic text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${colors.btn}`}>
              {loading ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Saving…</> : "⚡ Publish Entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
function EditModal({ record, category, catKey, onClose, onSuccess, reporterName }) {
  const fields = CATEGORIES[catKey]?.fields || [];
  const [form,    setForm]    = useState(Object.fromEntries(fields.map(f => [f, record[f] || ""])));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const colors = COLOR_MAP[CATEGORIES[catKey]?.color] || COLOR_MAP.indigo;

  const handleUpdate = async () => {
    setLoading(true); setError("");
    try { await apiFetch(`${catKey}/${record.id}`, "PUT", form); onSuccess("Updated!"); onClose(); }
    catch (e) { setError(e.message || "Failed to update."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className={`px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 ${colors.bg}`}>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Edit Record <span className="text-slate-700">#{record.id}</span></p>
            <h3 className={`text-lg font-black italic ${colors.text}`}>Update <span className="text-slate-100">{category}</span></h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">✕</button>
        </div>
        <div className="px-5 py-2 bg-slate-950 border-b border-slate-800 flex-shrink-0">
          <p className="text-xs text-slate-600 font-semibold">
            Editing: <span className="text-slate-400 font-bold">{record.title||record.matchTitle||record.movieTitle||record.companyName||record.gadgetHead||`Record #${record.id}`}</span>
          </p>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <FormFields fields={fields} form={form} onChange={(f,v)=>setForm(p=>({...p,[f]:v}))} autoReporterName={reporterName}/>
          {error && <div className="mt-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">⚠ {error}</div>}
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 font-bold text-sm cursor-pointer">Cancel</button>
            <button onClick={handleUpdate} disabled={loading}
              className="flex-[2] py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black italic text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Updating…</> : "✏️ Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, recordName }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑</div>
        <h3 className="text-slate-100 font-bold text-base mb-1">Delete this record?</h3>
        {recordName && <p className="text-slate-500 text-xs mb-2 font-semibold line-clamp-1">"{recordName}"</p>}
        <p className="text-slate-600 text-xs mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 font-bold text-sm cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm cursor-pointer">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── USERS TAB ────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const d = await apiFetch("auth/users"); setUsers(Array.isArray(d) ? d : []); }
    catch (e) { showToast("Failed: " + e.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id, enabled) => {
    try { await apiFetch(`auth/users/${id}/toggle`, "PATCH"); showToast(enabled ? "User disabled" : "User enabled"); load(); }
    catch (e) { showToast("Toggle failed: " + e.message, "error"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black italic text-violet-400">Users <span className="text-slate-600">Manager</span></h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">{users.length} total accounts</p>
        </div>
        <button onClick={load} className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-sm">↺</button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                {["ID","Username","Full Name","Role","Plan","Status","Action"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="flex items-center justify-center gap-3 py-12 text-slate-600">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-800 border-t-violet-400 animate-spin"/>Loading…
                </div></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-700 font-bold">No users found</td></tr>
              ) : users.map((u,i) => {
                const roleColor = ROLE_COLORS[u.role] || ROLE_COLORS.VIEWER;
                return (
                  <tr key={u.id} className={`border-b border-slate-800/50 hover:bg-white/[0.02] ${i%2===0?"bg-slate-950/50":""}`}>
                    <td className="px-4 py-3"><span className="text-xs font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded-lg">#{u.id}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-bold text-slate-300">{u.username}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-500">{u.fullName||"—"}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-lg border uppercase tracking-wider ${roleColor}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-500">{u.planName||"—"}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.enabled?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>{u.enabled?"● Active":"○ Disabled"}</span></td>
                    <td className="px-4 py-3">
                      {u.role !== "ADMIN" && (
                        <button onClick={() => handleToggle(u.id, u.enabled)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all
                            ${u.enabled?"bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20":"bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"}`}>
                          {u.enabled?"Disable":"Enable"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {toast && (
        <div className={`fixed bottom-6 right-4 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl min-w-[200px]
          ${toast.type==="success"?"bg-green-950 border border-green-800 text-green-300":"bg-red-950 border border-red-800 text-red-300"}`}>
          {toast.type==="success"?"✓ ":"⚠ "}{toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  const [activeCategory, setActiveCategory] = useState("global");
  const [activeTab,      setActiveTab]      = useState("news");
  const [records,        setRecords]        = useState([]);
  const [counts,         setCounts]         = useState({});
  const [loading,        setLoading]        = useState(false);
  const [search,         setSearch]         = useState("");
  const [showCreate,     setShowCreate]     = useState(false);
  const [editRecord,     setEditRecord]     = useState(null);
  const [deleteId,       setDeleteId]       = useState(null);
  const [deleteName,     setDeleteName]     = useState("");
  const [toast,          setToast]          = useState(null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const reporterName = user?.fullName || user?.username || "";

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchRecords = useCallback(async (cat = activeCategory) => {
    setLoading(true);
    try {
      const data = await apiFetch(cat);
      const list = Array.isArray(data) ? data : (data?.content || []);
      setRecords(list);
      setCounts(prev => ({ ...prev, [cat]: list.length }));
    } catch (e) { showToast("Failed: " + e.message, "error"); setRecords([]); }
    finally { setLoading(false); }
  }, [activeCategory]);

  useEffect(() => { if (activeTab === "news") fetchRecords(); }, [fetchRecords, activeTab]);

  const handleDelete = async (id) => {
    try { await apiFetch(`${activeCategory}/${id}`, "DELETE"); showToast("Deleted"); fetchRecords(); }
    catch (e) { showToast("Delete failed: " + e.message, "error"); }
    finally { setDeleteId(null); setDeleteName(""); }
  };

  const switchCategory = (cat) => { setActiveCategory(cat); setSidebarOpen(false); setSearch(""); };
  const getRecordName  = (r) => r.title||r.matchTitle||r.movieTitle||r.companyName||r.gadgetHead||`#${r.id}`;

  const catConfig     = CATEGORIES[activeCategory];
  const colors        = COLOR_MAP[catConfig.color] || COLOR_MAP.indigo;
  const displayFields = catConfig.fields.filter(f => f !== "reporterName").slice(0,3);
  const filtered      = records.filter(r => !search || catConfig.fields.some(f => String(r[f]||"").toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(v => !v)}
            className="lg:hidden w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center cursor-pointer">☰</button>
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-black italic text-white text-lg flex-shrink-0">F</div>
          <div className="hidden sm:block">
            <div className="text-sm font-black italic text-white uppercase">AP13 News</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Admin Engine</div>
          </div>
        </div>

        {!isAdmin && reporterName && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-xs font-bold text-green-400">Reporter: {reporterName}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Link to="/admin/applications"
                className="hidden sm:flex h-9 px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-bold text-xs uppercase tracking-wider items-center gap-1.5 transition-colors">
                📋 Applications
              </Link>
              <Link to="/ads-dashboard"
                className="hidden sm:flex h-9 px-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 font-bold text-xs uppercase tracking-wider items-center gap-1.5 transition-colors">
                📢 Ads
              </Link>
            </>
          )}
          <button onClick={() => fetchRecords()}
            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-sm" title="Refresh">
            ↺
          </button>
          {activeTab === "news" && (
            <button onClick={() => setShowCreate(true)}
              className={`h-9 px-4 rounded-lg text-white font-black italic text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${colors.btn}`}>
              + New
            </button>
          )}
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-56px)]">

        {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed top-14 left-0 bottom-0 w-56 bg-slate-900 border-r border-slate-800
          overflow-y-auto z-45 p-3 transition-transform duration-250
          lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:translate-x-0 lg:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          {/* Tab switcher */}
          <div className="flex gap-1 mb-4 p-1 bg-slate-950 rounded-xl">
            <button onClick={() => setActiveTab("news")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all
                ${activeTab==="news"?"bg-slate-700 text-white":"text-slate-500 hover:text-slate-300"}`}>
              📰 News
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab("users")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all
                  ${activeTab==="users"?"bg-slate-700 text-white":"text-slate-500 hover:text-slate-300"}`}>
                👥 Users
              </button>
            )}
          </div>

          {activeTab === "news" && (
            <>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">Categories</p>
              {Object.entries(CATEGORIES).map(([key, cfg]) => {
                const c = COLOR_MAP[cfg.color];
                const isActive = activeCategory === key;
                return (
                  <button key={key} onClick={() => switchCategory(key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl mb-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
                      ${isActive ? `${c.bg} ${c.text} border ${c.border}` : "text-slate-500 hover:bg-slate-800 hover:text-slate-200 border border-transparent"}`}>
                    <span>{cfg.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive?"bg-white/20 text-white":"bg-slate-800 text-slate-500"}`}>
                      {counts[key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {/* ── QUICK LINKS ── */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-2 mb-3">Quick Links</p>
            {isAdmin && (
              <>
                <Link to="/admin/applications"
                  className="w-full flex items-center px-3 py-2 rounded-xl mb-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                  📋 Applications
                </Link>
                <Link to="/ads-dashboard"
                  className="w-full flex items-center px-3 py-2 rounded-xl mb-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                  📢 Manage Ads
                </Link>
                <Link to="/ticker-control"
                  className="w-full flex items-center px-3 py-2 rounded-xl mb-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                  ⚡ Ticker Control
                </Link>
                <Link to="/id-card"
                  className="w-full flex items-center px-3 py-2 rounded-xl mb-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                  🪪 Press ID
                </Link>
              </>
            )}
            <Link to="/"
              className="w-full flex items-center px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
              ← Back to Site
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">

          {activeTab === "users" && isAdmin ? (
            <UsersTab />
          ) : (
            <>
              {/* Mobile category pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden">
                {Object.entries(CATEGORIES).map(([key, cfg]) => {
                  const c = COLOR_MAP[cfg.color];
                  const isActive = activeCategory === key;
                  return (
                    <button key={key} onClick={() => switchCategory(key)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 cursor-pointer transition-all
                        ${isActive ? `${c.bg} ${c.border} ${c.text}` : "bg-slate-900 border-slate-800 text-slate-500"}`}>
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-1 h-6 rounded-full ${colors.dot}`}/>
                    <h2 className={`text-3xl sm:text-4xl font-black italic ${colors.text}`}>
                      {catConfig.label} <span className="text-slate-600">Arena</span>
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold pl-3">
                    {records.length} records · {filtered.length} shown
                    {reporterName && <span className="ml-2 text-green-500">· Publishing as <strong>{reporterName}</strong></span>}
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter results..."
                    className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 text-slate-300 text-sm outline-none focus:border-slate-600 transition-colors"/>
                </div>
              </div>

              {/* Records table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[520px]">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800">
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest w-14">ID</th>
                        {displayFields.map(f => (
                          <th key={f} className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest">{FIELD_META[f]?.label||f}</th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest">Reporter</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-widest w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={displayFields.length+3}>
                          <div className="flex flex-col items-center gap-3 py-14">
                            <div className="w-7 h-7 rounded-full border-2 border-slate-800 border-t-blue-400 animate-spin"/>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Loading…</span>
                          </div>
                        </td></tr>
                      ) : filtered.length === 0 ? (
                        <tr><td colSpan={displayFields.length+3}>
                          <div className="py-14 text-center">
                            <p className="text-slate-700 text-sm font-bold uppercase tracking-widest">
                              {search ? `No results for "${search}"` : "No data — click + New to add"}
                            </p>
                          </div>
                        </td></tr>
                      ) : filtered.map((r,i) => (
                        <tr key={r.id} className={`border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors ${i%2===0?"bg-slate-950/50":""}`}>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${colors.bg} ${colors.text}`}>#{r.id}</span>
                          </td>
                          {displayFields.map(f => (
                            <td key={f} className="px-4 py-3">
                              {f === "imageUrl" ? (
                                <div className="w-12 h-9 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-600 text-xs">
                                  {r[f] ? <img src={r[f]} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display="none"}/> : "📷"}
                                </div>
                              ) : (
                                <span className="block max-w-[160px] truncate text-xs text-slate-400" title={r[f]||""}>
                                  {r[f] || <span className="text-slate-700">—</span>}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            {r.reporterName
                              ? <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">{r.reporterName}</span>
                              : <span className="text-slate-700 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => setEditRecord(r)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-bold cursor-pointer transition-all">
                                ✏️ Edit
                              </button>
                              {isAdmin && (
                                <button onClick={() => { setDeleteId(r.id); setDeleteName(getRecordName(r)); }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold cursor-pointer transition-all">
                                  🗑
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!loading && filtered.length > 0 && (
                  <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-600 font-semibold">Showing {filtered.length} of {records.length} records</p>
                    {search && <button onClick={() => setSearch("")} className="text-xs text-slate-500 hover:text-slate-300 font-bold cursor-pointer">Clear filter ✕</button>}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateModal category={catConfig.label} catKey={activeCategory}
          onClose={() => setShowCreate(false)}
          onSuccess={(msg) => { fetchRecords(); showToast(msg); }}
          reporterName={reporterName}/>
      )}
      {editRecord && (
        <EditModal record={editRecord} category={catConfig.label} catKey={activeCategory}
          onClose={() => setEditRecord(null)}
          onSuccess={(msg) => { fetchRecords(); showToast(msg); }}
          reporterName={reporterName}/>
      )}
      {deleteId && (
        <DeleteConfirm recordName={deleteName}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => { setDeleteId(null); setDeleteName(""); }}/>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-4 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl min-w-[220px] flex items-center gap-2
          ${toast.type==="success"?"bg-green-950 border border-green-800 text-green-300":"bg-red-950 border border-red-800 text-red-300"}`}>
          {toast.type==="success"?"✓ ":"⚠ "}{toast.msg}
        </div>
      )}
    </div>
  );
}