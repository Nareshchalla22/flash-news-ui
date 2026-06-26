// ─── S3 base URL ─────────────────────────────────────────────────────────────
const S3_BASE = 'https://ap13-news-media.s3.ap-south-2.amazonaws.com';

// ─── Fix image URL ────────────────────────────────────────────────────────────
// If imageUrl is just a number like "16641" or a path like "/news/img.jpg"
// prepend the S3 base URL so the browser can load it.
export function fixImageUrl(url) {
  if (!url) return '';
  const s = String(url).trim();
  if (!s) return '';
  // Already a full URL — return as-is
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  // Base64 data URL — return as-is
  if (s.startsWith('data:')) return s;
  // Just a number (S3 object key) or relative path — prepend S3 base
  const path = s.startsWith('/') ? s : `/${s}`;
  return `${S3_BASE}${path}`;
}

// ─── Safe array extractor ─────────────────────────────────────────────────────
export function extractNewsArray(data) {
  if (!data) return [];
  if (Array.isArray(data))          return data;
  if (Array.isArray(data.content))  return data.content;
  if (Array.isArray(data.data))     return data.data;
  if (Array.isArray(data.items))    return data.items;
  if (Array.isArray(data.results))  return data.results;
  return [];
}

// ─── Fix all image URLs in a news item ───────────────────────────────────────
export function fixNewsItem(item) {
  if (!item) return item;
  return {
    ...item,
    imageUrl: fixImageUrl(item.imageUrl || item.image || ''),
  };
}

// ─── Fetch category news safely ───────────────────────────────────────────────
export async function fetchCategoryNews(newsService, category) {
  try {
    const res  = await newsService.getCategoryNews(category);
    const list = extractNewsArray(res.data);
    return list.map(fixNewsItem);
  } catch (err) {
    console.error(`Failed to fetch ${category}:`, err?.response?.status, err?.message);
    return [];
  }
}