import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@inbot:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      localStorage.removeItem('@inbot:token');
      localStorage.removeItem('@inbot:user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Mapping backend error codes to user-friendly messages (ADR 1004)
    const message = data?.message || 'An unexpected error occurred';
    
    // We don't toast validation errors (422) because they are handled by the form
    if (status !== 422) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
