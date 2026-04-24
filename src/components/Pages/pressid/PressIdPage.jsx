import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import apiClient from '../../../services/api';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DESIGNATIONS = [
  'Senior Reporter', 'Field Reporter', 'News Anchor',
  'Photojournalist', 'Video Editor', 'Chief Editor',
  'Bureau Chief', 'Correspondent', 'Cameraperson', 'Producer',
];

const VALID_YEARS = ['2024', '2025', '2026', '2027'];

// ─── API helpers ──────────────────────────────────────────────────────────────
const pressApi = {
  getAll:    ()       => apiClient.get('/press-pass'),
  getById:   (id)     => apiClient.get(`/press-pass/${id}`),
  create:    (data)   => apiClient.post('/press-pass', data),
  update:    (id, d)  => apiClient.put(`/press-pass/${id}`, d),
  delete:    (id)     => apiClient.delete(`/press-pass/${id}`),
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function generateEmpId() {
  return 'AP13-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4);
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ─── HOLOGRAPHIC SHINE LAYER ──────────────────────────────────────────────────
function HoloShine({ active }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: active
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`
          : 'none',
        pointerEvents: active ? 'auto' : 'none',
        transition: 'background 0.1s',
        zIndex: 5,
      }}
    />
  );
}

// ─── PRESS CARD COMPONENT (the actual ID card) ────────────────────────────────
function PressCard({ data, printRef }) {
  const [holo, setHolo] = useState(false);

  const {
    reporterName = 'Your Name',
    designation = 'Reporter',
    employeeId = 'AP13-XXXX-0000',
    bloodGroup = 'O+',
    contactNumber = '+91 00000 00000',
    validUntil = '2026',
    photoUrl = null,
    department = 'News Division',
  } = data;

  return (
    <div style={{ perspective: 1000 }}>
      <div
        ref={printRef}
        onMouseEnter={() => setHolo(true)}
        onMouseLeave={() => setHolo(false)}
        style={{
          width: 380,
          minHeight: 240,
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #0a0f1e 0%, #0d1526 40%, #0a0f1e 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: holo
            ? '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'box-shadow 0.3s ease',
          fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
          userSelect: 'none',
        }}
      >
        <HoloShine active={holo} />

        {/* Top red band */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #dc2626, #ef4444, #dc2626)',
          zIndex: 10,
        }} />

        {/* Background pattern */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.04, width: '100%', height: '100%' }}>
          <defs>
            <pattern id="cp" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ef4444" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cp)" />
        </svg>

        {/* Diagonal accent */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180,
          background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
        }} />

        {/* AP13 watermark */}
        <div style={{
          position: 'absolute', bottom: -10, right: -10,
          fontSize: 80, fontWeight: 900, fontStyle: 'italic',
          color: 'rgba(239,68,68,0.04)', lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none', pointerEvents: 'none',
        }}>AP13</div>

        {/* Card body */}
        <div style={{ position: 'relative', zIndex: 2, padding: '20px 20px 20px 20px' }}>

          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 18,
          }}>
            <div>
              <div style={{
                fontSize: 28, fontWeight: 900, fontStyle: 'italic',
                color: '#ef4444', letterSpacing: '-0.02em', lineHeight: 1,
              }}>AP13</div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#94a3b8',
                letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>NEWS NETWORK</div>
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3,
            }}>
              <div style={{
                padding: '3px 10px', borderRadius: 30,
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                fontSize: 9, fontWeight: 800, color: '#f87171',
                letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>
                PRESS PASS
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>
                Valid: 2026
              </div>
            </div>
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

            {/* Photo */}
            <div style={{
              width: 80, height: 96, borderRadius: 12, flexShrink: 0,
              border: '2px solid rgba(239,68,68,0.4)',
              overflow: 'hidden',
              background: '#0f172a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Reporter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" width="28" height="28">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span style={{ fontSize: 8, color: '#334155', fontWeight: 700 }}>PHOTO</span>
                </div>
              )}
              {/* Photo corner accent */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, #ef4444, transparent)',
              }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 20, fontWeight: 900, fontStyle: 'italic',
                color: '#f1f5f9', lineHeight: 1.1, marginBottom: 4,
                letterSpacing: '-0.01em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {reporterName || 'Your Name'}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#ef4444',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
              }}>
                {designation || 'Designation'}
              </div>

              {/* Data grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                {[
                  { label: 'ID',       value: employeeId },
                  { label: 'Blood',    value: bloodGroup },
                  { label: 'Dept',     value: department },
                  { label: 'Mobile',   value: contactNumber },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {row.label}
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: '#94a3b8',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {row.value || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div style={{
            marginTop: 16, paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {/* Barcode-style decoration */}
            <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              {[6, 10, 4, 8, 12, 6, 9, 4, 11, 7, 5, 10, 3, 8].map((h, i) => (
                <div key={i} style={{
                  width: 2, height: h,
                  background: i % 3 === 0 ? '#ef4444' : 'rgba(255,255,255,0.15)',
                  borderRadius: 1,
                }} />
              ))}
            </div>

            <div style={{
              fontSize: 8, color: '#1e293b', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right',
            }}>
              FlashReport Network<br />
              <span style={{ color: '#0f172a' }}>Hyderabad, TS</span>
            </div>

            {/* Valid until chip */}
            <div style={{
              padding: '4px 10px', borderRadius: 6,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              fontSize: 9, fontWeight: 800, color: '#f87171',
            }}>
              VALID {validUntil}
            </div>
          </div>
        </div>

        {/* Bottom red band */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
        }} />
      </div>
    </div>
  );
}

// ─── FIELD INPUT ──────────────────────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700,
        color: '#475569', textTransform: 'uppercase',
        letterSpacing: '0.1em', marginBottom: 6,
        fontFamily: "'Barlow Condensed', sans-serif",
      }}>
        {label}
        {hint && <span style={{ color: '#334155', fontWeight: 500, textTransform: 'none', letterSpacing: 0, marginLeft: 6 }}>({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#0a0f1e', border: '1px solid #1e293b',
  color: '#e2e8f0', fontSize: 13, fontWeight: 600,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Barlow Condensed', sans-serif",
  letterSpacing: '0.02em', transition: 'border-color 0.2s',
};

// ─── SAVED CARDS LIST ─────────────────────────────────────────────────────────
function SavedCards({ cards, onEdit, onDelete, onPrint }) {
  if (!cards.length) return (
    <div style={{
      textAlign: 'center', padding: '40px 20px',
      color: '#334155', fontSize: 13, fontWeight: 600,
    }}>
      No press IDs saved yet. Create your first one above.
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {cards.map(card => (
        <div key={card.id} style={{
          background: '#0a0f1e', border: '1px solid #1e293b',
          borderRadius: 14, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#ef444440'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
        >
          {/* Avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            border: '2px solid rgba(239,68,68,0.3)', overflow: 'hidden',
            background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {card.photoUrl
              ? <img src={card.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 18, color: '#334155' }}>👤</span>
            }
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 15, fontWeight: 800, color: '#f1f5f9',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {card.reporterName}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>{card.designation}</span>
              <span style={{ fontSize: 11, color: '#334155' }}>•</span>
              <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{card.employeeId}</span>
              {card.bloodGroup && (
                <>
                  <span style={{ fontSize: 11, color: '#334155' }}>•</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                    background: 'rgba(239,68,68,0.1)', color: '#f87171',
                  }}>{card.bloodGroup}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={() => onPrint(card)} title="Print / Save PDF" style={{
              padding: '7px 10px', borderRadius: 8,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
              color: '#93c5fd', cursor: 'pointer', fontSize: 14,
            }}>🖨</button>
            <button onClick={() => onEdit(card)} title="Edit" style={{
              padding: '7px 10px', borderRadius: 8,
              background: '#1e293b', border: '1px solid #334155',
              color: '#94a3b8', cursor: 'pointer', fontSize: 14,
            }}>✏️</button>
            <button onClick={() => onDelete(card)} title="Delete" style={{
              padding: '7px 10px', borderRadius: 8,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171', cursor: 'pointer', fontSize: 14,
            }}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PressIdPage() {
  const { user } = useAuth();
  const printRef = useRef(null);
  const { toasts, add: addToast } = useToast();

  const blank = {
    reporterName: user?.username || '',
    designation: '',
    department: 'News Division',
    employeeId: generateEmpId(),
    bloodGroup: '',
    contactNumber: '',
    validUntil: '2026',
    photoUrl: '',
  };

  const [form, setForm]         = useState(blank);
  const [cards, setCards]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState(null);
  const [tab, setTab]           = useState('create'); // 'create' | 'saved'
  const [confirmDel, setConfirmDel] = useState(null);
  const [printCard, setPrintCard]   = useState(null);

  // Load all cards
  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pressApi.getAll();
      setCards(Array.isArray(res.data) ? res.data : []);
    } catch {
      // API might not be implemented yet — silently show empty
      setCards([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2097152) { addToast('Photo too large! Max 2MB.', 'error'); return; }
    const b64 = await toBase64(file);
    setForm(f => ({ ...f, photoUrl: b64 }));
  };

  const handleSave = async () => {
    if (!form.reporterName.trim()) { addToast('Reporter name is required!', 'error'); return; }
    setSaving(true);
    try {
      if (editId) {
        await pressApi.update(editId, form);
        addToast('Press ID updated!', 'success');
        setEditId(null);
      } else {
        await pressApi.create(form);
        addToast('Press ID created!', 'success');
      }
      setForm({ ...blank, employeeId: generateEmpId() });
      setTab('saved');
      fetchCards();
    } catch (err) {
      addToast(err?.response?.data?.message || 'Save failed. Check API.', 'error');
    } finally { setSaving(false); }
  };

  const handleEdit = (card) => {
    setForm({
      reporterName:  card.reporterName  || '',
      designation:   card.designation   || '',
      department:    card.department    || 'News Division',
      employeeId:    card.employeeId    || '',
      bloodGroup:    card.bloodGroup    || '',
      contactNumber: card.contactNumber || '',
      validUntil:    card.validUntil    || '2026',
      photoUrl:      card.photoUrl      || '',
    });
    setEditId(card.id);
    setTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    try {
      await pressApi.delete(confirmDel.id);
      addToast('Press ID deleted.', 'success');
      setConfirmDel(null);
      fetchCards();
    } catch {
      addToast('Delete failed.', 'error');
    }
  };

  const handlePrint = (card) => {
    setPrintCard(card);
    setTimeout(() => window.print(), 300);
  };

  const handleReset = () => {
    setForm({ ...blank, employeeId: generateEmpId() });
    setEditId(null);
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        select option { background: #0f172a; color: #e2e8f0; }
        input[type=file] { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          #print-card, #print-card * { visibility: visible !important; }
          #print-card {
            position: fixed !important; top: 20mm !important; left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>

      {/* Print target */}
      {printCard && (
        <div id="print-card" style={{ position: 'fixed', zIndex: -1, top: 0, left: 0, opacity: 0, pointerEvents: 'none' }}>
          <PressCard data={printCard} printRef={null} />
        </div>
      )}

      <div style={{
        minHeight: '100vh', background: '#020617',
        fontFamily: "'Barlow', sans-serif", color: '#e2e8f0',
        padding: '0 0 80px',
      }}>

        {/* ── PAGE HEADER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0f1e, #020617)',
          borderBottom: '1px solid #1e293b',
          padding: '32px 32px 24px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, #ef4444 30%, #ef4444 70%, transparent)',
          }} />
          <div style={{
            position: 'absolute', right: -20, top: -20, opacity: 0.03,
            fontSize: 120, fontWeight: 900, fontStyle: 'italic',
            fontFamily: "'Barlow Condensed', sans-serif", color: '#ef4444',
            userSelect: 'none',
          }}>ID</div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '4px 12px', borderRadius: 30,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                marginBottom: 12,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Press Pass System
                </span>
              </div>
              <h1 style={{
                fontSize: 42, fontWeight: 900, fontStyle: 'italic',
                fontFamily: "'Barlow Condensed', sans-serif",
                color: '#f1f5f9', lineHeight: 1, margin: '0 0 6px',
                letterSpacing: '-0.02em',
              }}>
                AP13 <span style={{ color: '#ef4444' }}>Press ID</span>
              </h1>
              <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>
                Generate, manage and print official journalist press passes
              </p>
            </div>

            {/* Tab switcher */}
            <div style={{
              display: 'flex', background: '#0a0f1e',
              border: '1px solid #1e293b', borderRadius: 12, padding: 4,
            }}>
              {[
                { key: 'create', label: editId ? '✏️ Editing' : '➕ Create' },
                { key: 'saved',  label: `📋 Saved (${cards.length})` },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: '8px 20px', borderRadius: 9,
                  background: tab === t.key ? '#ef4444' : 'transparent',
                  border: 'none', color: tab === t.key ? '#fff' : '#475569',
                  cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  transition: 'all 0.2s', fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: '0.03em',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

          {/* ════════ CREATE / EDIT TAB ════════ */}
          {tab === 'create' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>

              {/* ── FORM ── */}
              <div style={{
                background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 20, padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{
                    fontSize: 20, fontWeight: 800, fontStyle: 'italic',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: '#f1f5f9', margin: 0,
                  }}>
                    {editId ? 'Edit Press ID' : 'New Press ID'}
                  </h2>
                  {editId && (
                    <button onClick={handleReset} style={{
                      padding: '6px 14px', borderRadius: 8,
                      background: '#1e293b', border: '1px solid #334155',
                      color: '#64748b', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}>✕ Cancel Edit</button>
                  )}
                </div>

                {/* Photo upload */}
                <Field label="Reporter Photo" hint="max 2MB">
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 12,
                    background: '#0a0f1e', border: '2px dashed #1e293b',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#ef444460'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
                  >
                    <input type="file" accept="image/*" onChange={handlePhoto} />
                    {form.photoUrl
                      ? <img src={form.photoUrl} alt="" style={{ width: 56, height: 68, borderRadius: 8, objectFit: 'cover', border: '2px solid #ef444460' }} />
                      : (
                        <div style={{
                          width: 56, height: 68, borderRadius: 8,
                          background: '#0f172a', border: '1px solid #1e293b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 24,
                        }}>📷</div>
                      )
                    }
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>
                        {form.photoUrl ? 'Change photo' : 'Upload photo'}
                      </div>
                      <div style={{ fontSize: 11, color: '#475569' }}>Click to browse — JPG, PNG, WEBP</div>
                    </div>
                  </label>
                </Field>

                {/* 2-column fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                  <Field label="Full Name" style={{ gridColumn: '1 / -1' }}>
                    <input
                      style={inputStyle} placeholder="Reporter full name"
                      value={form.reporterName} onChange={set('reporterName')}
                    />
                  </Field>

                  <Field label="Designation">
                    <select style={inputStyle} value={form.designation} onChange={set('designation')}>
                      <option value="">Select role...</option>
                      {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>

                  <Field label="Department">
                    <input
                      style={inputStyle} placeholder="e.g. News Division"
                      value={form.department} onChange={set('department')}
                    />
                  </Field>

                  <Field label="Employee ID">
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }} placeholder="AP13-XXXX-0000"
                        value={form.employeeId} onChange={set('employeeId')}
                      />
                      <button
                        onClick={() => setForm(f => ({ ...f, employeeId: generateEmpId() }))}
                        title="Generate new ID"
                        style={{
                          padding: '10px 12px', borderRadius: 10, flexShrink: 0,
                          background: '#1e293b', border: '1px solid #334155',
                          color: '#64748b', cursor: 'pointer', fontSize: 14,
                        }}>🔄</button>
                    </div>
                  </Field>

                  <Field label="Blood Group">
                    <select style={inputStyle} value={form.bloodGroup} onChange={set('bloodGroup')}>
                      <option value="">Select...</option>
                      {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </Field>

                  <Field label="Contact Number">
                    <input
                      style={inputStyle} placeholder="+91 99999 00000"
                      value={form.contactNumber} onChange={set('contactNumber')}
                    />
                  </Field>

                  <Field label="Valid Until">
                    <select style={inputStyle} value={form.validUntil} onChange={set('validUntil')}>
                      {VALID_YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '14px 24px', borderRadius: 12,
                    background: saving ? '#1e293b' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none', color: '#fff', cursor: saving ? 'wait' : 'pointer',
                    fontSize: 15, fontWeight: 800, fontStyle: 'italic',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: saving ? 'none' : '0 4px 20px rgba(239,68,68,0.3)',
                    transition: 'all 0.3s',
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #334155', borderTopColor: '#ef4444', animation: 'spin 0.7s linear infinite' }} />
                      Saving...
                    </>
                  ) : editId ? '⚡ Update Press ID' : '⚡ Generate & Save Press ID'}
                </button>
              </div>

              {/* ── LIVE PREVIEW ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#334155',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  textAlign: 'center',
                }}>Live Preview</div>

                <PressCard data={form} printRef={printRef} />

                <button
                  onClick={() => handlePrint(form)}
                  style={{
                    padding: '10px 20px', borderRadius: 10,
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                    color: '#93c5fd', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.05em',
                  }}
                >
                  🖨 Print Preview Card
                </button>
              </div>
            </div>
          )}

          {/* ════════ SAVED CARDS TAB ════════ */}
          {tab === 'saved' && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 20,
              }}>
                <h2 style={{
                  fontSize: 22, fontWeight: 800, fontStyle: 'italic',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: '#f1f5f9', margin: 0,
                }}>
                  Saved Press <span style={{ color: '#ef4444' }}>IDs</span>
                </h2>
                <button onClick={() => { handleReset(); setTab('create'); }} style={{
                  padding: '8px 18px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none', color: '#fff', cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}>
                  ➕ New Press ID
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#334155' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #1e293b', borderTopColor: '#ef4444', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  Loading press IDs...
                </div>
              ) : (
                <SavedCards
                  cards={cards}
                  onEdit={handleEdit}
                  onDelete={setConfirmDel}
                  onPrint={handlePrint}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── DELETE CONFIRM ── */}
      {confirmDel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid #1e293b',
            borderRadius: 20, padding: '32px 36px', maxWidth: 400, width: '90%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗑</div>
            <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Delete Press ID?</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>
              This will permanently delete <strong style={{ color: '#94a3b8' }}>{confirmDel.reporterName}'s</strong> press pass.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDel(null)} style={{
                padding: '10px 24px', borderRadius: 10,
                background: '#1e293b', border: '1px solid #334155',
                color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              }}>Cancel</button>
              <button onClick={handleDelete} style={{
                padding: '10px 24px', borderRadius: 10,
                background: '#ef4444', border: 'none',
                color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '12px 18px', borderRadius: 12, minWidth: 240,
            background: t.type === 'error' ? '#450a0a' : '#052e16',
            border: `1px solid ${t.type === 'error' ? '#991b1b' : '#14532d'}`,
            color: t.type === 'error' ? '#fca5a5' : '#86efac',
            fontSize: 13, fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'slideIn 0.2s ease',
          }}>
            {t.type === 'error' ? '⚠' : '✓'} {t.msg}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes slideIn { from { transform:translateX(40px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </>
  );
}