import { useTranslation } from 'react-i18next';
import { getStatusLabel } from '../../utils/statusLabels';

const StatusBadge = ({ status, floating = false }: { status: string; floating?: boolean }) => {
	const { t } = useTranslation();
	const label = getStatusLabel(status, t);

	return (
		<span className={`badge badge-status ${label.className} ${floating ? 'floating' : ''}`}>
			{label.text}
		</span>
	);
};

export default StatusBadge;
