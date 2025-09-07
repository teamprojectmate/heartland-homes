import api from '../axios';

// ----- Створити платіж -----
export const createPayment = async (bookingId, paymentType = 'PAYMENT') => {
  console.log('📤 Відправляю на бекенд:', { bookingId, paymentType });
  const response = await api.post(
    '/payments',
    { bookingId: Number(bookingId), paymentType },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// ----- Отримати платежі користувача -----
export const fetchPaymentsByUser = async (userId, pageable) => {
  const response = await api.get('/payments', {
    params: { user_id: userId, ...pageable }
  });
  return response.data;
};

// ----- Скасувати платіж -----
export const cancelPayment = async (paymentId) => {
  const response = await api.post(`/payments/${paymentId}/cancel`);
  return response.data;
};

const paymentService = {
  createPayment,
  fetchPaymentsByUser,
  cancelPayment
};

export default paymentService;
