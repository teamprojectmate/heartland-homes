import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [notification, setNotification] = useState({ message: '', type: '' });

	const { isAuthenticated, user } = useAppSelector((state) => state.auth);
	const { bookings, status, error, page, totalPages, totalElements } = useAppSelector(
		(state) => state.bookings,
	);
	const { payments } = useAppSelector((state) => state.payments);

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
				message: t('booking.cancelSuccess'),
				type: 'success',
			});
		} catch {
			setNotification({
				message: t('booking.cancelError'),
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
				<h1 className="text-center">{t('booking.myBookings')}</h1>
				<p className="text-center">{t('common.loading')}</p>
			</div>
		);
	}

	const filteredBookings = enrichedBookings.filter((booking) => booking.status !== 'CANCELED');

	const hasBookings = totalElements > 0;
	const hasActiveBookingsOnThisPage = filteredBookings.length > 0;

	return (
		<div className="container page">
			<h1 className="text-center">{t('booking.myBookings')}</h1>
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
					{t('booking.noActiveBookings')}{' '}
					<button
						type="button"
						className="btn btn-link p-0 align-baseline"
						onClick={() => handlePageChange(0)}
					>
						{t('booking.goToFirstPage')}
					</button>{' '}
					{t('booking.orOtherPages')}
				</p>
			) : (
				<p className="text-center mt-5">{t('booking.noBookings')}</p>
			)}
		</div>
	);
};

export default MyBookings;
