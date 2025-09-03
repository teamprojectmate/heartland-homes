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

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, status, error } = useSelector((state) => state.bookings);

  const [usersMap, setUsersMap] = useState({});
  const [enrichedBookings, setEnrichedBookings] = useState([]);

  useEffect(() => {
    dispatch(fetchBookings());

    getAllUsers().then((users) => {
      const map = {};
      users.forEach((u) => {
        map[u.id] = u;
      });
      setUsersMap(map);
    });
  }, [dispatch]);

  useEffect(() => {
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
          } catch (e) {
            console.warn(`Не вдалося завантажити житло id=${booking.accommodationId}`);
          }

          const user = usersMap[booking.userId];

          return { ...booking, accommodation, user, totalPrice };
        })
      );
      setEnrichedBookings(results);
    };

    if (bookings.length > 0) enrichData();
  }, [bookings, usersMap]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateBookingStatus({ id, status: newStatus }));
  };

  const handleDelete = (id) => {
    dispatch(deleteBooking(id));
  };

  if (status === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="admin-bookings">
      <h1 className="section-heading text-center">Управління бронюваннями</h1>
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
                <td data-label="ID">{booking.id}</td>
                <td data-label="Користувач">
                  {booking.user
                    ? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
                    : booking.userId || '—'}
                </td>
                <td data-label="Помешкання">{booking.accommodation?.name || '—'}</td>
                <td data-label="Заїзд">{booking.checkInDate}</td>
                <td data-label="Виїзд">{booking.checkOutDate}</td>
                <td data-label="Ціна">
                  {booking.totalPrice ? `${booking.totalPrice} грн` : '—'}
                </td>
                <td data-label="Статус">
                  <span className={`badge badge-status ${booking.status.toLowerCase()}`}>
                    {booking.status === 'PENDING' && 'Очікує'}
                    {booking.status === 'CONFIRMED' && 'Підтверджено'}
                    {booking.status === 'CANCELED' && 'Скасовано'}
                    {booking.status === 'EXPIRED' && 'Прострочено'}
                  </span>
                </td>
                <td data-label="Дії" className="actions">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
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
    </div>
  );
};

export default AdminBookings;
