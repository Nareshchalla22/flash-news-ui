import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

const apiClient = axios.create({
  baseURL: isLocal
    ? 'http://localhost:8080/api'
    : 'http://18.61.229.102/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('ap13_token');
      localStorage.removeItem('ap13_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    if (status === 403) {
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login:    (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData)    => apiClient.post('/auth/register', userData),
  me:       ()            => apiClient.get('/auth/me'),
};

export const newsService = {
  getCategoryNews:  (category)           => apiClient.get(`/${category}`),
  getSingleNews:    (category, id)       => apiClient.get(`/${category}/${id}`),
  postNews:         (category, data)     => apiClient.post(`/${category}`, data),
  updateNews:       (category, id, data) => apiClient.put(`/${category}/${id}`, data),
  deleteNews:       (category, id)       => apiClient.delete(`/${category}/${id}`),
};

export const tickerService = {
  getAll:    ()             => apiClient.get('/all'),
  getActive: ()             => apiClient.get('/all/active'),
  create:    (payload)      => apiClient.post('/create', payload),
  update:    (id, payload)  => apiClient.put(`/update/${id}`, payload),
  toggle:    (id)           => apiClient.patch(`/ticker/${id}/toggle`),
  delete:    (id)           => apiClient.delete(`/ticker/${id}`),
};

export const mediaService = {
  upload:       (formData) => apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadBase64: (data)     => apiClient.post('/media/upload-base64', data),
  delete:       (url)      => apiClient.delete('/media/delete', { data: { url } }),
  health:       ()         => apiClient.get('/media/health'),
};

export const reporterService = {
  submit:      (data)   => apiClient.post('/reporter-application', data),
  getAll:      ()       => apiClient.get('/reporter-application'),
  getById:     (id)     => apiClient.get(`/reporter-application/${id}`),
  getByStatus: (status) => apiClient.get(`/reporter-application/status/${status}`),
  approve:     (id, note) => apiClient.put(`/reporter-application/${id}/approve`, { note }),
  reject:      (id, note) => apiClient.put(`/reporter-application/${id}/reject`, { note }),
  delete:      (id)     => apiClient.delete(`/reporter-application/${id}`),
};

export default apiClient;