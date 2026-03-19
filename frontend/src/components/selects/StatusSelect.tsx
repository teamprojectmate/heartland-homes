import '../../styles/components/_status-select.scss';

import {
	accommodationStatusLabels,
	adminBookingStatusLabels,
	paymentStatusLabels,
} from '../../utils/statusLabels';

//  функція для нормалізації ключів у css-класи
const normalizeClass = (value: string) =>
	value ? value.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-') : '';

type StatusSelectProps = {
	value: string;
	onChange: (value: string) => void;
	type?: string;
};

const StatusSelect = ({ value, onChange, type }: StatusSelectProps) => {
	let options: Record<string, { text: string; className: string }> = {};

	if (type === 'booking') options = adminBookingStatusLabels;
	if (type === 'accommodation') options = accommodationStatusLabels;
	if (type === 'payment') options = paymentStatusLabels;

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
