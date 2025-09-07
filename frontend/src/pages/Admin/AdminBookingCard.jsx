// src/components/AdminBookingCard.jsx
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import StatusBadge from '../../components/status/StatusBadge';
import StatusSelect from '../../components/selects/StatusSelect';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';

const fallbackImage = '/assets/no-image.svg'; // ✅ fallback в public/assets

const AdminBookingCard = ({ booking, onStatusChange, onDelete }) => {
  const image = booking.accommodation?.image
    ? fixDropboxUrl(booking.accommodation.image)
    : fallbackImage;

  return (
    <div className="admin-booking-card">
      {/* 🔹 Фото житла */}
      <img
        src={image}
        alt={booking.accommodation?.name || 'Житло'}
        className="booking-card-img"
        onError={(e) => (e.currentTarget.src = fallbackImage)} // ✅ fallback якщо картинка не грузиться
      />

      <div className="booking-card-content">
        <div className="card-header">
          <h3 className="admin-booking-title">
            {booking.accommodation?.name || 'Без назви'}
          </h3>
          <StatusBadge status={booking.status} />
        </div>

        <div className="card-body">
          <p>
            <strong>Користувач:</strong>{' '}
            {booking.user
              ? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
              : booking.userId || '—'}
          </p>

          <p>
            <strong>Дати:</strong> {booking.checkInDate} → {booking.checkOutDate}
          </p>

          <p className="price">
            <strong>Ціна:</strong>{' '}
            {booking.totalPrice ? `${booking.totalPrice} грн` : '—'}
          </p>
        </div>

        <div className="card-actions">
          <StatusSelect
            value={booking.status}
            onChange={(newStatus) => onStatusChange(booking, newStatus)}
          />

          <button className="btn-inline btn-danger" onClick={() => onDelete(booking.id)}>
            <TrashIcon className="w-4 h-4" />
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingCard;
