import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Моковані дані для розробки. Видали їх або закоментуй, коли бекенд буде готовий.
const mockBookingsDetails = {
  '101': {
    accommodationId: 'Затишна квартира в центрі',
    totalAmount: 250,
  },
  '102': {
    accommodationId: 'Котедж в горах',
    totalAmount: 400,
  },
};

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Отримуємо деталі бронювання для відображення.
    // Замінимо реальний API-запит на моковані дані.
    const fetchBookingDetails = async () => {
      try {
        // Закоментуй цей блок, коли будеш використовувати реальний бекенд.
        // const token = JSON.parse(localStorage.getItem('user')).token;
        // const response = await axios.get(
        //   `http://localhost:8080/api/v1/bookings/${bookingId}`,
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${token}`
        //     }
        //   }
        // );
        // setBookingDetails(response.data);

        // Цей блок використовує моковані дані.
        const details = mockBookingsDetails[bookingId];
        if (details) {
          setBookingDetails(details);
        } else {
          setError('Бронювання не знайдено.');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Крок 1: Замість реального запиту на бекенд, імітуємо його.
      console.log('Імітуємо запит до бекенду для створення PaymentIntent...');
      const clientSecret = 'pi_3PjA3E2eZvKYlo2C0pYdE6a1_secret_gX3XJ3X3X3X3X3X3X3X3X3X3X3'; // Мокований client_secret

      // Крок 2: Підтвердження оплати з клієнтської сторони.
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
      setPaymentError(err.response?.data?.message || err.message);
      setProcessing(false);
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Оплата бронювання</h2>
      {bookingDetails && (
        <div className="alert alert-info">
          Помешкання: **{bookingDetails.accommodationId}**,
          Ціна: **{bookingDetails.totalAmount} $**
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Дані картки</label>
          <CardElement className="form-control" />
        </div>
        {paymentError && <div className="alert alert-danger">{paymentError}</div>}
        <button
          className="btn btn-success"
          disabled={!stripe || processing}
        >
          {processing ? 'Обробка...' : 'Сплатити'}
        </button>
      </form>
    </div>
  );
};

export default Payment;
