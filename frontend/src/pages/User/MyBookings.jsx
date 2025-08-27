// src/pages/User/MyBookings.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { fetchMyBookings } from '../../store/slices/bookingsSlice';
import Pagination from '../../components/Pagination';
import { getStatusLabel } from '../../utils/statusLabels';
import '../../styles/components/_cards.scss';

const MyBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { bookings, status, error, page, totalPages } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchMyBookings({ page: 0, size: 5 }));
  }, [isAuthenticated, navigate, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchMyBookings({ page: newPage, size: 5 }));
  };

  if (status === 'loading') {
    return (
      <div className="container page">
        <h1 className="text-center">Мої бронювання</h1>
        <p className="text-center">Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="text-center">Мої бронювання</h1>
      {error && <Notification message={error} type="danger" />}

      <div className="row">
        <div className="col">
          {bookings.length > 0 ? (
            <>
              {bookings.map((booking) => {
                const label = getStatusLabel(booking.status);
                return (
                  <div key={booking.id} className="card card-custom my-3">
                    <div className="card-body">
                      <h4 className="card-title">
                        Помешкання #{booking.accommodationId}
                      </h4>
                      <p className="card-text">
                        Дати: {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        Статус:{' '}
                        <span className={`badge ${label.className}`}>{label.text}</span>
                      </p>
                    </div>
                  </div>
                );
              })}

              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <p className="text-center">У вас поки що немає бронювань.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
