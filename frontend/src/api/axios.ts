import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import qs from 'qs';

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat', allowDots: true }),
});

const getAuthToken = (): string | null => {
	try {
		const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
		if (!auth?.token) return null;

		const decoded = jwtDecode(auth.token);
		if (decoded.exp && Date.now() >= decoded.exp * 1000) {
			sessionStorage.removeItem('auth');
			sessionStorage.removeItem('userProfile');
			return null;
		}

		return auth.token;
	} catch {
		return null;
	}
};

instance.interceptors.request.use((config) => {
	const token = getAuthToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

instance.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response?.status === 401) {
			const isAuthEndpoint = err.config?.url?.includes('/auth/');
			if (!isAuthEndpoint && window.location.pathname !== '/login') {
				sessionStorage.removeItem('auth');
				sessionStorage.removeItem('userProfile');
				window.location.href = '/login';
			}
		}
		return Promise.reject(err);
	},
);

export default instance;
