import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor (attaches authorization token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handles token expiration and structures errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    // Evict expired or invalid token automatically
    if (status === 401) {
      localStorage.removeItem('token');
    }
    
    const customError = {
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      status: status,
      original: error,
    };
    return Promise.reject(customError);
  }
);

export default api;
