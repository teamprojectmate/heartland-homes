import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/auth';
const USERS_API_URL = 'http://localhost:8080/users';

// ✅ Реєстрація
const register = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/registration`, userData);
  return response.data;
};

// ✅ Логін
const login = async (email, password) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, { email, password });

  if (response.data?.token) {
    // ⚡ Зберігаємо уніфіковано під 'auth'
    localStorage.setItem('auth', JSON.stringify({ token: response.data.token }));
  }

  return response.data;
};

// ✅ Вихід
const logout = () => {
  localStorage.removeItem('auth');
};

// ✅ Профіль
const getProfile = async (token) => {
  const response = await axios.get(`${USERS_API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ✅ Оновлення профілю
const updateUser = async (userData, token) => {
  const response = await axios.put(`${USERS_API_URL}/me`, userData, {
    headers: { Authorization: `Bearer ${token}` }
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
