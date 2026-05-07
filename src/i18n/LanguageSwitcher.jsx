import { useState, useRef, useEffect } from "react";
import { useLang } from "../i18n/LanguageContext";
import { LANGUAGES } from "../i18n/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);
  const current           = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 200, flexShrink: 0 }}>

      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Change Language"
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         5,
          padding:     "6px 10px",
          borderRadius: 8,
          background:  open ? "#1e293b" : "#0f172a",
          border:      `1px solid ${open ? "#334155" : "#1e293b"}`,
          cursor:      "pointer",
          transition:  "all 0.2s",
        }}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>{current.flag}</span>
        <span style={{
          fontSize: 11, fontWeight: 800, color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
          maxWidth: 54, overflow: "hidden",
          whiteSpace: "nowrap", textOverflow: "ellipsis",
          letterSpacing: "0.02em",
        }}>
          {current.nativeLabel}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="#475569"
          strokeWidth="2.5" width="11" height="11"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <>
          <style>{`
            @keyframes langDrop {
              from { opacity:0; transform:translateY(-6px) scale(0.97); }
              to   { opacity:1; transform:translateY(0) scale(1); }
            }
          `}</style>
          <div style={{
            position:     "absolute",
            top:          "calc(100% + 8px)",
            right:        0,
            minWidth:     170,
            background:   "#0f172a",
            border:       "1px solid #1e293b",
            borderRadius: 14,
            boxShadow:    "0 20px 60px rgba(0,0,0,0.6)",
            overflow:     "hidden",
            animation:    "langDrop 0.15s ease",
          }}>
            {/* Header label */}
            <div style={{
              padding:      "10px 14px 8px",
              borderBottom: "1px solid #1e293b",
            }}>
              <p style={{
                fontSize: 9, fontWeight: 800, color: "#334155",
                textTransform: "uppercase", letterSpacing: "0.18em",
                margin: 0, fontFamily: "system-ui, sans-serif",
              }}>
                Select Language
              </p>
            </div>

            {/* Language options */}
            {LANGUAGES.map(language => {
              const isActive = language.code === lang;
              return (
                <button
                  key={language.code}
                  onClick={() => { setLang(language.code); setOpen(false); }}
                  style={{
                    width:       "100%",
                    display:     "flex",
                    alignItems:  "center",
                    gap:         10,
                    padding:     "11px 14px",
                    background:  isActive ? "rgba(29,185,84,0.07)" : "none",
                    border:      "none",
                    borderLeft:  `3px solid ${isActive ? "#1DB954" : "transparent"}`,
                    cursor:      "pointer",
                    transition:  "background 0.15s",
                    textAlign:   "left",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#1e293b"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                    {language.flag}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 800,
                      color: isActive ? "#1DB954" : "#e2e8f0",
                      margin: 0, lineHeight: 1.2,
                      fontFamily: "system-ui, sans-serif",
                    }}>
                      {language.nativeLabel}
                    </p>
                    <p style={{
                      fontSize: 10, fontWeight: 500, color: "#475569",
                      margin: "2px 0 0", fontFamily: "system-ui, sans-serif",
                    }}>
                      {language.label}
                    </p>
                  </div>
                  {isActive && (
                    <span style={{ fontSize: 14, color: "#1DB954", fontWeight: 900, flexShrink: 0 }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}