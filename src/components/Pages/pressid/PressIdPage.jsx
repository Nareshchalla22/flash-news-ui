import { useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { Link } from 'react-router-dom';

const PLAN_CONFIG = {
  basic: { label: 'Field Reporter',        color: '#3b82f6', dark: '#0d1f3c', badge: 'BASIC',    icon: '🎖️' },
  pro:   { label: 'Senior Correspondent',  color: '#ef4444', dark: '#2d0a0a', badge: 'PRO',      icon: '⭐' },
  elite: { label: 'Bureau Correspondent',  color: '#f59e0b', dark: '#2d1f00', badge: 'ELITE',    icon: '👑' },
};
const DEFAULT_PLAN = { label: 'Reporter', color: '#1DB954', dark: '#0a1f10', badge: 'REPORTER', icon: '📰' };

function QRCode({ value, size = 76 }) {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=111827&color=ffffff&margin=6`}
      alt="QR Code"
      width={size} height={size}
      style={{ borderRadius: 6, display: 'block' }}
    />
  );
}

// ── FRONT ─────────────────────────────────────────────────────────────────────
function CardFront({ user, plan, idNumber }) {
  return (
    <div style={{
      width: 340, height: 215, borderRadius: 18, flexShrink: 0,
      background: `linear-gradient(145deg, ${plan.dark} 0%, #0f172a 65%, #020617 100%)`,
      border: `1.5px solid ${plan.color}40`,
      boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px ${plan.color}15`,
      position: 'relative', overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif', userSelect: 'none',
    }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />

      {/* Watermark */}
      <div style={{ position: 'absolute', right: -20, bottom: -15, fontSize: 90, fontWeight: 900, fontStyle: 'italic', color: plan.color, opacity: 0.05, lineHeight: 1, pointerEvents: 'none' }}>AP13</div>

      {/* Dot grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
        <defs><pattern id="dp" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill={plan.color} /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dp)" />
      </svg>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px 9px', borderBottom: `1px solid ${plan.color}15` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: `linear-gradient(135deg, ${plan.color}, ${plan.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontStyle: 'italic', color: '#000', fontSize: 9 }}>AP13</div>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AP13 NEWS</p>
            <p style={{ margin: 0, fontSize: 7, color: plan.color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>FlashReport Network</p>
          </div>
        </div>
        <div style={{ background: plan.color, borderRadius: 5, padding: '3px 8px' }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: '#000', letterSpacing: '0.15em' }}>PRESS</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 12, padding: '10px 14px' }}>
        {/* Photo */}
        <div style={{ width: 68, height: 82, borderRadius: 10, background: `${plan.color}15`, border: `2px solid ${plan.color}30`, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.photoUrl
            ? <img src={user.photoUrl} alt="Reporter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            : <span style={{ fontSize: 30, opacity: 0.25 }}>👤</span>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.fullName || user?.username || 'Reporter'}
          </p>
          <p style={{ margin: '0 0 8px', fontSize: 8, fontWeight: 800, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {plan.icon} {plan.label}
          </p>

          {[
            { label: 'ID',    value: idNumber              },
            { label: 'Email', value: user?.email  || '—'   },
            { label: 'Phone', value: user?.phone  || '—'   },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 3 }}>
              <span style={{ fontSize: 7, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: 28, flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontSize: 8, fontWeight: 600, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 14px 8px', borderTop: `1px solid ${plan.color}12`, background: 'rgba(0,0,0,0.25)' }}>
        <div>
          <p style={{ margin: 0, fontSize: 7, color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Valid 2025 – 2026</p>
          <p style={{ margin: 0, fontSize: 7, color: '#1e293b', fontWeight: 500 }}>ap13news.in · Hyderabad, TS</p>
        </div>
        <div style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40`, borderRadius: 4, padding: '2px 7px' }}>
          <span style={{ fontSize: 7, fontWeight: 900, color: plan.color, letterSpacing: '0.12em' }}>{plan.badge}</span>
        </div>
      </div>
    </div>
  );
}

// ── BACK ──────────────────────────────────────────────────────────────────────
function CardBack({ user, plan, idNumber }) {
  const verifyUrl = `https://ap13news.in/verify/${idNumber}`;
  return (
    <div style={{
      width: 340, height: 215, borderRadius: 18, flexShrink: 0,
      background: 'linear-gradient(145deg, #0a0f1e 0%, #020617 100%)',
      border: `1.5px solid ${plan.color}30`,
      boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px ${plan.color}10`,
      position: 'relative', overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif', userSelect: 'none',
    }}>
      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />

      {/* Magnetic strip */}
      <div style={{ width: '100%', height: 34, background: 'linear-gradient(180deg, #0a0a0a, #111)', marginTop: 18, borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }} />

      {/* Content */}
      <div style={{ display: 'flex', gap: 14, padding: '10px 14px', alignItems: 'flex-start' }}>
        {/* QR */}
        <div style={{ padding: 6, background: '#111827', border: `1px solid ${plan.color}25`, borderRadius: 8, flexShrink: 0 }}>
          <QRCode value={verifyUrl} size={72} />
          <p style={{ margin: '4px 0 0', fontSize: 6, color: '#334155', fontWeight: 700, textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scan to Verify</p>
        </div>

        {/* Details */}
        <div style={{ flex: 1 }}>
          {[
            { label: 'Card No',    value: idNumber                             },
            { label: 'Name',       value: user?.fullName || user?.username     },
            { label: 'Plan',       value: plan.label                           },
            { label: 'Issued by',  value: 'AP13 News Network'                  },
            { label: 'Valid Till', value: '31 December 2026'                   },
            { label: 'Website',    value: 'ap13news.in'                        },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 7, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', width: 42, flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontSize: 8, fontWeight: 600, color: '#475569', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ width: 80, height: 1, background: '#1e293b', marginBottom: 3 }} />
          <p style={{ margin: 0, fontSize: 6, color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reporter Signature</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 900, fontStyle: 'italic', color: plan.color, letterSpacing: '0.02em' }}>AP13 NEWS</p>
          <p style={{ margin: 0, fontSize: 6, color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Authorised Signatory</p>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PressIdPage() {
  const { user, isAuthenticated, isReporter, isAdmin } = useAuth();
  const [copied,   setCopied]   = useState(false);
  const [showBack, setShowBack] = useState(false);

  const planKey = user?.planId?.toLowerCase() || '';
  const plan    = PLAN_CONFIG[planKey] || DEFAULT_PLAN;
  const idNumber = user?.id
    ? `AP13-${String(user.id).padStart(4, '0')}-2026`
    : 'AP13-0000-2026';

  const handleCopy = () => {
    navigator.clipboard.writeText(idNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '60vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
        <span style={{ fontSize: 56 }}>🪪</span>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#374151', textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>Login Required</h2>
        <p style={{ color: '#4b5563', fontSize: 13, textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
          You need to be logged in as a reporter to view your Press ID.
        </p>
        <Link to="/login" style={{ padding: '10px 24px', borderRadius: 10, background: '#1DB954', color: '#000', fontWeight: 800, textDecoration: 'none', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Login →
        </Link>
      </div>
    );
  }

  // ── Not a reporter ─────────────────────────────────────────────────────────
  if (!isReporter && !isAdmin) {
    return (
      <div style={{ minHeight: '60vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
        <span style={{ fontSize: 56 }}>📋</span>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#374151', textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>Not a Reporter Yet</h2>
        <p style={{ color: '#4b5563', fontSize: 13, textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
          Your Press ID will be issued after your reporter application is approved and your account is activated by an admin.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/join" style={{ padding: '10px 20px', borderRadius: 10, background: '#1DB954', color: '#000', fontWeight: 800, textDecoration: 'none', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Apply Now ⚡
          </Link>
          <Link to="/" style={{ padding: '10px 20px', borderRadius: 10, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>
            ← Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Press ID Page ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        @media print {
          body > * { display: none !important; }
          #press-id-printable { display: flex !important; flex-direction: column; align-items: center; gap: 24px; padding: 40px; }
        }
        #press-id-printable { display: none; }
      `}</style>

      {/* Print-only section */}
      <div id="press-id-printable">
        <CardFront user={user} plan={plan} idNumber={idNumber} />
        <CardBack  user={user} plan={plan} idNumber={idNumber} />
      </div>

      <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#e2e8f0', paddingBottom: 80, fontFamily: 'system-ui, sans-serif' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ background: '#111', borderBottom: '1px solid #1e293b', padding: '20px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1DB954', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: '#1DB954', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Press Credentials</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, fontStyle: 'italic', color: '#f1f5f9', margin: '0 0 4px', textTransform: 'uppercase' }}>
              Your <span style={{ color: plan.color }}>Press ID</span>
            </h1>
            <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
              AP13 News Network · Official Reporter Credentials · {idNumber}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px' }}>

          {/* Plan badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, marginBottom: 24, background: `${plan.color}15`, border: `1px solid ${plan.color}40` }}>
            <span style={{ fontSize: 16 }}>{plan.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{plan.label}</span>
            <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>· Verified Reporter</span>
          </div>

          {/* ── CARD DISPLAY ── */}
          <div style={{ marginBottom: 20, animation: 'fadeUp 0.5s ease' }}>
            {/* Toggle tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {['Front', 'Back'].map(side => (
                <button key={side} onClick={() => setShowBack(side === 'Back')}
                  style={{
                    padding: '5px 16px', borderRadius: 20, cursor: 'pointer',
                    background: (side === 'Back') === showBack ? plan.color : '#1e293b',
                    border: `1px solid ${(side === 'Back') === showBack ? plan.color : '#334155'}`,
                    color: (side === 'Back') === showBack ? '#000' : '#64748b',
                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}>
                  {side}
                </button>
              ))}
            </div>

            {/* Card */}
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              {showBack
                ? <CardBack  user={user} plan={plan} idNumber={idNumber} />
                : <CardFront user={user} plan={plan} idNumber={idNumber} />
              }
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            <button onClick={handlePrint} style={{ padding: '10px 20px', borderRadius: 10, background: plan.color, border: 'none', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              🖨️ Print ID Card
            </button>
            <button onClick={handleCopy} style={{ padding: '10px 20px', borderRadius: 10, background: copied ? '#1DB95420' : '#1e293b', border: `1px solid ${copied ? '#1DB95460' : '#334155'}`, color: copied ? '#1DB954' : '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s' }}>
              {copied ? '✓ Copied!' : '📋 Copy ID Number'}
            </button>
            <Link to="/admin" style={{ padding: '10px 20px', borderRadius: 10, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
              ⚡ Dashboard
            </Link>
          </div>

          {/* ── REPORTER INFO ── */}
          <div style={{ background: '#161616', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #1e293b', background: `linear-gradient(135deg, ${plan.color}08, transparent)` }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Account Details</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {[
                { label: 'Full Name',  value: user?.fullName || '—'      },
                { label: 'Username',   value: user?.username || '—'      },
                { label: 'Email',      value: user?.email    || '—'      },
                { label: 'Phone',      value: user?.phone    || '—'      },
                { label: 'Role',       value: user?.role     || 'REPORTER'},
                { label: 'Plan',       value: plan.label                  },
                { label: 'Press ID',   value: idNumber                    },
                { label: 'Valid Till', value: '31 December 2026'          },
              ].map(row => (
                <div key={row.label}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>{row.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: row.label === 'Press ID' ? plan.color : '#e2e8f0', fontFamily: row.label === 'Press ID' ? 'monospace' : 'inherit' }}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── PRIVILEGES ── */}
          <div style={{ background: '#161616', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #1e293b', background: `linear-gradient(135deg, ${plan.color}08, transparent)` }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Reporter Privileges</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {[
                { text: 'Publish News Articles',   granted: true                                    },
                { text: 'Edit Existing Articles',  granted: true                                    },
                { text: 'Upload Images / Media',   granted: true                                    },
                { text: 'Access News Dashboard',   granted: true                                    },
                { text: 'Reporter Credit Line',    granted: true                                    },
                { text: 'Priority Publishing',     granted: planKey === 'pro' || planKey === 'elite'},
                { text: 'Bureau Chief Title',      granted: planKey === 'elite'                    },
                { text: 'Revenue Share Program',   granted: planKey === 'elite'                    },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: item.granted ? `${plan.color}08` : '#111', border: `1px solid ${item.granted ? plan.color + '25' : '#1e293b'}` }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{item.granted ? '✅' : '🔒'}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: item.granted ? '#d1d5db' : '#334155' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── NOTICE ── */}
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: 10, borderLeft: `3px solid ${plan.color}` }}>
            <p style={{ fontSize: 11, color: '#475569', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: plan.color }}>Note:</strong> This Press ID is issued by AP13 News Network for official use only.
              It grants access to press events, news publishing, and reporter-exclusive features.
              Misuse of credentials will result in immediate revocation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}