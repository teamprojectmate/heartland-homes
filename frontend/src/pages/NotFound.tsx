import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
	const { t } = useTranslation();

	return (
		<div className="container page text-center">
			<h1 className="display-4 mb-3">{t('notFound.title')}</h1>
			<p className="mb-4">{t('notFound.message')}</p>
			<Link to="/" className="btn-primary">
				{t('notFound.goHome')}
			</Link>
		</div>
	);
};

export default NotFound;
