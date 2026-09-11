import axios from 'axios';

let rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
if (!rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

const api = axios.create({
  baseURL: rawBase,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;