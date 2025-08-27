// src/api/axios.js
import axios from 'axios';
import qs from 'qs';
import store from '../store/store';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: (params) => {
    // Вмикаємо опцію allowDots, щоб серіалізувати порожні об'єкти.
    return qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
  }
});

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
