import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

const PaymentCancel = () => {
	const { t } = useTranslation();

	return (
		<PageWrapper title={t('payment.cancelTitle')}>
			<div className="payment-page">
				<div className="payment-card">
					<h2 className="payment-title" style={{ color: '#dc2626' }}>
						{t('payment.cancelTitle')}
					</h2>
					<p className="payment-subtitle">{t('payment.cancelSubtitle')}</p>
					<Link to="/my-bookings" className="payment-button">
						{t('payment.backToBookings')}
					</Link>
				</div>
			</div>
		</PageWrapper>
	);
};

export default PaymentCancel;
