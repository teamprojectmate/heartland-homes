import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../store/slices/bookingsSlice';
import Notification from './Notification';
import '../styles/components/_booking-form.scss';

const BookingForm = ({ accommodationId }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.bookings);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('Будь ласка, увійдіть, щоб забронювати помешкання.');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Будь ласка, виберіть дати заїзду та виїзду.');
      return;
    }
    
    // ✅ Видаляємо `userId`. Сервер сам визначає користувача по токену.
    const bookingData = {
      accommodationId,
      checkInDate,
      checkOutDate,
    };

    const resultAction = await dispatch(createBooking(bookingData));

    if (createBooking.fulfilled.match(resultAction)) {
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1000);
    } else if (createBooking.rejected.match(resultAction)) {
      setError(resultAction.payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label htmlFor="check-in-date">Дата заїзду</label>
        <input
          type="date"
          className="form-control"
          id="check-in-date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </div>

      <div className="form-group form-group-spacing">
        <label htmlFor="check-out-date">Дата виїзду</label>
        <input
          type="date"
          className="form-control"
          id="check-out-date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </div>

      {error && <Notification message={error} type="danger" />}

      {/* ✅ Оновлюємо кнопку для керування станом */}
      <button type="submit" className="btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Бронювання...' : 'Забронювати'}
      </button>
    </form>
  );
};

export default BookingForm;