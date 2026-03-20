import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import Notification from '../../components/Notification';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPayment } from '../../store/slices/paymentsSlice';
import type { Booking } from '../../types';
import '../../styles/components/payment/_payment-checkout.scss';
import { calcNights } from '../../utils/dateCalc';

const Payment = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { bookingId } = useParams();

	const { payment, createStatus, error } = useAppSelector((s) => s.payments);

	const [booking, setBooking] = useState<Booking | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadBooking = async () => {
			try {
				if (!bookingId) return;
				const data = await fetchBookingById(bookingId);

				let accommodation = null;
				try {
					accommodation = await getAccommodationById(data.accommodationId);
				} catch (_err) {
					/* error handled silently */
				}

				const nights = calcNights(data.checkInDate, data.checkOutDate);

				const calculatedPrice =
					data.totalPrice || (accommodation?.dailyRate ? accommodation.dailyRate * nights : 0);

				setBooking({
					...data,
					accommodation: accommodation ?? undefined,
					totalPrice: calculatedPrice,
				});
			} catch (_err) {
				/* error handled silently */
			} finally {
				setLoading(false);
			}
		};
		loadBooking();
	}, [bookingId]);

	const handlePay = () => {
		dispatch(createPayment({ bookingId: Number(bookingId), paymentType: 'PAYMENT' }));
	};

	useEffect(() => {
		if (payment?.sessionUrl) {
			try {
				const url = new URL(payment.sessionUrl as string);
				if (url.protocol === 'https:') {
					window.location.href = payment.sessionUrl as string;
				}
			} catch {
				/* invalid URL — ignore */
			}
		}
	}, [payment]);

	if (loading)
		return (
			<div className="payment-page">
				<p className="text-center">{t('common.loading')}</p>
			</div>
		);

	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2 className="payment-title">{t('payment.title')}</h2>
				<p className="payment-subtitle">{t('payment.subtitle')}</p>

				{error && <Notification type="danger" message={error} />}

				<div className="payment-info">
					<p>
						<strong>{t('payment.accommodation')}:</strong> {booking?.accommodation?.name || '—'},{' '}
						{booking?.accommodation?.city || '—'}
					</p>
					<p>
						<strong>{t('payment.address')}:</strong> {booking?.accommodation?.location || '—'}
					</p>
					<p>
						<strong>{t('payment.dates')}:</strong> {booking?.checkInDate} → {booking?.checkOutDate}
					</p>
					<p className="payment-amount">
						<span className="icon">💰</span> {booking?.totalPrice || '—'} ₴
					</p>
				</div>

				<button
					type="button"
					className="payment-button"
					onClick={handlePay}
					disabled={createStatus === 'loading'}
				>
					<span className="icon">💳</span>{' '}
					{createStatus === 'loading' ? t('common.processing') : t('payment.payNow')}
				</button>

				<div className="payment-systems">
					<span className="powered">Powered by</span>
					<img src="/assets/stripe.svg" alt="Stripe" className="system-logo stripe" />
					<div className="cards">
						<img src="/assets/visa.svg" alt="Visa" className="system-logo" />
						<img src="/assets/mastercard.svg" alt="Mastercard" className="system-logo" />
						<img src="/assets/applepay.svg" alt="Apple Pay" className="system-logo" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Payment;
