import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../SearchForm';

const HeroSection = ({ onSearch }) => {
	const { t } = useTranslation();

	return (
		<section className="hero-section">
			<div className="container">
				<h1 className="hero-heading">{t('home.heroTitle')}</h1>
				<p className="hero-subheading">{t('home.heroSubtitle')}</p>
				<SearchForm onSearch={onSearch} />
			</div>
		</section>
	);
};

export default React.memo(HeroSection);
