import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingList } from '../../components/booking/index';
import Notification from '../../components/Notification';
import { useEnrichedBookings } from '../../hooks/useEnrichedBookings';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { cancelBooking, fetchMyBookings, setPage } from '../../store/slices/bookingsSlice';
import { fetchPaymentsByUser } from '../../store/slices/paymentsSlice';

import '../../styles/components/booking/_bookings.scss';
import '../../styles/components/_cards.scss';

const MyBookings = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [notification, setNotification] = useState({ message: '', type: '' });

	const { isAuthenticated, user } = useAppSelector((state) => state.auth);
	const { bookings, status, error, page, totalPages, totalElements } = useAppSelector(
		(state) => state.bookings,
	);
	const { payments } = useAppSelector((state) => state.payments);

	// Shared enrichment hook (replaces manual useEffect)
	const enrichedBookings = useEnrichedBookings(bookings, payments);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		dispatch(fetchMyBookings({ page, size: 5 }));

		if (user?.id) {
			dispatch(fetchPaymentsByUser({ userId: user.id, pageable: { page: 0, size: 50 } }));
		}
	}, [isAuthenticated, navigate, dispatch, page, user]);

	useEffect(() => {
		if (status === 'succeeded' && bookings.length === 0 && page > 0) {
			dispatch(setPage(page - 1));
			dispatch(fetchMyBookings({ page: page - 1, size: 5 }));
		}
	}, [status, bookings, page, dispatch]);

	const handlePageChange = (newPage: number) => {
		dispatch(setPage(newPage));
	};

	const handleCancelBooking = async (bookingId: number) => {
		try {
			await dispatch(cancelBooking(bookingId)).unwrap();
			setNotification({
				message: 'Bронювання успiшно скасовано!',
				type: 'success',
			});
		} catch {
			setNotification({
				message: 'Не вдалося скасувати бронювання.',
				type: 'danger',
			});
		}
	};

	const handlePayBooking = (bookingId: number) => {
		navigate(`/payment/${bookingId}`);
	};

	if (status === 'loading') {
		return (
			<div className="container page">
				<h1 className="text-center">Мої бронювання</h1>
				<p className="text-center">Завантаження...</p>
			</div>
		);
	}

	const filteredBookings = enrichedBookings.filter((booking) => booking.status !== 'CANCELED');

	const hasBookings = totalElements > 0;
	const hasActiveBookingsOnThisPage = filteredBookings.length > 0;

	return (
		<div className="container page">
			<h1 className="text-center">Мої бронювання</h1>
			{error && <Notification message={error} type="danger" />}
			{notification.message && (
				<Notification message={notification.message} type={notification.type} />
			)}

			{hasActiveBookingsOnThisPage ? (
				<BookingList
					bookings={filteredBookings}
					onCancel={handleCancelBooking}
					onPay={handlePayBooking}
					page={page}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			) : hasBookings ? (
				<p className="text-center mt-5">
					На цій сторінці немає активних бронювань. Спробуйте{' '}
					<button
						type="button"
						className="btn btn-link p-0 align-baseline"
						onClick={() => handlePageChange(0)}
					>
						повернутись на першу сторінку
					</button>{' '}
					або перейдіть на інші сторінки.
				</p>
			) : (
				<p className="text-center mt-5">У вас поки що немає бронювань.</p>
			)}
		</div>
	);
};

export default MyBookings;
