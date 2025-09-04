// src/pages/admin/AdminBookings.jsx
// src/pages/admin/AdminBookings.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookings,
  updateBookingStatus,
  deleteBooking
} from '../../store/slices/bookingsSlice';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { getAllUsers } from '../../api/user/userService';
import '../../styles/components/_badges.scss';
import '../../styles/components/_admin-bookings.scss';
import { TrashIcon } from '@heroicons/react/24/solid';

const AdminBookingCard = ({ booking, onStatusChange, onDelete }) => {
  return (
    <div className="admin-booking-card">
      <h3 className="admin-booking-title">
        {booking.accommodation?.name || 'Без назви'}
      </h3>
      <p>
        <strong>Користувач:</strong>{' '}
        {booking.user
          ? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
          : booking.userId || '—'}
      </p>
      <p>
        <strong>Дати:</strong> {booking.checkInDate} — {booking.checkOutDate}
      </p>
      <p>
        <strong>Ціна:</strong> {booking.totalPrice ? `${booking.totalPrice} грн` : '—'}
      </p>
      <p>
        <strong>Статус:</strong>{' '}
        <span className={`badge badge-status ${booking.status.toLowerCase()}`}>
          {booking.status === 'PENDING' && 'Очікує'}
          {booking.status === 'CONFIRMED' && 'Підтверджено'}
          {booking.status === 'CANCELED' && 'Скасовано'}
          {booking.status === 'EXPIRED' && 'Прострочено'}
        </span>
      </p>

      <div className="card-actions">
        <select
          value={booking.status}
          onChange={(e) => onStatusChange(booking, e.target.value)}
        >
          <option value="PENDING">Очікує</option>
          <option value="CONFIRMED">Підтверджено</option>
          <option value="CANCELED">Скасовано</option>
          <option value="EXPIRED">Прострочено</option>
        </select>
        <button
          className="btn-icon btn-danger"
          onClick={() => onDelete(booking.id)}
          title="Видалити бронювання"
        >
          <TrashIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, status, error } = useSelector((state) => state.bookings);

  const [usersMap, setUsersMap] = useState({});
  const [enrichedBookings, setEnrichedBookings] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- resize listener ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- завантаження бронювань та користувачів ---
  useEffect(() => {
    dispatch(fetchBookings());

    getAllUsers().then((users) => {
      const map = {};
      (users?.content || users || []).forEach((u) => {
        map[u.id] = u;
      });
      setUsersMap(map);
    });
  }, [dispatch]);

  // --- enrichment житла та користувачів ---
  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    const enrichData = async () => {
      const results = await Promise.all(
        bookings.map(async (booking) => {
          let accommodation = null;
          let totalPrice = null;

          try {
            accommodation = await getAccommodationById(booking.accommodationId);
            if (accommodation && booking.checkInDate && booking.checkOutDate) {
              const start = new Date(booking.checkInDate);
              const end = new Date(booking.checkOutDate);
              const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              totalPrice = nights * (accommodation.dailyRate || 0);
            }
          } catch {
            console.warn(`Не вдалося завантажити житло id=${booking.accommodationId}`);
          }

          const user = usersMap[booking.userId];
          return { ...booking, accommodation, user, totalPrice };
        })
      );
      setEnrichedBookings(results);
    };

    enrichData();
  }, [bookings, usersMap]);

  const handleStatusChange = (booking, newStatus) => {
    dispatch(updateBookingStatus({ booking, status: newStatus }));
  };

  const handleDelete = (id) => {
    dispatch(deleteBooking(id));
  };

  if (status === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="admin-bookings">
      <h1 className="section-heading text-center">Управління бронюваннями</h1>

      {isMobile ? (
        <div className="admin-bookings-cards">
          {enrichedBookings.map((booking) => (
            <AdminBookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="admin-bookings-table-wrapper">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Користувач</th>
                <th>Помешкання</th>
                <th>Заїзд</th>
                <th>Виїзд</th>
                <th>Ціна</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {enrichedBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
                      : booking.userId || '—'}
                  </td>
                  <td>{booking.accommodation?.name || '—'}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td>{booking.totalPrice ? `${booking.totalPrice} грн` : '—'}</td>
                  <td>
                    <span
                      className={`badge badge-status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status === 'PENDING' && 'Очікує'}
                      {booking.status === 'CONFIRMED' && 'Підтверджено'}
                      {booking.status === 'CANCELED' && 'Скасовано'}
                      {booking.status === 'EXPIRED' && 'Прострочено'}
                    </span>
                  </td>
                  <td className="actions">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking, e.target.value)}
                    >
                      <option value="PENDING">Очікує</option>
                      <option value="CONFIRMED">Підтверджено</option>
                      <option value="CANCELED">Скасовано</option>
                      <option value="EXPIRED">Прострочено</option>
                    </select>
                    <button
                      className="btn-icon btn-danger btn-sm"
                      onClick={() => handleDelete(booking.id)}
                      title="Видалити бронювання"
                    >
                      <TrashIcon className="w-4 h-4 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
