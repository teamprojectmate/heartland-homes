import { Filter, RotateCcw } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../styles/components/_buttons.scss';
import '../../styles/components/accommodation/_accommodation-filters.scss';

type AccommodationFiltersProps = {
	city: string;
	type: string;
	minDailyRate: string;
	maxDailyRate: string;
	onApplyFilters: (e: React.FormEvent, filters: Record<string, string>) => void;
	onResetFilters: () => void;
};

const ACCOMMODATION_TYPES = [
	{ value: 'HOUSE', labelKey: 'accommodationType.house', icon: '🏠' },
	{ value: 'APARTMENT', labelKey: 'accommodationType.apartment', icon: '🏢' },
	{ value: 'HOTEL', labelKey: 'accommodationType.hotel', icon: '🏨' },
	{ value: 'VACATION_HOME', labelKey: 'accommodationType.vacationHome', icon: '🌴' },
	{ value: 'HOSTEL', labelKey: 'accommodationType.hostel', icon: '🛏️' },
];

const AccommodationFilters = ({
	city,
	type,
	minDailyRate,
	maxDailyRate,
	onApplyFilters,
	onResetFilters,
}: AccommodationFiltersProps) => {
	const { t } = useTranslation();
	const [localFilters, setLocalFilters] = useState({
		city: city || '',
		type: type || '',
		minDailyRate: minDailyRate || '',
		maxDailyRate: maxDailyRate || '',
	});

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLocalFilters({
			city: city || '',
			type: type || '',
			minDailyRate: minDailyRate || '',
			maxDailyRate: maxDailyRate || '',
		});
	}, [city, type, minDailyRate, maxDailyRate]);

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
		setLocalFilters((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleTypeSelect = useCallback((value: string) => {
		setLocalFilters((prev) => ({ ...prev, type: value }));
		setDropdownOpen(false);
	}, []);

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onApplyFilters(e, localFilters);
	};

	const selectedType = ACCOMMODATION_TYPES.find((t) => t.value === localFilters.type);
	const hasActiveFilters =
		localFilters.city ||
		localFilters.type ||
		localFilters.minDailyRate ||
		localFilters.maxDailyRate;

	return (
		<section className="filters-section">
			<form onSubmit={handleApply} className="filter-bar">
				<div className="filter-field">
					<label htmlFor="filter-city">{t('accommodationForm.city')}</label>
					<input
						id="filter-city"
						type="text"
						name="city"
						value={localFilters.city}
						onChange={handleChange}
						className="filter-input"
						placeholder={t('accommodationForm.cityPlaceholder')}
					/>
				</div>

				<div className="filter-field" ref={dropdownRef}>
					<label htmlFor="filter-type">{t('searchForm.type')}</label>
					<button
						type="button"
						id="filter-type"
						className="filter-select-trigger"
						onClick={() => setDropdownOpen((v) => !v)}
						aria-haspopup="listbox"
						aria-expanded={dropdownOpen}
					>
						<span className={selectedType ? 'selected-value' : 'placeholder-value'}>
							{selectedType ? (
								<>
									<span className="type-icon">{selectedType.icon}</span> {t(selectedType.labelKey)}
								</>
							) : (
								t('common.any')
							)}
						</span>
						<svg
							className={`chevron ${dropdownOpen ? 'open' : ''}`}
							width="12"
							height="12"
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
						<div className="filter-dropdown" role="listbox">
							<div
								role="option"
								tabIndex={0}
								aria-selected={localFilters.type === ''}
								className={`dropdown-item ${localFilters.type === '' ? 'active' : ''}`}
								onClick={() => handleTypeSelect('')}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') handleTypeSelect('');
								}}
							>
								{t('common.any')}
							</div>
							{ACCOMMODATION_TYPES.map((option) => (
								<div
									key={option.value}
									role="option"
									tabIndex={0}
									aria-selected={localFilters.type === option.value}
									className={`dropdown-item ${localFilters.type === option.value ? 'active' : ''}`}
									onClick={() => handleTypeSelect(option.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') handleTypeSelect(option.value);
									}}
								>
									<span className="type-icon">{option.icon}</span>
									{t(option.labelKey)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="filter-field filter-price">
					<label htmlFor="filter-minRate">{t('filters.priceFrom')}</label>
					<input
						id="filter-minRate"
						type="number"
						name="minDailyRate"
						value={localFilters.minDailyRate}
						onChange={handleChange}
						className="filter-input"
						placeholder="min"
					/>
				</div>

				<div className="filter-field filter-price">
					<label htmlFor="filter-maxRate">{t('filters.priceTo')}</label>
					<input
						id="filter-maxRate"
						type="number"
						name="maxDailyRate"
						value={localFilters.maxDailyRate}
						onChange={handleChange}
						className="filter-input"
						placeholder="max"
					/>
				</div>

				<div className="filter-actions">
					<button className="btn-filter-apply" type="submit">
						<Filter size={16} />
						<span className="btn-label">{t('filters.apply')}</span>
					</button>
					{hasActiveFilters && (
						<button className="btn-filter-reset" type="button" onClick={onResetFilters}>
							<RotateCcw size={14} />
						</button>
					)}
				</div>
			</form>
		</section>
	);
};

export default AccommodationFilters;
