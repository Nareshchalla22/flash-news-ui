import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

const apiClient = axios.create({
  baseURL: isLocal
    ? 'http://localhost:8080/api'
    : 'https://apnews.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── REQUEST INTERCEPTOR: attach JWT token automatically ─────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ap13_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR: handle 401 / 403 globally ────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem('ap13_token');
      localStorage.removeItem('ap13_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      // Authenticated but not authorized
      window.location.href = '/unauthorized';
    }

    console.error('--- API ERROR LOG ---');
    console.error('Status:', status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return Promise.reject(error);
  }
);

// ─── AUTH SERVICE ─────────────────────────────────────────────────────────────
export const authService = {
  login:    (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData)    => apiClient.post('/auth/register', userData),
  me:       ()            => apiClient.get('/auth/me'),
};

// ─── CATEGORY NEWS ────────────────────────────────────────────────────────────
export const newsService = {
  getCategoryNews: (category)         => apiClient.get(`/${category}`),
  getSingleNews:   (category, id)     => apiClient.get(`/${category}/${id}`),
  postNews:        (category, data)   => apiClient.post(`/${category}`, data),
  updateNews:      (category, id, data) => apiClient.put(`/${category}/${id}`, data),
  deleteNews:      (category, id)     => apiClient.delete(`/${category}/${id}`),
};

// ─── TICKER ───────────────────────────────────────────────────────────────────
export const tickerService = {
  getAll:  ()              => apiClient.get('/all'),
  create:  (payload)       => apiClient.post('/create', payload),
  update:  (id, payload)   => apiClient.put(`/update/${id}`, payload),
  delete:  (id)            => apiClient.delete(`/delete/${id}`),
};

// ─── SYSTEM ───────────────────────────────────────────────────────────────────
export const systemService = {
  getLiveTv:    () => apiClient.get('/livetv'),
  getNavigation:() => apiClient.get('/categories'),
  getPressPass: () => apiClient.get('/press-pass'),
};

export default apiClient;