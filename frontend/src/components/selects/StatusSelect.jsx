// src/components/StatusSelect.jsx
import React from 'react';
import '../../styles/components/_status-select.scss';

import {
  adminBookingStatusLabels,
  accommodationStatusLabels,
  paymentStatusLabels
} from '../../utils/statusLabels';

// 🟢 функція для нормалізації ключів у css-класи
const normalizeClass = (value) =>
  value ? value.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-') : '';

const StatusSelect = ({ value, onChange, type }) => {
  let options = {};

  if (type === 'booking') options = adminBookingStatusLabels;
  if (type === 'accommodation') options = accommodationStatusLabels;
  if (type === 'payment') options = paymentStatusLabels;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`status-select ${normalizeClass(value)}`}
    >
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>
          {label.text}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;
