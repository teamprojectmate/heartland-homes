// src/pages/User/MyBookings.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';

import {
  fetchMyBookings,
  setPage,
  cancelBooking
} from '../../store/slices/bookingsSlice';

import { getAccommodationById } from '../../api/accommodations/accommodationService';

// 🔹 централізовано booking-компоненти
import { BookingList } from '../../components/booking/index';

import '../../styles/components/booking/_bookings.scss';
import '../../styles/components/_cards.scss';

const MyBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [notification, setNotification] = useState({ message: '', type: '' });
  const [enrichedBookings, setEnrichedBookings] = useState([]);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { bookings, status, error, page, totalPages, totalElements } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchMyBookings({ page, size: 5 }));
  }, [isAuthenticated, navigate, dispatch, page]);

  useEffect(() => {
    if (status === 'succeeded' && bookings.length === 0 && page > 0) {
      dispatch(setPage(page - 1));
      dispatch(fetchMyBookings({ page: page - 1, size: 5 }));
    }
  }, [status, bookings, page, dispatch]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!bookings || bookings.length === 0) {
        setEnrichedBookings([]);
        return;
      }

      try {
        const results = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const acc = await getAccommodationById(booking.accommodationId);
              return { ...booking, accommodation: acc };
            } catch {
              console.warn(`⚠️ Не вдалося отримати житло для bookingId=${booking.id}`);
              return { ...booking, accommodation: null };
            }
          })
        );
        setEnrichedBookings(results);
      } catch (err) {
        console.error('❌ Помилка підвантаження житла:', err);
      }
    };

    fetchAccommodations();
  }, [bookings]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      setNotification({
        message: 'Бронювання успішно скасовано!',
        type: 'success'
      });
      setEnrichedBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch {
      setNotification({
        message: 'Не вдалося скасувати бронювання.',
        type: 'danger'
      });
    }
  };

  const handlePayBooking = (bookingId) => {
    navigate(`/payment/${bookingId}`);
  };

  if (status === 'loading') {
    return (
      <div className="container page">
        <h1 className="text-center">Мої бронювання</h1>
        <p className="text-center">Завантаження...</p>
      </div>
    );
  }

  const filteredBookings = enrichedBookings.filter(
    (booking) => booking.status !== 'CANCELED'
  );

  const hasBookings = totalElements > 0;
  const hasActiveBookingsOnThisPage = filteredBookings.length > 0;

  return (
    <div className="container page">
      <h1 className="text-center">Мої бронювання</h1>
      {error && <Notification message={error} type="danger" />}
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}

      {hasActiveBookingsOnThisPage ? (
        <BookingList
          bookings={filteredBookings}
          onCancel={handleCancelBooking}
          onPay={handlePayBooking}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <>
          {hasBookings ? (
            <p className="text-center mt-5">
              На цій сторінці немає активних бронювань. Спробуйте{' '}
              <button
                className="btn btn-link p-0 align-baseline"
                onClick={() => handlePageChange(0)}
              >
                повернутись на першу сторінку
              </button>{' '}
              або перейдіть на інші сторінки.
            </p>
          ) : (
            <p className="text-center mt-5">У вас поки що немає бронювань.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;
