// src/components/AdminBookingCard.jsx
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import StatusSelect from '../../components/selects/StatusSelect';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';

const fallbackImage = '/assets/no-image.svg';

const AdminBookingCard = ({ booking, onDelete, onStatusChange }) => {
  const image = booking.accommodation?.image
    ? fixDropboxUrl(booking.accommodation.image)
    : fallbackImage;

  return (
    <div className="admin-booking-card">
      <img
        src={image}
        alt={booking.accommodation?.name || 'Житло'}
        className="booking-card-img"
        onError={(e) => (e.currentTarget.src = fallbackImage)}
      />

      <div className="booking-card-content">
        <div className="card-header">
          <h3 className="admin-booking-title">
            {booking.accommodation?.name || 'Без назви'}
          </h3>
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

          {/* 🔹 Бейджі */}
          <p>
            <strong>Статус:</strong>{' '}
            <span
              className={`badge badge-status badge-status-${booking.status.toLowerCase()}`}
            >
              {booking.status === 'PENDING' && 'Очікує'}
              {booking.status === 'CONFIRMED' && 'Підтверджено'}
              {booking.status === 'CANCELED' && 'Скасовано'}
              {booking.status === 'EXPIRED' && 'Прострочено'}
            </span>
          </p>

          <p>
            <strong>Оплата:</strong>{' '}
            {booking.payment ? (
              <span
                className={`badge ${
                  booking.payment.status === 'PAID'
                    ? 'badge-status-paid'
                    : 'badge-status-pending'
                }`}
              >
                {booking.payment.status === 'PAID' ? 'Оплачено' : 'Очікує оплату'}
              </span>
            ) : (
              <span className="badge badge-status badge-status-unknown">—</span>
            )}
          </p>
        </div>

        <div className="card-actions">
          <StatusSelect
            type="booking"
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
