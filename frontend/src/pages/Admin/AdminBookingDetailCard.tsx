import { TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

export type BookingRow = Record<string, unknown> & {
	id: number;
	accommodation?: { name?: string } | null;
	user?: { firstName: string; lastName: string; email: string } | null;
	userId?: number;
	checkInDate: string;
	checkOutDate: string;
	totalPrice?: number | null;
	status: string;
};

type Props = {
	booking: BookingRow;
	onStatusChange: (booking: BookingRow, status: string) => void;
	onDelete: (id: number) => void;
};

const AdminBookingDetailCard = ({ booking, onStatusChange, onDelete }: Props) => {
	const { t } = useTranslation();
	return (
		<div className="admin-booking-card">
			<h3 className="admin-booking-title">{booking.accommodation?.name || t('common.noName')}</h3>
			<p>
				<strong>{t('admin.user')}:</strong>{' '}
				{booking.user
					? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
					: booking.userId || '—'}
			</p>
			<p>
				<strong>{t('admin.dates')}:</strong> {booking.checkInDate} — {booking.checkOutDate}
			</p>
			<p>
				<strong>{t('admin.price')}:</strong>{' '}
				{booking.totalPrice ? `${booking.totalPrice} ${t('common.currency')}` : '—'}
			</p>
			<p>
				<strong>{t('admin.status')}:</strong>{' '}
				<span className={`badge badge-status ${booking.status.toLowerCase()}`}>
					{t(`bookingStatus.${booking.status.toLowerCase()}`)}
				</span>
			</p>

			<div className="card-actions">
				<select value={booking.status} onChange={(e) => onStatusChange(booking, e.target.value)}>
					<option value="PENDING">{t('bookingStatus.pending')}</option>
					<option value="CONFIRMED">{t('bookingStatus.confirmed')}</option>
					<option value="CANCELED">{t('bookingStatus.canceled')}</option>
					<option value="EXPIRED">{t('bookingStatus.expired')}</option>
				</select>
				<button
					type="button"
					className="btn-icon btn-danger"
					onClick={() => onDelete(booking.id)}
					title={t('admin.deleteBooking')}
				>
					<TrashIcon className="w-4 h-4 text-white" />
				</button>
			</div>
		</div>
	);
};

export default AdminBookingDetailCard;
