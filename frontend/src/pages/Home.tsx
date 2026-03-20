import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AccommodationsSection from '../components/Home/AccommodationsSection';
import HeroSection from '../components/Home/HeroSection';
import OffersSection from '../components/Home/OffersSection';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadAccommodations, resetFilters, setFilters } from '../store/slices/accommodationsSlice';

const Home = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { items, loading, error } = useAppSelector((state) => state.accommodations);

	useEffect(() => {
		dispatch(resetFilters());
		dispatch(loadAccommodations({ pageable: { page: 0, size: 4 } }));
	}, [dispatch]);

	const handleSearch = useCallback(
		(e: React.FormEvent, formData: Record<string, string>) => {
			e.preventDefault();
			dispatch(setFilters(formData));

			const filtered = Object.fromEntries(
				Object.entries(formData).filter(([_, v]) => v !== null && v !== ''),
			) as Record<string, string>;
			const queryParams = new URLSearchParams(filtered).toString();

			navigate(`/accommodations?${queryParams}`);
		},
		[dispatch, navigate],
	);

	const topAccommodations = useMemo(() => items.slice(0, 4), [items]);

	return (
		<div className="home-page">
			<HeroSection onSearch={handleSearch} />
			<AccommodationsSection loading={loading} error={error} accommodations={topAccommodations} />
			<OffersSection />
		</div>
	);
};

export default React.memo(Home);
