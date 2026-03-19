import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaymentsByUser } from '../../store/slices/paymentsSlice';
import '../../styles/components/payment/_payments-list.scss';

const PaymentsList = () => {
	const { t } = useTranslation();
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

	if (fetchStatus === 'loading') return <p className="text-center">{t('common.loading')}</p>;
	if (error) return <Notification message={error} type="danger" />;

	return (
		<div className="container payments-page">
			<h2 className="auth-title">{t('payment.myPayments')}</h2>

			{enrichedPayments.length === 0 ? (
				<p className="text-center">{t('payment.noPayments')}</p>
			) : (
				<>
					<div className="payments-grid">
						{enrichedPayments.map((p) => (
							<div className={`payment-card ${p.status.toLowerCase()}`} key={p.id}>
								<div className="payment-card-header">
									<h4>
										<span className="icon-chip">💳</span> {t('payment.paymentId', { id: p.id })}
									</h4>
								</div>

								<div className="payment-card-body">
									<p>
										<strong>{t('payment.accommodation')}:</strong> {p.accommodation?.name || '—'}
									</p>
									<p>
										<strong>{t('payment.address')}:</strong> {p.accommodation?.location || '—'}
									</p>
									<div className="payment-amount">
										<div className="left">
											<span className="icon">💰</span>
											{p.amountToPay} ₴
										</div>
										<img src="/assets/visa.svg" alt="VISA" className="system-logo" />
									</div>
									<p>
										<strong>{t('payment.type')}:</strong>{' '}
										{p.paymentType === 'PAYMENT' ? t('payment.typePayment') : p.paymentType}
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
											{t('booking.pay')}
										</a>
									) : (
										<span className="btn btn-sm btn-success">{t('payment.paidBadge')}</span>
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
