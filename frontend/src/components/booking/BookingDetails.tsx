import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Booking } from '../../types';
import BookingStatusBlock from '../BookingStatusBlock';
import BookingActions from './BookingActions';
import BookingInfo from './BookingInfo';

import '../../styles/components/booking/_booking-card.scss';
import '../../styles/components/booking/_booking-details.scss';

type BookingDetailsProps = {
	booking: Booking;
	onCancel: (id: number) => void;
	onDelete: (id: number) => void;
	onPay: (id: number) => void;
};

const BookingDetails = ({ booking, onCancel, onDelete, onPay }: BookingDetailsProps) => {
	const { t } = useTranslation();

	const enrichedBooking = useMemo(() => {
		if (!booking) return null;
		let fixedStatus = booking.status;
		if (booking.payment?.status === 'PAID' && booking.status === 'PENDING') {
			fixedStatus = 'CONFIRMED';
		}
		return { ...booking, status: fixedStatus };
	}, [booking]);

	if (!enrichedBooking) return null;

	return (
		<div className="container booking-details-page">
			<h1 className="section-heading">{t('booking.detailsTitle')}</h1>

			<div className="details-grid">
				<BookingInfo booking={enrichedBooking} />

				<div className="details-actions">
					<BookingStatusBlock booking={enrichedBooking} />

					<BookingActions
						booking={enrichedBooking}
						onCancel={onCancel}
						onDelete={onDelete}
						onPay={onPay}
					/>
				</div>
			</div>
		</div>
	);
};

export default BookingDetails;
