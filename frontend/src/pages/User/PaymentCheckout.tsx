import { useTranslation } from 'react-i18next';
import '../../styles/components/payment/_payment-checkout.scss';

const PaymentCheckout = ({
	bookingId,
	amount = 5000,
}: {
	bookingId: number | string;
	amount?: number;
}) => {
	const { t } = useTranslation();
	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2>{t('payment.title')}</h2>
				<p className="payment-subtitle">{t('payment.subtitle')}</p>

				<div className="payment-info">
					<p>
						<strong>{t('payment.bookingId')}:</strong>{' '}
						<span className="badge-id">#{bookingId}</span>
					</p>
					<p className="payment-amount">
						<span className="icon">💰</span> {amount} {t('common.currencySymbol')}
						<img src="/assets/visa.svg" alt="VISA" className="system-logo" />
					</p>
				</div>

				<button type="button" className="payment-button">
					{t('payment.pay')}
				</button>
			</div>
		</div>
	);
};

export default PaymentCheckout;
