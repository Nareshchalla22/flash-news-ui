import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);

const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
const BASE_URL = isLocal
  ? "http://localhost:8080/api"
  : "https://apnews.onrender.com/api";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem("ap13_token"));
  const [loading, setLoading] = useState(true);

  // Validate stored token on boot
  useEffect(() => {
    const stored = localStorage.getItem("ap13_token");
    const storedUser = localStorage.getItem("ap13_user");
    if (stored && storedUser) {
      try {
        setToken(stored);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Invalid credentials");
    }

    const data = await res.json();
    // Expected: { token: "jwt...", user: { id, username, role } }
    localStorage.setItem("ap13_token", data.token);
    localStorage.setItem("ap13_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ap13_token");
    localStorage.removeItem("ap13_user");
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}