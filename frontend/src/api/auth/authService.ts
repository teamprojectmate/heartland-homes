import type { User } from '../../types';
import api from '../axios';

const register = async (userData: Record<string, unknown>): Promise<User> => {
	const response = await api.post<User>('/auth/registration', userData);
	return response.data;
};

const login = async (userData: { email: string; password: string }): Promise<{ token: string }> => {
	const response = await api.post<{ token: string }>('/auth/login', userData);
	return { token: response.data.token };
};

const logout = () => {
	sessionStorage.removeItem('auth');
	sessionStorage.removeItem('userProfile');
};

const getProfile = async (): Promise<User> => {
	const response = await api.get<User>('/users/me');
	return response.data;
};

const authService = { register, login, logout, getProfile };
export default authService;
