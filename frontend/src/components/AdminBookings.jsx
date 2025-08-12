import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const mockAllBookings = [
  {
    id: 101,
    accommodationId: 1,
    userId: 1,
    accommodationName: 'Затишна квартира в центрі',
    userName: 'Іван Петров',
    checkInDate: '2025-08-20',
    checkOutDate: '2025-08-25',
    totalAmount: 250,
  },
  {
    id: 102,
    accommodationId: 3,
    userId: 2,
    accommodationName: 'Котедж в горах',
    userName: 'Марія Іванова',
    checkInDate: '2025-09-10',
    checkOutDate: '2025-09-15',
    totalAmount: 400,
  },
];

const AdminBookings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Перевірка, чи користувач є адміністратором
    if (!user || user.role !== 'ADMIN') {
      navigate('/'); // Перенаправляємо, якщо не адміністратор
      return;
    }

    // Симулюємо запит до API з мокованими даними
    setTimeout(() => {
      setBookings(mockAllBookings);
      setLoading(false);
    }, 500);

    // Коли бекенд буде готовий, заміни цей код на реальний запит:
    /*
    const fetchAllBookings = async () => {
      try {
        const token = user.token;
        const response = await axios.get('http://localhost:8080/api/v1/bookings', {
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
    fetchAllBookings();
    */
  }, [user, navigate]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Усі бронювання (Адмін-панель)</h2>
      {bookings.length > 0 ? (
        <ul className="list-group">
          {bookings.map((booking) => (
            <li key={booking.id} className="list-group-item">
              <div>
                <strong>Помешкання:</strong> {booking.accommodationName}
                <br />
                <strong>Користувач:</strong> {booking.userName} (ID: {booking.userId})
                <br />
                <strong>Дати:</strong> {booking.checkInDate} - {booking.checkOutDate}
                <br />
                <strong>Сума:</strong> {booking.totalAmount} $
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info">Бронювань ще немає.</div>
      )}
    </div>
  );
};

export default AdminBookings;