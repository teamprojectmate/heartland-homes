import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookings,
  updateBookingStatus,
  deleteBooking
} from '../../store/slices/bookingsSlice';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { getAllUsers } from '../../api/user/userService';
import AdminTable from '../Admin/AdminTable';
import AdminBookingCard from '../Admin/AdminBookingCard';
import StatusSelect from '../../components/selects/StatusSelect';
import { TrashIcon } from '@heroicons/react/24/solid';

// стилі
import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';
import '../../styles/components/admin/_admin-tables.scss';

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

  // --- дії ---
  const handleStatusChange = (booking, newStatus) => {
    dispatch(updateBookingStatus({ booking, status: newStatus }));
  };

  const handleDelete = (id) => {
    dispatch(deleteBooking(id));
  };

  if (status === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  // --- колонки для AdminTable ---
  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'user',
      label: 'Користувач',
      render: (b) =>
        b.user ? `${b.user.firstName} ${b.user.lastName} (${b.user.email})` : b.userId
    },
    {
      key: 'accommodation',
      label: 'Помешкання',
      render: (b) => b.accommodation?.name || '—'
    },
    { key: 'checkInDate', label: 'Заїзд' },
    { key: 'checkOutDate', label: 'Виїзд' },
    {
      key: 'totalPrice',
      label: 'Ціна',
      render: (b) => (b.totalPrice ? `${b.totalPrice} грн` : '—')
    },
    {
      key: 'status',
      label: 'Статус',
      render: (b) => (
        <StatusSelect
          value={b.status}
          onChange={(newStatus) => handleStatusChange(b, newStatus)}
        />
      )
    }
  ];

  return (
    <div className="admin-bookings container admin-page-container">
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
        <AdminTable
          columns={columns}
          data={enrichedBookings}
          actions={(b) => (
            <button
              className="btn-inline btn-danger"
              onClick={() => handleDelete(b.id)}
              title="Видалити бронювання"
            >
              <TrashIcon className="w-4 h-4" />
              Видалити
            </button>
          )}
        />
      )}
    </div>
  );
};

export default AdminBookings;
