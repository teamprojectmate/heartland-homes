import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';

const AdminBookings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    // Перевірка, чи користувач є адміністратором
    // Припускаємо, що у об'єкті користувача є поле `role`
    if (!user || user.role !== 'ADMIN') {
      navigate('/'); // Перенаправляємо, якщо не адміністратор
      return;
    }

    const fetchAllBookings = async () => {
      try {
        const token = user.token;
        const response = await axios.get(`${BASE_URL}/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        // Додаємо більш детальну інформацію про помилку, якщо вона доступна
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, [user, navigate]);

  // Функція для скасування бронювання
  const handleCancelBooking = async (id) => {
    try {
      const token = user.token;
      await axios.delete(`${BASE_URL}/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Оновлюємо список бронювань, видаливши скасований елемент
      setBookings(bookings.filter(booking => booking.id !== id));
      setConfirmCancelId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка скасування бронювання');
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <h1 className="text-xs-center">Усі бронювання (Адмін-панель)</h1>
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
        <h1 className="text-xs-center">Усі бронювання (Адмін-панель)</h1>
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
      <h1 className="text-xs-center">Усі бронювання (Адмін-панель)</h1>
      <div className="row">
        <div className="col-md-8 offset-md-2 col-xs-12">
          {bookings.length > 0 ? (
            <ul className="list-group">
              {bookings.map((booking) => (
                <li key={booking.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Помешкання:</strong> {booking.accommodationName}
                      <br />
                      <strong>Користувач:</strong> {booking.userName} (ID: {booking.userId})
                      <br />
                      <strong>Дати:</strong> {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      <br />
                      <strong>Сума:</strong> {booking.totalAmount} $
                    </div>
                    <button 
                      onClick={() => setConfirmCancelId(booking.id)} 
                      className="btn btn-sm btn-danger"
                    >
                      Скасувати
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info text-xs-center">Бронювань ще немає.</div>
          )}
        </div>
      </div>

      {/* Модальне вікно для підтвердження скасування */}
      {confirmCancelId && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Підтвердження скасування</h5>
              </div>
              <div className="modal-body">
                <p>Ви впевнені, що хочете скасувати це бронювання?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmCancelId(null)}>
                  Ні, повернутися
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleCancelBooking(confirmCancelId)}>
                  Так, скасувати
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
