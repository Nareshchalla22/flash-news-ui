import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://apnews.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('--- API ERROR LOG ---');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return Promise.reject(error);
  }
);

// --- CATEGORY ---
// --- CATEGORY ---
export const newsService = {
  getCategoryNews: (category) => apiClient.get(`${category}`),
  getSingleNews: (category, id) => apiClient.get(`${category}/${id}`),
  postNews: (category, data) => apiClient.post(`${category}`, data),
  updateNews: (category, id, data) => apiClient.put(`${category}/${id}`, data),
};

// --- TICKER ---
export const tickerService = {
  // Notice we removed the leading '/' because it's handled by baseURL
  getAll: () => apiClient.get('api/all'),
  create: (payload) => apiClient.post('api/create', payload),
  update: (id, payload) => apiClient.put(`api/update/${id}`, payload),
};

// --- SYSTEM ---
export const systemService = {
  getLiveTv: () => apiClient.get('livetv'),
  getNavigation: () => apiClient.get('categories'),
  getPressPass: () => apiClient.get('press-pass'),
};