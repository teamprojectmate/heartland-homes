import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getSafeImageUrl } from '../../utils/getSafeImageUrl';
import { mapType } from '../../utils/translations/index';

const fallbackImage = '/no-image.png';

const AccommodationCard = ({ accommodation }) => {
	const { t } = useTranslation();
	const imageUrl = getSafeImageUrl(accommodation.image);

	const { label, icon, color } = mapType(accommodation.type);

	return (
		<div className="card-custom">
			<img
				src={imageUrl}
				alt={accommodation.location || t('accommodations.imageAlt')}
				className="card-img-top-custom"
				onError={(e) => (e.currentTarget.src = fallbackImage)}
			/>

			<div className="card-body">
				<h3 className="card-title">{accommodation?.name || t('accommodations.noName')}</h3>

				<div className="card-badges">
					<span className="badge badge-type" style={{ backgroundColor: color }}>
						{icon} {label}
					</span>

					{accommodation.size && (
						<span className="badge badge-size">
							{parseInt(accommodation.size, 10)}{' '}
							{parseInt(accommodation.size, 10) > 1
								? t('accommodations.bedrooms_other')
								: t('accommodations.bedrooms_one')}
						</span>
					)}
				</div>

				<p className="city-label">
					{accommodation?.location?.includes(accommodation?.city)
						? accommodation?.location
						: `${accommodation?.city}, ${accommodation?.location}`}
				</p>

				<p className="card-price">
					{accommodation.dailyRate} {t('common.currency')} {t('common.perNight')}
				</p>

				<Link to={`/accommodations/${accommodation.id}`} className="btn btn-primary w-100">
					{t('accommodations.moreDetails')}
				</Link>
			</div>
		</div>
	);
};

export default React.memo(AccommodationCard);
