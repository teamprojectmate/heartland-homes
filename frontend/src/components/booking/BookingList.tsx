import { useTranslation } from 'react-i18next';
import type { Booking } from '../../types';
import Notification from '../Notification';
import Pagination from '../Pagination';
import BookingCard from './BookingCard';
import BookingRow from './BookingRow';

import '../../styles/components/booking/_bookings.scss';

type BookingListProps = {
	bookings?: Booking[];
	view?: string;
	onCancel?: (id: number) => void;
	onPay?: (id: number) => void;
	onDelete?: (id: number) => void;
	page?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	error?: string;
};

const BookingList = ({
	bookings = [],
	view = 'card',
	onCancel,
	onPay,
	onDelete,
	page,
	totalPages,
	onPageChange,
	error,
}: BookingListProps) => {
	const { t } = useTranslation();

	if (error) return <Notification message={error} type="danger" />;

	if (!bookings || bookings.length === 0) {
		return <p className="text-center mt-5">{t('booking.noBookingsYet')}</p>;
	}

	return (
		<div className="booking-list">
			{view === 'card' ? (
				<div className="booking-card-list">
					{bookings.map((booking) => (
						<BookingCard
							key={booking.id}
							booking={booking}
							onCancel={onCancel}
							onPay={onPay}
							onDelete={onDelete}
						/>
					))}
				</div>
			) : (
				<div className="bookings-table">
					{bookings.map((booking) => (
						<BookingRow
							key={booking.id}
							booking={booking}
							onCancel={onCancel}
							onPay={onPay}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}

			{totalPages > 0 && (
				<div className="pagination-wrapper">
					<Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
				</div>
			)}
		</div>
	);
};

export default BookingList;
