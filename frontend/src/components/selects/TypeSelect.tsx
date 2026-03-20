import { useTranslation } from 'react-i18next';
import '../../styles/components/admin/_admin-form.scss';
import { getTypeTranslations } from '../../utils/translations';

type TypeSelectProps = {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

const TypeSelect = ({ value, onChange, disabled = false }: TypeSelectProps) => {
	const { t } = useTranslation();
	const types = getTypeTranslations(t);

	return (
		<select
			className="type-select"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
		>
			<option value="">{t('searchForm.selectType')}</option>
			{Object.entries(types).map(([key, { label }]) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
};

export default TypeSelect;
