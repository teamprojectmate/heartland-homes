import React, { useCallback, useState } from 'react';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';
import '../styles/components/_searchForm.scss';

// Опції для типів житла
const ACCOMMODATION_TYPES = [
	{ value: 'HOUSE', label: 'Будинок' },
	{ value: 'APARTMENT', label: 'Квартира' },
	{ value: 'HOTEL', label: 'Готель' },
	{ value: 'VACATION_HOME', label: 'Дім для відпочинку' },
	{ value: 'HOSTEL', label: 'Хостел' },
];

const SearchForm = ({ onSearch }) => {
	const [formData, setFormData] = useState({
		city: '',
		type: '',
		minDailyRate: '',
		maxDailyRate: '',
	});

	// Мемоізація, щоб не створювати нові функції на кожен рендер
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
			{/* Місто */}
			<div className="search-input-group">
				<label htmlFor="city">Місто</label>
				<input
					type="text"
					id="city"
					name="city"
					placeholder="Наприклад, Київ"
					className="form-control"
					value={formData.city}
					onChange={handleChange}
				/>
			</div>

			{/* Тип житла */}
			<div className="search-input-group">
				<label htmlFor="type">Тип житла</label>
				<select
					id="type"
					name="type"
					className="form-control"
					value={formData.type}
					onChange={handleChange}
				>
					<option value="">— Оберіть тип —</option>
					{ACCOMMODATION_TYPES.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			{/* Ціна від */}
			<div className="search-input-group">
				<label htmlFor="minDailyRate">Ціна від</label>
				<input
					type="number"
					id="minDailyRate"
					name="minDailyRate"
					className="form-control"
					value={formData.minDailyRate}
					onChange={handleChange}
				/>
			</div>

			{/* Ціна до */}
			<div className="search-input-group">
				<label htmlFor="maxDailyRate">Ціна до</label>
				<input
					type="number"
					id="maxDailyRate"
					name="maxDailyRate"
					className="form-control"
					value={formData.maxDailyRate}
					onChange={handleChange}
				/>
			</div>

			{/* Кнопка */}
			<button className="btn-primary" type="submit">
				🔍 Шукати
			</button>
		</form>
	);
};

// Обгортаємо у React.memo для оптимізації
export default React.memo(SearchForm);
