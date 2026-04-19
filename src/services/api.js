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
// --- 2. TICKER & BREAKING NEWS SERVICE ---
export const tickerService = {
  // Good practice: use a single method name for fetching all
  getAll: () => apiClient.get('/all'),
  
  // Ensure your backend @PostMapping is actually "/create" 
  // Often it's just "/" if the Controller has @RequestMapping("/ticker")
  create: (data) => apiClient.post('/create', data),
  
  // Verify if your backend uses @PathVariable {id}
  update: (id, data) => apiClient.put(`/update/${id}`, data),
};

// --- 3. MEDIA & SYSTEM SERVICE ---
export const systemService = {
  // If your backend handles images/videos, ensure these endpoints 
  // match your @RestController @GetMapping paths exactly.
  getLiveTv: () => apiClient.get('/livetv'),
  getNavigation: () => apiClient.get('/categories'),
  getPressPass: () => apiClient.get('/press-pass'),
};
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      alert("AP13 Satellite Uplink is starting up. Please refresh in 30 seconds.");
    }
    return Promise.reject(error);
  }
);