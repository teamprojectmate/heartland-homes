// src/pages/User/Payment.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createPayment, resetPayment } from '../../store/slices/paymentsSlice';
import Notification from '../../components/Notification';

const Payment = () => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { payment, status, error } = useSelector((s) => s.payments);
  const { token } = useSelector((s) => s.auth);

  const handlePay = () => {
    dispatch(createPayment({ bookingId, paymentType: 'CARD', token }));
  };

  useEffect(() => {
    if (payment?.sessionUrl) {
      // редірект на платіжну сторінку (Stripe/PayPal і т.д.)
      window.location.href = payment.sessionUrl;
    }
  }, [payment]);

  return (
    <div className="container page">
      <h2>Оплата бронювання</h2>

      {error && <Notification type="danger" message={error} />}

      <button
        className="btn btn-primary"
        onClick={handlePay}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Обробка...' : 'Оплатити'}
      </button>
    </div>
  );
};

export default Payment;
