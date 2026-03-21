import { TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import StatusSelect from '../../components/selects/StatusSelect';
import { formatDate } from '../../utils/dateCalc';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';

const fallbackImage = '/assets/no-image.svg';

type AdminBookingCardProps = {
	booking: Record<string, unknown> & {
		accommodation?: { image?: string; name?: string };
		user?: { firstName: string; lastName: string; email: string };
		userId?: number;
		checkInDate: string;
		checkOutDate: string;
		totalPrice?: number;
		status: string;
		payment?: { status: string };
		id: number;
	};
	onDelete: (id: number) => void;
	onStatusChange: (booking: Record<string, unknown>, newStatus: string) => void;
};

const AdminBookingCard = ({ booking, onDelete, onStatusChange }: AdminBookingCardProps) => {
	const { t } = useTranslation();

	const image = booking.accommodation?.image
		? fixDropboxUrl(booking.accommodation.image)
		: fallbackImage;

	return (
		<div className="admin-booking-card">
			<img
				src={image}
				alt={booking.accommodation?.name || t('accommodations.accommodation')}
				className="booking-card-img"
				onError={(e) => (e.currentTarget.src = fallbackImage)}
			/>

			<div className="booking-card-content">
				<div className="card-header">
					<h3 className="admin-booking-title">
						{booking.accommodation?.name || t('accommodations.noName')}
					</h3>
				</div>

				<div className="card-body">
					<p>
						<strong>{t('booking.user')}:</strong>{' '}
						{booking.user
							? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
							: booking.userId || '—'}
					</p>

					<p>
						<strong>{t('booking.dates')}:</strong> {formatDate(booking.checkInDate)} →{' '}
						{formatDate(booking.checkOutDate)}
					</p>

					<p className="price">
						<strong>{t('booking.totalPrice')}:</strong>{' '}
						{booking.totalPrice ? `${booking.totalPrice} ${t('common.currency')}` : '—'}
					</p>

					<p>
						<strong>{t('booking.status')}:</strong>{' '}
						<span className={`badge badge-status badge-status-${booking.status.toLowerCase()}`}>
							{booking.status === 'PENDING' && t('status.pending')}
							{booking.status === 'CONFIRMED' && t('status.confirmed')}
							{booking.status === 'CANCELED' && t('status.cancelled')}
							{booking.status === 'EXPIRED' && t('status.expired')}
						</span>
					</p>

					<p>
						<strong>{t('booking.payment')}:</strong>{' '}
						{booking.payment ? (
							<span
								className={`badge ${
									booking.payment.status === 'PAID' ? 'badge-status-paid' : 'badge-status-pending'
								}`}
							>
								{booking.payment.status === 'PAID' ? t('status.paid') : t('status.awaitingPayment')}
							</span>
						) : (
							<span className="badge badge-status badge-status-unknown">—</span>
						)}
					</p>
				</div>

				<div className="card-actions">
					<StatusSelect
						type="booking"
						value={booking.status}
						onChange={(newStatus) => onStatusChange(booking, newStatus)}
					/>

					<button
						type="button"
						className="btn-inline btn-danger"
						onClick={() => onDelete(booking.id)}
					>
						<TrashIcon className="w-4 h-4" />
						{t('common.delete')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminBookingCard;
