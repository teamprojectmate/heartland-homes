import { useTranslation } from 'react-i18next';
import type { Booking } from '../types';
import { normalizeBooking } from '../utils/normalizeBooking';
import StatusBadge from './status/StatusBadge';

const BookingStatusBlock = ({ booking }: { booking: Booking }) => {
	const { t } = useTranslation();
	const enrichedBooking = normalizeBooking(booking as Record<string, unknown>) as Booking;

	if (!enrichedBooking) return null;

	return (
		<div className="booking-status-block">
			<p>
				<strong>{t('booking.bookingStatus')}:</strong>{' '}
				<StatusBadge status={enrichedBooking.status} />
			</p>

			<p>
				<strong>{t('booking.payment')}:</strong>{' '}
				{enrichedBooking.payment?.status ? (
					<StatusBadge status={enrichedBooking.payment.status} />
				) : (
					<span className="badge badge-status badge-status-unknown">—</span>
				)}
			</p>
		</div>
	);
};

export default BookingStatusBlock;
