import { createContext, useContext, useState, useCallback, useEffect } from "react";

// ─── API BASE URL ─────────────────────────────────────────────────────────────
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:8080/api"
  : "https://ap13news.in/api";

const AuthContext = createContext(null);

// ─── Safe localStorage ────────────────────────────────────────────────────────
function safeStorage() {
  try {
    localStorage.setItem("__ap13_test__", "1");
    localStorage.removeItem("__ap13_test__");
    return localStorage;
  } catch {
    const mem = {};
    return {
      getItem:    (k) => mem[k] ?? null,
      setItem:    (k, v) => { mem[k] = String(v); },
      removeItem: (k) => { delete mem[k]; },
      clear:      () => { Object.keys(mem).forEach(k => delete mem[k]); },
    };
  }
}
const storage = safeStorage();

function safeJson(str) {
  try { return JSON.parse(str); } catch { return null; }
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on boot ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const t = storage.getItem("ap13_token");
      const u = safeJson(storage.getItem("ap13_user"));
      if (t && u) { setToken(t); setUser(u); }
    } catch { storage.clear(); }
    finally { setLoading(false); }
  }, []);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
        signal:  controller.signal,
      });
      clearTimeout(timeoutId);

      let data;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await res.json().catch(() => ({}));
      } else {
        const text = await res.text().catch(() => "");
        data = { message: text || `HTTP ${res.status}` };
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
          (res.status === 401 ? "Wrong username or password." :
           res.status === 403 ? "Access denied." :
           res.status === 500 ? "Server error — try again." :
           `Login failed (${res.status}).`)
        );
      }

      if (!data?.token) throw new Error("Invalid response — missing token.");
      if (!data?.user)  throw new Error("Invalid response — missing user.");

      // Store full user profile including reporter fields for Press ID card
      const userProfile = {
        id:       data.user.id,
        username: data.user.username,
        role:     data.user.role,
        fullName: data.user.fullName  || "",
        email:    data.user.email     || "",
        phone:    data.user.phone     || "",
        planId:   data.user.planId    || "",
        planName: data.user.planName  || "",
        photoUrl: data.user.photoUrl  || "",
      };

      storage.setItem("ap13_token", data.token);
      storage.setItem("ap13_user",  JSON.stringify(userProfile));
      setToken(data.token);
      setUser(userProfile);
      return data;

    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError")
        throw new Error("Server timeout. Please try again.");
      if (err.message === "Failed to fetch" || err.message.includes("NetworkError"))
        throw new Error("Cannot reach the server. Check your connection.");
      throw err;
    }
  }, []);

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    storage.removeItem("ap13_token");
    storage.removeItem("ap13_user");
    setToken(null);
    setUser(null);
  }, []);

  // ── ROLES ─────────────────────────────────────────────────────────────────
  const isAuthenticated = !!token && !!user;
  const isAdmin         = user?.role === "ADMIN"    || user?.role === "ROLE_ADMIN";
  const isReporter      = user?.role === "REPORTER" || user?.role === "ROLE_REPORTER";
  const canAccessAdmin  = isAdmin || isReporter;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      isReporter,
      canAccessAdmin,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export default AuthContext;