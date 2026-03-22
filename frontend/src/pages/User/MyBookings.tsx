import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookingList } from '../../components/booking/index';
import EmptyState from '../../components/EmptyState';
import Notification from '../../components/Notification';
import { CardSkeleton } from '../../components/skeletons';
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
	const { bookings, status, error, page, totalPages } = useAppSelector((state) => state.bookings);
	const { payments } = useAppSelector((state) => state.payments);

	const enrichedBookings = useEnrichedBookings(
		bookings as unknown as import('../../types').Booking[],
		payments as unknown as import('../../types').Payment[],
	);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		if (user?.id) {
			dispatch(fetchPaymentsByUser({ userId: user.id, pageable: { page: 0, size: 50 } }));
		}
	}, [isAuthenticated, navigate, dispatch, user]);

	useEffect(() => {
		if (!isAuthenticated) return;
		dispatch(fetchMyBookings({ page, size: 5 }));
	}, [isAuthenticated, dispatch, page]);

	useEffect(() => {
		if (status === 'succeeded' && bookings.length === 0 && page > 0) {
			dispatch(setPage(page - 1));
		}
	}, [status, bookings.length, page, dispatch]);

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
				<div className="page-skeleton__grid">
					<CardSkeleton />
					<CardSkeleton />
					<CardSkeleton />
				</div>
			</div>
		);
	}

	const filteredBookings = enrichedBookings.filter((booking) => booking.status !== 'CANCELED');

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
			) : (
				<EmptyState
					icon="📋"
					title={t('booking.noBookings')}
					description={t('booking.noBookingsDesc')}
					actionLabel={t('accommodations.browseAll')}
					actionTo="/accommodations"
				/>
			)}
		</div>
	);
};

export default MyBookings;
