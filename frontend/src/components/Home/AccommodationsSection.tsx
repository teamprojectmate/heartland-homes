import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AccommodationList from '../../pages/Accommodations/AccommodationList';
import type { Accommodation } from '../../types';
import Notification from '../Notification';
import { CardSkeleton } from '../skeletons';

type AccommodationsSectionProps = {
	loading: boolean;
	error: string | null;
	accommodations: Accommodation[];
};

const AccommodationsSection = ({ loading, error, accommodations }: AccommodationsSectionProps) => {
	const { t } = useTranslation();

	return (
		<section className="accommodations-section">
			<div className="container">
				<div className="section-header">
					<h2 className="section-heading">{t('home.availableAccommodations')}</h2>
					<Link to="/accommodations" className="btn btn-secondary view-all-btn">
						{t('home.viewAll')} →
					</Link>
				</div>

				{loading && (
					<div className="page-skeleton__grid">
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
						<CardSkeleton />
					</div>
				)}
				{error && <Notification message={error} type="danger" />}
				{!loading && !error && <AccommodationList accommodations={accommodations} />}
			</div>
		</section>
	);
};

export default React.memo(AccommodationsSection);
