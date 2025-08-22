import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import {
  fetchBookings,
  deleteBooking,
  updateBooking
} from '../store/slices/bookingsSlice';
import '../styles/components/_admin.scss';

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

  const handleCancelBooking = (id) => {
    dispatch(deleteBooking(id));
    setConfirmCancelId(null);
  };

  const handleMarkAsPaid = (booking) => {
    dispatch(
      updateBooking({
        id: booking.id,
        bookingData: { ...booking, isPaid: true }
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
              <th>Помешкання</th>
              <th>Користувач</th>
              <th>Дати</th>
              <th>Сума</th>
              <th>Оплата</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.accommodationName}</td>
                <td>{booking.userName}</td>
                <td>
                  {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>
                <td>{booking.totalAmount}$</td>
                <td>
                  {booking.isPaid ? (
                    <span className="text-success">Оплачено</span>
                  ) : (
                    <button
                      onClick={() => handleMarkAsPaid(booking)}
                      className="btn-primary btn-sm"
                    >
                      Позначити як оплачене
                    </button>
                  )}
                </td>
                <td>
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
            <div className="modal-header">
              <h5 className="modal-title">Підтвердження скасування</h5>
            </div>
            <div className="modal-body">
              <p>Ви впевнені, що хочете скасувати це бронювання?</p>
            </div>
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
