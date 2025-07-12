import axios from 'axios';

// Use environment variable for API URL with better error handling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for better reliability
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and network errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    // Handle network errors more gracefully
    if (!error.response) {
      // Network error or server not reachable
      const networkError = {
        message: 'Unable to connect to server. Please check your internet connection or try again later.',
        code: 'NETWORK_ERROR',
        status: 0
      };
      throw networkError;
    }
    
    // Only redirect to login for 401 errors on protected routes
    // Don't redirect if user is already on login/register pages
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = ['/login', '/register', '/forgot-password', '/verify-email', '/reset-password', '/'].includes(currentPath);
      
      if (!isAuthPage) {
        localStorage.removeItem('token');
        // Use navigate instead of direct window.location to avoid full page reload
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      const notFoundError = {
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND',
        status: 404
      };
      throw notFoundError;
    }
    
    if (error.response?.status >= 500) {
      const serverError = {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
        status: error.response.status
      };
      throw serverError;
    }
    
    throw error.response?.data || error;
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyEmail: (email, otp) => api.post('/auth/verify-email', { email, otp }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword }),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: () => api.post('/auth/refresh'),
};

export const resumeAPI = {
  getStats: () => api.get('/resumes/stats'),
  getResumes: () => api.get('/resumes'),
  getResume: (id) => api.get(`/resumes/${id}`),
  createResume: (data) => api.post('/resumes', data),
  updateResume: (id, data) => api.put(`/resumes/${id}`, data),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  saveResumeData: (data) => api.post('/resumes/save-data', data),
  getResumeData: () => api.get('/resumes/data'),
};

export default api;