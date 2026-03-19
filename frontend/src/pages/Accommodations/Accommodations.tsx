import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import BaseMap from '../../components/BaseMap';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	loadAccommodations,
	resetFilters,
	setFilters,
	setPage,
} from '../../store/slices/accommodationsSlice';
import { getSafeImageUrl } from '../../utils/getSafeImageUrl';
import AccommodationDetails from './AccommodationDetails';
import AccommodationFilters from './AccommodationFilters';
import AccommodationList from './AccommodationList';
import AccommodationModal from './AccommodationModal';

import '../../styles/components/accommodation/_accommodations-map.scss';
import '../../styles/components/accommodation/_accommodations-list.scss';

const Accommodations = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { items, loading, error, filters, page, totalPages } = useAppSelector(
		(state) => state.accommodations,
	);

	const accommodationListRef = useRef(null);
	const [highlightedId, setHighlightedId] = useState<number | null>(null);
	const [selectedAccommodation, setSelectedAccommodation] = useState<{
		id: number;
		name?: string;
	} | null>(null);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const newFilters: Record<string, string> = {};
		for (const [key, value] of queryParams.entries()) {
			if (value !== 'null' && value !== '') {
				newFilters[key] = value;
			}
		}
		dispatch(setFilters(newFilters));
	}, [dispatch, location.search]);

	useEffect(() => {
		dispatch(loadAccommodations({}) as any);
	}, [dispatch]);

	useEffect(() => {
		return () => {
			dispatch(resetFilters());
			dispatch(setPage(0));
		};
	}, [dispatch]);

	const handleApplyFilters = useCallback(
		(e: React.FormEvent, formData: Record<string, string>) => {
			e.preventDefault();
			const newFilters = Object.fromEntries(
				Object.entries(formData).filter(([_, v]) => v !== null && v !== ''),
			);
			navigate(`/accommodations?${new URLSearchParams(newFilters as Record<string, string>)}`);
		},
		[navigate],
	);

	const handleResetFilters = useCallback(() => {
		dispatch(resetFilters());
		dispatch(setPage(0));
		navigate('/accommodations');
	}, [dispatch, navigate]);

	const handleCardHover = useCallback((id: number | null) => {
		setHighlightedId(id);
	}, []);

	return (
		<div className="accommodations-page-container accommodations-list-page">
			<div className="accommodations-list-wrapper">
				<div className="container mt-4">
					<h2 ref={accommodationListRef} className="section-heading mt-5">
						{t('accommodations.title')}
					</h2>
					<AccommodationFilters
						city={filters.city || ''}
						type={filters.type || ''}
						minDailyRate={filters.minDailyRate || ''}
						maxDailyRate={filters.maxDailyRate || ''}
						onApplyFilters={handleApplyFilters}
						onResetFilters={handleResetFilters}
					/>

					{error && <Notification message={error} type="danger" />}

					{loading ? (
						<p className="text-center">{t('common.loading')}</p>
					) : items.length > 0 ? (
						<>
							<AccommodationList accommodations={items} onCardHover={handleCardHover} />
							<Pagination
								page={page}
								totalPages={totalPages}
								onPageChange={(newPage) => dispatch(setPage(newPage))}
							/>
						</>
					) : (
						!error && <p className="text-center">{t('accommodations.notFound')}</p>
					)}
				</div>
			</div>

			<div className="accommodations-map-wrapper">
				<BaseMap
					items={items}
					highlightedId={highlightedId}
					renderPopup={(acc) => (
						<div style={{ width: '150px' }}>
							<img
								src={acc.image ? getSafeImageUrl(acc.image) : '/no-image.png'}
								alt={acc.name || t('accommodations.accommodation')}
								style={{
									width: '100%',
									borderRadius: '6px',
									marginBottom: '6px',
									cursor: 'pointer',
								}}
								onError={(e) => (e.currentTarget.src = '/no-image.png')}
								onClick={() => setSelectedAccommodation(acc)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') setSelectedAccommodation(acc);
								}}
							/>
							<strong>{acc.name}</strong>
							<div>{acc.city}</div>
						</div>
					)}
				/>
			</div>

			<AccommodationModal
				isOpen={!!selectedAccommodation}
				onClose={() => setSelectedAccommodation(null)}
			>
				{selectedAccommodation && <AccommodationDetails id={selectedAccommodation.id} />}
			</AccommodationModal>
		</div>
	);
};

export default Accommodations;
