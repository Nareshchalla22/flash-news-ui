import axios from 'axios';

// ─── BASE URL ─────────────────────────────────────────────────────────────────
const BASE_URL = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : 'https://api.ap13news.in/api';

// ─── AXIOS INSTANCE ───────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Attach JWT on every request ──────────────────────────────────────────────
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('ap13_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

// ── Handle 401/403 globally ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    if (status === 401) {
      localStorage.removeItem('ap13_token');
      localStorage.removeItem('ap13_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authService = {
  login:           (data)     => apiClient.post('/auth/login', data),
  register:        (data)     => apiClient.post('/auth/register', data),
  me:              ()         => apiClient.get('/auth/me'),
  listUsers:       ()         => apiClient.get('/auth/users'),
  toggleUser:      (id)       => apiClient.patch(`/auth/users/${id}/toggle`),
  activateReporter:(id, data) => apiClient.post(`/auth/activate-reporter/${id}`, data),
};

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export const newsService = {
  getCategoryNews: (category)            => apiClient.get(`/${category}`),
  getSingleNews:   (category, id)        => apiClient.get(`/${category}/${id}`),
  postNews:        (category, data)      => apiClient.post(`/${category}`, data),
  updateNews:      (category, id, data)  => apiClient.put(`/${category}/${id}`, data),
  deleteNews:      (category, id)        => apiClient.delete(`/${category}/${id}`),
};

// ─── TICKER ───────────────────────────────────────────────────────────────────
export const tickerService = {
  getAll:    ()           => apiClient.get('/all'),
  getActive: ()           => apiClient.get('/all/active'),
  create:    (data)       => apiClient.post('/create', data),
  update:    (id, data)   => apiClient.put(`/update/${id}`, data),
  toggle:    (id)         => apiClient.patch(`/ticker/${id}/toggle`),
  delete:    (id)         => apiClient.delete(`/ticker/${id}`),
};

// ─── MEDIA UPLOAD ─────────────────────────────────────────────────────────────
export const mediaService = {
  upload: (formData) => apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (url) => apiClient.delete('/media/delete', { data: { url } }),
};

// ─── REPORTER APPLICATIONS ────────────────────────────────────────────────────
export const reporterService = {
  submit:      (data)       => apiClient.post('/reporter-application', data),
  getAll:      ()           => apiClient.get('/reporter-application'),
  getByStatus: (status)     => apiClient.get(`/reporter-application/status/${status}`),
  approve:     (id, note)   => apiClient.put(`/reporter-application/${id}/approve`, { note }),
  reject:      (id, note)   => apiClient.put(`/reporter-application/${id}/reject`, { note }),
  delete:      (id)         => apiClient.delete(`/reporter-application/${id}`),
};

// ─── ADS ──────────────────────────────────────────────────────────────────────
export const adsService = {
  getAll:          ()        => apiClient.get('/ads'),
  getActive:       ()        => apiClient.get('/ads/active'),
  getByPlacement:  (p)       => apiClient.get(`/ads/placement/${p}`),
  getByType:       (t)       => apiClient.get(`/ads/type/${t}`),
  getStats:        ()        => apiClient.get('/ads/stats'),
  create:          (data)    => apiClient.post('/ads', data),
  update:          (id,data) => apiClient.put(`/ads/${id}`, data),
  toggle:          (id)      => apiClient.patch(`/ads/${id}/toggle`),
  delete:          (id)      => apiClient.delete(`/ads/${id}`),
  trackImpression: (id)      => apiClient.post(`/ads/${id}/impression`),
  trackClick:      (id)      => apiClient.post(`/ads/${id}/click`),
};

export default apiClient;