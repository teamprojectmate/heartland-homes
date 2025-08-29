import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <PageWrapper title="Оплата успішна">
      <div className="payment-page">
        <div className="payment-card">
          <h2 className="payment-title" style={{ color: '#16a34a' }}>
            🎉 Оплату успішно завершено! 🎉
          </h2>
          <p className="payment-subtitle">
            Дякуємо за вашу оплату. Ваше бронювання підтверджено.
          </p>
          <Link to="/my-bookings" className="payment-button">
            Перейти до моїх бронювань
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentSuccess;