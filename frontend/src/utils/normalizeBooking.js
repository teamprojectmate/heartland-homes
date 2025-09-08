// src/utils/normalizeBooking.js

/**
 * Нормалізація бронювання:
 * - якщо бекенд віддає booking.status → мапимо у статус
 * - якщо бронювання ще PENDING, але є оплата (PAID) → CONFIRMED
 */
export const normalizeBooking = (booking) => {
  if (!booking) return null;

  // 🟢 Нормалізуємо статус
  let fixedStatus = booking.status?.toUpperCase() || 'UNKNOWN';

  // 🟢 Автопідтвердження, якщо вже оплачено
  if (booking.payment?.status === 'PAID' && fixedStatus === 'PENDING') {
    fixedStatus = 'CONFIRMED';
  }

  return { ...booking, status: fixedStatus };
};
