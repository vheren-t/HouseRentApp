import axios from 'axios';

export const BASE = 'http://localhost:8000';
const api = axios.create({ baseURL: `${BASE}/api` });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const errMsg = (e) => e.response?.data?.message || e.message;
export const rupiah = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
export default api;

// Foto bisa berupa nama file upload atau URL penuh (data contoh)
export const imgUrl = (n) => (n ? (/^https?:/.test(n) ? n : `${BASE}/uploads/${n}`) : null);
