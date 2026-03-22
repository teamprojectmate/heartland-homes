import { TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Booking } from '../../types';
import { formatDate } from '../../utils/dateCalc';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import { localized, mapCity } from '../../utils/translations';
import BookingStatusBlock from '../BookingStatusBlock';
import StatusSelect from '../selects/StatusSelect';

import '../../styles/components/booking/_booking-card.scss';

const fallbackImage = '/no-image.png';

type BookingCardProps = {
	booking: Booking;
	onCancel?: (id: number) => void;
	onPay?: (id: number) => void;
	onStatusChange?: (booking: Booking, status: string) => void;
	onDelete?: (id: number) => void;
	showAdminControls?: boolean;
};

const BookingCard = ({
	booking,
	onCancel,
	onPay,
	onStatusChange,
	onDelete,
	showAdminControls = false,
}: BookingCardProps) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const imageUrl = booking.accommodation?.image
		? fixDropboxUrl(booking.accommodation.image)
		: fallbackImage;

	const isPaid = booking.payment?.status === 'PAID';

	return (
		<div className="booking-card">
			<div className="booking-card-image-wrapper">
				<img
					src={imageUrl}
					alt={
						localized(booking.accommodation?.name, booking.accommodation?.nameUk, lang) ||
						t('accommodations.imageAlt')
					}
					className="booking-card-image"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.onerror = null;
						target.src = fallbackImage;
					}}
				/>
			</div>

			<div className="booking-card-content">
				<div className="booking-card-header">
					<h4 className="booking-card-title">
						{localized(booking.accommodation?.name, booking.accommodation?.nameUk, lang) ||
							t('accommodations.noName')}
					</h4>
					<p className="booking-card-location">
						{mapCity(booking.accommodation?.city ?? '', t) || t('booking.unknownCity')}
					</p>
				</div>

				<div className="booking-card-info">
					<p>
						<strong>{t('booking.checkInDate')}:</strong> {formatDate(booking.checkInDate)}
					</p>
					<p>
						<strong>{t('booking.checkOutDate')}:</strong> {formatDate(booking.checkOutDate)}
					</p>

					<BookingStatusBlock booking={booking} />

					{showAdminControls && booking.user && (
						<p>
							<strong>{t('booking.user')}:</strong> {booking.user.firstName} {booking.user.lastName}{' '}
							({booking.user.email})
						</p>
					)}
				</div>

				{booking.totalPrice && (
					<p className="booking-card-price">
						<strong>
							{booking.totalPrice} {t('common.currency')}
						</strong>
					</p>
				)}

				<div className="booking-card-actions">
					{!showAdminControls && (
						<>
							<Link to={`/my-bookings/${booking.id}`} className="btn btn-primary">
								{t('common.details')}
							</Link>
							{booking.status === 'PENDING' && !isPaid && (
								<button
									type="button"
									className="btn btn-warning"
									onClick={() => onPay?.(booking.id)}
								>
									{t('booking.pay')}
								</button>
							)}
							{!isPaid && booking.status !== 'CANCELED' && (
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => onCancel?.(booking.id)}
								>
									{t('booking.cancelBooking')}
								</button>
							)}
						</>
					)}

					{showAdminControls && (
						<>
							<StatusSelect
								value={booking.status}
								onChange={(newStatus) => onStatusChange?.(booking, newStatus)}
							/>
							<button
								type="button"
								className="btn-icon btn-danger"
								onClick={() => onDelete?.(booking.id)}
								title={t('admin.deleteBooking')}
							>
								<TrashIcon className="w-5 h-5 text-white" />
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookingCard;
