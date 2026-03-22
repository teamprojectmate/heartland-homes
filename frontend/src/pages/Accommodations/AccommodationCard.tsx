import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Accommodation } from '../../types';
import { getSafeImageUrl } from '../../utils/getSafeImageUrl';
import { localized, mapCity, mapType } from '../../utils/translations/index';

const fallbackImage = '/no-image.png';

const AccommodationCard = ({ accommodation }: { accommodation: Accommodation }) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const imageUrl = getSafeImageUrl(accommodation.image);

	const { label, icon, color } = mapType(accommodation.type, t);

	return (
		<div className="card-custom">
			<img
				src={imageUrl}
				alt={accommodation.location || t('accommodations.imageAlt')}
				className="card-img-top-custom"
				onError={(e) => (e.currentTarget.src = fallbackImage)}
			/>

			<div className="card-body">
				<h3 className="card-title">
					{localized(accommodation?.name, accommodation?.nameUk, lang) ||
						t('accommodations.noName')}
				</h3>

				<div className="card-badges">
					<span className="badge badge-type" style={{ backgroundColor: color }}>
						{icon} {label}
					</span>

					{accommodation.bedrooms != null && accommodation.bedrooms > 0 && (
						<span className="badge badge-size">
							🛏 {accommodation.bedrooms}{' '}
							{accommodation.bedrooms > 1
								? t('accommodations.bedrooms_other')
								: t('accommodations.bedrooms_one')}
						</span>
					)}

					{accommodation.size && <span className="badge badge-size">📐 {accommodation.size}</span>}
				</div>

				<p className="city-label">
					{`${mapCity(accommodation?.city ?? '', t)}, ${localized(accommodation?.location, accommodation?.locationUk, lang)}`}
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
