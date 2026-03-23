import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';
import '../styles/components/_searchForm.scss';

type SearchFormProps = {
	onSearch: (e: React.FormEvent, formData: Record<string, string>) => void;
};

const SearchForm = ({ onSearch }: SearchFormProps) => {
	const { t } = useTranslation();

	const ACCOMMODATION_TYPES = [
		{ value: 'HOUSE', label: t('accommodationType.house'), icon: '🏠' },
		{ value: 'APARTMENT', label: t('accommodationType.apartment'), icon: '🏢' },
		{ value: 'HOTEL', label: t('accommodationType.hotel'), icon: '🏨' },
		{ value: 'VACATION_HOME', label: t('accommodationType.vacationHome'), icon: '🌴' },
		{ value: 'HOSTEL', label: t('accommodationType.hostel'), icon: '🛏️' },
	];

	const [formData, setFormData] = useState({
		city: '',
		type: '',
		minDailyRate: '',
		maxDailyRate: '',
	});

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedType = ACCOMMODATION_TYPES.find((t) => t.value === formData.type);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const handleTypeSelect = useCallback((value: string) => {
		setFormData((prev) => ({ ...prev, type: value }));
		setDropdownOpen(false);
	}, []);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
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

			<div className="search-input-group" ref={dropdownRef}>
				<label htmlFor="type-select">{t('searchForm.type')}</label>
				<button
					type="button"
					id="type-select"
					className="custom-select-trigger"
					onClick={() => setDropdownOpen((v) => !v)}
					aria-haspopup="listbox"
					aria-expanded={dropdownOpen}
				>
					<span className={selectedType ? 'selected-value' : 'placeholder-value'}>
						{selectedType ? (
							<>
								<span className="type-icon">{selectedType.icon}</span> {selectedType.label}
							</>
						) : (
							t('searchForm.selectType')
						)}
					</span>
					<svg
						className={`chevron ${dropdownOpen ? 'open' : ''}`}
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>
				{dropdownOpen && (
					<div className="custom-select-dropdown" role="listbox">
						<div
							role="option"
							tabIndex={0}
							aria-selected={formData.type === ''}
							className={`dropdown-item ${formData.type === '' ? 'active' : ''}`}
							onClick={() => handleTypeSelect('')}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') handleTypeSelect('');
							}}
						>
							{t('searchForm.selectType')}
						</div>
						{ACCOMMODATION_TYPES.map((option) => (
							<div
								key={option.value}
								role="option"
								tabIndex={0}
								aria-selected={formData.type === option.value}
								className={`dropdown-item ${formData.type === option.value ? 'active' : ''}`}
								onClick={() => handleTypeSelect(option.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') handleTypeSelect(option.value);
								}}
							>
								<span className="type-icon">{option.icon}</span>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>

			<div className="search-input-group">
				<label htmlFor="minDailyRate">{t('searchForm.priceFrom')}</label>
				<input
					type="number"
					id="minDailyRate"
					name="minDailyRate"
					placeholder={`${t('common.currencySymbol')} min`}
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
					placeholder={`${t('common.currencySymbol')} max`}
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
