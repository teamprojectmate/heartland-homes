import type { User } from '../../types';
import api from '../axios';

type AuthTokens = { token: string; refreshToken: string };

const register = async (userData: Record<string, unknown>): Promise<User> => {
	const response = await api.post<User>('/auth/registration', userData);
	return response.data;
};

const login = async (userData: { email: string; password: string }): Promise<AuthTokens> => {
	const response = await api.post<AuthTokens>('/auth/login', userData);
	return { token: response.data.token, refreshToken: response.data.refreshToken };
};

const logout = async () => {
	try {
		await api.post('/auth/logout');
	} catch {
		/* logout endpoint may fail if token expired — ignore */
	}
	sessionStorage.removeItem('auth');
	sessionStorage.removeItem('userProfile');
};

const getProfile = async (): Promise<User> => {
	const response = await api.get<User>('/users/me');
	return response.data;
};

const authService = { register, login, logout, getProfile };
export default authService;
