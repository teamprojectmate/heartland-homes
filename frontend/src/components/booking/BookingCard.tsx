import { TrashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';
import BookingStatusBlock from '../BookingStatusBlock';
import StatusSelect from '../selects/StatusSelect';

import '../../styles/components/booking/_booking-card.scss';

const fallbackImage = '/no-image.png';

type BookingCardProps = {
	booking: any;
	onCancel?: (id: any) => void;
	onPay?: (id: any) => void;
	onStatusChange?: (booking: any, status: string) => void;
	onDelete?: (id: any) => void;
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
	const imageUrl = booking.accommodation?.image
		? fixDropboxUrl(booking.accommodation.image)
		: fallbackImage;

	const isPaid = booking.payment?.status === 'PAID';

	return (
		<div className="booking-card">
			{/* Фото */}
			<div className="booking-card-image-wrapper">
				<img
					src={imageUrl}
					alt={booking.accommodation?.name || 'Зображення помешкання'}
					className="booking-card-image"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.onerror = null;
						target.src = fallbackImage;
					}}
				/>
			</div>

			{/* Контент */}
			<div className="booking-card-content">
				<div className="booking-card-header">
					<h4 className="booking-card-title">{booking.accommodation?.name || 'Без назви'}</h4>
					<p className="booking-card-location">{booking.accommodation?.city || 'Невідоме місто'}</p>
				</div>

				<div className="booking-card-info">
					<p>
						<strong>Дата заїзду:</strong> {booking.checkInDate}
					</p>
					<p>
						<strong>Дата виїзду:</strong> {booking.checkOutDate}
					</p>

					{/* 🔹 Статуси */}
					<BookingStatusBlock booking={booking} />

					{showAdminControls && booking.user && (
						<p>
							<strong>Користувач:</strong> {booking.user.firstName} {booking.user.lastName} (
							{booking.user.email})
						</p>
					)}
				</div>

				{/* Ціна */}
				{booking.totalPrice && (
					<p className="booking-card-price">
						<strong>{booking.totalPrice} грн</strong>
					</p>
				)}

				{/* Кнопки */}
				<div className="booking-card-actions">
					{!showAdminControls && (
						<>
							<Link to={`/my-bookings/${booking.id}`} className="btn btn-primary">
								Деталі
							</Link>
							{booking.status === 'PENDING' && !isPaid && (
								<button type="button" className="btn btn-warning" onClick={() => onPay(booking.id)}>
									Оплатити
								</button>
							)}
							{!isPaid && booking.status !== 'CANCELED' && (
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => onCancel(booking.id)}
								>
									Скасувати
								</button>
							)}
						</>
					)}

					{showAdminControls && (
						<>
							<StatusSelect
								value={booking.status}
								onChange={(newStatus) => onStatusChange(booking, newStatus)}
							/>
							<button
								type="button"
								className="btn-icon btn-danger"
								onClick={() => onDelete(booking.id)}
								title="Видалити бронювання"
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
