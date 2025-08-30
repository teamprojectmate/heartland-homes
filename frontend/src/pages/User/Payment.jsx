import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createPayment } from '../../store/slices/paymentsSlice';
import Notification from '../../components/Notification';
import '../../styles/payment.scss';

const Payment = () => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { payment, status, error } = useSelector((s) => s.payments);

  const handlePay = () => {
    dispatch(createPayment({ bookingId, paymentType: 'CARD' }));
  };

  useEffect(() => {
    if (payment?.sessionUrl) {
      window.location.href = payment.sessionUrl;
    }
  }, [payment]);

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2 className="payment-title">Оплата бронювання</h2>
        <p className="payment-subtitle">
          Будь ласка, натисніть кнопку нижче, щоб перейти до захищеної сторінки оплати.
        </p>

        {error && <Notification type="danger" message={error} />}

        <button
          className="payment-button"
          onClick={handlePay}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Обробка...' : 'Оплатити'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
