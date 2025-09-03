import api from '../axios'; // наш axios з інтерцептором

// ✅ Реєстрація
const register = async (userData) => {
  const response = await api.post('/auth/registration', userData);
  return response.data;
};

// ✅ Логін
const login = async (userData) => {
  console.log('📤 Надсилаю на бекенд /auth/login:', userData);
  const response = await api.post('/auth/login', userData);
  return response.data; // очікуємо { token: "..." }
};

// ✅ Вихід
const logout = () => {
  localStorage.removeItem('auth');
};

const authService = {
  register,
  login,
  logout
};

export default authService;
