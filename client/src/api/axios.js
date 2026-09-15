import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token if present in sessionStorage or localStorage
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('blood_bank_token') || localStorage.getItem('blood_bank_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
