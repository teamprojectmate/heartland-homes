import { normalizeBooking } from '../../utils/normalizeBooking';

const BookingActions = ({ booking, onCancel, onPay, onDelete }) => {
	const enrichedBooking = normalizeBooking(booking);
	const isPaid = enrichedBooking.payment?.status === 'PAID';

	return (
		<div className="booking-actions">
			{/* Оплатити */}
			{!isPaid && enrichedBooking.status === 'PENDING' && (
				<button type="button" className="btn btn-success" onClick={() => onPay(enrichedBooking.id)}>
					Оплатити
				</button>
			)}

			{/* Скасувати */}
			{!isPaid && enrichedBooking.status !== 'CANCELED' && (
				<button
					type="button"
					className="btn btn-danger"
					onClick={() => onCancel(enrichedBooking.id)}
				>
					Скасувати
				</button>
			)}

			{/* Видалити */}
			{enrichedBooking.status === 'CANCELED' && (
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => onDelete(enrichedBooking.id)}
				>
					Видалити
				</button>
			)}
		</div>
	);
};

export default BookingActions;
