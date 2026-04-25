import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

// ── Backend base URL ───────────────────────────────────────────────────────────
// Change this to your EC2 Elastic IP or domain once deployed on AWS
export const BASE_URL = isLocal
  ? 'http://localhost:8080/api'
  : 'https://apnews.onrender.com/api';   // ← replace with http://<EC2-IP>:8080/api

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 25000, // 25 seconds — handles Render/EC2 cold starts
});

// ── REQUEST: attach JWT automatically ─────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ap13_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE: handle 401 / 403 globally ───────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('ap13_token');
      localStorage.removeItem('ap13_user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }

    if (status === 403) window.location.href = '/unauthorized';

    console.error('API Error:', status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ── AUTH ───────────────────────────────────────────────────────────────────────
export const authService = {
  login:    (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData)    => apiClient.post('/auth/register', userData),
  me:       ()            => apiClient.get('/auth/me'),
};

// ── S3 MEDIA UPLOAD ────────────────────────────────────────────────────────────
export const mediaService = {
  // Upload a File object (from <input type="file">)
  uploadFile: (file, folder = 'news') => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return apiClient.post('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Upload a Base64 string (from FileReader)
  uploadBase64: (base64, folder = 'news') =>
    apiClient.post('/media/upload-base64', { image: base64, folder }),

  // Delete by S3 URL
  deleteFile: (url) =>
    apiClient.delete('/media/delete', { data: { url } }),

  // Health check
  health: () => apiClient.get('/media/health'),
};

// ── NEWS CATEGORIES ────────────────────────────────────────────────────────────
export const newsService = {
  getCategoryNews: (category)           => apiClient.get(`/${category}`),
  getSingleNews:   (category, id)       => apiClient.get(`/${category}/${id}`),
  postNews:        (category, data)     => apiClient.post(`/${category}`, data),
  updateNews:      (category, id, data) => apiClient.put(`/${category}/${id}`, data),
  deleteNews:      (category, id)       => apiClient.delete(`/${category}/${id}`),
};

// ── TICKER ─────────────────────────────────────────────────────────────────────
export const tickerService = {
  getAll:  ()            => apiClient.get('/all'),
  create:  (payload)     => apiClient.post('/create', payload),
  update:  (id, payload) => apiClient.put(`/update/${id}`, payload),
  delete:  (id)          => apiClient.delete(`/delete/${id}`),
};

// ── PRESS PASS ─────────────────────────────────────────────────────────────────
export const pressPassService = {
  getAll:   ()         => apiClient.get('/press-pass'),
  getById:  (id)       => apiClient.get(`/press-pass/${id}`),
  create:   (data)     => apiClient.post('/press-pass', data),
  update:   (id, data) => apiClient.put(`/press-pass/${id}`, data),
  delete:   (id)       => apiClient.delete(`/press-pass/${id}`),
};

// ── REPORTER APPLICATIONS ──────────────────────────────────────────────────────
export const applicationService = {
  submit:      (data)        => apiClient.post('/reporter-application', data),
  getAll:      ()            => apiClient.get('/reporter-application'),
  getById:     (id)          => apiClient.get(`/reporter-application/${id}`),
  getByStatus: (status)      => apiClient.get(`/reporter-application/status/${status}`),
  approve:     (id, note)    => apiClient.put(`/reporter-application/${id}/approve`, { note }),
  reject:      (id, note)    => apiClient.put(`/reporter-application/${id}/reject`, { note }),
  delete:      (id)          => apiClient.delete(`/reporter-application/${id}`),
};

// ── SYSTEM ─────────────────────────────────────────────────────────────────────
export const systemService = {
  getLiveTv:     () => apiClient.get('/livetv'),
  getNavigation: () => apiClient.get('/categories'),
  getPressPass:  () => apiClient.get('/press-pass'),
};

export default apiClient;