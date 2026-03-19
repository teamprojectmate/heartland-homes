import { useTranslation } from 'react-i18next';
import { normalizeBooking } from '../../utils/normalizeBooking';

const BookingActions = ({ booking, onCancel, onPay, onDelete }) => {
	const { t } = useTranslation();
	const enrichedBooking = normalizeBooking(booking);
	const isPaid = enrichedBooking.payment?.status === 'PAID';

	return (
		<div className="booking-actions">
			{!isPaid && enrichedBooking.status === 'PENDING' && (
				<button type="button" className="btn btn-success" onClick={() => onPay(enrichedBooking.id)}>
					{t('booking.pay')}
				</button>
			)}

			{!isPaid && enrichedBooking.status !== 'CANCELED' && (
				<button
					type="button"
					className="btn btn-danger"
					onClick={() => onCancel(enrichedBooking.id)}
				>
					{t('booking.cancelBooking')}
				</button>
			)}

			{enrichedBooking.status === 'CANCELED' && (
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => onDelete(enrichedBooking.id)}
				>
					{t('booking.deleteBooking')}
				</button>
			)}
		</div>
	);
};

export default BookingActions;
