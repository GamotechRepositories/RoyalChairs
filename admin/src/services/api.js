import axios from 'axios';

let rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
if (!rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

const API_BASE_URL = rawBase;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Admin JWT Token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('royal_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
