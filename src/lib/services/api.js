import axios from 'axios';
import { goto } from '$app/navigation';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - for adding custom headers if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - for handling errors globally
api.interceptors.response.use(
(response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const res = await api.get('/authentication/refresh', {
          withCredentials: true,
        }); 

        if (res.data?.accessToken) {
          localStorage.setItem('accessToken', res.data.accessToken);
        }
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          goto('/auth');
        }
        return Promise.reject(refreshError);
      }
    }

  api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // For 403 errors (forbidden), redirect to unauthorized page
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        goto('/unauthorized');
      }
    }

    return Promise.reject(error);
  }
);

export default api;