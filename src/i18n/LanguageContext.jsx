import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, DEFAULT_LANG } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("ap13_lang");
      return saved && translations[saved] ? saved : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });

  const setLang = useCallback((code) => {
    if (!translations[code]) return;
    setLangState(code);
    try { localStorage.setItem("ap13_lang", code); } catch {
      // ignore localStorage errors
    }
    document.documentElement.lang = code;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // t("nav.home") — dot-notation lookup with fallback to English
  const t = useCallback((key, fallback = "") => {
    const keys = key.split(".");
    let node = translations[lang];
    for (const k of keys) {
      if (node == null) break;
      node = node[k];
    }
    if (node && typeof node === "string") return node;
    // fallback to English
    let enNode = translations["en"];
    for (const k of keys) {
      if (enNode == null) break;
      enNode = enNode[k];
    }
    return enNode || fallback || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}