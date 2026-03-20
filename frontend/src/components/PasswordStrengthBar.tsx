import { useTranslation } from 'react-i18next';

const PasswordStrengthBar = ({ password }: { password: string }) => {
	const { t } = useTranslation();

	if (!password) return null;

	const hasLetters = /[a-zA-Z]/.test(password);
	const hasNumbers = /\d/.test(password);
	const hasSpecial = /[^a-zA-Z0-9]/.test(password);

	let labelKey = 'passwordStrength.weak';
	let color = 'red';
	let level = 25;

	if (password.length < 6) {
		labelKey = 'passwordStrength.weak';
		color = 'red';
		level = 25;
	} else if (password.length >= 6 && hasLetters && hasNumbers) {
		if (password.length >= 8 && hasSpecial) {
			labelKey = 'passwordStrength.strong';
			color = 'green';
			level = 100;
		} else {
			labelKey = 'passwordStrength.medium';
			color = 'orange';
			level = 50;
		}
	}

	return (
		<div style={{ marginTop: '5px' }}>
			<p style={{ color, marginBottom: '5px' }}>
				{t('passwordStrength.label')} {t(labelKey)}
			</p>
			<div
				style={{
					height: '6px',
					borderRadius: '4px',
					background: '#ddd',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${level}%`,
						height: '100%',
						background: color,
						transition: 'width 0.3s ease',
					}}
				/>
			</div>
		</div>
	);
};

export default PasswordStrengthBar;
