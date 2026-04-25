import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS = {
  PENDING:  { label: 'Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)',  icon: '⏳' },
  APPROVED: { label: 'Approved', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',   icon: '✓' },
  REJECTED: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)',   icon: '✕' },
};

const PLAN_COLORS = { basic: '#3b82f6', pro: '#ef4444', elite: '#f59e0b' };

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── PAYMENT PROOF MODAL ───────────────────────────────────────────────────────
function ProofModal({ app, onClose, onApprove, onReject }) {
  const [note, setNote] = useState('');
  const [acting, setActing] = useState('');
  const st = STATUS[app.status] || STATUS.PENDING;

  const handle = async (action) => {
    setActing(action);
    await (action === 'approve' ? onApprove(app.id, note) : onReject(app.id, note));
    setActing('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b',
        borderRadius: 24, width: '94%', maxWidth: 800,
        maxHeight: '92vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid #1e293b',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.06), transparent)',
        }}>
          <div>
            <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Application Review
            </p>
            <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 800, margin: '4px 0 0', fontFamily: "'Barlow Condensed', sans-serif", fontStyle: 'italic' }}>
              {app.fullName}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              padding: '4px 12px', borderRadius: 20,
              background: st.bg, border: `1px solid ${st.border}`,
              fontSize: 11, fontWeight: 700, color: st.color,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {st.icon} {st.label}
            </div>
            <button onClick={onClose} style={{
              background: '#1e293b', border: 'none', borderRadius: 8,
              color: '#64748b', cursor: 'pointer', padding: '6px 10px', fontSize: 18,
            }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', display: 'flex', flex: 1 }}>
          {/* LEFT: Details */}
          <div style={{ flex: 1, padding: '22px 22px 22px 24px', borderRight: '1px solid #0f172a' }}>
            <Section title="Personal Info">
              <Row label="Name"        value={app.fullName} />
              <Row label="Email"       value={app.email} />
              <Row label="Phone"       value={app.phone} />
              <Row label="City/State"  value={`${app.city || '—'}, ${app.state || '—'}`} />
              <Row label="Aadhar"      value={app.aadharNumber || '—'} />
            </Section>

            <Section title="Professional">
              <Row label="Designation" value={app.designation} />
              <Row label="Experience"  value={app.experience || '—'} />
              {app.about && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>About</span>
                  <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6, margin: '4px 0 0' }}>{app.about}</p>
                </div>
              )}
            </Section>

            <Section title="Payment">
              <Row label="Plan"    value={app.planName} color={PLAN_COLORS[app.planId] || '#94a3b8'} />
              <Row label="Amount"  value={`₹${app.amount}`} color="#22c55e" />
              <Row label="Txn ID"  value={app.txnId} mono />
              <Row label="Applied" value={fmtDate(app.appliedAt)} />
              {app.reviewedAt && <Row label="Reviewed" value={fmtDate(app.reviewedAt)} />}
              {app.adminNote && <Row label="Note" value={app.adminNote} />}
            </Section>
          </div>

          {/* RIGHT: Photo + Payment Proof */}
          <div style={{ width: 280, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile photo */}
            {app.photoUrl && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Profile Photo</p>
                <img src={app.photoUrl} alt="Applicant"
                  style={{ width: '100%', borderRadius: 12, border: '1px solid #1e293b', objectFit: 'cover', maxHeight: 160 }} />
              </div>
            )}

            {/* Payment proof */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Payment Screenshot</p>
              {app.paymentProof ? (
                <a href={app.paymentProof} target="_blank" rel="noreferrer">
                  <img src={app.paymentProof} alt="Payment proof"
                    style={{ width: '100%', borderRadius: 12, border: '2px solid #22c55e40', cursor: 'zoom-in', objectFit: 'contain', background: '#0a0f1e', maxHeight: 200 }} />
                  <p style={{ fontSize: 10, color: '#22c55e', marginTop: 4, fontWeight: 600, textAlign: 'center' }}>Click to view full size</p>
                </a>
              ) : (
                <div style={{
                  height: 100, borderRadius: 12, border: '2px dashed #1e293b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#334155', fontSize: 12,
                }}>No screenshot uploaded</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Actions */}
        {app.status === 'PENDING' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea
              rows={2}
              placeholder="Optional note to applicant (shown on approval/rejection)..."
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: '#0a0f1e', border: '1px solid #1e293b',
                color: '#e2e8f0', fontSize: 12, resize: 'none', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{
                padding: '10px 20px', borderRadius: 10,
                background: '#1e293b', border: '1px solid #334155',
                color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              }}>Cancel</button>
              <button
                onClick={() => handle('reject')}
                disabled={acting === 'reject'}
                style={{
                  padding: '10px 22px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                  color: '#f87171', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {acting === 'reject'
                  ? <><Spin /> Rejecting...</>
                  : '✕ Reject'}
              </button>
              <button
                onClick={() => handle('approve')}
                disabled={acting === 'approve'}
                style={{
                  padding: '10px 22px', borderRadius: 10,
                  background: acting === 'approve' ? '#1e293b' : 'linear-gradient(135deg,#16a34a,#15803d)',
                  border: 'none', color: '#fff', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {acting === 'approve'
                  ? <><Spin /> Approving...</>
                  : '✓ Approve & Activate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #0f172a' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function Row({ label, value, color, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ fontSize: 11, color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: color || '#64748b', fontWeight: 600, fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', wordBreak: 'break-all' }}>{value || '—'}</span>
    </div>
  );
}

function Spin() {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: '#fff',
      animation: 'spin 0.7s linear infinite', flexShrink: 0,
    }} />
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 14, padding: '16px 20px',
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 900, fontStyle: 'italic', color, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

// ─── MAIN ADMIN APPLICATIONS PAGE ─────────────────────────────────────────────
export default function AdminApplicationsPage() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');
  const [search,  setSearch]  = useState('');
  const [viewing, setViewing] = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/reporter-application');
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch {
      setApps([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleApprove = async (id, note) => {
    try {
      await apiClient.put(`/reporter-application/${id}/approve`, { note });
      showToast('Application approved! Reporter activated.', 'success');
      fetchApps();
    } catch { showToast('Approval failed.', 'error'); }
  };

  const handleReject = async (id, note) => {
    try {
      await apiClient.put(`/reporter-application/${id}/reject`, { note });
      showToast('Application rejected.', 'success');
      fetchApps();
    } catch { showToast('Rejection failed.', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application permanently?')) return;
    try {
      await apiClient.delete(`/reporter-application/${id}`);
      showToast('Deleted.', 'success');
      fetchApps();
    } catch { showToast('Delete failed.', 'error'); }
  };

  // Stats
  const counts = {
    ALL:      apps.length,
    PENDING:  apps.filter(a => a.status === 'PENDING').length,
    APPROVED: apps.filter(a => a.status === 'APPROVED').length,
    REJECTED: apps.filter(a => a.status === 'REJECTED').length,
    revenue:  apps.filter(a => a.status === 'APPROVED').reduce((s, a) => s + (a.amount || 0), 0),
  };

  // Filtered list
  const displayed = apps
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      !search ||
      [a.fullName, a.email, a.phone, a.txnId, a.planName, a.city, a.state]
        .some(v => String(v || '').toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,900&family=Barlow:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform:translateX(40px);opacity:0; } to { transform:translateX(0);opacity:1; } }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#020617',
        fontFamily: "'Barlow', sans-serif", color: '#e2e8f0',
        paddingBottom: 60,
      }}>
        {/* ── PAGE HEADER ── */}
        <div style={{
          background: '#0a0f1e', borderBottom: '1px solid #1e293b',
          padding: '24px 28px 20px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, #ef4444 30%, #ef4444 70%, transparent)',
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 6px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                Admin Panel
              </p>
              <h1 style={{
                fontSize: 32, fontWeight: 900, fontStyle: 'italic',
                fontFamily: "'Barlow Condensed', sans-serif",
                color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em',
              }}>
                Reporter <span style={{ color: '#ef4444' }}>Applications</span>
              </h1>
            </div>
            <button onClick={fetchApps} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 10,
              background: '#1e293b', border: '1px solid #334155',
              color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px' }}>

          {/* ── STATS GRID ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
            <StatCard label="Total"    value={counts.ALL}      color="#64748b" icon="📋" />
            <StatCard label="Pending"  value={counts.PENDING}  color="#f59e0b" icon="⏳" />
            <StatCard label="Approved" value={counts.APPROVED} color="#22c55e" icon="✓" />
            <StatCard label="Rejected" value={counts.REJECTED} color="#ef4444" icon="✕" />
            <StatCard label="Revenue"  value={`₹${counts.revenue.toLocaleString('en-IN')}`} color="#a78bfa" icon="💰" />
          </div>

          {/* ── FILTERS + SEARCH ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status filter pills */}
            <div style={{ display: 'flex', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: 10, padding: 4, gap: 2 }}>
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => {
                const st = f === 'ALL' ? { color: '#64748b' } : STATUS[f];
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '6px 14px', borderRadius: 7,
                    background: filter === f ? (f === 'ALL' ? '#1e293b' : st.bg) : 'transparent',
                    border: filter === f ? `1px solid ${f === 'ALL' ? '#334155' : st.border}` : '1px solid transparent',
                    color: filter === f ? (f === 'ALL' ? '#94a3b8' : st.color) : '#334155',
                    cursor: 'pointer', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    transition: 'all 0.15s',
                  }}>
                    {f} {f !== 'ALL' && `(${counts[f]})`}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{
              flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8,
              background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: 10, padding: '8px 14px',
            }}>
              <span style={{ color: '#334155', fontSize: 14 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, plan..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#e2e8f0', fontSize: 13,
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 16,
                }}>✕</button>
              )}
            </div>

            <div style={{ color: '#334155', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {displayed.length} result{displayed.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* ── TABLE ── */}
          <div style={{ border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12, color: '#475569' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '3px solid #1e293b', borderTopColor: '#ef4444', animation: 'spin 0.8s linear infinite' }} />
                Loading applications...
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#334155' }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📋</div>
                <p style={{ fontSize: 16, fontWeight: 700 }}>No applications found</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>
                  {filter !== 'ALL' ? `No ${filter.toLowerCase()} applications` : 'No applications submitted yet'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                  <thead>
                    <tr style={{ background: '#0a0f1e', borderBottom: '1px solid #1e293b' }}>
                      {['#', 'Applicant', 'Contact', 'Plan', 'Amount', 'Txn ID', 'Applied', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{
                          padding: '11px 14px', textAlign: 'left',
                          fontSize: 10, fontWeight: 700, color: '#334155',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((app, i) => {
                      const st = STATUS[app.status] || STATUS.PENDING;
                      const planColor = PLAN_COLORS[app.planId] || '#64748b';
                      return (
                        <tr
                          key={app.id}
                          style={{
                            borderBottom: '1px solid #0f172a',
                            background: i % 2 === 0 ? '#0b1120' : '#0d1526',
                            cursor: 'pointer', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#0b1120' : '#0d1526'}
                          onClick={() => setViewing(app)}
                        >
                          {/* ID */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 28, height: 28, borderRadius: 6,
                              background: '#0f172a', fontSize: 11, fontWeight: 700, color: '#475569',
                            }}>{app.id}</span>
                          </td>

                          {/* Applicant */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                                background: '#0f172a', border: '1px solid #1e293b',
                                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                {app.photoUrl
                                  ? <img src={app.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : <span style={{ fontSize: 14 }}>👤</span>
                                }
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>{app.fullName}</div>
                                <div style={{ fontSize: 11, color: '#475569' }}>{app.designation}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{app.email}</div>
                            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{app.phone}</div>
                          </td>

                          {/* Plan */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '3px 8px', borderRadius: 6,
                              background: `${planColor}18`, border: `1px solid ${planColor}40`,
                              fontSize: 11, fontWeight: 700, color: planColor,
                              textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                            }}>{app.planId?.toUpperCase() || '—'}</span>
                          </td>

                          {/* Amount */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#22c55e', fontFamily: "'Barlow Condensed', sans-serif" }}>
                              ₹{app.amount || 0}
                            </span>
                          </td>

                          {/* Txn ID */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700 }}>
                              {app.txnId?.slice(0, 14) || '—'}
                            </span>
                          </td>

                          {/* Date */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap' }}>
                              {fmtDate(app.appliedAt)}
                            </span>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: 20,
                              background: st.bg, border: `1px solid ${st.border}`,
                              fontSize: 10, fontWeight: 800, color: st.color,
                              textTransform: 'uppercase', letterSpacing: '0.08em',
                              whiteSpace: 'nowrap',
                            }}>{st.icon} {st.label}</span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button
                                onClick={() => setViewing(app)}
                                title="View & Review"
                                style={{
                                  padding: '5px 10px', borderRadius: 7,
                                  background: '#1e293b', border: '1px solid #334155',
                                  color: '#94a3b8', cursor: 'pointer', fontSize: 12,
                                }}>👁</button>
                              {app.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(app.id, '')}
                                    title="Quick Approve"
                                    style={{
                                      padding: '5px 10px', borderRadius: 7,
                                      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                      color: '#86efac', cursor: 'pointer', fontSize: 12,
                                    }}>✓</button>
                                  <button
                                    onClick={() => handleReject(app.id, '')}
                                    title="Quick Reject"
                                    style={{
                                      padding: '5px 10px', borderRadius: 7,
                                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                      color: '#f87171', cursor: 'pointer', fontSize: 12,
                                    }}>✕</button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(app.id)}
                                title="Delete"
                                style={{
                                  padding: '5px 10px', borderRadius: 7,
                                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                  color: '#f87171', cursor: 'pointer', fontSize: 12, opacity: 0.6,
                                }}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {viewing && (
        <ProofModal
          app={viewing}
          onClose={() => setViewing(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          padding: '12px 20px', borderRadius: 12, minWidth: 240,
          background: toast.type === 'error' ? '#450a0a' : '#052e16',
          border: `1px solid ${toast.type === 'error' ? '#991b1b' : '#14532d'}`,
          color: toast.type === 'error' ? '#fca5a5' : '#86efac',
          fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.2s ease',
        }}>
          {toast.type === 'error' ? '⚠' : '✓'} {toast.msg}
        </div>
      )}
    </>
  );
}