// src/components/StatusSelect.jsx
import React from 'react';
import '../../styles/components/_status-select.scss';

import {
  bookingStatusLabels,
  accommodationStatusLabels,
  paymentStatusLabels
} from '../../utils/statusLabels';

const StatusSelect = ({ value, onChange, type }) => {
  let options = {};

  if (type === 'booking') options = bookingStatusLabels;
  if (type === 'accommodation') options = accommodationStatusLabels;
  if (type === 'payment') options = paymentStatusLabels;

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>
          {label.text}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;
