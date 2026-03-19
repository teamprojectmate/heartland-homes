import '../../styles/components/payment/_payment-checkout.scss';

const PaymentCheckout = ({
	bookingId,
	amount = 5000,
}: {
	bookingId: number | string;
	amount?: number;
}) => {
	return (
		<div className="payment-page">
			<div className="payment-card payment-checkout">
				<h2>💳 Оплата бронювання</h2>
				<p className="payment-subtitle">
					Будь ласка, перевірте інформацію нижче та натисніть кнопку для переходу на захищену
					сторінку оплати.
				</p>

				<div className="payment-info">
					<p>
						<strong>ID бронювання:</strong> <span className="badge-id">#{bookingId}</span>
					</p>
					<p className="payment-amount">
						<span className="icon">💰</span> {amount} ₴
						<img src="/assets/visa.svg" alt="VISA" className="system-logo" />
					</p>
				</div>

				<button type="button" className="payment-button">
					Оплатити
				</button>
			</div>
		</div>
	);
};

export default PaymentCheckout;
