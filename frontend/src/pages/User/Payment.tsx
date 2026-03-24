import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import { fetchPaymentsByUser } from '../../api/payments/paymentService';
import StatusBadge from '../../components/status/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearPaymentsError, createPayment } from '../../store/slices/paymentsSlice';
import type { Booking, Payment as PaymentType } from '../../types';
import { calcNights, formatDate } from '../../utils/dateCalc';
import { localized, mapCity } from '../../utils/translations';
import '../../styles/components/payment/_payment-checkout.scss';

const Payment = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const dispatch = useAppDispatch();
	const { bookingId } = useParams();

	const { payment: newPayment, createStatus } = useAppSelector((s) => s.payments);
	const { user } = useAppSelector((s) => s.auth);

	const [booking, setBooking] = useState<Booking | null>(null);
	const [existingPayment, setExistingPayment] = useState<PaymentType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		dispatch(clearPaymentsError());
	}, [dispatch]);

	useEffect(() => {
		const loadData = async () => {
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

				// Check if payment already exists for this booking
				if (user?.id) {
					try {
						const paymentsData = await fetchPaymentsByUser(user.id, {
							page: 0,
							size: 100,
						});
						const found = paymentsData.content?.find((p) => p.bookingId === Number(bookingId));
						if (found) {
							setExistingPayment(found);
						}
					} catch (_err) {
						/* no existing payment — will create new */
					}
				}
			} catch (_err) {
				/* error handled silently */
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [bookingId, user?.id]);

	const handlePay = () => {
		// If existing payment has session URL, redirect to it
		if (existingPayment?.sessionUrl) {
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

	const isPaid = existingPayment?.status === 'PAID';

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
						<span className="icon">💰</span> {booking?.totalPrice || '—'} ₴
					</p>
				</div>

				{isPaid ? (
					<Link to="/my-payments" className="payment-button">
						{t('payment.backToPayments')}
					</Link>
				) : (
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
