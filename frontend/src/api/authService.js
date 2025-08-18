import axios from 'axios';

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

export default authService;
