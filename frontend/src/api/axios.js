// src/api/axios.js
import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
  }
});

// 🔹 Функція для отримання токена з localStorage
const getAuthData = () => {
  try {
    return JSON.parse(localStorage.getItem('auth')) || null;
  } catch (error) {
    console.error('Помилка при парсингу токена з localStorage:', error);
    return null;
  }
};

// 🔹 Додаємо токен в кожен запит
instance.interceptors.request.use(
  (config) => {
    const auth = getAuthData();
    const token = auth?.token; // ✅ твій бекенд повертає саме token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Обробка помилок (без refresh flow)
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // токен недійсний → чистимо локалку і відправляємо на логін
      localStorage.removeItem('auth');
      localStorage.removeItem('userProfile');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export default instance;
