import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


const ROLE_COLORS = {
  ADMIN:  { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#f87171'  },
  EDITOR: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#93c5fd'  },
  VIEWER: { bg: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.4)',text: '#94a3b8'  },
};

export default function UserMenu() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 8,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.35)',
          color: '#f87171', textDecoration: 'none',
          fontSize: 12, fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: '0.05em', textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
      >
        🔐 Admin Login
      </Link>
    );
  }

  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.VIEWER;
  const initials = (user?.username || 'U').slice(0, 2).toUpperCase();

  return (
    <div ref={ref} style={{ position: 'relative', zIndex: 200 }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 10px 6px 6px', borderRadius: 10,
          background: open ? '#1e293b' : '#0f172a',
          border: `1px solid ${open ? '#334155' : '#1e293b'}`,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #ef4444, #7f1d1d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: '#fff',
          fontFamily: "'Barlow Condensed', sans-serif",
          flexShrink: 0,
        }}>
          {initials}
        </div>

        {/* Name + role */}
        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
            {user?.username}
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: roleStyle.text,
          }}>
            {user?.role}
          </div>
        </div>

        {/* Chevron */}
        <svg
          viewBox="0 0 24 24" fill="none" stroke="#475569"
          strokeWidth="2" width="14" height="14"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 220, background: '#0f172a',
          border: '1px solid #1e293b', borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          animation: 'dropIn 0.15s ease',
        }}>
          <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>

          {/* User info header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.08), transparent)',
            borderBottom: '1px solid #1e293b',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
              {user?.username}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '2px 8px', borderRadius: 6,
              background: roleStyle.bg, border: `1px solid ${roleStyle.border}`,
              fontSize: 10, fontWeight: 700, color: roleStyle.text,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {user?.role}
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: '6px' }}>
            {isAdmin && (
              <MenuItem
                icon="⚡"
                label="Admin Dashboard"
                to="/admin"
                color="#f87171"
                onClick={() => setOpen(false)}
              />
            )}
            <MenuItem
              icon="🪪"
              label="My Press ID"
              to="/id-card"
              onClick={() => setOpen(false)}
            />
            <MenuItem
              icon="🏠"
              label="News Home"
              to="/"
              onClick={() => setOpen(false)}
            />

            <div style={{ height: 1, background: '#1e293b', margin: '6px 0' }} />

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '9px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'none', border: 'none',
                borderRadius: 8, cursor: 'pointer',
                color: '#f87171', fontSize: 13, fontWeight: 600,
                textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, to, color, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8,
        color: color || '#94a3b8', textDecoration: 'none',
        fontSize: 13, fontWeight: 600,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span>{icon}</span> {label}
    </Link>
  );
}