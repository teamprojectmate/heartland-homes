// src/utils/statusLabels.js

// ✅ Єдина мапа статусів → текст + CSS клас
export const statusLabels = {
  PENDING: { text: 'Очікує', className: 'badge-pending' },
  PAID: { text: 'Оплачено', className: 'badge-paid' },
  CANCELLED: { text: 'Скасовано', className: 'badge-cancelled' }
};

// 🔹 Допоміжна функція для відображення
export const getStatusLabel = (status) => {
  return statusLabels[status] || { text: status, className: '' };
};
