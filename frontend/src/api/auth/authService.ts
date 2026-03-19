import api from '../axios';

const register = async (userData) => {
	const response = await api.post('/auth/registration', userData);
	return response.data;
};

const login = async (userData) => {
	const response = await api.post('/auth/login', userData);
	return { token: response.data.token };
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
