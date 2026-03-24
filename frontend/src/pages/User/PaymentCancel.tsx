import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPaymentsByUser } from '../../api/payments/paymentService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { cancelPayment } from '../../store/slices/paymentsSlice';
import '../../styles/components/payment/_payment-checkout.scss';

const PaymentCancel = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [searchParams] = useSearchParams();
	const bookingId = searchParams.get('bookingId');
	const { user } = useAppSelector((s) => s.auth);
	const [cancelled, setCancelled] = useState(false);

	useEffect(() => {
		const cancelExistingPayment = async () => {
			if (!bookingId || !user?.id) return;

			try {
				const paymentsData = await fetchPaymentsByUser(user.id, { page: 0, size: 100 });
				const found = paymentsData.content?.find(
					(p) => p.bookingId === Number(bookingId) && p.status === 'PENDING',
				);
				if (found) {
					await dispatch(cancelPayment(found.id));
					setCancelled(true);
				}
			} catch (_err) {
				/* silently ignore — payment may not exist yet */
			}
		};

		cancelExistingPayment();
	}, [bookingId, user?.id, dispatch]);

	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2 className="payment-title" style={{ color: '#dc2626' }}>
					{t('payment.cancelTitle')}
				</h2>
				<p className="payment-subtitle">
					{cancelled ? t('payment.cancelledDescription') : t('payment.cancelSubtitle')}
				</p>
				<Link to="/my-bookings" className="payment-button">
					{t('payment.backToBookings')}
				</Link>
			</div>
		</div>
	);
};

export default PaymentCancel;
