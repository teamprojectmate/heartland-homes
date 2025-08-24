import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import {
  fetchBookings,
  deleteBooking,
  updateBooking
} from '../../store/slices/bookingsSlice';
import '../../styles/components/_admin.scss';

const AdminBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, status, error } = useSelector((state) => state.bookings);

  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      navigate('/');
      return;
    }
    dispatch(fetchBookings());
  }, [user, navigate, dispatch]);

  const handleCancelBooking = async (id) => {
    await dispatch(deleteBooking(id));
    dispatch(fetchBookings()); // 🔄 оновлюємо після видалення
    setConfirmCancelId(null);
  };

  const handleMarkAsPaid = (booking) => {
    dispatch(
      updateBooking({
        id: booking.id,
        bookingData: { ...booking, status: 'PAID' }
      })
    );
  };

  if (status === 'loading') {
    return (
      <div className="container admin-page-container text-center">
        <h1 className="section-heading">Усі бронювання (Адмін-панель)</h1>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="container admin-page-container">
      <h1 className="section-heading text-center">Усі бронювання (Адмін-панель)</h1>
      {error && <Notification message={error} type="danger" />}
      {bookings.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Помешкання ID</th>
              <th>Користувач ID</th>
              <th>Дати</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.accommodationId}</td>
                <td>{booking.userId}</td>
                <td>
                  {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>
                <td>{booking.status}</td>
                <td>
                  {booking.status !== 'PAID' ? (
                    <button
                      onClick={() => handleMarkAsPaid(booking)}
                      className="btn-primary btn-sm"
                    >
                      Позначити як оплачене
                    </button>
                  ) : (
                    <span className="text-success">Оплачено</span>
                  )}
                  <button
                    onClick={() => setConfirmCancelId(booking.id)}
                    className="btn-danger btn-sm btn-action"
                  >
                    Скасувати
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert-info text-center">Бронювань ще немає.</div>
      )}

      {confirmCancelId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5 className="modal-title">Підтвердження скасування</h5>
            <p>Ви впевнені, що хочете скасувати це бронювання?</p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmCancelId(null)}
              >
                Ні, повернутися
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleCancelBooking(confirmCancelId)}
              >
                Так, скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
