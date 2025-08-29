import api from '../axios';

// 🔹 Створити платіж (отримати sessionUrl)
// ✅ Тепер приймає токен як аргумент
export const createPayment = async (bookingId, paymentType = 'CARD', token) => {
  // ✅ Додавання токена до заголовків
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post(
    '/payments',
    { bookingId, paymentType },
    config
  );
  return response.data; // PaymentDto
};

// 🔹 Отримати всі платежі користувача (з пагінацією)
// ✅ Тепер приймає токен як аргумент
export const fetchPaymentsByUser = async (userId, pageable, token) => {
  // ✅ Додавання токена до заголовків
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get('/payments', {
    params: {
      user_id: userId,
      pageable: JSON.stringify(pageable) // Тепер передаємо об'єкт
    },
    ...config // ✅ Додавання конфігурації з токеном
  });
  return response.data; // PagePaymentDto
};
