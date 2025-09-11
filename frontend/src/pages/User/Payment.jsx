import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createPayment } from '../../store/slices/paymentsSlice';
import Notification from '../../components/Notification';
import '../../styles/components/payment/_payment-checkout.scss';

const Payment = () => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const { payment, createStatus, error } = useSelector((s) => s.payments);

  const handlePay = () => {
    dispatch(createPayment({ bookingId, paymentType: 'PAYMENT' }));
  };

  useEffect(() => {
    if (payment?.sessionUrl) {
      window.location.href = payment.sessionUrl;
    }
  }, [payment]);

  return (
    <div className="payment-page">
      <div className="payment-card payment-checkout">
        {/* Заголовок */}
        <h2 className="payment-title">
          <span className="icon">💳</span> Оплата бронювання
        </h2>
        <p className="payment-subtitle">
          🔒 Захищена оплата через банківську систему. Перевірте дані перед
          підтвердженням.
        </p>

        {error && <Notification type="danger" message={error} />}

        {/* Інформація */}
        <div className="payment-info">
          <p>
            <strong>ID бронювання:</strong> <span className="badge-id">#{bookingId}</span>
          </p>
          {payment?.amountToPay && (
            <p className="payment-amount">
              <span className="icon">💰</span> {payment.amountToPay} ₴
              <img src="/assets/visa.svg" alt="Visa" className="system-logo" />
            </p>
          )}
        </div>

        {/* Кнопка */}
        <button
          className="payment-button"
          onClick={handlePay}
          disabled={createStatus === 'loading'}
        >
          <span className="icon">💳</span>{' '}
          {createStatus === 'loading' ? 'Обробка...' : 'Оплатити зараз'}
        </button>

        {/* Лого платіжних систем */}
        <div className="payment-systems">
          <span className="powered">Powered by</span>
          <img src="/assets/stripe.svg" alt="Stripe" className="system-logo stripe" />
          <div className="cards">
            <img src="/assets/visa.svg" alt="Visa" className="system-logo" />
            <img src="/assets/mastercard.svg" alt="Mastercard" className="system-logo" />
            <img src="/assets/applepay.svg" alt="Apple Pay" className="system-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
