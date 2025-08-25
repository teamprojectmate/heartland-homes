import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Notification from '../../components/Notification';
import { fetchBookingById } from '../../store/slices/bookingsSlice';
import { createPaymentIntent, resetPayment } from '../../store/slices/paymentsSlice';

import '../../styles/layout/_main-layout.scss';
import '../../styles/components/_forms.scss';
import '../../styles/components/_buttons.scss';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    currentBooking,
    status: bookingStatus,
    error: bookingError
  } = useSelector((state) => state.bookings);
  const { status: paymentStatus, error: paymentError } = useSelector(
    (state) => state.payments
  );

  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchBookingById(bookingId));
  }, [isAuthenticated, bookingId, dispatch, navigate]);

  useEffect(() => {
    if (paymentStatus === 'succeeded') {
      dispatch(resetPayment());
      navigate('/my-bookings');
    }
  }, [paymentStatus, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStripeError(null);

    if (!stripe || !elements || !currentBooking) return;

    const resultAction = await dispatch(createPaymentIntent(bookingId));

    if (createPaymentIntent.fulfilled.match(resultAction)) {
      const { clientSecret } = resultAction.payload;

      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) setStripeError(error.message);
    }
  };

  if (bookingStatus === 'loading') {
    return <p className="text-center mt-5">Завантаження...</p>;
  }

  return (
    <div className="container page">
      <div className="row">
        <div className="col auth-form-container">
          <h2 className="auth-title">Оплата бронювання</h2>
          {bookingError && <Notification message={bookingError} type="danger" />}

          {currentBooking && (
            <div className="notification-info">
              ID помешкання: <strong>{currentBooking.accommodationId}</strong>
              <br />
              Дати: {new Date(currentBooking.checkInDate).toLocaleDateString()} –{' '}
              {new Date(currentBooking.checkOutDate).toLocaleDateString()}
              <br />
              Статус: <strong>{currentBooking.status}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group form-group-spacing">
              <label>Дані картки</label>
              <CardElement className="form-control" />
            </div>

            {stripeError && <Notification message={stripeError} type="danger" />}
            {paymentError && <Notification message={paymentError} type="danger" />}

            <button
              className="btn btn-primary btn-full-width"
              disabled={!stripe || paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' ? 'Обробка...' : 'Сплатити'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
