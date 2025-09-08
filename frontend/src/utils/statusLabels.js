// src/utils/statusLabels.js

// --- Статуси бронювань ---
export const bookingStatusLabels = {
  PENDING: { text: 'Очікує підтвердження', className: 'badge-status-pending' },
  CONFIRMED: { text: 'Підтверджено', className: 'badge-status-confirmed' },
  CANCELED: { text: 'Скасовано', className: 'badge-status-canceled' },
  EXPIRED: { text: 'Прострочено', className: 'badge-status-expired' }
};

// --- Статуси помешкань ---
export const accommodationStatusLabels = {
  REQUIRES_VERIFICATION: {
    text: 'Потребує перевірки',
    className: 'badge-status-requires-verification'
  },
  PERMITTED: { text: 'Дозволено', className: 'badge-status-permitted' },
  REJECTED: { text: 'Відхилено', className: 'badge-status-rejected' }
};

// --- Статуси платежів ---
export const paymentStatusLabels = {
  PENDING: { text: 'Очікує оплату', className: 'badge-status-pending' },
  PAID: { text: 'Оплачено', className: 'badge-status-paid' },
  FAILED: { text: 'Помилка', className: 'badge-status-failed' }
};

// 🔹 Об'єднаний словник
const allStatusLabels = {
  ...bookingStatusLabels,
  ...accommodationStatusLabels,
  ...paymentStatusLabels
};

// --- Статуси бронювань для адмін-панелі ---
export const adminBookingStatusLabels = {
  PENDING: { text: 'Очікує підтвердження', className: 'badge-status-pending' },
  CONFIRMED: { text: 'Підтверджено', className: 'badge-status-confirmed' }
};

// 🔹 функція для StatusBadge
export const getStatusLabel = (status) =>
  allStatusLabels[status] || { text: status, className: 'badge-status-unknown' };
