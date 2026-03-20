import { useTranslation } from 'react-i18next';
import '../../styles/components/_status-select.scss';

import {
	getAccommodationStatusLabels,
	getAdminBookingStatusLabels,
	getPaymentStatusLabels,
} from '../../utils/statusLabels';

// function to normalize keys to css classes
const normalizeClass = (value: string) =>
	value ? value.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-') : '';

type StatusSelectProps = {
	value: string;
	onChange: (value: string) => void;
	type?: string;
};

const StatusSelect = ({ value, onChange, type }: StatusSelectProps) => {
	const { t } = useTranslation();
	let options: Record<string, { text: string; className: string }> = {};

	if (type === 'booking') options = getAdminBookingStatusLabels(t);
	if (type === 'accommodation') options = getAccommodationStatusLabels(t);
	if (type === 'payment') options = getPaymentStatusLabels(t);

	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={`status-select ${normalizeClass(value)}`}
		>
			{Object.entries(options).map(([key, label]) => (
				<option key={key} value={key}>
					{label.text}
				</option>
			))}
		</select>
	);
};

export default StatusSelect;
