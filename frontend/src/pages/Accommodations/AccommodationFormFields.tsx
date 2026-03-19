import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const AccommodationFormFields = ({
	formData,
	handleChange,
	showDailyRateRange = false,
	...rest
}: {
	formData: any;
	handleChange: any;
	showDailyRateRange?: boolean;
	[key: string]: any;
}) => {
	const { t } = useTranslation();

	const ACCOMMODATION_TYPES = [
		{ value: 'HOUSE', label: t('accommodationType.house') },
		{ value: 'APARTMENT', label: t('accommodationType.apartment') },
		{ value: 'HOTEL', label: t('accommodationType.hotel') },
		{ value: 'VACATION_HOME', label: t('accommodationType.vacationHome') },
		{ value: 'HOSTEL', label: t('accommodationType.hostel') },
	];

	return (
		<>
			<div className="form-group">
				<label htmlFor="city-field">{t('accommodationForm.city')}</label>
				<input
					id="city-field"
					type="text"
					name="city"
					value={formData.city}
					onChange={handleChange}
					className="form-control"
					placeholder={t('accommodationForm.cityPlaceholder')}
				/>
			</div>

			<div className="form-group">
				<label htmlFor="type-field">{t('searchForm.type')}</label>
				<select
					id="type-field"
					name="type"
					value={formData.type}
					onChange={handleChange}
					className="form-control"
				>
					<option value="">{t('common.any')}</option>
					{ACCOMMODATION_TYPES.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			{showDailyRateRange && (
				<div className="price-range-group">
					<div className="form-group">
						<label htmlFor="minDailyRate-field">{t('filters.priceFrom')}</label>
						<input
							id="minDailyRate-field"
							type="number"
							name="minDailyRate"
							value={formData.minDailyRate}
							onChange={handleChange}
							className="form-control"
							placeholder={t('filters.pricePlaceholder')}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="maxDailyRate-field">{t('filters.priceTo')}</label>
						<input
							id="maxDailyRate-field"
							type="number"
							name="maxDailyRate"
							value={formData.maxDailyRate}
							onChange={handleChange}
							className="form-control"
							placeholder={t('filters.pricePlaceholder')}
						/>
					</div>
				</div>
			)}
		</>
	);
};

AccommodationFormFields.propTypes = {
	formData: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired,
	showDailyRateRange: PropTypes.bool,
};

export default AccommodationFormFields;
