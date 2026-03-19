import React from 'react';
import { useTranslation } from 'react-i18next';
import Offers from '../Offers';

const OffersSection = () => {
	const { t } = useTranslation();

	return (
		<section className="offers-section">
			<div className="container">
				<h2 className="section-heading">{t('home.offers')}</h2>
				<p className="section-subheading">{t('home.offersSubtitle')}</p>
				<Offers />
			</div>
		</section>
	);
};

export default React.memo(OffersSection);
