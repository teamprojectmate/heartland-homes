import { useTranslation } from 'react-i18next';
import ThemeSwitcher from './ThemeSwitcher';

const SettingsBar = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('language', lng);
	};

	return (
		<div className="settings-bar">
			<fieldset className="toggle-group" aria-label="Language">
				<button
					type="button"
					className={`toggle-btn ${i18n.language === 'en' ? 'active' : ''}`}
					onClick={() => changeLanguage('en')}
					aria-label="English"
					aria-pressed={i18n.language === 'en'}
				>
					EN
				</button>
				<button
					type="button"
					className={`toggle-btn ${i18n.language === 'uk' ? 'active' : ''}`}
					onClick={() => changeLanguage('uk')}
					aria-label="Ukrainian"
					aria-pressed={i18n.language === 'uk'}
				>
					UA
				</button>
			</fieldset>
			<ThemeSwitcher />
		</div>
	);
};

export default SettingsBar;
