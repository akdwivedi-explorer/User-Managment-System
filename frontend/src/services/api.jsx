import axios from 'axios';

// 1. Point to your Backend Port (3000)
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Automatically attach the Token to every request
api.interceptors.request.use(
  (config) => {
    // Check if user is logged in
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

// 3. API Calls
export const authAPI = {
  // Matches POST http://localhost:3000/api/auth/login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Matches POST http://localhost:3000/api/auth/signup
  // Expected data: { name, email, password }
  signup: (data) => api.post('/auth/signup', data),
  
  // Matches GET http://localhost:3000/api/users/profile
  getProfile: () => api.get('/users/profile'),
  
  // Matches PUT http://localhost:3000/api/users/profile
  updateProfile: (data) => api.put('/users/profile', data),
};

export const adminAPI = {
  // Matches GET http://localhost:3000/api/admin/users?page=1&limit=10
  getUsers: (page = 1, limit = 10) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  
  // Matches PATCH http://localhost:3000/api/admin/users/:id/status
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
};

export default api;