import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
  }
});

// 🔹 Функція для отримання токена з localStorage
const getAuthToken = () => {
  try {
    // ✅ Виправлено: використовуємо правильний ключ 'auth'
    const authData = JSON.parse(localStorage.getItem('auth'));
    return authData?.token;
  } catch (error) {
    console.error('Помилка при парсингу токена з localStorage:', error);
    return null;
  }
};

instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
