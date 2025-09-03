// src/pages/BookingDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookingById, cancelBooking } from '../api/bookings/bookingsService';
import { getAccommodationById } from '../api/accommodations/accommodationService';
import { useDispatch } from 'react-redux';
import { deleteBooking } from '../store/slices/bookingsSlice';
import { fixDropboxUrl } from '../utils/fixDropboxUrl';
import { mapStatus } from '../utils/translations';
import Notification from '../components/Notification';
import { FaTrash } from 'react-icons/fa';

const fallbackImage = '/no-image.png';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await fetchBookingById(id);
        if (!bookingData) {
          setError('Бронювання не знайдено.');
          setLoading(false);
          return;
        }

        let accommodation = null;
        try {
          accommodation = await getAccommodationById(bookingData.accommodationId);
        } catch (err) {
          console.warn('⚠️ Не вдалося отримати помешкання:', err);
        }

        setBooking({ ...bookingData, accommodation });
      } catch (err) {
        console.error('❌ Помилка завантаження бронювання:', err);
        setError('Не вдалося завантажити деталі бронювання.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    if (window.confirm('Ви впевнені, що хочете скасувати бронювання?')) {
      try {
        await cancelBooking(id);
        setBooking((prev) => ({ ...prev, status: 'CANCELED' }));
      } catch (err) {
        console.error('❌ Помилка скасування бронювання:', err);
        setError('Не вдалося скасувати бронювання.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити бронювання?')) {
      try {
        await dispatch(deleteBooking(id)).unwrap();
        navigate('/my-bookings');
      } catch (err) {
        console.error('❌ Помилка видалення бронювання:', err);
        setError('Не вдалося видалити бронювання.');
      }
    }
  };

  if (loading) return <p className="text-center">Завантаження...</p>;
  if (error) return <Notification message={error} type="danger" />;
  if (!booking) return <p className="text-center">Бронювання не знайдено</p>;

  const imageUrl = booking.accommodation?.image
    ? fixDropboxUrl(booking.accommodation.image)
    : fallbackImage;

  const { label: statusLabel, color: statusColor } = mapStatus(booking.status);

  // ✅ Розрахунок ціни
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

  const totalPrice =
    booking.totalPrice ||
    (booking.accommodation?.dailyRate ? booking.accommodation.dailyRate * nights : null);

  return (
    <div className="container booking-details-page">
      <h1 className="section-heading">Деталі бронювання</h1>

      <div className="details-grid">
        {/* Ліва частина */}
        <div className="booking-info-card">
          <img src={imageUrl} alt="Помешкання" className="booking-image" />
          <div className="booking-info-header">
            <h3 className="card-title">{booking.accommodation?.name || 'Помешкання'}</h3>
            <p className="card-subtitle">
              {booking.accommodation?.city || '—'},{' '}
              {booking.accommodation?.location || '—'}
            </p>
          </div>

          <div className="booking-details-content">
            <p>
              <strong>ID бронювання:</strong> {booking.id}
            </p>
            <p>
              <strong>Дата заїзду:</strong> {booking.checkInDate}
            </p>
            <p>
              <strong>Дата виїзду:</strong> {booking.checkOutDate}
            </p>
            <p>
              <strong>Статус:</strong>{' '}
              <span className="badge" style={{ backgroundColor: statusColor }}>
                {statusLabel}
              </span>
            </p>
            <p className="total-price">
              <strong>Загальна ціна:</strong>{' '}
              {totalPrice ? (
                <span className="price">{totalPrice} грн</span>
              ) : (
                <span className="text-muted">—</span>
              )}
            </p>
          </div>
        </div>

        {/* Права частина */}
        <div className="actions-card">
          <div className="booking-price">
            <span className="price">{totalPrice || '—'}</span>
            <span className="currency">грн</span>
          </div>

          {booking.status === 'PENDING' && (
            <button className="btn btn-success">Оплатити</button>
          )}
          {booking.status !== 'CANCELED' && (
            <button className="btn btn-danger" onClick={handleCancel}>
              Скасувати
            </button>
          )}
          {booking.status === 'CANCELED' && (
            <button className="btn btn-secondary" onClick={handleDelete}>
              Видалити <FaTrash />
            </button>
          )}

          <Link to="/my-bookings" className="btn btn-secondary">
            Повернутися до списку
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
