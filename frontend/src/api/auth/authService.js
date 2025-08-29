// src/api/auth/authService.js
import api from '../axios'; // Використовуємо наш налаштований екземпляр

// ✅ Реєстрація
const register = async (userData) => {
  const response = await api.post('/auth/registration', userData);
  return response.data;
};

// ✅ Логін
const login = async (userData) => { // Приймаємо об'єкт, як в схемах
  const response = await api.post('/auth/login', userData);
  
  // ❌ Прибрали всю логіку з localStorage.
  // Цим займається Redux-санк.
  
  return response.data;
};

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
