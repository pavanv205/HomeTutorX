import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor (e.g., to attach auth token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Deployment diagnostics logging for requests
    console.log(`[API REQUEST] Configured Base URL: ${config.baseURL || 'Relative (/api)'}`);
    console.log(`[API REQUEST] Full Destination URL: ${config.baseURL || ''}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Response interceptor (e.g., to handle token refresh or global errors)
api.interceptors.response.use(
  (response) => {
    // Deployment diagnostics logging for successful responses
    console.log(`[API RESPONSE] URL: ${response.config.url} | Status: ${response.status}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    // Deployment diagnostics logging for errors
    console.error(`[API RESPONSE ERROR] URL: ${error.config?.url} | Status: ${status || 'Network Error'} | Error:`, message);
    
    const customError = {
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      status: error.response?.status,
      original: error,
    };
    return Promise.reject(customError);
  }
);

export default api;
