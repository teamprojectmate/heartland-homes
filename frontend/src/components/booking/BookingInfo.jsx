import React from 'react';
import { mapStatus } from '../../utils/translations';

const BookingInfo = ({ booking }) => {
  const { label, color, slug } = mapStatus(booking.status);

  return (
    <div className="booking-info">
      <p>
        <strong>ID:</strong> {booking.id}
      </p>
      {booking.user && (
        <p>
          <strong>Користувач:</strong> {booking.user.firstName} {booking.user.lastName} (
          {booking.user.email})
        </p>
      )}
      {booking.accommodation && (
        <p>
          <strong>Помешкання:</strong> {booking.accommodation.name} (
          {booking.accommodation.city})
        </p>
      )}
      <p>
        <strong>Заїзд:</strong> {booking.checkInDate}
      </p>
      <p>
        <strong>Виїзд:</strong> {booking.checkOutDate}
      </p>
      <p>
        <strong>Статус:</strong>{' '}
        <span
          className={`status-badge status-${slug}`}
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </p>
      {booking.totalPrice && (
        <p>
          <strong>Ціна:</strong> {booking.totalPrice} грн
        </p>
      )}
    </div>
  );
};

export default BookingInfo;
