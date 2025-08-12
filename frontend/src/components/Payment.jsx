import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Імпортуємо useSelector для доступу до стану Redux

// URL для бекенду.
const BASE_URL = 'http://localhost:8080/api/v1';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { isAuthenticated, token } = useSelector((state) => state.auth); // Отримуємо токен з Redux

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // Робимо реальний запит до бекенду, щоб отримати деталі бронювання
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
  }, [bookingId, isAuthenticated, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !bookingDetails) {
      setProcessing(false);
      return;
    }

    try {
      // Крок 1: Відправляємо запит на бекенд для створення PaymentIntent
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
      
      // Крок 2: Підтвердження оплати з клієнтської сторони
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

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Оплата бронювання</h2>
      {bookingDetails && (
        <div className="alert alert-info">
          Помешкання: <strong>{bookingDetails.accommodationName}</strong>,
          Сума: <strong>{bookingDetails.totalAmount} $</strong>
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
