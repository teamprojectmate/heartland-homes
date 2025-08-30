// src/components/BookingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { fixDropboxUrl } from '../utils/fixDropboxUrl';

const fallbackImage = '/no-image.png';

const BookingCard = ({ booking, onCancel }) => {
  const acc = booking.accommodation;

  // ✅ картинка з житла або fallback
  const imageUrl = acc?.image ? fixDropboxUrl(acc.image) : fallbackImage;

  // ✅ адреса — повна, якщо є
  const address = acc?.address ? acc.address : acc?.city ? acc.city : 'Адреса невідома';

  // ✅ ціна — спочатку з бронювання, інакше з житла
  const price = booking.totalPrice ?? acc?.dailyRate ?? '—';

  return (
    <div className="card-custom">
      {/* Фото */}
      <img
        src={imageUrl}
        alt={acc?.title ?? 'Зображення житла'}
        className="card-img-top-custom"
        onError={(e) => (e.target.src = fallbackImage)}
      />

      <div className="card-body">
        {/* Назва */}
        <h3 className="card-title">
          {acc?.title ?? `Помешкання #${booking.accommodationId}`}
        </h3>

        {/* Адреса */}
        <p className="card-text">📍 {address}</p>

        {/* Дати */}
        <p>
          Дати: {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
          {new Date(booking.checkOutDate).toLocaleDateString()}
        </p>

        {/* ID */}
        <p>ID бронювання: {booking.id}</p>

        {/* Статус */}
        <span className={`badge badge-status ${booking.status.toLowerCase()}`}>
          Статус: {booking.status}
        </span>

        {/* Ціна */}
        <p className="card-price">{price} грн</p>

        {/* Дії */}
        <div className="booking-actions">
          <Link to={`/my-bookings/${booking.id}`} className="btn btn-primary w-100">
            Деталі
          </Link>

          {booking.status === 'PENDING' && (
            <>
              <Link to={`/payment/${booking.id}`} className="btn btn-success w-100">
                Оплатити
              </Link>
              <button
                className="btn btn-danger w-100"
                onClick={() => onCancel?.(booking.id)}
              >
                Скасувати
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
