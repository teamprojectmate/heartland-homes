// src/api/payments/paymentService.js
import api from '../axios';

// 🔹 Створити платіж (отримати sessionUrl)
export const createPayment = async (bookingId, paymentType = 'CARD', token) => {
  const response = await api.post(
    '/payments',
    { bookingId, paymentType },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // PaymentDto
};

// 🔹 Отримати всі платежі користувача (з пагінацією)
export const fetchPaymentsByUser = async (userId, pageable, token) => {
  const response = await api.get('/payments', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      user_id: userId,
      pageable: JSON.stringify(pageable)
    }
  });
  return response.data; // PagePaymentDto
};
