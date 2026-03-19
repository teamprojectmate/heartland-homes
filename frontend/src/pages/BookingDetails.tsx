import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAccommodationById } from '../api/accommodations/accommodationService';
import { cancelBooking, fetchBookingById } from '../api/bookings/bookingsService';
import ErrorState from '../components/ErrorState';
import { FormSkeleton } from '../components/skeletons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteBooking } from '../store/slices/bookingsSlice';
import { fetchPaymentsByUser } from '../store/slices/paymentsSlice';
import { calcNights } from '../utils/dateCalc';
import { fixDropboxUrl } from '../utils/fixDropboxUrl';
import { mapStatus } from '../utils/translations';

import '../styles/components/booking/_booking-card.scss';
import '../styles/components/booking/_booking-details.scss';

const fallbackImage = '/no-image.png';

const BookingDetails = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { user } = useAppSelector((state) => state.auth);
	const { payments } = useAppSelector((state) => state.payments);

	const [booking, setBooking] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBooking = async () => {
			try {
				const bookingData = await fetchBookingById(id);
				if (!bookingData) {
					setError(t('booking.notFoundError'));
					setLoading(false);
					return;
				}

				let accommodation = null;
				try {
					accommodation = await getAccommodationById(bookingData.accommodationId);
				} catch (err) {
					console.warn('Could not load accommodation:', err);
				}

				setBooking({ ...bookingData, accommodation });
			} catch (err) {
				console.error('Error loading booking:', err);
				setError(t('booking.loadError'));
			} finally {
				setLoading(false);
			}
		};

		fetchBooking();
	}, [id, t]);

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchPaymentsByUser({ userId: user.id, pageable: { page: 0, size: 50 } }));
		}
	}, [user, dispatch]);

	const enrichedBooking = useMemo(() => {
		if (!booking) return null;
		const payment = payments.find((p) => p.bookingId === booking.id);

		let fixedStatus = booking.status;
		if (payment?.status === 'PAID' && booking.status === 'PENDING') {
			fixedStatus = 'CONFIRMED';
		}

		return { ...booking, payment, status: fixedStatus };
	}, [booking, payments]);

	const isPaid = enrichedBooking?.payment?.status === 'PAID';
	const imageUrl = enrichedBooking?.accommodation?.image
		? fixDropboxUrl(enrichedBooking.accommodation.image)
		: fallbackImage;

	const { label: statusLabel, color: statusColor } = enrichedBooking
		? mapStatus(enrichedBooking.status)
		: { label: '—', color: '#ccc' };

	const nights =
		enrichedBooking?.checkInDate && enrichedBooking?.checkOutDate
			? calcNights(enrichedBooking.checkInDate, enrichedBooking.checkOutDate)
			: 0;

	const totalPrice =
		enrichedBooking?.totalPrice ||
		(enrichedBooking?.accommodation?.dailyRate
			? enrichedBooking.accommodation.dailyRate * nights
			: null);

	const handleCancel = async () => {
		if (window.confirm(t('booking.cancelConfirm'))) {
			try {
				await cancelBooking(Number(id));
				setBooking((prev) => ({ ...prev, status: 'CANCELED' }));
			} catch (err) {
				console.error('Error cancelling booking:', err);
				setError(t('booking.cancelError'));
			}
		}
	};

	const handleDelete = async () => {
		if (window.confirm(t('booking.deleteConfirm'))) {
			try {
				await dispatch(deleteBooking(Number(id))).unwrap();
				navigate('/my-bookings');
			} catch (err) {
				console.error('Error deleting booking:', err);
				setError(t('booking.deleteError'));
			}
		}
	};

	const handlePay = () => {
		navigate(`/payment/${enrichedBooking.id}`, {
			state: {
				amount: totalPrice,
				accommodation: enrichedBooking.accommodation,
				dates: {
					checkIn: enrichedBooking.checkInDate,
					checkOut: enrichedBooking.checkOutDate,
				},
			},
		});
	};

	if (loading) return <FormSkeleton />;
	if (error) return <ErrorState message={String(error)} />;
	if (!enrichedBooking) return <p className="text-center">{t('booking.notFoundError')}</p>;

	return (
		<div className="container booking-details-page">
			<h1 className="section-heading">{t('booking.detailsTitle')}</h1>

			<div className="details-grid">
				<div className="booking-info-card">
					<img src={imageUrl} alt={t('accommodations.accommodation')} className="booking-image" />
					<div className="booking-info-header">
						<h3 className="card-title">
							{enrichedBooking.accommodation?.name || t('accommodations.accommodation')}
						</h3>
						<p className="card-subtitle">
							{enrichedBooking.accommodation?.city || '—'},{' '}
							{enrichedBooking.accommodation?.location || '—'}
						</p>
					</div>

					<div className="booking-details-content">
						<p>
							<strong>{t('booking.checkInDate')}:</strong> {enrichedBooking.checkInDate}
						</p>
						<p>
							<strong>{t('booking.checkOutDate')}:</strong> {enrichedBooking.checkOutDate}
						</p>
						<p>
							<strong>{t('booking.status')}:</strong>{' '}
							<span className="badge" style={{ backgroundColor: statusColor }}>
								{statusLabel}
							</span>
						</p>
						<p>
							<strong>{t('booking.payment')}:</strong>{' '}
							{isPaid ? (
								<span className="badge badge-success">{t('booking.paid')}</span>
							) : (
								<span className="badge badge-warning">{t('booking.unpaid')}</span>
							)}
						</p>
						<p className="total-price">
							<strong>{t('booking.totalPrice')}:</strong>{' '}
							{totalPrice ? (
								<span className="price">
									{totalPrice} {t('common.currency')}
								</span>
							) : (
								<span className="text-muted">—</span>
							)}
						</p>
					</div>
				</div>

				<div className="actions-card">
					<div className="booking-price">
						<span className="price">{totalPrice || '—'}</span>
						<span className="currency">{t('common.currency')}</span>
					</div>

					{!isPaid && enrichedBooking.status === 'PENDING' && (
						<button type="button" className="btn btn-success" onClick={handlePay}>
							{t('booking.pay')}
						</button>
					)}
					{!isPaid && enrichedBooking.status !== 'CANCELED' && (
						<button type="button" className="btn btn-danger" onClick={handleCancel}>
							{t('booking.cancelBooking')}
						</button>
					)}
					{enrichedBooking.status === 'CANCELED' && (
						<button type="button" className="btn btn-secondary" onClick={handleDelete}>
							{t('booking.deleteBooking')} <FaTrash />
						</button>
					)}

					<Link to="/my-bookings" className="btn btn-secondary">
						{t('booking.backToList')}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BookingDetails;
