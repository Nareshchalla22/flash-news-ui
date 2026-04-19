import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- 1. CATEGORY NEWS SERVICE ---
export const newsService = {
  // Fetch news for any category (global, national, sports, etc.)
  getCategoryNews: (category) => apiClient.get(`/${category}`),
  
  // Single item operations
  getSingleNews: (category, id) => apiClient.get(`/${category}/${id}`),
  postNews: (category, data) => apiClient.post(`/${category}`, data),
  updateNews: (category, id, data) => apiClient.put(`/${category}/${id}`, data),
};

// --- 2. TICKER & BREAKING NEWS SERVICE ---
export const tickerService = {
  // Matches @GetMapping("/all")
  getAll: () => apiClient.get('/all'),
   getTicker:() => apiClient.get('/all'),
  
  // Matches @PostMapping("/ticker")
  create: (data) => apiClient.post('/create', data),
  
  // Matches @PutMapping("/update/{id}")
  update: (id, data) => apiClient.put(`/update/${id}`, data),
};

// --- 3. MEDIA & SYSTEM SERVICE ---
export const systemService = {
  getLiveTv: () => apiClient.get('/livetv'),
  getNavigation: () => apiClient.get('/categories'),
  getPressPass: () => apiClient.get('/press-pass'),
};