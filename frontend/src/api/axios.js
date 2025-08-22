import axios from 'axios';
import store from '../store/store';

const instance = axios.create({
  baseURL: 'http://localhost:8080'
});

// додаємо токен з redux у headers
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
