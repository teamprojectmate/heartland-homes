import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('language', lng);
	};

	return (
		<div className="language-switcher" style={{ display: 'flex', gap: '4px' }}>
			<button
				type="button"
				className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
				onClick={() => changeLanguage('en')}
				style={{
					padding: '4px 8px',
					fontSize: '0.8rem',
					border: '1px solid #ccc',
					borderRadius: '4px',
					cursor: 'pointer',
					backgroundColor: i18n.language === 'en' ? '#2563eb' : 'transparent',
					color: i18n.language === 'en' ? '#fff' : '#333',
					fontWeight: i18n.language === 'en' ? 600 : 400,
				}}
			>
				EN
			</button>
			<button
				type="button"
				className={`lang-btn ${i18n.language === 'uk' ? 'active' : ''}`}
				onClick={() => changeLanguage('uk')}
				style={{
					padding: '4px 8px',
					fontSize: '0.8rem',
					border: '1px solid #ccc',
					borderRadius: '4px',
					cursor: 'pointer',
					backgroundColor: i18n.language === 'uk' ? '#2563eb' : 'transparent',
					color: i18n.language === 'uk' ? '#fff' : '#333',
					fontWeight: i18n.language === 'uk' ? 600 : 400,
				}}
			>
				UA
			</button>
		</div>
	);
};

export default LanguageSwitcher;
