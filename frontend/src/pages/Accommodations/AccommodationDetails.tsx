import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import BaseMap from '../../components/BaseMap';
import { BookingForm } from '../../components/booking';
import { useAppSelector } from '../../store/hooks';
import { getSafeImageUrl } from '../../utils/getSafeImageUrl';

import { mapAmenity, mapType } from '../../utils/translations';
import AccommodationGallery from './AccommodationGallery';

import '../../styles/components/accommodation/_accommodation-details.scss';
import '../../styles/components/accommodation/_accommodation-gallery.scss';
import '../../styles/components/badges/_badges.scss';

const AccommodationDetails = ({ id: propId }: { id?: any }) => {
	const { t } = useTranslation();
	const { id: routeId } = useParams();
	const id = propId || routeId;

	const [accommodation, setAccommodation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (!id) return;
		const fetchAccommodation = async () => {
			try {
				const data = await getAccommodationById(id);
				if (!data) {
					setError(t('accommodations.notFoundError'));
					return;
				}
				setAccommodation(data);
			} catch (err) {
				console.error('Error loading accommodation:', err);
				setError(t('accommodations.errorLoadingDetails'));
			} finally {
				setLoading(false);
			}
		};
		fetchAccommodation();
	}, [id, t]);

	if (loading) return <div className="loading">{t('common.loading')}</div>;
	if (error) return <div className="error">{error}</div>;
	if (!accommodation) return <div className="not-found">{t('accommodations.notFoundError')}</div>;

	const { label: typeLabel, icon: typeIcon, color: typeColor } = mapType(accommodation.type);

	return (
		<div className="accommodation-details-page">
			<div className="page-header">
				<h2 className="page-title">{t('accommodations.detailsTitle')}</h2>
				<h3 className="page-subtitle">
					<strong>{accommodation?.name || t('accommodations.noName')}</strong>
				</h3>
				<p className="page-subtitle">
					{accommodation?.city}, {accommodation?.location}
				</p>
			</div>

			<div className="details-grid">
				<div className="left-column">
					<div className="gallery-wrapper">
						<AccommodationGallery
							images={
								accommodation.images?.length
									? accommodation.images.map((img) => getSafeImageUrl(img))
									: accommodation.image
										? [getSafeImageUrl(accommodation.image)]
										: []
							}
						/>
					</div>

					<div className="details-card">
						<h4 className="details-section-title">{t('accommodations.information')}</h4>

						<div className="characteristics-inline">
							<span className="badge badge-type" style={{ backgroundColor: typeColor }}>
								{typeIcon} {typeLabel}
							</span>
							<span className="badge badge-size">
								{parseInt(accommodation.size, 10)}{' '}
								{parseInt(accommodation.size, 10) > 1
									? t('accommodations.bedrooms_other')
									: t('accommodations.bedrooms_one')}
							</span>
						</div>

						<div className="mt-3">
							<strong>{t('accommodations.amenities')}:</strong>
							<div className="badge-group mt-2">
								{accommodation?.amenities?.length > 0 ? (
									accommodation.amenities.map((amenity) => {
										const { label, icon, slug, color } = mapAmenity(amenity);
										return (
											<span
												key={amenity}
												className={`badge badge-amenity ${slug}`}
												style={{ backgroundColor: color, color: '#fff' }}
											>
												{icon} {label}
											</span>
										);
									})
								) : (
									<span className="text-muted">{t('accommodations.noAmenities')}</span>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="right-column">
					<div className="booking-details-card">
						<h5 className="booking-title">{t('accommodations.book')}</h5>

						<div className="booking-price">
							<div className="price-row">
								<span className="price">{accommodation?.dailyRate || '—'}</span>
								<span className="currency">{t('common.currency')}</span>
							</div>
							<div className="per-night">{t('common.perNight')}</div>
						</div>

						{isAuthenticated ? (
							<BookingForm accommodation={accommodation} />
						) : (
							<div className="text-center">
								<p className="text-muted mb-2">{t('accommodations.loginToBook')}</p>
								<Link to="/login" className="btn btn-primary w-100">
									{t('nav.login')}
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>

			{accommodation?.latitude && accommodation?.longitude && (
				<div className="location-map-full">
					<h4 className="details-section-title">{t('accommodations.location')}</h4>
					<BaseMap
						items={[accommodation]}
						renderPopup={(acc) => (
							<div style={{ width: '150px' }}>
								<img
									src={getSafeImageUrl(acc.image) || '/no-image.png'}
									alt={acc.name}
									style={{ width: '100%', borderRadius: '6px', marginBottom: '6px' }}
									onError={(e) => (e.currentTarget.src = '/no-image.png')}
								/>
								<strong>{acc.name}</strong>
								<div>{acc.city}</div>
							</div>
						)}
					/>
				</div>
			)}
		</div>
	);
};

export default AccommodationDetails;
