import { useTranslation } from 'react-i18next';

const PaymentStatusBadge = ({ status }: { status: string }) => {
	const { t } = useTranslation();

	const labels: Record<string, { i18nKey: string; className: string }> = {
		PAID: { i18nKey: 'status.paid', className: 'success' },
		PENDING: { i18nKey: 'status.pending', className: 'warning' },
		FAILED: { i18nKey: 'status.failed', className: 'danger' },
	};

	const config = labels[status];
	const text = config ? t(config.i18nKey) : status;
	const className = config?.className || 'secondary';

	return <span className={`badge badge-status ${className}`}>{text}</span>;
};

export default PaymentStatusBadge;
