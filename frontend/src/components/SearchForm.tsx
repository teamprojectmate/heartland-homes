import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';
import '../styles/components/_searchForm.scss';

const SearchForm = ({ onSearch }) => {
	const { t } = useTranslation();

	const ACCOMMODATION_TYPES = [
		{ value: 'HOUSE', label: t('accommodationType.house') },
		{ value: 'APARTMENT', label: t('accommodationType.apartment') },
		{ value: 'HOTEL', label: t('accommodationType.hotel') },
		{ value: 'VACATION_HOME', label: t('accommodationType.vacationHome') },
		{ value: 'HOSTEL', label: t('accommodationType.hostel') },
	];

	const [formData, setFormData] = useState({
		city: '',
		type: '',
		minDailyRate: '',
		maxDailyRate: '',
	});

	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();
			if (onSearch) {
				onSearch(e, formData);
			}
		},
		[onSearch, formData],
	);

	return (
		<form onSubmit={handleSubmit} className="search-form-container">
			<div className="search-input-group">
				<label htmlFor="city">{t('searchForm.city')}</label>
				<input
					type="text"
					id="city"
					name="city"
					placeholder={t('searchForm.cityPlaceholder')}
					className="form-control"
					value={formData.city}
					onChange={handleChange}
				/>
			</div>

			<div className="search-input-group">
				<label htmlFor="type">{t('searchForm.type')}</label>
				<select
					id="type"
					name="type"
					className="form-control"
					value={formData.type}
					onChange={handleChange}
				>
					<option value="">{t('searchForm.selectType')}</option>
					{ACCOMMODATION_TYPES.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="search-input-group">
				<label htmlFor="minDailyRate">{t('searchForm.priceFrom')}</label>
				<input
					type="number"
					id="minDailyRate"
					name="minDailyRate"
					className="form-control"
					value={formData.minDailyRate}
					onChange={handleChange}
				/>
			</div>

			<div className="search-input-group">
				<label htmlFor="maxDailyRate">{t('searchForm.priceTo')}</label>
				<input
					type="number"
					id="maxDailyRate"
					name="maxDailyRate"
					className="form-control"
					value={formData.maxDailyRate}
					onChange={handleChange}
				/>
			</div>

			<button className="btn-primary" type="submit">
				{t('searchForm.search')}
			</button>
		</form>
	);
};

export default React.memo(SearchForm);
