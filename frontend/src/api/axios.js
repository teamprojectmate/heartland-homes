// src/api/axios.js
import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: 'repeat', allowDots: true })
});

const getAuthData = () => {
  try {
    return JSON.parse(localStorage.getItem('auth')) || null;
  } catch (error) {
    console.error('Помилка при парсингу токена з localStorage:', error);
    return null;
  }
};

// 🔹 додаємо токен у кожен запит
instance.interceptors.request.use((config) => {
  const auth = getAuthData();
  const token = auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 обробка помилок
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth');
      localStorage.removeItem('userProfile');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default instance;
