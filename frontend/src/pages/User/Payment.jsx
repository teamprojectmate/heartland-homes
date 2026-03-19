import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import Notification from '../../components/Notification';
import { createPayment } from '../../store/slices/paymentsSlice';
import '../../styles/components/payment/_payment-checkout.scss';

const Payment = () => {
	const dispatch = useDispatch();
	const { bookingId } = useParams();

	const { payment, createStatus, error } = useSelector((s) => s.payments);

	const [booking, setBooking] = useState(null);
	const [loading, setLoading] = useState(true);

	// завантаження бронювання + помешкання
	useEffect(() => {
		const loadBooking = async () => {
			try {
				const data = await fetchBookingById(bookingId);

				let accommodation = null;
				try {
					accommodation = await getAccommodationById(data.accommodationId);
				} catch (err) {
					console.warn('⚠️ Не вдалося отримати помешкання', err);
				}

				// 🔹 розрахунок кількості ночей
				const checkIn = new Date(data.checkInDate);
				const checkOut = new Date(data.checkOutDate);
				const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

				// 🔹 якщо totalPrice немає в API → рахуємо самі
				const calculatedPrice =
					data.totalPrice || (accommodation?.dailyRate ? accommodation.dailyRate * nights : 0);

				setBooking({ ...data, accommodation, totalPrice: calculatedPrice });
			} catch (err) {
				console.error('❌ Помилка завантаження бронювання', err);
			} finally {
				setLoading(false);
			}
		};
		loadBooking();
	}, [bookingId]);

	const handlePay = () => {
		dispatch(createPayment({ bookingId, paymentType: 'PAYMENT' }));
	};

	useEffect(() => {
		if (payment?.sessionUrl) {
			window.location.href = payment.sessionUrl;
		}
	}, [payment]);

	if (loading) return <p className="text-center">Завантаження...</p>;

	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2 className="payment-title">💳 Оплата бронювання</h2>
				<p className="payment-subtitle">
					🔒 Захищена оплата через банківську систему. Перевірте дані перед підтвердженням.
				</p>

				{error && <Notification type="danger" message={error} />}

				{/* Інформація */}
				<div className="payment-info">
					<p>
						<strong>Помешкання:</strong> {booking?.accommodation?.name || '—'},{' '}
						{booking?.accommodation?.city || '—'}
					</p>
					<p>
						<strong>Адреса:</strong> {booking?.accommodation?.location || '—'}
					</p>
					<p>
						<strong>Дати:</strong> {booking?.checkInDate} → {booking?.checkOutDate}
					</p>
					<p className="payment-amount">
						<span className="icon">💰</span> {booking?.totalPrice || '—'} ₴
					</p>
				</div>

				{/* Кнопка */}
				<button
					type="button"
					className="payment-button"
					onClick={handlePay}
					disabled={createStatus === 'loading'}
				>
					<span className="icon">💳</span>{' '}
					{createStatus === 'loading' ? 'Обробка...' : 'Оплатити зараз'}
				</button>

				{/* Лого платіжних систем */}
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
