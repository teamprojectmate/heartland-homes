import PropTypes from 'prop-types';

const ACCOMMODATION_TYPES = [
	{ value: 'HOUSE', label: 'Будинок' },
	{ value: 'APARTMENT', label: 'Квартира' },
	{ value: 'HOTEL', label: 'Готель' },
	{ value: 'VACATION_HOME', label: 'Дім для відпочинку' },
	{ value: 'HOSTEL', label: 'Хостел' },
];

const AccommodationFormFields = ({ formData, handleChange, showDailyRateRange = false }) => {
	return (
		<>
			<div className="form-group">
				<label htmlFor="city-field">Місто</label>
				<input
					id="city-field"
					type="text"
					name="city"
					value={formData.city}
					onChange={handleChange}
					className="form-control"
					placeholder="Наприклад, Київ"
				/>
			</div>

			<div className="form-group">
				<label htmlFor="type-field">Тип житла</label>
				<select
					id="type-field"
					name="type"
					value={formData.type}
					onChange={handleChange}
					className="form-control"
				>
					<option value="">Будь-який</option>
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
						<label htmlFor="minDailyRate-field">Ціна від</label>
						<input
							id="minDailyRate-field"
							type="number"
							name="minDailyRate"
							value={formData.minDailyRate}
							onChange={handleChange}
							className="form-control"
							placeholder="грн"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="maxDailyRate-field">Ціна до</label>
						<input
							id="maxDailyRate-field"
							type="number"
							name="maxDailyRate"
							value={formData.maxDailyRate}
							onChange={handleChange}
							className="form-control"
							placeholder="грн"
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
