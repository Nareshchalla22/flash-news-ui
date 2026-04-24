import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

// ─── Animated grid background ─────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", zIndex: 0,
      pointerEvents: "none",
    }}>
      {/* Grid lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ef4444" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
        animation: "breathe 4s ease-in-out infinite",
      }} />

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }} />

      {/* Top bar accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #ef4444, transparent)",
        animation: "shimmer 3s ease-in-out infinite",
      }} />
    </div>
  );
}

// ─── Floating label input ──────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, error, icon, name, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isActive = focused || value.length > 0;
  const inputType = type === "password" ? (showPass ? "text" : "password") : type;

  return (
    <div style={{ position: "relative", marginBottom: 4 }}>
      {/* Label */}
      <label style={{
        position: "absolute", left: 16,
        top: isActive ? 8 : "50%",
        transform: isActive ? "translateY(0)" : "translateY(-50%)",
        fontSize: isActive ? 10 : 14,
        fontWeight: 700,
        color: focused ? "#ef4444" : error ? "#f87171" : "#475569",
        textTransform: isActive ? "uppercase" : "none",
        letterSpacing: isActive ? "0.08em" : 0,
        transition: "all 0.2s ease",
        pointerEvents: "none",
        zIndex: 2,
        fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
      }}>
        {label}
      </label>

      {/* Icon */}
      <div style={{
        position: "absolute", right: type === "password" ? 44 : 14,
        top: "50%", transform: "translateY(-50%)",
        color: focused ? "#ef4444" : "#334155",
        transition: "color 0.2s", zIndex: 2,
        fontSize: 16,
      }}>
        {icon}
      </div>

      {/* Input */}
      <input
        name={name}
        type={inputType}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          paddingTop: isActive ? 24 : 16,
          paddingBottom: isActive ? 8 : 16,
          paddingLeft: 16,
          paddingRight: type === "password" ? 80 : 44,
          background: focused ? "rgba(239,68,68,0.04)" : "#0a0f1e",
          border: `1px solid ${error ? "#991b1b" : focused ? "#ef444460" : "#1e293b"}`,
          borderRadius: 12,
          color: "#f1f5f9",
          fontSize: 15,
          fontWeight: 600,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "all 0.2s ease",
          fontFamily: "'Barlow Condensed', 'Oswald', 'Segoe UI', sans-serif",
          letterSpacing: "0.02em",
          boxShadow: focused ? "0 0 0 3px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.02)" : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      />

      {/* Show/Hide password */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPass(v => !v)}
          style={{
            position: "absolute", right: 14, top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none",
            color: "#334155", cursor: "pointer", padding: 4,
            fontSize: 16, zIndex: 3,
          }}
        >
          {showPass ? "🙈" : "👁"}
        </button>
      )}

      {/* Error */}
      {error && (
        <p style={{
          color: "#f87171", fontSize: 11, fontWeight: 600,
          marginTop: 6, marginLeft: 2, display: "flex", alignItems: "center", gap: 4,
        }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || "/admin";

  const [form, setForm]     = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [errMsg, setErrMsg] = useState("");
  const [attempts, setAttempts] = useState(0);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password)        e.password = "Password is required";
    else if (form.password.length < 4) e.password = "Password too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrMsg("");

    try {
      await login(form.username.trim(), form.password);
      setStatus("success");
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err) {
      setAttempts(a => a + 1);
      setErrMsg(err.message || "Login failed. Check credentials.");
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,900&family=Barlow:wght@400;500;600&display=swap');

        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50%       { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        @keyframes successPulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70% { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        fontFamily: "'Barlow', 'Segoe UI', sans-serif",
        position: "relative",
      }}>
        <GridBg />

        {/* ── LEFT PANEL (branding) ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          position: "relative",
          zIndex: 1,
          animation: "fadeIn 0.8s ease",
        }}
          className="left-panel"
        >
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 30,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            width: "fit-content", marginBottom: 48,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#ef4444",
              animation: "breathe 2s ease-in-out infinite",
            }} />
            <span style={{
              color: "#f87171", fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.15em",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}>Live Broadcast System</span>
          </div>

          {/* Main logo text */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 88,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "#ef4444",
              textShadow: "0 0 60px rgba(239,68,68,0.4)",
              animation: "slideUp 0.6s ease 0.1s both",
            }}>
              AP13
            </div>
            <div style={{
              fontSize: 48,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
              color: "#f1f5f9",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              animation: "slideUp 0.6s ease 0.2s both",
            }}>
              NEWS
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginTop: 16,
              animation: "slideUp 0.6s ease 0.3s both",
            }}>
              <div style={{ height: 2, width: 40, background: "#ef4444" }} />
              <span style={{
                fontSize: 12, fontWeight: 600, color: "#475569",
                textTransform: "uppercase", letterSpacing: "0.25em",
                fontFamily: "'Barlow Condensed', sans-serif",
              }}>FlashReport Network</span>
            </div>
          </div>

          {/* Description */}
          <p style={{
            color: "#475569", fontSize: 16, lineHeight: 1.7,
            maxWidth: 400, marginBottom: 48,
            animation: "slideUp 0.6s ease 0.4s both",
          }}>
            Secure access to the AP13 editorial management system. Only authorized personnel may proceed.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 40,
            animation: "slideUp 0.6s ease 0.5s both",
          }}>
            {[
              { n: "11", label: "Categories" },
              { n: "24/7", label: "Live Coverage" },
              { n: "AWS", label: "Infrastructure" },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontSize: 28,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900, fontStyle: "italic",
                  color: "#ef4444", lineHeight: 1,
                }}>{s.n}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "#334155",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  marginTop: 2,
                }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Vertical rule */}
          <div style={{
            position: "absolute", right: 0, top: "10%", bottom: "10%",
            width: 1,
            background: "linear-gradient(180deg, transparent, #1e293b 30%, #1e293b 70%, transparent)",
          }} />
        </div>

        {/* ── RIGHT PANEL (form) ── */}
        <div style={{
          width: 480,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 48px",
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(10,15,30,0.98))",
          borderLeft: "1px solid #0f172a",
          animation: "fadeIn 0.6s ease 0.2s both",
        }}>

          {/* Top label */}
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#334155",
              textTransform: "uppercase", letterSpacing: "0.2em",
              fontFamily: "'Barlow Condensed', sans-serif",
              marginBottom: 8,
            }}>Admin Portal</p>
            <h2 style={{
              fontSize: 36,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontStyle: "italic",
              color: "#f1f5f9",
              lineHeight: 1, letterSpacing: "-0.01em",
            }}>
              Sign In to<br />
              <span style={{ color: "#ef4444" }}>Console</span>
            </h2>
          </div>

          {/* Error banner */}
          {status === "error" && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, marginBottom: 20,
              background: "rgba(127,29,29,0.3)",
              border: "1px solid rgba(239,68,68,0.4)",
              display: "flex", alignItems: "flex-start", gap: 10,
              animation: "shake 0.4s ease",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
              <div>
                <p style={{ color: "#fca5a5", fontSize: 13, fontWeight: 700 }}>
                  Authentication Failed
                </p>
                <p style={{ color: "#f87171", fontSize: 12, marginTop: 2 }}>{errMsg}</p>
                {attempts >= 3 && (
                  <p style={{ color: "#ef4444", fontSize: 11, marginTop: 6, fontWeight: 600 }}>
                    Too many attempts. Contact your system administrator.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Success banner */}
          {status === "success" && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, marginBottom: 20,
              background: "rgba(5,46,22,0.5)",
              border: "1px solid rgba(34,197,94,0.4)",
              display: "flex", alignItems: "center", gap: 10,
              animation: "successPulse 0.6s ease",
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <p style={{ color: "#86efac", fontSize: 13, fontWeight: 700 }}>
                Access granted — redirecting...
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field
              label="Username"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={set("username")}
              error={errors.username}
              icon="👤"
            />
            <Field
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              icon="🔐"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              style={{
                marginTop: 8,
                padding: "16px 24px",
                background: status === "success"
                  ? "#16a34a"
                  : status === "loading"
                  ? "#7f1d1d"
                  : "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: status === "loading" ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 24px rgba(239,68,68,0.3)",
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              {status === "loading" ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Authenticating...
                </>
              ) : status === "success" ? (
                <>✓ Access Granted</>
              ) : (
                <>⚡ Enter Console</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, margin: "28px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
            <span style={{ color: "#334155", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
              SYSTEM INFO
            </span>
            <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
          </div>

          {/* System info */}
          <div style={{
            background: "#0a0f1e", border: "1px solid #1e293b",
            borderRadius: 12, padding: "16px 18px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {[
              { label: "Backend",  value: "Spring Boot 3 + JWT" },
              { label: "Database", value: "PostgreSQL (AWS RDS)" },
              { label: "Frontend", value: "React 19 + Vite 8" },
              { label: "Deploy",   value: "Render + Vercel" },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{ color: "#334155", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {row.label}
                </span>
                <span style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Back to site */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link to="/" style={{
              color: "#334155", fontSize: 12, fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#94a3b8"}
              onMouseLeave={e => e.target.style.color = "#334155"}
            >
              ← Back to AP13 News
            </Link>
          </div>

          {/* Corner decoration */}
          <div style={{
            position: "absolute", bottom: 24, right: 24,
            opacity: 0.04,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 80, fontWeight: 900, fontStyle: "italic",
            color: "#ef4444", lineHeight: 1, userSelect: "none",
          }}>AP13</div>
        </div>

        {/* Mobile responsive override */}
        <style>{`
          @media (max-width: 768px) {
            .left-panel { display: none !important; }
          }
        `}</style>
      </div>
    </>
  );
}