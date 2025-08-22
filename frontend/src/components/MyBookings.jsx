import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { fetchMyBookings } from '../store/slices/bookingsSlice';
import { createPaymentIntent, resetPayment } from '../store/slices/paymentsSlice';
import axios from '../api/axios';

import '../styles/components/_cards.scss';
import '../styles/layout/_main-layout.scss';

const MyBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { bookings, status, error } = useSelector((state) => state.bookings);
  const { status: paymentStatus, error: paymentError } = useSelector(
    (state) => state.payments
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchMyBookings());
  }, [isAuthenticated, navigate, dispatch]);

  // Хендлер для кнопки "Оплатити"
  const handlePay = async (bookingId) => {
    dispatch(resetPayment());
    const resultAction = await dispatch(createPaymentIntent(bookingId));
    if (createPaymentIntent.fulfilled.match(resultAction)) {
      navigate(`/payment/${bookingId}`);
    }
  };

  // Хендлер для "Завантажити чек"
  const handleDownloadReceipt = async (bookingId) => {
    try {
      const response = await axios.get(`/payments/receipt/${bookingId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob' // ⚡️ PDF або інший файл
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Не вдалося завантажити чек.');
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

  return (
    <div className="container page">
      <h1 className="text-center">Мої бронювання</h1>
      {error && <Notification message={error} type="danger" />}
      {paymentError && <Notification message={paymentError} type="danger" />}

      <div className="row">
        <div className="col">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="card card-custom my-3">
                <div className="card-body">
                  <h4 className="card-title">{booking.accommodationName}</h4>
                  <p className="card-text">
                    Дати: {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">Сума: {booking.totalAmount} $</p>

                  {!booking.isPaid ? (
                    <button
                      onClick={() => handlePay(booking.id)}
                      className="btn-primary"
                      disabled={paymentStatus === 'processing'}
                    >
                      {paymentStatus === 'processing' ? 'Обробка...' : 'Оплатити'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownloadReceipt(booking.id)}
                      className="btn-secondary"
                    >
                      Завантажити чек
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">У вас поки що немає бронювань.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
