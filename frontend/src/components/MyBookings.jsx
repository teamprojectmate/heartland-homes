import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Імпортуємо axios для запитів
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

// Моковані дані для розробки
const mockBookings = [
  {
    id: 101,
    accommodationId: 1,
    accommodationName: 'Затишна квартира в центрі',
    checkInDate: '2025-08-20',
    checkOutDate: '2025-08-25',
    totalAmount: 250,
    isPaid: false, // Додано для імітації статусу оплати
  },
  {
    id: 102,
    accommodationId: 3,
    accommodationName: 'Котедж в горах',
    checkInDate: '2025-09-10',
    checkOutDate: '2025-09-15',
    totalAmount: 400,
    isPaid: true,
  },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Симулюємо запит до API з мокованими даними
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);

    // Коли бекенд буде готовий, заміни цей код на реальний запит
    /*
    const fetchBookings = async () => {
      try {
        const token = user.token;
        const response = await axios.get('http://localhost:8080/api/v1/bookings/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    */
  }, [isAuthenticated, navigate, user]);

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
                  {/* Умовний рендеринг кнопки оплати, як ми обговорювали */}
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
