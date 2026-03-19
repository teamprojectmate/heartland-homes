import { useTranslation } from 'react-i18next';

const GoogleLoginButton = () => {
	const { t } = useTranslation();

	const handleGoogleLogin = () => {
		const api = import.meta.env.VITE_API_URL;
		window.location.href = `${api}/oauth2/authorization/google`;
	};

	return (
		<button type="button" className="btn-google w-100" onClick={handleGoogleLogin}>
			<img
				src="https://developers.google.com/identity/images/g-logo.png"
				alt="Google logo"
				width="20"
				height="20"
				style={{ marginRight: 8 }}
			/>
			{t('nav.loginViaGoogle')}
		</button>
	);
};

export default GoogleLoginButton;
