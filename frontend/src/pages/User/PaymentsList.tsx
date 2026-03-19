import { useEffect, useMemo, useState } from 'react';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaymentsByUser } from '../../store/slices/paymentsSlice';
import '../../styles/components/payment/_payments-list.scss';

const PaymentsList = () => {
	const dispatch = useAppDispatch();
	const { fetchStatus, error, totalPages } = useAppSelector((state) => state.payments);
	const { isAuthenticated, user } = useAppSelector((state) => state.auth);

	const [page, setPage] = useState(0);
	const [enrichedPayments, setEnrichedPayments] = useState([]);
	const size = 5;

	const pageable = useMemo(() => ({ page, size, sort: ['id,desc'] }), [page]);

	useEffect(() => {
		const loadPayments = async () => {
			if (isAuthenticated && user?.id) {
				const action = await dispatch(fetchPaymentsByUser({ userId: user.id, pageable }));
				const data = action.payload?.content || [];

				// підвантажуємо бронювання + житло
				const enriched = await Promise.all(
					data.map(async (p) => {
						try {
							const booking = await fetchBookingById(p.bookingId);
							const accommodation = await getAccommodationById(booking.accommodationId);
							return { ...p, booking, accommodation };
						} catch {
							return p;
						}
					}),
				);

				setEnrichedPayments(enriched);
			}
		};

		loadPayments();
	}, [dispatch, isAuthenticated, user, pageable]);

	if (fetchStatus === 'loading') return <p className="text-center">Завантаження...</p>;
	if (error) return <Notification message={error} type="danger" />;

	return (
		<div className="container payments-page">
			<h2 className="auth-title">Мої платежі</h2>

			{enrichedPayments.length === 0 ? (
				<p className="text-center">У вас ще немає платежів.</p>
			) : (
				<>
					<div className="payments-grid">
						{enrichedPayments.map((p) => (
							<div className={`payment-card ${p.status.toLowerCase()}`} key={p.id}>
								<div className="payment-card-header">
									<h4>
										<span className="icon-chip">💳</span> Платіж #{p.id}
									</h4>
								</div>

								<div className="payment-card-body">
									<p>
										<strong>Помешкання:</strong> {p.accommodation?.name || '—'}
									</p>
									<p>
										<strong>Адреса:</strong> {p.accommodation?.location || '—'}
									</p>
									<div className="payment-amount">
										<div className="left">
											<span className="icon">💰</span>
											{p.amountToPay} ₴
										</div>
										<img src="/assets/visa.svg" alt="VISA" className="system-logo" />
									</div>
									<p>
										<strong>Тип:</strong> {p.paymentType === 'PAYMENT' ? 'Оплата' : p.paymentType}
									</p>
								</div>

								<div className="payment-card-footer">
									{p.status !== 'PAID' && p.sessionUrl ? (
										<a
											href={p.sessionUrl}
											target="_blank"
											rel="noreferrer"
											className="btn btn-primary"
										>
											Оплатити
										</a>
									) : (
										<span className="btn btn-sm btn-success">✅ Оплачено</span>
									)}
								</div>
							</div>
						))}
					</div>

					<Pagination
						page={page}
						totalPages={totalPages}
						onPageChange={(newPage) => setPage(newPage)}
					/>
				</>
			)}
		</div>
	);
};

export default PaymentsList;
