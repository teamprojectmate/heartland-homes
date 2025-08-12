import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Імпортуємо axios для запитів
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

// Моковані дані для розробки. Цей код було видалено, оскільки тепер ми використовуємо реальний бекенд.

const MyBookings = () => {
  const navigate = useNavigate();
  // Тепер отримуємо token з Redux стану, а не з localStorage напряму
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Перевіряємо, чи користувач автентифікований і чи є токен
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Робимо реальний запит до API з використанням токена
        const response = await axios.get('http://localhost:8080/api/v1/bookings/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        // Додаємо більш детальну обробку помилок
        setError(err.response?.data?.message || err.message || 'Не вдалося отримати бронювання');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated, navigate, token]); // Додали token до залежностей useEffect

  if (loading) {
    return (
      <div className="container page">
        <h1 className="text-xs-center">Мої бронювання</h1>
        <div className="row">
          <div className="col-md-8 offset-md-2 col-xs-12">
            <p className="text-xs-center">Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <h1 className="text-xs-center">Мої бронювання</h1>
        <div className="row">
          <div className="col-md-8 offset-md-2 col-xs-12">
            <p className="text-xs-center text-danger">Помилка: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="text-xs-center">Мої бронювання</h1>
      <div className="row">
        <div className="col-md-8 offset-md-2 col-xs-12">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="card my-3">
                <div className="card-block">
                  <h4 className="card-title">{booking.accommodationName}</h4>
                  <p className="card-text">
                    Дати: {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">Сума: {booking.totalAmount} $</p>
                  {!booking.isPaid ? (
                    <Link to={`/payment/${booking.id}`} className="btn btn-outline-success">
                      Оплатити
                    </Link>
                  ) : (
                    <span className="text-success">Оплачено</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs-center">У вас поки що немає бронювань.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
