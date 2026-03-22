import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import ErrorState from '../../components/ErrorState';
import StatusSelect from '../../components/selects/StatusSelect';
import { FormSkeleton } from '../../components/skeletons';
import { useAppDispatch } from '../../store/hooks';
import { deleteBooking, updateBookingStatus } from '../../store/slices/bookingsSlice';
import type { Accommodation, Booking, BookingStatus } from '../../types';
import { calcNights, formatDate } from '../../utils/dateCalc';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { localized, mapCity, mapStatus } from '../../utils/translations';

import '../../styles/components/booking/_booking-details.scss';

const fallbackImage = '/no-image.png';

const AdminBookingDetails = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [booking, setBooking] = useState<Booking | null>(null);
	const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!id) return;
				const bookingData = await fetchBookingById(id);
				if (!bookingData) {
					setError(t('booking.notFoundError'));
					setLoading(false);
					return;
				}
				setBooking(bookingData);

				try {
					const acc = await getAccommodationById(bookingData.accommodationId);
					setAccommodation(acc);
				} catch {
					/* accommodation fetch failed silently */
				}
			} catch {
				setError(t('booking.loadError'));
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id, t]);

	const handleStatusChange = (newStatus: string) => {
		if (!booking) return;
		dispatch(updateBookingStatus({ booking, status: newStatus }));
		setBooking({ ...booking, status: newStatus as BookingStatus });
	};

	const handleDelete = () => {
		if (!booking) return;
		if (window.confirm(t('booking.deleteConfirm'))) {
			dispatch(deleteBooking(booking.id));
			navigate('/admin/bookings');
		}
	};

	if (loading) return <FormSkeleton />;
	if (error || !booking)
		return (
			<div className="container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
				<ErrorState message={error || t('booking.notFoundError')} />
				<Link to="/admin/bookings" className="btn-primary" style={{ marginTop: '1rem' }}>
					{t('common.back')}
				</Link>
			</div>
		);

	const { label: statusLabel, color: statusColor } = mapStatus(booking.status, t);
	const nights = calcNights(booking.checkInDate, booking.checkOutDate);
	const totalPrice = accommodation ? nights * accommodation.dailyRate : null;
	const imageUrl = accommodation?.image ? fixDropboxUrl(accommodation.image) : fallbackImage;

	return (
		<div className="booking-details-page container">
			<div className="booking-details-header">
				<Link to="/admin/bookings" className="btn-secondary" style={{ marginBottom: '1rem' }}>
					← {t('booking.backToList')}
				</Link>
				<h1 className="section-heading">{t('booking.detailsTitle')}</h1>
			</div>

			<div className="booking-details-card">
				<div className="booking-details-image">
					<img
						src={imageUrl}
						alt={
							localized(accommodation?.name, accommodation?.nameUk, lang) ||
							t('accommodations.imageAlt')
						}
						onError={(e) => (e.currentTarget.src = fallbackImage)}
					/>
				</div>

				<div className="booking-details-info">
					<h3>
						{localized(accommodation?.name, accommodation?.nameUk, lang) ||
							t('accommodations.noName')}
					</h3>
					<p className="booking-location">
						{mapCity(accommodation?.city, t)},{' '}
						{localized(accommodation?.location, accommodation?.locationUk, lang)}
					</p>

					<div className="booking-details-content">
						<p>
							<strong>{t('booking.checkInDate')}:</strong> {formatDate(booking.checkInDate)}
						</p>
						<p>
							<strong>{t('booking.checkOutDate')}:</strong> {formatDate(booking.checkOutDate)}
						</p>
						<p>
							<strong>{t('booking.totalPrice')}:</strong>{' '}
							{totalPrice ? `${totalPrice} ${t('common.currency')}` : '—'}
						</p>
						<p>
							<strong>{t('booking.status')}:</strong>{' '}
							<span className="status-badge" style={{ backgroundColor: statusColor }}>
								{statusLabel}
							</span>
						</p>
					</div>

					<div
						className="booking-details-actions"
						style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
					>
						<StatusSelect type="booking" value={booking.status} onChange={handleStatusChange} />
						<button type="button" className="btn-danger" onClick={handleDelete}>
							{t('common.delete')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminBookingDetails;
