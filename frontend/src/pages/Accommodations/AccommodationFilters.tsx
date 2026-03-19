import { Filter, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccommodationFormFields from './AccommodationFormFields';

import '../../styles/components/_forms.scss';
import '../../styles/components/_buttons.scss';
import '../../styles/components/accommodation/_accommodation-form-fields.scss';

const AccommodationFilters = ({
	city,
	type,
	minDailyRate,
	maxDailyRate,
	onApplyFilters,
	onResetFilters,
}) => {
	const { t } = useTranslation();
	const [localFilters, setLocalFilters] = useState({
		city: city || '',
		type: type || '',
		minDailyRate: minDailyRate || '',
		maxDailyRate: maxDailyRate || '',
	});

	useEffect(() => {
		setLocalFilters({
			city: city || '',
			type: type || '',
			minDailyRate: minDailyRate || '',
			maxDailyRate: maxDailyRate || '',
		});
	}, [city, type, minDailyRate, maxDailyRate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLocalFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleApply = (e) => {
		e.preventDefault();
		if (onApplyFilters) {
			onApplyFilters(e, localFilters);
		}
	};

	return (
		<section className="filters-section">
			<form onSubmit={handleApply} className="accommodation-form-fields two-rows">
				<div className="filters-row">
					<AccommodationFormFields
						formData={localFilters}
						handleChange={handleChange}
						showDailyRate={false}
						showDailyRateRange={false}
						showLocation={false}
						showImage={false}
						showAmenities={false}
						showLatitude={false}
						showLongitude={false}
						onlyBasicFields={true}
					/>
				</div>

				<div className="filters-row">
					<div className="price-range-group">
						<div className="form-group">
							<label htmlFor="filter-minRate">{t('filters.priceFrom')}</label>
							<input
								id="filter-minRate"
								type="number"
								name="minDailyRate"
								value={localFilters.minDailyRate}
								onChange={handleChange}
								className="form-control"
								placeholder={t('filters.pricePlaceholder')}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="filter-maxRate">{t('filters.priceTo')}</label>
							<input
								id="filter-maxRate"
								type="number"
								name="maxDailyRate"
								value={localFilters.maxDailyRate}
								onChange={handleChange}
								className="form-control"
								placeholder={t('filters.pricePlaceholder')}
							/>
						</div>
					</div>

					<div className="filters-actions">
						<button className="btn-primary btn-with-icon" type="submit">
							<Filter size={18} /> {t('filters.apply')}
						</button>
						<button className="btn-outline btn-with-icon" type="button" onClick={onResetFilters}>
							<RotateCcw size={18} /> {t('filters.reset')}
						</button>
					</div>
				</div>
			</form>
		</section>
	);
};

export default AccommodationFilters;
