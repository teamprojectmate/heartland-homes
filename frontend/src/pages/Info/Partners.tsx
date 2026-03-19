import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const Partners = () => {
	const { t } = useTranslation();

	const partners = [
		{ name: 'TravelUA', desc: t('info.travelAgency') },
		{ name: 'HotelPro', desc: t('info.hotelNetwork') },
		{ name: 'CityRentals', desc: t('info.apartmentRentals') },
	];

	return (
		<section className="info-page container">
			<div className="info-header">
				<Users className="info-icon" size={28} />
				<h1 className="page-title">{t('info.partnersTitle')}</h1>
			</div>

			<p className="lead-text">{t('info.partnersText')}</p>

			<div className="about-highlights">
				{partners.map((p) => (
					<div key={p.name} className="highlight-card">
						<Users className="highlight-icon" size={32} />
						<h3>{p.name}</h3>
						<p>{p.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Partners;
