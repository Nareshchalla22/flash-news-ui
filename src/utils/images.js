// Multi-image helpers.
// Backend stores:  imageUrl  = cover (first) image   (legacy, still used by cards/OG tags)
//                  imageUrls = JSON array string of ALL images
export function parseImages(item) {
  if (!item) return [];
  const raw = item.imageUrls;
  if (raw) {
    try {
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(arr)) {
        const clean = arr.filter(u => typeof u === 'string' && u.trim());
        if (clean.length) return clean;
      }
    } catch { /* fall through to legacy */ }
  }
  const single = item.imageUrl || item.image;
  return single ? [single] : [];
}

export const serializeImages = (arr) => (arr && arr.length ? JSON.stringify(arr) : '');

// Spread into a form object: { ...formWithImages(form, urls) }
export const withImages = (form, urls) => ({
  ...form,
  imageUrl: urls[0] || '',
  imageUrls: serializeImages(urls),
});
