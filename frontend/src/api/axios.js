import axios from 'axios';
import qs from 'qs'; // 👉 потрібно встановити: npm install qs
import store from '../store/store';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
  // => type=HOUSE&type=APARTMENT&size=1
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
