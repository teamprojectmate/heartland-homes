import { useTranslation } from 'react-i18next';
import { getRoles } from '../../utils/roles';
import '../../styles/components/admin/_admin-users.scss';

type RoleSelectProps = {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

const RoleSelect = ({ value, onChange, disabled = false }: RoleSelectProps) => {
	const { t } = useTranslation();
	const roles = getRoles(t);

	return (
		<select
			className="role-select"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
		>
			{Object.values(roles).map(({ value, label }) => (
				<option key={value} value={value}>
					{label}
				</option>
			))}
		</select>
	);
};

export default RoleSelect;
