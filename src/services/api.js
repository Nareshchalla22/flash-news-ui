import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- CATEGORY ---
export const newsService = {
  getCategoryNews: (category) => apiClient.get(`/${category}`),
  getSingleNews: (category, id) => apiClient.get(`/${category}/${id}`),
  postNews: (category, data) => apiClient.post(`/${category}`, data),
  updateNews: (category, id, data) => apiClient.put(`/${category}/${id}`, data),
};

// --- TICKER ---
export const tickerService = {
  getAll: () => apiClient.get('/ticker/all'),
  create: (data) => apiClient.post('/ticker/create', data),
  update: (id, data) => apiClient.put(`/ticker/update/${id}`, data),
};

// --- SYSTEM ---
export const systemService = {
  getLiveTv: () => apiClient.get('/livetv'),
  getNavigation: () => apiClient.get('/categories'),
  getPressPass: () => apiClient.get('/press-pass'),
};