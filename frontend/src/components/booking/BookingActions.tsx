import { useTranslation } from 'react-i18next';
import type { Booking } from '../../types';
import { normalizeBooking } from '../../utils/normalizeBooking';

type BookingActionsProps = {
	booking: Booking;
	onCancel: (id: number) => void;
	onPay: (id: number) => void;
	onDelete: (id: number) => void;
};

const BookingActions = ({ booking, onCancel, onPay, onDelete }: BookingActionsProps) => {
	const { t } = useTranslation();
	const enrichedBooking = normalizeBooking(booking as Record<string, unknown>) as Booking;
	const hasPayment = !!enrichedBooking?.payment;
	const isPaid = enrichedBooking?.payment?.status === 'PAID';

	return (
		<div className="booking-actions">
			{!hasPayment && enrichedBooking.status === 'PENDING' && (
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
