import { Home } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const About = () => {
	const { t } = useTranslation();

	return (
		<section className="info-page container">
			<div className="info-header">
				<Home className="info-icon" size={28} />
				<h1 className="page-title">{t('info.aboutTitle')}</h1>
			</div>

			<p className="lead-text">
				<Trans i18nKey="info.aboutText" components={{ strong: <strong /> }} />
			</p>

			<div className="about-highlights">
				<div className="highlight-card">
					<Home className="highlight-icon" size={36} />
					<h3>{t('info.cozyHomes')}</h3>
					<p>{t('info.cozyHomesDesc')}</p>
				</div>
				<div className="highlight-card">
					<Home className="highlight-icon" size={36} />
					<h3>{t('info.affordablePrices')}</h3>
					<p>{t('info.affordablePricesDesc')}</p>
				</div>
				<div className="highlight-card">
					<Home className="highlight-icon" size={36} />
					<h3>{t('info.easyBooking')}</h3>
					<p>{t('info.easyBookingDesc')}</p>
				</div>
			</div>
		</section>
	);
};

export default About;
