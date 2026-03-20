import api from '../axios';

const register = async (userData: Record<string, unknown>) => {
	const response = await api.post('/auth/registration', userData);
	return response.data;
};

const login = async (userData: { email: string; password: string }) => {
	const response = await api.post('/auth/login', userData);
	return { token: response.data.token as string };
};

const logout = () => {
	sessionStorage.removeItem('auth');
	sessionStorage.removeItem('userProfile');
};

const getProfile = async () => {
	const response = await api.get('/users/me');
	return response.data;
};

const authService = { register, login, logout, getProfile };
export default authService;
