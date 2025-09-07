// src/components/StatusSelect.jsx
import React from 'react';
import { statusLabels } from '../../utils/statusLabels';
import '../../styles/components/_status-select.scss';

const StatusSelect = ({ value, onChange, disabled = false }) => {
  return (
    <select
      className={`status-select ${statusLabels[value]?.className || ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {Object.entries(statusLabels).map(([key, { text }]) => (
        <option key={key} value={key}>
          {text}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;
