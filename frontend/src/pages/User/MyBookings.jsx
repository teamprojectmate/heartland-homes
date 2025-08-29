import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { fetchMyBookings, setPage, cancelBooking } from '../../store/slices/bookingsSlice';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
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
    dispatch(fetchMyBookings({ page, size: 5 }));
  }, [isAuthenticated, navigate, dispatch, page]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };
  
  const handleCancelBooking = (bookingId) => {
    // Диспетчеризуємо thunk для скасування бронювання
    dispatch(cancelBooking(bookingId));
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
              {bookings.map((booking) => (
                <div key={booking.id} className="card card-custom my-3">
                  <div className="card-body">
                    <h4 className="card-title">Помешкання #{booking.accommodationId}</h4>
                    <p className="card-text">
                      Дати: {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      Статус: <StatusBadge status={booking.status} />
                    </p>
                    <p className="card-text">
                      ID бронювання: {booking.id}
                    </p>
                    <p className="card-text">
                      Загальна вартість: {booking.totalPrice} грн.
                    </p>
                    <div className="d-flex justify-content-between">
                      {booking.status === 'PENDING' && (
                        <button 
                          className="btn-primary" 
                          onClick={() => navigate(`/payments/${booking.id}`)}
                        >
                          Оплатити
                        </button>
                      )}
                      {booking.status === 'PENDING' && (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Скасувати
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

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