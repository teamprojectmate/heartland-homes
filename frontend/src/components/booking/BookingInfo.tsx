import { useTranslation } from 'react-i18next';
import type { Booking } from '../../types';
import { formatDate } from '../../utils/dateCalc';
import { mapStatus } from '../../utils/translations';

const BookingInfo = ({ booking }: { booking: Booking }) => {
	const { t } = useTranslation();
	const { label, color, slug } = mapStatus(booking.status, t);

	return (
		<div className="booking-info">
			{booking.user && (
				<p>
					<strong>{t('booking.user')}:</strong> {booking.user.firstName} {booking.user.lastName} (
					{booking.user.email})
				</p>
			)}
			{booking.accommodation && (
				<p>
					<strong>{t('accommodations.accommodation')}:</strong> {booking.accommodation.name} (
					{booking.accommodation.city})
				</p>
			)}
			<p>
				<strong>{t('booking.checkInDate')}:</strong> {formatDate(booking.checkInDate)}
			</p>
			<p>
				<strong>{t('booking.checkOutDate')}:</strong> {formatDate(booking.checkOutDate)}
			</p>
			<p>
				<strong>{t('booking.status')}:</strong>{' '}
				<span className={`status-badge status-${slug}`} style={{ backgroundColor: color }}>
					{label}
				</span>
			</p>
			{booking.totalPrice && (
				<p>
					<strong>{t('admin.price')}:</strong> {booking.totalPrice} {t('common.currency')}
				</p>
			)}
		</div>
	);
};

export default BookingInfo;
