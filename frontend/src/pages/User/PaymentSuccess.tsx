import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/payment/_payment-checkout.scss';

const PaymentSuccess = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate('/my-payments');
		}, 2000);

		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2 className="payment-title" style={{ color: '#16a34a' }}>
					{t('payment.successTitle')}
				</h2>
				<p className="payment-subtitle">{t('payment.successSubtitle')}</p>
			</div>
		</div>
	);
};

export default PaymentSuccess;
