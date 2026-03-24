import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { fetchBookingById } from '../../api/bookings/bookingsService';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import Pagination from '../../components/Pagination';
import { CardSkeleton } from '../../components/skeletons';
import StatusBadge from '../../components/status/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaymentsByUser, resetPaymentsList } from '../../store/slices/paymentsSlice';
import type { Payment } from '../../types';
import { formatDate } from '../../utils/dateCalc';
import { localized } from '../../utils/translations';
import '../../styles/components/payment/_payments-list.scss';

type EnrichedPayment = {
	id: number;
	status: string;
	amount?: number;
	currency?: string;
	createdAt?: string;
	sessionUrl?: string;
	accommodation?: { name?: string; nameUk?: string; location?: string; locationUk?: string };
	booking?: { checkInDate?: string; checkOutDate?: string };
	bookingId: number;
	[key: string]: unknown;
};

const PaymentsList = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const dispatch = useAppDispatch();
	const { fetchStatus, error, totalPages } = useAppSelector((state) => state.payments);
	const { isAuthenticated, user } = useAppSelector((state) => state.auth);

	const [page, setPage] = useState(0);
	const [enrichedPayments, setEnrichedPayments] = useState<EnrichedPayment[]>([]);
	const size = 5;

	const pageable = useMemo(() => ({ page, size, sort: ['id,desc'] }), [page]);

	useEffect(() => {
		dispatch(resetPaymentsList());
	}, [dispatch]);

	useEffect(() => {
		const loadPayments = async () => {
			if (isAuthenticated && user?.id) {
				const action = await dispatch(fetchPaymentsByUser({ userId: user.id, pageable }));
				const payload = action.payload as { content?: Payment[] } | undefined;
				const data = payload?.content || [];

				const enriched = await Promise.all(
					data.map(async (p) => {
						try {
							const booking = await fetchBookingById(p.bookingId);
							const accommodation = await getAccommodationById(booking.accommodationId);
							return { ...p, booking, accommodation } as unknown as EnrichedPayment;
						} catch {
							return p as unknown as EnrichedPayment;
						}
					}),
				);

				setEnrichedPayments(enriched);
			}
		};

		loadPayments();
	}, [dispatch, isAuthenticated, user, pageable]);

	if (fetchStatus === 'loading')
		return (
			<div className="container page">
				<div className="cards-grid">
					<CardSkeleton />
					<CardSkeleton />
					<CardSkeleton />
				</div>
			</div>
		);
	if (fetchStatus === 'failed') return <ErrorState message={error || t('payment.loadError')} />;

	return (
		<div className="container payments-page">
			<h2 className="auth-title">{t('payment.myPayments')}</h2>

			{enrichedPayments.length === 0 ? (
				<EmptyState
					icon="💳"
					title={t('payment.noPayments')}
					description={t('payment.noPaymentsDesc')}
					actionLabel={t('accommodations.browseAll')}
					actionTo="/accommodations"
				/>
			) : (
				<>
					<div className="payments-grid">
						{enrichedPayments.map((p) => (
							<div className={`payment-card ${p.status.toLowerCase()}`} key={p.id}>
								<div className="payment-card-header">
									<h4>
										<span className="icon-chip">💳</span> {t('payment.paymentId', { id: p.id })}
									</h4>
									<StatusBadge status={p.status} context="payment" />
								</div>

								<div className="payment-card-body">
									<p>
										<strong>{t('payment.accommodation')}:</strong>{' '}
										{localized(p.accommodation?.name, p.accommodation?.nameUk, lang) || '—'}
									</p>
									<p>
										<strong>{t('payment.address')}:</strong>{' '}
										{localized(p.accommodation?.location, p.accommodation?.locationUk, lang) || '—'}
									</p>
									{p.booking?.checkInDate && (
										<p>
											<strong>{t('payment.dates')}:</strong> {formatDate(p.booking.checkInDate)} →{' '}
											{formatDate(p.booking.checkOutDate)}
										</p>
									)}
									<div className="payment-amount">
										<div className="left">
											<span className="icon">💰</span>
											{p.amount ?? '—'} {t('common.currency')}
										</div>
										<img src="/assets/visa.svg" alt="VISA" className="system-logo" />
									</div>
									{p.createdAt && <p className="payment-date">{formatDate(p.createdAt)}</p>}
								</div>

								<div className="payment-card-footer">
									{p.status === 'PAID' && (
										<Link to={`/my-bookings/${p.bookingId}`} className="btn btn-primary btn-sm">
											{t('common.details')}
										</Link>
									)}
									{p.status === 'PENDING' && p.sessionUrl && (
										<a
											href={p.sessionUrl}
											target="_blank"
											rel="noreferrer"
											className="btn btn-primary"
										>
											{t('booking.pay')}
										</a>
									)}
									{p.status === 'PENDING' && !p.sessionUrl && (
										<Link to={`/payment/${p.bookingId}`} className="btn btn-warning">
											{t('booking.pay')}
										</Link>
									)}
									{p.status === 'FAILED' && (
										<Link to={`/payment/${p.bookingId}`} className="btn btn-danger btn-sm">
											{t('payment.retry')}
										</Link>
									)}
									{p.status === 'CANCELED' && (
										<span className="badge badge-canceled">{t('status.cancelled')}</span>
									)}
								</div>
							</div>
						))}
					</div>

					<Pagination
						page={page}
						totalPages={totalPages}
						onPageChange={(newPage: number) => setPage(newPage)}
					/>
				</>
			)}
		</div>
	);
};

export default PaymentsList;
