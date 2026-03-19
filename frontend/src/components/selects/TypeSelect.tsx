import { typeTranslations } from '../../utils/translations';
import '../../styles/components/admin/_admin-form.scss';

type TypeSelectProps = {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

const TypeSelect = ({ value, onChange, disabled = false }: TypeSelectProps) => {
	return (
		<select
			className="type-select"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
		>
			<option value="">— Оберіть тип —</option>
			{Object.entries(typeTranslations).map(([key, { label }]) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
};

export default TypeSelect;
