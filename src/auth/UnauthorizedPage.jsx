import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&display=swap');
        @keyframes flicker {
          0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 94% { opacity: 1; } 96% { opacity: 0.3; } 97% { opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020617",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        padding: 24,
      }}>
        {/* Glow */}
        <div style={{
          position: "fixed", top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* 403 */}
        <div style={{
          fontSize: 160, fontWeight: 900, fontStyle: "italic",
          color: "#ef4444", lineHeight: 1,
          opacity: 0.15, userSelect: "none",
          animation: "flicker 5s infinite",
          position: "absolute",
        }}>403</div>

        <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 30,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            marginBottom: 24,
          }}>
            <span style={{ color: "#f87171", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em" }}>
              🚫 ACCESS DENIED
            </span>
          </div>

          <h1 style={{
            fontSize: 56, fontWeight: 900, fontStyle: "italic",
            color: "#f1f5f9", lineHeight: 1, marginBottom: 16,
          }}>
            Unauthorized<br/>
            <span style={{ color: "#ef4444" }}>Personnel</span>
          </h1>

          <p style={{
            color: "#475569", fontSize: 16, lineHeight: 1.7,
            maxWidth: 400, margin: "0 auto 36px",
            fontFamily: "sans-serif",
          }}>
            Your account <strong style={{ color: "#64748b" }}>"{user?.username}"</strong> does not have sufficient privileges to access the Admin Console.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" style={{
              padding: "12px 28px", borderRadius: 10,
              background: "#1e293b", border: "1px solid #334155",
              color: "#94a3b8", textDecoration: "none",
              fontSize: 14, fontWeight: 700, letterSpacing: "0.05em",
            }}>
              ← Back to News
            </Link>
            <button
              onClick={logout}
              style={{
                padding: "12px 28px", borderRadius: 10,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171", cursor: "pointer",
                fontSize: 14, fontWeight: 700, letterSpacing: "0.05em",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}