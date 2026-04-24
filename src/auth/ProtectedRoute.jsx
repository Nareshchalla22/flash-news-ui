import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Spinner shown while auth state loads
function AuthLoader() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#020617",
      flexDirection: "column", gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid #1e293b",
        borderTopColor: "#ef4444",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{
        color: "#475569", fontSize: 12, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.15em",
      }}>Verifying session...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/**
 * ProtectedRoute
 * @param {boolean} requireAdmin - if true, user must also have ADMIN role
 */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/**
 * PublicOnlyRoute - redirects logged-in users away from /login
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
}