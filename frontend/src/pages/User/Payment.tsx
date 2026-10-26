import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import StatusBadge from '../../components/status/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearPaymentsError, createPayment } from '../../store/slices/paymentsSlice';
import type { Booking } from '../../types';
import { calcNights, formatDate } from '../../utils/dateCalc';
import { localized, mapCity } from '../../utils/translations';
import '../../styles/components/payment/_payment-checkout.scss';

const Payment = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const dispatch = useAppDispatch();
	const { bookingId } = useParams();

	const { payment: newPayment, createStatus } = useAppSelector((s) => s.payments);

	const [booking, setBooking] = useState<Booking | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadFailed, setLoadFailed] = useState(false);

	useEffect(() => {
		dispatch(clearPaymentsError());
	}, [dispatch]);

	useEffect(() => {
		if (!bookingId) {
			setLoadFailed(true);
			setLoading(false);
			return;
		}

		let isCurrent = true;
		setLoading(true);
		setLoadFailed(false);

		// The booking already includes its accommodation and payment — no extra requests needed
		fetchBookingById(bookingId)
			.then((data) => {
				if (isCurrent) setBooking(data);
			})
			.catch(() => {
				if (isCurrent) setLoadFailed(true);
			})
			.finally(() => {
				if (isCurrent) setLoading(false);
			});

		return () => {
			isCurrent = false;
		};
	}, [bookingId]);

	const existingPayment = booking?.payment ?? null;
	const nights = booking ? calcNights(booking.checkInDate, booking.checkOutDate) : 0;
	// The amount the server charges wins; the client-side estimate is only a fallback for display
	const amount = existingPayment?.amount ?? nights * (booking?.accommodation?.dailyRate ?? 0);

	const handlePay = () => {
		// Reuse the Stripe session only while the payment is still pending; a canceled/failed one is recreated
		if (existingPayment?.status === 'PENDING' && existingPayment.sessionUrl) {
			try {
				const url = new URL(existingPayment.sessionUrl);
				if (url.protocol === 'https:') {
					window.location.href = existingPayment.sessionUrl;
					return;
				}
			} catch {
				/* invalid URL — fall through */
			}
		}
		dispatch(createPayment({ bookingId: Number(bookingId), paymentType: 'PAYMENT' }));
	};

	useEffect(() => {
		if (newPayment?.sessionUrl) {
			try {
				const url = new URL(newPayment.sessionUrl as string);
				if (url.protocol === 'https:') {
					window.location.href = newPayment.sessionUrl as string;
				}
			} catch {
				/* invalid URL — ignore */
			}
		}
	}, [newPayment]);

	if (loading)
		return (
			<div className="payment-page">
				<p className="text-center">{t('common.loading')}</p>
			</div>
		);

	if (loadFailed || !booking)
		return (
			<div className="payment-page">
				<div className="payment-card payment-checkout">
					<p className="text-center">{t('payment.loadError')}</p>
					<Link to="/my-bookings" className="payment-button">
						{t('payment.backToBookings')}
					</Link>
				</div>
			</div>
		);

	const isPaid = existingPayment?.status === 'PAID';
	const isCanceled = booking.status === 'CANCELED';

	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2 className="payment-title">{isPaid ? t('payment.successTitle') : t('payment.title')}</h2>
				<p className="payment-subtitle">
					{isPaid ? t('payment.paidDescription') : t('payment.subtitle')}
				</p>

				{existingPayment && (
					<div className="payment-status-row">
						<StatusBadge status={existingPayment.status} context="payment" />
					</div>
				)}

				<div className="payment-info">
					<p>
						<strong>{t('payment.accommodation')}:</strong>{' '}
						{localized(booking?.accommodation?.name, booking?.accommodation?.nameUk, lang) || '—'},{' '}
						{mapCity(booking?.accommodation?.city ?? '', t) || '—'}
					</p>
					<p>
						<strong>{t('payment.address')}:</strong>{' '}
						{localized(
							booking?.accommodation?.location,
							booking?.accommodation?.locationUk,
							lang,
						) || '—'}
					</p>
					<p>
						<strong>{t('payment.dates')}:</strong>{' '}
						{booking?.checkInDate ? formatDate(booking.checkInDate) : ''} →{' '}
						{booking?.checkOutDate ? formatDate(booking.checkOutDate) : ''}
					</p>
					<p className="payment-amount">
						<span className="icon">💰</span> {amount || '—'} ₴
					</p>
				</div>

				{isPaid && (
					<Link to="/my-payments" className="payment-button">
						{t('payment.backToPayments')}
					</Link>
				)}
				{isCanceled && !isPaid && <p className="text-center">{t('payment.bookingCanceled')}</p>}
				{!isPaid && !isCanceled && (
					<button
						type="button"
						className="payment-button"
						onClick={handlePay}
						disabled={createStatus === 'loading'}
					>
						<span className="icon">💳</span>{' '}
						{createStatus === 'loading' ? t('common.processing') : t('payment.payNow')}
					</button>
				)}

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
