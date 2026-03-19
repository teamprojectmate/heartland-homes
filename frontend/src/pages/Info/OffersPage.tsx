import { Clock, Gift, Percent, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_info-pages.scss';

const OffersPage = () => {
	const { t } = useTranslation();

	const offers = [
		{
			id: 1,
			icon: <Percent size={28} />,
			title: t('offers.summerDiscount'),
			description: t('offers.summerDiscountDesc'),
		},
		{
			id: 2,
			icon: <Clock size={28} />,
			title: t('offers.longTermRental'),
			description: t('offers.longTermRentalDesc'),
		},
		{
			id: 3,
			icon: <Gift size={28} />,
			title: t('offers.promoCode'),
			description: t('offers.promoCodeDesc'),
		},
		{
			id: 4,
			icon: <Sparkles size={28} />,
			title: t('offers.exclusiveOffers'),
			description: t('offers.exclusiveOffersDesc'),
		},
	];

	return (
		<section className="info-page container">
			<div className="info-header">
				<Percent className="info-icon" size={32} />
				<h1 className="page-title">{t('offers.title')}</h1>
			</div>

			<p className="lead-text">{t('offers.subtitle')}</p>

			<div className="offers-grid">
				{offers.map(({ id, icon, title, description }) => (
					<div key={id} className="offer-card">
						<div className="offer-icon">{icon}</div>
						<h3>{title}</h3>
						<p>{description}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default OffersPage;
