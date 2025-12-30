import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),

  signup: (data) => api.post('/auth/signup', data),
  
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data) => api.put('/users/profile', data),
};

export const adminAPI = {
  getUsers: (page = 1, limit = 10) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
};

export default api;