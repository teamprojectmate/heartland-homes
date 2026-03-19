import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Popular = () => {
	const { t } = useTranslation();

	const destinations = [
		{ city: t('info.kyiv'), desc: t('info.kyivDesc') },
		{ city: t('info.lviv'), desc: t('info.lvivDesc') },
		{ city: t('info.odesa'), desc: t('info.odesaDesc') },
		{ city: t('info.carpathians'), desc: t('info.carpathiansDesc') },
	];

	return (
		<section className="info-page container">
			<div className="info-header">
				<MapPin className="info-icon" size={28} />
				<h1 className="page-title">{t('info.popularTitle')}</h1>
			</div>

			<p className="lead-text">{t('info.popularText')}</p>

			<div className="about-highlights">
				{destinations.map((d) => (
					<div key={d.city} className="highlight-card">
						<MapPin className="highlight-icon" size={32} />
						<h3>{d.city}</h3>
						<p>{d.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Popular;
