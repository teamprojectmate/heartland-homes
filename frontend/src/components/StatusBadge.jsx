// src/components/StatusBadge.jsx
import React from 'react';
import { getStatusLabel } from '../utils/statusLabels';

const StatusBadge = ({ status }) => {
  const label = getStatusLabel(status);

  return <span className={`badge ${label.className}`}>{label.text}</span>;
};

export default StatusBadge;
