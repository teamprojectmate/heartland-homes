import { useTranslation } from 'react-i18next';
import { getStatusLabel } from '../../utils/statusLabels';

const StatusBadge = ({
	status,
	floating = false,
	context = 'booking',
}: {
	status: string;
	floating?: boolean;
	context?: 'booking' | 'payment' | 'accommodation';
}) => {
	const { t } = useTranslation();
	const label = getStatusLabel(status, t, context);

	return (
		<span className={`badge badge-status ${label.className} ${floating ? 'floating' : ''}`}>
			{label.text}
		</span>
	);
};

export default StatusBadge;
