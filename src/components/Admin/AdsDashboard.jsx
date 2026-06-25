import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import apiClient from '../../services/api';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const AD_TYPES = [
  { value: 'school',   label: '🏫 School',          accent: '#3b82f6', bg: '#0a1628' },
  { value: 'college',  label: '🎓 College',          accent: '#8b5cf6', bg: '#0f0a28' },
  { value: 'shopping', label: '🛍️ Shopping Complex', accent: '#ef4444', bg: '#1f0a0a' },
  { value: 'business', label: '💼 Business',         accent: '#22c55e', bg: '#0a1f0a' },
  { value: 'other',    label: '📢 Other',            accent: '#f59e0b', bg: '#1f1500' },
];

const PLACEMENTS = [
  { value: 'all',     label: 'All Pages'  },
  { value: 'top',     label: 'Top Banner' },
  { value: 'middle',  label: 'Mid Page'   },
  { value: 'bottom',  label: 'Bottom'     },
  { value: 'sidebar', label: 'Sidebar'    },
];

const EMPTY_FORM = {
  title: '', subtitle: '', phone: '', url: '',
  type: 'school', badge: '', tag: '',
  accentColor: '#3b82f6', bgColor: '#0a1628',
  imageUrl: '', placement: 'all', priority: 5,
  active: true, startDate: '', endDate: '',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const typeBadge = (type) => AD_TYPES.find(t => t.value === type)?.label || '📢 Ad';

function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

// ─── SAFE UPLOAD — bypasses the 403 redirect interceptor ─────────────────────
async function uploadImage(file) {
  const token = localStorage.getItem('ap13_token');
  const fd = new FormData();
  fd.append('file', file);

  // Use fetch directly so axios interceptor can't redirect us on 403
  const res = await fetch('https://api.ap13news.in/api/media/upload', {
    method: 'POST',
    headers: {
      // DO NOT set Content-Type — browser sets it with boundary automatically
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: fd,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }
  return res.json();
}

// ─── AD PREVIEW ───────────────────────────────────────────────────────────────
function AdPreview({ form }) {
  const accent = form.accentColor || '#3b82f6';
  const bg     = form.bgColor     || '#0a1628';
  return (
    <div style={{ background: bg, border: `1.5px solid ${accent}40`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${accent},${accent}44)` }} />
      <div className="flex items-center gap-3 px-4 py-3 relative">
        <span className="absolute top-1.5 right-2.5 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ color: accent, background: `${accent}20` }}>
          {form.tag || 'Advertisement'}
        </span>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
          style={{ background: `${accent}18`, border: `2px solid ${accent}40` }}>
          {form.imageUrl
            ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
            : (form.type === 'school' ? '🏫' : form.type === 'college' ? '🎓' : form.type === 'shopping' ? '🛍️' : '📢')
          }
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full inline-block mb-1"
            style={{ color: accent, background: `${accent}20` }}>
            {form.badge || typeBadge(form.type)}
          </span>
          <p className="text-sm font-black text-white truncate leading-tight mb-0.5">{form.title || 'Business Name'}</p>
          <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{form.subtitle || 'Your tagline here'}</p>
          {form.phone && <p className="text-[9px] font-black mt-1" style={{ color: accent }}>📞 {form.phone}</p>}
        </div>
        <div className="flex-shrink-0 text-[9px] font-black uppercase tracking-wide px-2.5 py-2 rounded-lg text-black"
          style={{ background: accent }}>
          {form.type === 'school' ? 'Enquire →' : form.type === 'college' ? 'Apply →' : form.type === 'shopping' ? 'Visit →' : 'Learn More →'}
        </div>
      </div>
    </div>
  );
}

// ─── AD FORM ──────────────────────────────────────────────────────────────────
function AdForm({ initial, onSave, onCancel }) {
  const [form,       setForm]       = useState(initial || EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState('');
  const [imgPreview, setImgPreview] = useState(initial?.imageUrl || '');
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({
    ...f, [k]: v,
    ...(k === 'type' ? {
      accentColor: AD_TYPES.find(t => t.value === v)?.accent || f.accentColor,
      bgColor:     AD_TYPES.find(t => t.value === v)?.bg     || f.bgColor,
      badge:       AD_TYPES.find(t => t.value === v)?.label  || f.badge,
    } : {}),
  }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadErr('');
    setUploading(true);
    try {
      const data = await uploadImage(file);
      const url = data?.url || data?.imageUrl || '';
      if (url) {
        setImgPreview(url);
        set('imageUrl', url);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err) {
      setUploadErr(err.message || 'Upload failed');
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = ev => { setImgPreview(ev.target.result); set('imageUrl', ev.target.result); };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div className="mb-3">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</label>
      <input type={type} value={form[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-blue-400 text-slate-900 bg-white" />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
      <h3 className="text-lg font-black text-slate-900 uppercase italic mb-5">
        {initial?.id ? '✏️ Edit Ad' : '➕ New Ad'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left */}
        <div>
          <Field label="Business / School Name *" k="title" placeholder="Sri Vidya School" />
          <Field label="Tagline / Description"    k="subtitle" placeholder="Admissions Open 2025–26" />
          <Field label="Phone Number"             k="phone"    type="tel" placeholder="9876543210" />
          <Field label="Website URL"              k="url"      type="url" placeholder="https://yourschool.com" />

          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ad Type *</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {AD_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => set('type', t.value)}
                className="py-2 px-2.5 rounded-lg text-[11px] font-black border-2 transition-all"
                style={{
                  borderColor: form.type === t.value ? t.accent : '#e2e8f0',
                  background:  form.type === t.value ? `${t.accent}18` : '#fafafa',
                  color:       form.type === t.value ? t.accent : '#64748b',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <Field label="Ad Tag"    k="tag"   placeholder="Admissions Open / Grand Opening" />
          <Field label="Badge Text" k="badge" placeholder="🏫 School" />

          <div className="mb-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Placement</label>
            <select value={form.placement} onChange={e => set('placement', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] outline-none bg-white text-slate-900">
              {PLACEMENTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Priority (1=highest)</label>
            <input type="number" min={1} max={10} value={form.priority || 5} onChange={e => set('priority', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] outline-none bg-white text-slate-900" />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[['Accent Color', 'accentColor'], ['Background', 'bgColor']].map(([label, key]) => (
              <div key={key}>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form[key] || '#000000'} onChange={e => set(key, e.target.value)}
                    className="w-9 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 flex-shrink-0" />
                  <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-md border border-slate-200 text-[11px] outline-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" k="startDate" type="datetime-local" />
            <Field label="End Date"   k="endDate"   type="datetime-local" />
          </div>
        </div>
      </div>

      {/* Image upload */}
      <div className="mb-5 mt-2">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ad Image / Logo</label>
        <div className="flex gap-4 items-start">
          <button type="button" onClick={() => fileRef.current.click()}
            className="w-28 h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors flex-shrink-0 overflow-hidden">
            {imgPreview
              ? <img src={imgPreview} alt="" className="w-full h-full object-cover rounded-xl" onError={() => setImgPreview('')} />
              : <>
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-[9px] font-bold text-slate-400 text-center px-1">
                    {uploading ? 'Uploading...' : 'Click to upload'}
                  </span>
                </>
            }
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </button>
          <div className="flex-1">
            <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
              Recommended: 200×200px square logo or 600×200px banner.<br/>
              Uploads to S3 — or paste a URL below.
            </p>
            {uploadErr && (
              <p className="text-[10px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mb-2">
                ⚠️ S3 upload failed ({uploadErr}) — using base64 fallback
              </p>
            )}
            <input type="text" value={form.imageUrl || ''}
              onChange={e => { set('imageUrl', e.target.value); setImgPreview(e.target.value); }}
              placeholder="Or paste image URL directly"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] outline-none" />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Preview</p>
        <AdPreview form={form} />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button type="button" onClick={handleSubmit} disabled={saving || uploading}
          className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[13px] uppercase tracking-wide transition-colors disabled:opacity-60 disabled:cursor-wait">
          {saving ? '⏳ Saving...' : uploading ? '⏳ Uploading...' : initial?.id ? '✅ Update Ad' : '➕ Create Ad'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-bold text-[13px] hover:bg-slate-100 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── AD CARD ──────────────────────────────────────────────────────────────────
function AdCard({ ad, onEdit, onToggle, onDelete }) {
  const accent = ad.accentColor || '#6b7280';
  const ctr    = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
  return (
    <div className="bg-white rounded-2xl overflow-hidden border transition-shadow hover:shadow-md"
      style={{ borderColor: ad.active ? `${accent}30` : '#f1f5f9', opacity: ad.active ? 1 : 0.65 }}>
      <div className="h-1" style={{ background: ad.active ? `linear-gradient(90deg,${accent},${accent}44)` : '#f1f5f9' }} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 overflow-hidden"
              style={{ background: `${accent}15`, border: `1.5px solid ${accent}30` }}>
              {ad.imageUrl
                ? <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                : (ad.type === 'school' ? '🏫' : ad.type === 'college' ? '🎓' : ad.type === 'shopping' ? '🛍️' : '📢')
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded"
                  style={{ color: accent, background: `${accent}18` }}>
                  {typeBadge(ad.type)}
                </span>
                {!ad.active && <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">PAUSED</span>}
              </div>
              <p className="text-sm font-black text-slate-900 truncate">{ad.title}</p>
              <p className="text-[11px] text-slate-500 truncate">{ad.subtitle}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => onToggle(ad)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-colors
                ${ad.active ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100' : 'border-green-400 bg-green-50 text-green-600 hover:bg-green-100'}`}>
              {ad.active ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button onClick={() => onEdit(ad)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-black border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(ad)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-black border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
              🗑
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 pt-3 border-t border-slate-100 flex-wrap">
          {[
            { label: 'Placement',    value: PLACEMENTS.find(p => p.value === ad.placement)?.label || ad.placement },
            { label: 'Priority',     value: `#${ad.priority}` },
            { label: 'Impressions',  value: fmtNum(ad.impressions) },
            { label: 'Clicks',       value: fmtNum(ad.clicks) },
            { label: 'CTR',          value: `${ctr}%` },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{s.label}</p>
              <p className="text-[13px] font-black text-slate-900">{s.value}</p>
            </div>
          ))}
          {ad.phone && (
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
              <p className="text-[13px] font-black" style={{ color: accent }}>📞 {ad.phone}</p>
            </div>
          )}
          {ad.url && (
            <div className="ml-auto self-end">
              <a href={ad.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-500 no-underline hover:underline">🔗 View Site</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdsDashboard() {
  const { isAdmin } = useAuth();

  const [ads,        setAds]        = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editAd,     setEditAd]     = useState(null);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [toast,      setToast]      = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [adsRes, statsRes] = await Promise.all([
        apiClient.get('/ads'),
        apiClient.get('/ads/stats'),
      ]);
      setAds(adsRes.data   || []);
      setStats(statsRes.data || null);
    } catch { showToast('Failed to load ads', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleSave = async (form) => {
    try {
      if (editAd?.id) {
        await apiClient.put(`/ads/${editAd.id}`, form);
        showToast('Ad updated ✅');
      } else {
        await apiClient.post('/ads', form);
        showToast('Ad created ✅');
      }
      setShowForm(false);
      setEditAd(null);
      loadAll();
    } catch { showToast('Failed to save ❌', 'error'); }
  };

  const handleToggle = async (ad) => {
    try {
      await apiClient.patch(`/ads/${ad.id}/toggle`);
      showToast(ad.active ? 'Ad paused' : 'Ad resumed ✅');
      loadAll();
    } catch { showToast('Failed to toggle ❌', 'error'); }
  };

  const handleDelete = async (ad) => {
    try {
      await apiClient.delete(`/ads/${ad.id}`);
      showToast('Ad deleted');
      setDelConfirm(null);
      loadAll();
    } catch { showToast('Failed to delete ❌', 'error'); }
  };

  const filtered = ads
    .filter(a => filter === 'all' || a.type === filter)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
      <span className="text-5xl">🔒</span>
      <h2 className="text-xl font-black text-slate-700">Admin Only</h2>
      <Link to="/" className="text-blue-600 font-bold no-underline hover:underline">← Go Home</Link>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .shimmer { background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
        .animate-fadeUp { animation:fadeUp 0.35s ease both; }
        .line-clamp-2   { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        * { box-sizing:border-box; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-5 py-2.5 rounded-full font-black text-[13px] text-white shadow-xl whitespace-nowrap ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ animation: 'toastIn 0.2s ease' }}>
          {toast.msg}
        </div>
      )}

      {/* Delete confirm */}
      {delConfirm && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl">
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="text-lg font-black text-slate-900 mb-1">Delete Ad?</h3>
            <p className="text-[13px] text-slate-500 mb-5">"{delConfirm.title}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(delConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-[13px] transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setDelConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 bg-slate-50 text-slate-600 font-bold rounded-xl text-[13px] hover:bg-slate-100 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-100 pb-16 font-sans">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-3 flex-wrap sticky top-0 z-50 shadow-sm">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">AP13 News</p>
            <h1 className="text-xl font-black text-slate-900 uppercase italic">📢 Ads Dashboard</h1>
          </div>
          <div className="flex gap-2.5">
            <Link to="/admin"
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-bold text-[12px] no-underline hover:bg-slate-100 transition-colors">
              ← Admin
            </Link>
            <button onClick={() => { setEditAd(null); setShowForm(true); }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[13px] uppercase tracking-wide transition-colors">
              ➕ New Ad
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-6">

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 animate-fadeUp">
              {[
                { label: 'Total Ads',    value: stats.totalAds,              icon: '📢', color: '#3b82f6' },
                { label: 'Active',       value: stats.activeAds,             icon: '✅', color: '#22c55e' },
                { label: 'Paused',       value: stats.inactiveAds,           icon: '⏸', color: '#f59e0b' },
                { label: 'Impressions',  value: fmtNum(stats.totalImpressions), icon: '👁', color: '#8b5cf6' },
                { label: 'Clicks',       value: fmtNum(stats.totalClicks),   icon: '👆', color: '#ef4444' },
                { label: 'CTR',          value: stats.ctr,                   icon: '📊', color: '#0d9488' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-3.5 border shadow-sm"
                  style={{ borderColor: `${s.color}20` }}>
                  <p className="text-xl mb-1">{s.icon}</p>
                  <p className="text-xl font-black mb-0.5 leading-none" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="mb-6 animate-fadeUp">
              <AdForm
                initial={editAd}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditAd(null); }}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            {[{ value: 'all', label: 'All' }, ...AD_TYPES].map(t => (
              <button key={t.value} onClick={() => setFilter(t.value)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black border transition-colors whitespace-nowrap
                  ${filter === t.value ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-red-400'}`}>
                {t.label || 'All'}
              </button>
            ))}
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search ads..."
              className="ml-auto px-4 py-1.5 rounded-full border border-slate-200 text-[12px] outline-none min-w-[160px]" />
            <span className="text-[11px] text-slate-400 font-bold">{filtered.length} ads</span>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl shimmer" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-5xl mb-3">📢</p>
              <p className="text-lg font-black text-slate-700 uppercase italic mb-1">No Ads Found</p>
              <p className="text-[13px] text-slate-400 mb-5">Create your first ad to get started.</p>
              <button onClick={() => { setEditAd(null); setShowForm(true); }}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-[13px] uppercase tracking-wide transition-colors">
                ➕ Create First Ad
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-fadeUp">
              {filtered.map(ad => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onEdit={ad => { setEditAd(ad); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  onToggle={handleToggle}
                  onDelete={ad => setDelConfirm(ad)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}