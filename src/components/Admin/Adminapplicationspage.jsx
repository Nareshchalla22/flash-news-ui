import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS = {
  PENDING:  { label: 'Pending',  icon: '⏳', badge: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' },
  APPROVED: { label: 'Approved', icon: '✓',  badge: 'bg-green-500/10  border border-green-500/30  text-green-400'  },
  REJECTED: { label: 'Rejected', icon: '✕',  badge: 'bg-red-500/10    border border-red-500/30    text-red-400'    },
};

const PLAN_COLORS = {
  basic: 'bg-blue-500/10  border-blue-500/30  text-blue-400',
  pro:   'bg-red-500/10   border-red-500/30   text-red-400',
  elite: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
};

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
function Spin({ size = 4 }) {
  return (
    <div className={`w-${size} h-${size} rounded-full border-2 border-white/20 border-t-white animate-spin flex-shrink-0`} />
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, border }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 ${border} border-t-2 rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-4xl font-black italic text-slate-100 leading-none">{value}</div>
    </div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 pb-2 border-b border-slate-900">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

// ─── ROW ──────────────────────────────────────────────────────────────────────
function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className={`text-xs font-semibold text-slate-400 text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}

// ─── PROOF MODAL ──────────────────────────────────────────────────────────────
function ProofModal({ app, onClose, onApprove, onReject }) {
  const [note, setNote]     = useState('');
  const [acting, setActing] = useState('');
  const st = STATUS[app.status] || STATUS.PENDING;

  const handle = async (action) => {
    setActing(action);
    await (action === 'approve' ? onApprove(app.id, note) : onReject(app.id, note));
    setActing('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/85 backdrop-blur-md">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-[94%] max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-red-500/5 to-transparent">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Application Review</p>
            <h3 className="text-lg font-black italic text-slate-100">{app.fullName}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${st.badge}`}>
              {st.icon} {st.label}
            </span>
            <button onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg px-3 py-1.5 text-lg transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-y-auto">

          {/* LEFT: Details */}
          <div className="flex-1 p-6 border-r border-slate-900">
            <Section title="Personal Info">
              <Row label="Name"       value={app.fullName} />
              <Row label="Email"      value={app.email} />
              <Row label="Phone"      value={app.phone} />
              <Row label="City/State" value={`${app.city || '—'}, ${app.state || '—'}`} />
              <Row label="Aadhar"     value={app.aadharNumber || '—'} />
            </Section>
            <Section title="Professional">
              <Row label="Designation" value={app.designation} />
              <Row label="Experience"  value={app.experience || '—'} />
              {app.about && (
                <div className="mt-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">About</span>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">{app.about}</p>
                </div>
              )}
            </Section>
            <Section title="Payment">
              <Row label="Plan"     value={app.planName} />
              <Row label="Amount"   value={`₹${app.amount}`} />
              <Row label="Txn ID"   value={app.txnId} mono />
              <Row label="Applied"  value={fmtDate(app.appliedAt)} />
              {app.reviewedAt && <Row label="Reviewed" value={fmtDate(app.reviewedAt)} />}
              {app.adminNote  && <Row label="Note"     value={app.adminNote} />}
            </Section>
          </div>

          {/* RIGHT: Photos */}
          <div className="w-64 p-5 flex flex-col gap-4 flex-shrink-0">
            {app.photoUrl && (
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Profile Photo</p>
                <img src={app.photoUrl} alt="Applicant"
                  className="w-full rounded-xl border border-slate-800 object-cover max-h-40" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Payment Screenshot</p>
              {app.paymentProof ? (
                <a href={app.paymentProof} target="_blank" rel="noreferrer">
                  <img src={app.paymentProof} alt="Payment proof"
                    className="w-full rounded-xl border-2 border-green-500/20 object-contain bg-slate-950 max-h-48 cursor-zoom-in" />
                  <p className="text-xs text-green-400 mt-1 font-semibold text-center">Click to view full size</p>
                </a>
              ) : (
                <div className="h-24 rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 text-xs">
                  No screenshot uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {app.status === 'PENDING' && (
          <div className="px-6 py-4 border-t border-slate-800 flex flex-col gap-3">
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional note to applicant..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs resize-none outline-none focus:border-slate-600 transition-colors"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-300 font-semibold text-sm transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={() => handle('reject')} disabled={!!acting}
                className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
                {acting === 'reject' ? <><Spin size={3} /> Rejecting...</> : '✕ Reject'}
              </button>
              <button onClick={() => handle('approve')} disabled={!!acting}
                className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
                {acting === 'approve' ? <><Spin size={3} /> Approving...</> : '✓ Approve'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export function AdminApplicationsPage() {
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleApprove = async (id, note) => {
    try {
      await apiClient.put(`/reporter-application/${id}/approve`, { note });
      showToast('Application approved!', 'success');
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

  const counts = {
    ALL:      apps.length,
    PENDING:  apps.filter(a => a.status === 'PENDING').length,
    APPROVED: apps.filter(a => a.status === 'APPROVED').length,
    REJECTED: apps.filter(a => a.status === 'REJECTED').length,
    revenue:  apps.filter(a => a.status === 'APPROVED').reduce((s, a) => s + (a.amount || 0), 0),
  };

  const displayed = apps
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      !search ||
      [a.fullName, a.email, a.phone, a.txnId, a.planName, a.city, a.state]
        .some(v => String(v || '').toLowerCase().includes(search.toLowerCase()))
    );

  const filterBtns = [
    { key: 'ALL',      label: `All (${counts.ALL})`,               cls: 'text-slate-400 border-slate-700 bg-slate-800' },
    { key: 'PENDING',  label: `Pending (${counts.PENDING})`,       cls: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
    { key: 'APPROVED', label: `Approved (${counts.APPROVED})`,     cls: 'text-green-400  border-green-500/30  bg-green-500/10'  },
    { key: 'REJECTED', label: `Rejected (${counts.REJECTED})`,     cls: 'text-red-400    border-red-500/30    bg-red-500/10'    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-16">

      {/* ── PAGE HEADER ── */}
      <div className="bg-slate-900 border-b border-slate-800 px-7 pt-6 pb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-3xl font-black italic text-slate-100">
              Reporter <span className="text-red-500">Applications</span>
            </h1>
          </div>
          <button onClick={fetchApps}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-7">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total"    value={counts.ALL}      icon="📋" border="border-t-slate-500" />
          <StatCard label="Pending"  value={counts.PENDING}  icon="⏳" border="border-t-yellow-500" />
          <StatCard label="Approved" value={counts.APPROVED} icon="✓"  border="border-t-green-500" />
          <StatCard label="Rejected" value={counts.REJECTED} icon="✕"  border="border-t-red-500" />
          <StatCard label="Revenue"  value={`₹${counts.revenue.toLocaleString('en-IN')}`} icon="💰" border="border-t-violet-500" />
        </div>

        {/* ── FILTERS + SEARCH ── */}
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            {filterBtns.map(({ key, label, cls }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer
                  ${filter === key ? cls : 'text-slate-600 border-transparent bg-transparent hover:text-slate-400'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-48 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5">
            <span className="text-slate-600">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, plan..."
              className="flex-1 bg-transparent border-none outline-none text-slate-300 text-sm placeholder:text-slate-700"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="text-slate-600 hover:text-slate-400 text-base cursor-pointer bg-transparent border-none">✕</button>
            )}
          </div>

          <span className="text-xs font-semibold text-slate-600">
            {displayed.length} result{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── TABLE ── */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-3 text-slate-600">
              <div className="w-6 h-6 rounded-full border-2 border-slate-800 border-t-red-500 animate-spin" />
              Loading applications...
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <div className="text-5xl mb-4 opacity-30">📋</div>
              <p className="text-base font-bold">No applications found</p>
              <p className="text-sm mt-1">
                {filter !== 'ALL' ? `No ${filter.toLowerCase()} applications` : 'No applications submitted yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800">
                    {['#', 'Applicant', 'Contact', 'Plan', 'Amount', 'Txn ID', 'Applied', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((app, i) => {
                    const st = STATUS[app.status] || STATUS.PENDING;
                    const planCls = PLAN_COLORS[app.planId] || 'bg-slate-800 border-slate-700 text-slate-400';
                    return (
                      <tr key={app.id}
                        onClick={() => setViewing(app)}
                        className={`border-b border-slate-900 cursor-pointer transition-colors hover:bg-red-500/[0.03]
                          ${i % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'}`}>

                        {/* ID */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-xs font-bold text-slate-500">
                            {app.id}
                          </span>
                        </td>

                        {/* Applicant */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                              {app.photoUrl
                                ? <img src={app.photoUrl} alt="" className="w-full h-full object-cover" />
                                : <span className="text-base">👤</span>
                              }
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-200 leading-tight">{app.fullName}</div>
                              <div className="text-xs text-slate-500">{app.designation}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-400">{app.email}</div>
                          <div className="text-xs text-slate-600 font-mono">{app.phone}</div>
                        </td>

                        {/* Plan */}
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider whitespace-nowrap ${planCls}`}>
                            {app.planId?.toUpperCase() || '—'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3">
                          <span className="text-base font-black italic text-green-400">₹{app.amount || 0}</span>
                        </td>

                        {/* Txn ID */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-yellow-400 font-mono font-bold">
                            {app.txnId?.slice(0, 14) || '—'}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-500 whitespace-nowrap">{fmtDate(app.appliedAt)}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${st.badge}`}>
                            {st.icon} {st.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1.5">
                            <button onClick={() => setViewing(app)} title="View"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer">
                              👁
                            </button>
                            {app.status === 'PENDING' && (
                              <>
                                <button onClick={() => handleApprove(app.id, '')} title="Quick Approve"
                                  className="px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs transition-colors cursor-pointer">
                                  ✓
                                </button>
                                <button onClick={() => handleReject(app.id, '')} title="Quick Reject"
                                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs transition-colors cursor-pointer">
                                  ✕
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDelete(app.id)} title="Delete"
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400/60 hover:text-red-400 text-xs transition-colors cursor-pointer">
                              🗑
                            </button>
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

      {/* ── MODAL ── */}
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
        <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl min-w-60 text-sm font-semibold shadow-2xl
          animate-[slideIn_0.2s_ease]
          ${toast.type === 'error'
            ? 'bg-red-950 border border-red-800 text-red-300'
            : 'bg-green-950 border border-green-800 text-green-300'}`}>
          {toast.type === 'error' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}
    </div>
  );
}
export default AdminApplicationsPage;