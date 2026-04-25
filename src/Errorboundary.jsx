import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, errorInfo: info });
    console.error('─── AP13 App Error ───');
    console.error('Error:', error?.message);
    console.error('Stack:', error?.stack);
    console.error('Component:', info?.componentStack);
  }

  handleClear = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('settings'); // optional
  } catch (e) {
    console.error('Storage clear failed:', e);
  }

  window.location.replace('/'); // better than href
};

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, resetKey: this.state.resetKey + 0 });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message || 'An unexpected error occurred.';
    const isNetworkError = msg.toLowerCase().includes('fetch') ||
                           msg.toLowerCase().includes('network') ||
                           msg.toLowerCase().includes('cors');
    const isColdStart   = msg.toLowerCase().includes('waking') ||
                           msg.toLowerCase().includes('cold') ||
                           msg.toLowerCase().includes('30 second');

    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif",
        padding: 24,
        textAlign: 'center',
      }}>
        {/* Glow */}
        <div style={{
          position: 'fixed', top: '40%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 480, width: '100%' }}>
          {/* Icon */}
          <div style={{ fontSize: 56, marginBottom: 20 }}>
            {isColdStart ? '⏳' : isNetworkError ? '📡' : '⚡'}
          </div>

          {/* Brand */}
          <div style={{
            fontSize: 14, fontWeight: 800, color: '#ef4444',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            AP13 News Network
          </div>

          <h2 style={{
            color: '#f1f5f9', fontSize: 22, fontWeight: 800,
            margin: '0 0 12px', lineHeight: 1.3,
          }}>
            {isColdStart ? 'Server is waking up…' :
             isNetworkError ? 'Connection error' :
             'Something went wrong'}
          </h2>

          {/* Error message box */}
          <div style={{
            background: '#0a0f1e', border: '1px solid #1e293b',
            borderRadius: 12, padding: '14px 18px', marginBottom: 20,
            textAlign: 'left',
          }}>
            <p style={{ color: '#f87171', fontSize: 13, fontWeight: 600, margin: 0 }}>
              {msg}
            </p>
          </div>

          {/* Hint */}
          <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
            {isColdStart
              ? 'The server (Render free tier) goes to sleep after 15 minutes. Wait ~30 seconds then try logging in again.'
              : isNetworkError
              ? 'Cannot reach the backend. Check your internet connection, or the Render service may be down.'
              : 'This is usually caused by a temporary bug. Try reloading. If it persists, clear your session and reload.'}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '11px 24px', borderRadius: 10,
                background: '#1e293b', border: '1px solid #334155',
                color: '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '11px 24px', borderRadius: 10,
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
                color: '#93c5fd', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}
            >
              ↺ Reload Page
            </button>
            <button
              onClick={this.handleClear}
              style={{
                padding: '11px 24px', borderRadius: 10,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}
            >
              🚪 Clear & Go Home
            </button>
          </div>

          {/* Dev hint */}
          <p style={{ color: '#1e293b', fontSize: 11, marginTop: 28 }}>
            Open DevTools (F12) → Console for full error details
          </p>
        </div>
      </div>
    );
  }
}