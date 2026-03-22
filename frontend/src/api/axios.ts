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
			return null;
		}

		return auth.token;
	} catch {
		return null;
	}
};

const getRefreshToken = (): string | null => {
	try {
		const auth = JSON.parse(sessionStorage.getItem('auth') || 'null');
		return auth?.refreshToken ?? null;
	} catch {
		return null;
	}
};

const clearAuth = () => {
	sessionStorage.removeItem('auth');
	sessionStorage.removeItem('userProfile');
};

let isRefreshing = false;
let refreshQueue: Array<{
	resolve: (token: string) => void;
	reject: (err: unknown) => void;
}> = [];

const processQueue = (token: string | null, error: unknown = null) => {
	for (const { resolve, reject } of refreshQueue) {
		if (token) {
			resolve(token);
		} else {
			reject(error);
		}
	}
	refreshQueue = [];
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
	async (err) => {
		const originalRequest = err.config;
		const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

		if (err.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
			return Promise.reject(err);
		}

		const refreshToken = getRefreshToken();
		if (!refreshToken) {
			clearAuth();
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
			return Promise.reject(err);
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				refreshQueue.push({
					resolve: (token: string) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(instance(originalRequest));
					},
					reject,
				});
			});
		}

		isRefreshing = true;
		originalRequest._retry = true;

		try {
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
				refreshToken,
			});

			const { token: newToken, refreshToken: newRefreshToken } = response.data;

			const currentAuth = JSON.parse(sessionStorage.getItem('auth') || '{}');
			sessionStorage.setItem(
				'auth',
				JSON.stringify({ ...currentAuth, token: newToken, refreshToken: newRefreshToken }),
			);

			originalRequest.headers.Authorization = `Bearer ${newToken}`;
			processQueue(newToken);

			return instance(originalRequest);
		} catch (refreshError) {
			processQueue(null, refreshError);
			clearAuth();
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

export default instance;
