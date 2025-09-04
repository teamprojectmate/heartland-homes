// src/api/auth/authService.js
import api from '../axios';

// ✅ Реєстрація
const register = async (userData) => {
  const response = await api.post('/auth/registration', userData);
  return response.data;
};

// ✅ Логін
const login = async (userData) => {
  console.log('📤 Надсилаю на бекенд /auth/login:', userData);
  const response = await api.post('/auth/login', userData);

  // очікуємо { token: "..." }
  const authData = { token: response.data.token };

  // 🔹 зберігаємо в localStorage
  localStorage.setItem('auth', JSON.stringify(authData));

  return authData;
};

// ✅ Вихід
const logout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('userProfile');
};

// ✅ Отримати профіль користувача
const getProfile = async () => {
  const stored = JSON.parse(localStorage.getItem('auth'));
  if (!stored?.token) throw new Error('Нема токена');

  const response = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${stored.token}`
    }
  });

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile
};

export default authService;
