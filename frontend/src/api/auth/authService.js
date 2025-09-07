// src/api/auth/authService.js
import api from '../axios';

const register = async (userData) => {
  const response = await api.post('/auth/registration', userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  const authData = { token: response.data.token };
  localStorage.setItem('auth', JSON.stringify(authData));
  return authData;
};

const logout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('userProfile');
};

const getProfile = async () => {
  const stored = JSON.parse(localStorage.getItem('auth'));
  if (!stored?.token) throw new Error('Нема токена');
  const response = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${stored.token}` }
  });
  return response.data;
};

const authService = { register, login, logout, getProfile };
export default authService;