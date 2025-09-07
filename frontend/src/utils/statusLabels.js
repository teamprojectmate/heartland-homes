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
  PAID: { text: 'Оплачено', className: 'badge-status-paid' }
};

// 🔹 Об'єднаний словник для бейджів
const allStatusLabels = {
  ...bookingStatusLabels,
  ...accommodationStatusLabels,
  ...paymentStatusLabels
};

// 🔹 функція для StatusBadge.jsx
export const getStatusLabel = (status) =>
  allStatusLabels[status] || { text: status, className: '' };
