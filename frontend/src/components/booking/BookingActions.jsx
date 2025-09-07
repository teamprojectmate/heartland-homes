import React from 'react';

const BookingActions = ({ booking, onCancel, onPay, onDelete }) => {
  return (
    <div className="booking-actions">
      {booking.status === 'PENDING' && (
        <button className="btn btn-success" onClick={() => onPay(booking.id)}>
          Оплатити
        </button>
      )}
      {booking.status !== 'CANCELED' && (
        <button className="btn btn-danger" onClick={() => onCancel(booking.id)}>
          Скасувати
        </button>
      )}
      {booking.status === 'CANCELED' && (
        <button className="btn btn-secondary" onClick={() => onDelete(booking.id)}>
          Видалити
        </button>
      )}
    </div>
  );
};

export default BookingActions;
