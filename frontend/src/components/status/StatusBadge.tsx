import { getStatusLabel } from '../../utils/statusLabels';

const StatusBadge = ({ status, floating = false }: { status: string; floating?: boolean }) => {
	const label = getStatusLabel(status);

	return (
		<span className={`badge badge-status ${label.className} ${floating ? 'floating' : ''}`}>
			{label.text}
		</span>
	);
};

export default StatusBadge;
