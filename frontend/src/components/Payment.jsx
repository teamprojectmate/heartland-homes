// src/components/Payment.jsx

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import "../styles/layout/_main-layout.scss"; // ✅ Імпортуємо стилі для розмітки
import "../styles/components/_forms.scss"; // ✅ Імпортуємо стилі для форм
import "../styles/components/_buttons.scss"; // ✅ Імпортуємо стилі для кнопок

const BASE_URL = 'http://localhost:8080';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const token = user.token;
        const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookingDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Не вдалося отримати деталі бронювання.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements || !bookingDetails) {
      setProcessing(false);
      return;
    }

    try {
      const token = user.token;
      const response = await axios.post(
        `${BASE_URL}/payments/create`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { clientSecret } = response.data;

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setPaymentError(error.message);
        setProcessing(false);
      } else {
        console.log('Payment successful:', paymentIntent);
        navigate('/bookings/my');
      }
    } catch (err) {
      setPaymentError(err.response?.data?.message || err.message || 'Помилка при обробці платежу.');
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Завантаження...</p>;

  return (
    <div className="container page">
      <div className="row">
        <div className="col auth-form-container">
          <h2 className="auth-title">Оплата бронювання</h2>
          {error && <Notification message={error} type="danger" />}

          {bookingDetails && (
            <div className="notification-info">
              Помешкання: <strong>{bookingDetails.accommodationName}</strong>,
              Сума: <strong>{bookingDetails.totalAmount} $</strong>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group form-group-spacing"> {/* ✅ Виправлено */}
              <label>Дані картки</label>
              <CardElement className="form-control" />
            </div>
            {paymentError && <Notification message={paymentError} type="danger" />}
            <button
              className="btn btn-primary btn-full-width" // ✅ Виправлено
              disabled={!stripe || processing}
            >
              {processing ? 'Обробка...' : 'Сплатити'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
