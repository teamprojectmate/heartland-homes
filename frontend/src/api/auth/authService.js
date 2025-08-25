import axios from 'axios';

// Базові URL-адреси для різних контролерів
const AUTH_API_URL = 'http://localhost:8080/auth';
const USERS_API_URL = 'http://localhost:8080/users';

const register = async (userData) => {
  // ⚡️ правильний endpoint з документації — /auth/registration
  const response = await axios.post(`${AUTH_API_URL}/registration`, userData);
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, {
    email,
    password
  });

  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getProfile = async (token) => {
  const response = await axios.get(`${USERS_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateUser = async (userData, token) => {
  // ⚡️ у документації є PUT /users/me
  const response = await axios.put(`${USERS_API_URL}/me`, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateUser
};

export default authService;
