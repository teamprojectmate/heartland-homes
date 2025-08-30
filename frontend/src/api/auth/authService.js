// src/api/auth/authService.js
import api from '../axios'; // Використовуємо наш налаштований екземпляр

// ✅ Реєстрація
const register = async (userData) => {
  const response = await api.post('/auth/registration', userData);
  return response.data;
};

// ✅ Логін
const login = async (userData) => {
  console.log('📤 Надсилаю на бекенд /auth/login:', userData); // 👈
  const response = await api.post('/auth/login', userData);
  return response.data;
};

// ❌ Прибрали всю логіку з localStorage.
// Цим займається Redux-санк.

// ✅ Вихід
const logout = () => {
  // ❌ Прибрали всю логіку з localStorage.
  // Цим займається Redux-санк.
};

const authService = {
  register,
  login,
  logout
};

export default authService;
