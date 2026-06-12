// ─── useSEO.js ────────────────────────────────────────────────────────────────
// Injects Open Graph + Twitter Card meta tags dynamically.
// Call this in any page/category component to make WhatsApp/Telegram
// show the article image + title when a link is shared.
//
// Usage:
//   useSEO({ title, description, image, url })

import { useEffect } from 'react';

const DEFAULT_IMAGE = 'https://ap13news.in/logo.png'; // fallback OG image
const SITE_NAME     = 'AP13 News';
const BASE_URL      = 'https://ap13news.in';

function setMeta(property, content, isName = false) {
  if (!content) return;
  const attr = isName ? 'name' : 'property';
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO({ title, description, image, url, type = 'article' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const ogImage   = image || DEFAULT_IMAGE;
    const ogUrl     = url   || window.location.href;
    const ogDesc    = description || 'Latest breaking news from Andhra Pradesh & Telangana — AP13 News 24/7';

    // ── Document title ──
    document.title = fullTitle;

    // ── Open Graph (WhatsApp, Facebook, Telegram use these) ──
    setMeta('og:type',        type);
    setMeta('og:site_name',   SITE_NAME);
    setMeta('og:title',       fullTitle);
    setMeta('og:description', ogDesc);
    setMeta('og:image',       ogImage);
    setMeta('og:image:width',  '1200');
    setMeta('og:image:height', '630');
    setMeta('og:url',         ogUrl);
    setMeta('og:locale',      'te_IN');

    // ── Twitter Card ──
    setMeta('twitter:card',        'summary_large_image', true);
    setMeta('twitter:title',       fullTitle,             true);
    setMeta('twitter:description', ogDesc,                true);
    setMeta('twitter:image',       ogImage,               true);
    setMeta('twitter:site',        '@AP13News',           true);

    // ── Standard meta ──
    setMeta('description', ogDesc, true);

    // Cleanup on unmount — reset to defaults
    return () => {
      document.title = SITE_NAME;
      setMeta('og:title',       SITE_NAME);
      setMeta('og:description', 'Latest breaking news from Andhra Pradesh & Telangana');
      setMeta('og:image',       DEFAULT_IMAGE);
      setMeta('og:url',         BASE_URL);
    };
  }, [title, description, image, url, type]);
}

export default useSEO;