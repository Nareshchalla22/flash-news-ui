import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import apiClient from '../../services/api';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const AD_TYPES = [
  { value:'school',   label:'🏫 School',           accent:'#3b82f6', bg:'#0a1628' },
  { value:'college',  label:'🎓 College',           accent:'#8b5cf6', bg:'#0f0a28' },
  { value:'shopping', label:'🛍️ Shopping Complex',  accent:'#ef4444', bg:'#1f0a0a' },
  { value:'business', label:'💼 Business',          accent:'#22c55e', bg:'#0a1f0a' },
  { value:'other',    label:'📢 Other',             accent:'#f59e0b', bg:'#1f1500' },
];

const PLACEMENTS = [
  { value:'all',     label:'All Pages'    },
  { value:'top',     label:'Top Banner'   },
  { value:'middle',  label:'Mid Page'     },
  { value:'bottom',  label:'Bottom'       },
  { value:'sidebar', label:'Sidebar'      },
];

const EMPTY_FORM = {
  title:'', subtitle:'', phone:'', url:'',
  type:'school', badge:'', tag:'',
  accentColor:'#3b82f6', bgColor:'#0a1628',
  imageUrl:'', placement:'all', priority:5,
  active:true, startDate:'', endDate:'',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function typeColor(type) {
  return AD_TYPES.find(t => t.value === type)?.accent || '#6b7280';
}

function typeBadge(type) {
  return AD_TYPES.find(t => t.value === type)?.label || '📢 Ad';
}

function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000)    return (n/1000).toFixed(1)+'K';
  return String(n);
}

// ─── AD PREVIEW CARD ─────────────────────────────────────────────────────────
function AdPreview({ form }) {
  const accent = form.accentColor || '#3b82f6';
  const bg     = form.bgColor     || '#0a1628';
  return (
    <div style={{ background: bg, border:`1.5px solid ${accent}40`, borderRadius:12, overflow:'hidden' }}>
      <div style={{ height:3, background:`linear-gradient(90deg,${accent},${accent}44)` }} />
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', position:'relative' }}>
        <div style={{ position:'absolute', top:6, right:10, fontSize:8, fontWeight:700, color:accent, background:`${accent}20`, borderRadius:4, padding:'1px 6px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {form.tag || 'Advertisement'}
        </div>
        <div style={{ width:52, height:52, borderRadius:10, background:`${accent}18`, border:`2px solid ${accent}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, overflow:'hidden' }}>
          {form.imageUrl
            ? <img src={form.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
            : (form.type === 'school' ? '🏫' : form.type === 'college' ? '🎓' : form.type === 'shopping' ? '🛍️' : '📢')
          }
        </div>
        <div style={{ flex:1, overflow:'hidden' }}>
          <div style={{ fontSize:9, fontWeight:800, color:accent, background:`${accent}20`, borderRadius:20, padding:'1px 8px', display:'inline-block', marginBottom:4 }}>
            {form.badge || typeBadge(form.type)}
          </div>
          <p style={{ fontSize:13, fontWeight:900, color:'#fff', margin:'0 0 2px', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {form.title || 'Business Name'}
          </p>
          <p style={{ fontSize:10, color:'#94a3b8', margin:0, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {form.subtitle || 'Your tagline here'}
          </p>
          {form.phone && <p style={{ fontSize:9, fontWeight:800, color:accent, margin:'3px 0 0' }}>📞 {form.phone}</p>}
        </div>
        <div style={{ flexShrink:0, background:accent, color:'#000', borderRadius:8, padding:'7px 10px', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>
          {form.type==='school'?'Enquire →':form.type==='college'?'Apply →':form.type==='shopping'?'Visit →':'Learn More →'}
        </div>
      </div>
    </div>
  );
}

// ─── CREATE / EDIT FORM ───────────────────────────────────────────────────────
function AdForm({ initial, onSave, onCancel, uploading, setUploading }) {
  const [form, setForm]   = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imgPreview, setImgPreview] = useState(initial?.imageUrl || '');
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({
    ...f, [k]: v,
    ...(k==='type' ? {
      accentColor: AD_TYPES.find(t=>t.value===v)?.accent || f.accentColor,
      bgColor:     AD_TYPES.find(t=>t.value===v)?.bg     || f.bgColor,
      badge:       AD_TYPES.find(t=>t.value===v)?.label  || f.badge,
    } : {}),
  }));

  // Handle image upload
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Try S3 upload first
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/media/upload', fd, { headers:{'Content-Type':'multipart/form-data'} });
      const url = res.data?.url || res.data?.imageUrl || '';
      setImgPreview(url);
      set('imageUrl', url);
    } catch {
      // Fallback: base64
      const reader = new FileReader();
      reader.onload = ev => { setImgPreview(ev.target.result); set('imageUrl', ev.target.result); };
      reader.readAsDataURL(file);
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    if (!form.type)         { alert('Type is required');  return; }
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const inp = (label, key, type='text', placeholder='') => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>{label}</label>
      <input
        type={type}
        value={form[key]||''}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', color:'#0f172a' }}
      />
    </div>
  );

  return (
    <div style={{ background:'#fff', borderRadius:16, padding:24, border:'1px solid #e2e8f0', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
      <h3 style={{ fontSize:18, fontWeight:900, color:'#0f172a', margin:'0 0 20px', fontStyle:'italic', textTransform:'uppercase' }}>
        {initial?.id ? '✏️ Edit Ad' : '➕ New Ad'}
      </h3>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Left col */}
        <div>
          {inp('Business / School Name *', 'title', 'text', 'Sri Vidya School')}
          {inp('Tagline / Description', 'subtitle', 'text', 'Admissions Open 2025–26')}
          {inp('Phone Number', 'phone', 'tel', '9876543210')}
          {inp('Website URL', 'url', 'url', 'https://yourschool.com')}

          {/* Type */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>Ad Type *</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {AD_TYPES.map(t => (
                <button key={t.value} onClick={() => set('type', t.value)}
                  style={{ padding:'8px 10px', borderRadius:8, border:`2px solid ${form.type===t.value?t.accent:'#e2e8f0'}`, background:form.type===t.value?`${t.accent}15`:'#fafafa', color:form.type===t.value?t.accent:'#64748b', fontSize:11, fontWeight:800, cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div>
          {/* Tag */}
          {inp('Ad Tag', 'tag', 'text', 'Admissions Open / Grand Opening')}

          {/* Custom badge */}
          {inp('Badge Text', 'badge', 'text', '🏫 School')}

          {/* Placement */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>Placement</label>
            <select value={form.placement} onChange={e=>set('placement',e.target.value)}
              style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', color:'#0f172a' }}>
              {PLACEMENTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>Priority (1=highest)</label>
            <input type="number" min={1} max={10} value={form.priority||5} onChange={e=>set('priority',Number(e.target.value))}
              style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', color:'#0f172a' }} />
          </div>

          {/* Colors */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            <div>
              <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>Accent Color</label>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <input type="color" value={form.accentColor||'#3b82f6'} onChange={e=>set('accentColor',e.target.value)}
                  style={{ width:40, height:36, borderRadius:6, border:'1px solid #e2e8f0', cursor:'pointer', padding:2 }} />
                <input type="text" value={form.accentColor||''} onChange={e=>set('accentColor',e.target.value)}
                  style={{ flex:1, padding:'8px 10px', borderRadius:6, border:'1px solid #e2e8f0', fontSize:12, outline:'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>Background</label>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <input type="color" value={form.bgColor||'#0a1628'} onChange={e=>set('bgColor',e.target.value)}
                  style={{ width:40, height:36, borderRadius:6, border:'1px solid #e2e8f0', cursor:'pointer', padding:2 }} />
                <input type="text" value={form.bgColor||''} onChange={e=>set('bgColor',e.target.value)}
                  style={{ flex:1, padding:'8px 10px', borderRadius:6, border:'1px solid #e2e8f0', fontSize:12, outline:'none' }} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {inp('Start Date', 'startDate', 'datetime-local')}
            {inp('End Date',   'endDate',   'datetime-local')}
          </div>
        </div>
      </div>

      {/* Image upload */}
      <div style={{ marginBottom:20 }}>
        <label style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:8 }}>
          Ad Image / Logo
        </label>
        <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
          {/* Upload area */}
          <div
            onClick={() => fileRef.current.click()}
            style={{ width:120, height:90, borderRadius:10, border:'2px dashed #e2e8f0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', background:'#f8fafc', transition:'border-color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='#3b82f6'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='#e2e8f0'}
          >
            {imgPreview
              ? <img src={imgPreview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} onError={()=>setImgPreview('')} />
              : <>
                  <span style={{ fontSize:24, marginBottom:4 }}>🖼️</span>
                  <span style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textAlign:'center' }}>Click to upload</span>
                </>
            }
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }} />
          </div>

          <div style={{ flex:1 }}>
            <p style={{ fontSize:11, color:'#64748b', margin:'0 0 8px', lineHeight:1.5 }}>
              Upload your logo or banner image. Recommended: 200×200px square logo, or 600×200px banner.
            </p>
            <input
              type="text"
              value={form.imageUrl||''}
              onChange={e=>{ set('imageUrl',e.target.value); setImgPreview(e.target.value); }}
              placeholder="Or paste image URL directly"
              style={{ width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:12, outline:'none' }}
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:10, fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 8px' }}>Live Preview</p>
        <AdPreview form={form} />
      </div>

      {/* Buttons */}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={handleSubmit} disabled={saving||uploading}
          style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'#e8192c', color:'#fff', fontWeight:900, fontSize:13, cursor:saving?'wait':'pointer', textTransform:'uppercase', letterSpacing:'0.08em', opacity:saving?0.7:1, transition:'opacity 0.2s' }}>
          {saving ? '⏳ Saving...' : uploading ? '⏳ Uploading...' : initial?.id ? '✅ Update Ad' : '➕ Create Ad'}
        </button>
        <button onClick={onCancel}
          style={{ padding:'11px 20px', borderRadius:10, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── AD ROW CARD ─────────────────────────────────────────────────────────────
function AdCard({ ad, onEdit, onToggle, onDelete }) {
  const accent = ad.accentColor || '#6b7280';
  const ctr    = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
  return (
    <div style={{ background:'#fff', borderRadius:14, border:`1px solid ${ad.active?accent+'30':'#f1f5f9'}`, overflow:'hidden', transition:'box-shadow 0.2s', opacity:ad.active?1:0.6 }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>

      {/* Top bar */}
      <div style={{ height:3, background:ad.active?`linear-gradient(90deg,${accent},${accent}44)`:'#f1f5f9' }} />

      <div style={{ padding:'12px 16px' }}>
        {/* Header row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
            {/* Image */}
            <div style={{ width:44, height:44, borderRadius:9, background:`${accent}15`, border:`1.5px solid ${accent}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, overflow:'hidden' }}>
              {ad.imageUrl
                ? <img src={ad.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
                : (ad.type==='school'?'🏫':ad.type==='college'?'🎓':ad.type==='shopping'?'🛍️':'📢')
              }
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <span style={{ fontSize:9, fontWeight:800, color:accent, background:`${accent}18`, borderRadius:4, padding:'1px 6px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                  {typeBadge(ad.type)}
                </span>
                {!ad.active && <span style={{ fontSize:8, fontWeight:800, color:'#94a3b8', background:'#f1f5f9', borderRadius:4, padding:'1px 5px' }}>PAUSED</span>}
              </div>
              <p style={{ fontSize:14, fontWeight:900, color:'#0f172a', margin:'0 0 1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ad.title}</p>
              <p style={{ fontSize:11, color:'#64748b', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ad.subtitle}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            <button onClick={() => onToggle(ad)}
              style={{ padding:'5px 10px', borderRadius:7, border:`1px solid ${ad.active?'#e2e8f0':'#22c55e'}`, background:ad.active?'#f8fafc':'#f0fdf4', color:ad.active?'#64748b':'#22c55e', fontSize:10, fontWeight:800, cursor:'pointer' }}>
              {ad.active ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button onClick={() => onEdit(ad)}
              style={{ padding:'5px 10px', borderRadius:7, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#475569', fontSize:10, fontWeight:800, cursor:'pointer' }}>
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(ad)}
              style={{ padding:'5px 10px', borderRadius:7, border:'1px solid #fee2e2', background:'#fff5f5', color:'#ef4444', fontSize:10, fontWeight:800, cursor:'pointer' }}>
              🗑
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:12, paddingTop:10, borderTop:'1px solid #f1f5f9', flexWrap:'wrap' }}>
          {[
            { label:'Placement', value: PLACEMENTS.find(p=>p.value===ad.placement)?.label || ad.placement },
            { label:'Priority',  value: `#${ad.priority}` },
            { label:'Impressions', value: fmtNum(ad.impressions) },
            { label:'Clicks',    value: fmtNum(ad.clicks) },
            { label:'CTR',       value: `${ctr}%` },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize:8, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 2px' }}>{s.label}</p>
              <p style={{ fontSize:13, fontWeight:900, color:'#0f172a', margin:0 }}>{s.value}</p>
            </div>
          ))}
          {ad.phone && (
            <div>
              <p style={{ fontSize:8, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 2px' }}>Phone</p>
              <p style={{ fontSize:13, fontWeight:900, color:accent, margin:0 }}>📞 {ad.phone}</p>
            </div>
          )}
          {ad.url && (
            <div style={{ marginLeft:'auto' }}>
              <a href={ad.url} target="_blank" rel="noreferrer" style={{ fontSize:10, fontWeight:700, color:'#3b82f6', textDecoration:'none' }}>🔗 View Site</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdsDashboard() {
  const { isAdmin } = useAuth();

  const [ads,      setAds]      = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAd,   setEditAd]   = useState(null);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(null);
  const [uploading,setUploading]= useState(false);
  const [delConfirm,setDelConfirm]=useState(null);

  const showToast = (msg, type='success') => {
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
    } catch (e) { showToast('Failed to load ads', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleSave = async (form) => {
    try {
      if (editAd?.id) {
        await apiClient.put(`/ads/${editAd.id}`, form);
        showToast('Ad updated successfully ✅');
      } else {
        await apiClient.post('/ads', form);
        showToast('Ad created successfully ✅');
      }
      setShowForm(false);
      setEditAd(null);
      loadAll();
    } catch { showToast('Failed to save ad ❌', 'error'); }
  };

  const handleToggle = async (ad) => {
    try {
      await apiClient.patch(`/ads/${ad.id}/toggle`);
      showToast(ad.active ? 'Ad paused' : 'Ad resumed ✅');
      loadAll();
    } catch { showToast('Failed to toggle ad ❌', 'error'); }
  };

  const handleDelete = async (ad) => {
    try {
      await apiClient.delete(`/ads/${ad.id}`);
      showToast('Ad deleted');
      setDelConfirm(null);
      loadAll();
    } catch { showToast('Failed to delete ❌', 'error'); }
  };

  // Filter ads
  const filtered = ads
    .filter(a => filter==='all' || a.type===filter)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  if (!isAdmin) return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, background:'#f8fafc' }}>
      <span style={{ fontSize:48 }}>🔒</span>
      <h2 style={{ fontSize:22, fontWeight:900, color:'#334155', margin:0 }}>Admin Only</h2>
      <Link to="/" style={{ color:'#3b82f6', fontWeight:700, textDecoration:'none' }}>← Go Home</Link>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
          zIndex:99999, background:toast.type==='error'?'#ef4444':'#22c55e',
          color:'#fff', padding:'10px 22px', borderRadius:30,
          fontWeight:800, fontSize:13, boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
          animation:'toastIn 0.2s ease', whiteSpace:'nowrap',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {delConfirm && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:340, width:'100%', textAlign:'center' }}>
            <p style={{ fontSize:40, margin:'0 0 10px' }}>🗑️</p>
            <h3 style={{ fontSize:18, fontWeight:900, color:'#0f172a', margin:'0 0 6px' }}>Delete Ad?</h3>
            <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>"{delConfirm.title}" will be permanently deleted.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => handleDelete(delConfirm)}
                style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'#ef4444', color:'#fff', fontWeight:900, cursor:'pointer', fontSize:13 }}>
                Yes, Delete
              </button>
              <button onClick={() => setDelConfirm(null)}
                style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ minHeight:'100vh', background:'#f1f5f9', fontFamily:'system-ui,sans-serif', paddingBottom:60 }}>

        {/* ── HEADER ── */}
        <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', position:'sticky', top:0, zIndex:50 }}>
          <div>
            <p style={{ fontSize:9, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 2px' }}>AP13 News</p>
            <h1 style={{ fontSize:22, fontWeight:900, color:'#0f172a', margin:0, fontStyle:'italic', textTransform:'uppercase' }}>
              📢 Ads Dashboard
            </h1>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Link to="/admin" style={{ padding:'9px 16px', borderRadius:10, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontWeight:700, fontSize:12, textDecoration:'none' }}>
              ← Admin
            </Link>
            <button
              onClick={() => { setEditAd(null); setShowForm(true); }}
              style={{ padding:'9px 18px', borderRadius:10, border:'none', background:'#e8192c', color:'#fff', fontWeight:900, fontSize:13, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              ➕ New Ad
            </button>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>

          {/* ── STATS CARDS ── */}
          {stats && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24, animation:'fadeUp 0.4s ease' }}>
              {[
                { label:'Total Ads',    value:stats.totalAds,         icon:'📢', color:'#3b82f6' },
                { label:'Active',       value:stats.activeAds,         icon:'✅', color:'#22c55e' },
                { label:'Paused',       value:stats.inactiveAds,       icon:'⏸',  color:'#f59e0b' },
                { label:'Impressions',  value:fmtNum(stats.totalImpressions), icon:'👁',color:'#8b5cf6' },
                { label:'Clicks',       value:fmtNum(stats.totalClicks),icon:'👆', color:'#ef4444' },
                { label:'CTR',          value:stats.ctr,               icon:'📊', color:'#0d9488' },
              ].map(s => (
                <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'14px 16px', border:`1px solid ${s.color}20`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize:20, margin:'0 0 4px' }}>{s.icon}</p>
                  <p style={{ fontSize:22, fontWeight:900, color:s.color, margin:'0 0 2px', lineHeight:1 }}>{s.value}</p>
                  <p style={{ fontSize:9, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', margin:0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── CREATE / EDIT FORM ── */}
          {showForm && (
            <div style={{ marginBottom:24, animation:'fadeUp 0.3s ease' }}>
              <AdForm
                initial={editAd}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditAd(null); }}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          )}

          {/* ── FILTERS ── */}
          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[{ value:'all', label:'All' }, ...AD_TYPES].map(t => (
                <button key={t.value} onClick={() => setFilter(t.value)}
                  style={{ padding:'6px 12px', borderRadius:20, border:`1px solid ${filter===t.value?'#e8192c':'#e2e8f0'}`, background:filter===t.value?'#e8192c':'#fff', color:filter===t.value?'#fff':'#64748b', fontSize:11, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap' }}>
                  {t.label || 'All'}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search ads..."
              style={{ marginLeft:'auto', padding:'7px 14px', borderRadius:20, border:'1px solid #e2e8f0', fontSize:12, outline:'none', minWidth:180 }}
            />
            <span style={{ fontSize:11, color:'#94a3b8', fontWeight:700 }}>{filtered.length} ads</span>
          </div>

          {/* ── AD LIST ── */}
          {loading ? (
            <div style={{ display:'grid', gap:12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height:110, borderRadius:14, background:'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff', borderRadius:16, border:'2px dashed #e2e8f0' }}>
              <p style={{ fontSize:48, margin:'0 0 12px' }}>📢</p>
              <p style={{ fontSize:18, fontWeight:900, color:'#334155', margin:'0 0 6px', textTransform:'uppercase', fontStyle:'italic' }}>No Ads Found</p>
              <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 20px' }}>Create your first ad to get started.</p>
              <button onClick={() => { setEditAd(null); setShowForm(true); }}
                style={{ padding:'10px 24px', borderRadius:10, border:'none', background:'#e8192c', color:'#fff', fontWeight:900, fontSize:13, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                ➕ Create First Ad
              </button>
            </div>
          ) : (
            <div style={{ display:'grid', gap:12, animation:'fadeUp 0.4s ease' }}>
              {filtered.map(ad => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onEdit={ad => { setEditAd(ad); setShowForm(true); window.scrollTo({ top:0, behavior:'smooth' }); }}
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