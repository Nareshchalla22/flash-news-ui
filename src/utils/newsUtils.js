// ─── Safe array extractor ─────────────────────────────────────────────────────
// Handles:
//   - Plain array:          [...]
//   - Spring Page object:   { content: [...], totalPages: N }
//   - Wrapped:              { data: [...] }
//   - Null / undefined:     returns []

export function extractNewsArray(responseData) {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData.content)) return responseData.content;
  if (Array.isArray(responseData.data))    return responseData.data;
  if (Array.isArray(responseData.items))   return responseData.items;
  if (Array.isArray(responseData.results)) return responseData.results;
  return [];
}

// ─── Safe category news fetch ─────────────────────────────────────────────────
// Use this in every category page instead of raw res.data
export async function fetchCategoryNews(newsService, category) {
  try {
    const res = await newsService.getCategoryNews(category);
    return extractNewsArray(res.data);
  } catch (err) {
    console.error(`Failed to fetch ${category}:`, err?.response?.status, err?.message);
    return [];
  }
}