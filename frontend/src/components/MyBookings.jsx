// src/components/MyBookings.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Notification from './Notification';
import "../styles/components/_cards.scss";
import "../styles/layout/_main-layout.scss";

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/bookings/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Не вдалося отримати бронювання');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated, navigate, token]);

  if (loading) {
    return (
      <div className="container page">
        <h1 className="text-center">Мої бронювання</h1>
        <div className="row">
          <div className="col">
            <p className="text-center">Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="text-center">Мої бронювання</h1>
      <div className="row">
        <div className="col">
          {error && <Notification message={error} type="danger" />}
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="card card-custom my-3">
                <div className="card-body">
                  <h4 className="card-title">{booking.accommodationName}</h4>
                  <p className="card-text">
                    Дати: {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">Сума: {booking.totalAmount} $</p>
                  {!booking.isPaid ? (
                    <Link to={`/payment/${booking.id}`} className="btn-primary">
                      Оплатити
                    </Link>
                  ) : (
                    <span className="text-success">Оплачено</span>
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
