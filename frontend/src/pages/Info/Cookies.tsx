import { Cookie } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Cookies = () => {
	const { t } = useTranslation();

	return (
		<section className="info-page container">
			<div className="info-header">
				<Cookie className="info-icon" size={28} />
				<h1 className="page-title">{t('info.cookiesTitle')}</h1>
			</div>

			<div className="info-block">
				<p>{t('info.cookiesText')}</p>
				<ul className="styled-list cookies">
					<li>{t('info.cookies1')}</li>
					<li>{t('info.cookies2')}</li>
					<li>{t('info.cookies3')}</li>
				</ul>
			</div>
		</section>
	);
};

export default Cookies;
