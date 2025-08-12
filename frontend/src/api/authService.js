/*import axios from 'axios';

// Базові URL-адреси для різних контролерів
const AUTH_API_URL = 'http://localhost:8080/api/v1/auth';
const USERS_API_URL = 'http://localhost:8080/api/v1/users';

const register = async (email, password) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, {
    email,
    password,
  });
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, {
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const updateUser = async (userId, userData, token) => {
  const response = await axios.put(`${USERS_API_URL}/${userId}/me`, userData, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateUser,
};

export default authService;*/
import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/api/v1/auth';

const register = async (userData) => {
  console.log('Mocking registration...', userData);
  // Замість реального запиту повертаємо моковані дані
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000) + 1,
        email: userData.email,
        username: userData.username,
        token: 'mock-jwt-token-' + Math.random(),
        role: 'USER',
      });
    }, 1000);
  });
};

const login = async (userData) => {
  console.log('Mocking login...', userData);
  // Замість реального запиту повертаємо моковані дані
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        email: userData.email,
        username: 'testuser',
        token: 'mock-jwt-token',
        role: 'USER',
      });
    }, 1000);
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;