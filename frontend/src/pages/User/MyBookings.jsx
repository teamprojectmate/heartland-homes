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
import Pagination from '../../components/Pagination';
import BookingCard from '../../components/BookingCard';
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

  // 🔹 Після отримання бронювань підтягнути житло
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
            } catch (err) {
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
    } catch (err) {
      setNotification({
        message: 'Не вдалося скасувати бронювання.',
        type: 'danger'
      });
    }
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
  const totalActivePages = Math.ceil(totalElements / 5);

  return (
    <div className="container page">
      <h1 className="text-center">Мої бронювання</h1>
      {error && <Notification message={error} type="danger" />}

      {hasActiveBookingsOnThisPage ? (
        <>
          <div className="bookings-row">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>

          {totalActivePages > 1 && (
            <div className="pagination-wrapper">
              <Pagination
                page={page}
                totalPages={totalActivePages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
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

          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <Notification message={notification.message} type={notification.type} />
    </div>
  );
};

export default MyBookings;
