import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/ticker'; // Base URL for all news-related endpoints

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsService = {
  
  // 1. Fetch specific category news 
  // Changed from `/news/${category}` to `/${category}` to match your Controller
  getCategoryNews: (category) => apiClient.get(`/${category}`), // Cache-busting with timestamp

  // 2. Fetch a SINGLE news item by ID (Required for the Update Form)
  getSingleNews: (category, id) => apiClient.get(`/${category}/${id}`),

  // 3. Update an existing news item (The "Update Data" logic)
  updateNews: (category, id, data) => apiClient.put(`/${category}/${id}`, data),

  // 4. Post new news (For your future Admin post form)
  postNews: (category, data) => apiClient.post(`/${category}`, data),

  // --- Other Services ---
  getNavigation: () => apiClient.get('/categories'),

  getLiveTv: () => apiClient.get('/livetv'),
  getPressPass: () => apiClient.get('/press-pass'),

 // Fetch only active ones for display
  getTicker: () => apiClient.get('/all'), 
  // Fetch all for the Admin Manager
  getAllTickers: () => apiClient.get('/ticker/all'), 
  // POST new message
  createTicker: (data) => apiClient.post('/ticker', data),
  // UPDATE existing message
  updateTicker: (id, data) => apiClient.put(`/ticker/update/${id}`, data)
};
