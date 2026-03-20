import { useTranslation } from 'react-i18next';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type { Booking } from '../../types';
import { mapStatus } from '../../utils/translations';

type BookingRowProps = {
	booking: Booking;
	onCancel?: (id: number) => void;
	onPay?: (id: number) => void;
	onStatusChange?: (id: number, status: string) => void;
	onDelete?: (id: number) => void;
};

const BookingRow = ({ booking, onStatusChange, onDelete }: BookingRowProps) => {
	const { t } = useTranslation();
	const { label, color, slug } = mapStatus(booking.status, t);

	return (
		<tr>
			<td>{booking.id}</td>
			<td>{booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : '—'}</td>
			<td>
				{booking.accommodation
					? `${booking.accommodation.name} (${booking.accommodation.city})`
					: '—'}
			</td>
			<td>{booking.checkInDate}</td>
			<td>{booking.checkOutDate}</td>
			<td>
				<span className={`status-badge status-${slug}`} style={{ backgroundColor: color }}>
					{label}
				</span>
			</td>
			<td className="actions">
				<select
					value={booking.status}
					onChange={(e) => onStatusChange?.(booking.id, e.target.value)}
				>
					<option value="PENDING">{t('status.pending')}</option>
					<option value="CONFIRMED">{t('status.confirmed')}</option>
					<option value="CANCELED">{t('status.cancelled')}</option>
					<option value="EXPIRED">{t('status.expired')}</option>
				</select>

				<Link to={`/admin/bookings/${booking.id}`} className="btn-secondary btn-sm">
					<FaInfoCircle />
				</Link>

				<button type="button" className="btn-danger btn-sm" onClick={() => onDelete?.(booking.id)}>
					<FaTrash />
				</button>
			</td>
		</tr>
	);
};

export default BookingRow;
