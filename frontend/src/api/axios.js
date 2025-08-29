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
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData?.token;
  } catch (error) {
    console.error('Помилка при парсингу токена з localStorage:', error);
    return null;
  }
};

instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // ✅ Змінено: отримуємо токен з localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
