import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// ── ProtectedRoute — requires login, optionally requires reporter or admin ─────
export function ProtectedRoute({ children, requireReporter = false, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isReporter, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0f0f0f',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #1e293b', borderTopColor: '#e8192c',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireAdmin && !isAdmin) return <Navigate to="/unauthorized" replace />;

  if (requireReporter && !isAdmin && !isReporter) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// ── PublicOnlyRoute — redirect logged-in users away from login page ───────────
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isAdmin, isReporter, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={isAdmin || isReporter ? '/admin' : '/'} replace />;
  }

  return children;
}

export default ProtectedRoute;