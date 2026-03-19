import React, { useCallback } from 'react';
import AccommodationCard from './AccommodationCard';
import '../../styles/components/accommodation/_accommodations-list.scss';

const AccommodationList = ({
	accommodations,
	onCardHover,
}: {
	accommodations: any[];
	onCardHover?: (id: any) => void;
}) => {
	const handleMouseEnter = useCallback((id: any) => () => onCardHover?.(id), [onCardHover]);

	const handleMouseLeave = useCallback(() => onCardHover?.(null), [onCardHover]);

	if (!accommodations || accommodations.length === 0) {
		return <p className="text-center">Немає доступних помешкань.</p>;
	}

	return (
		<div className="accommodations-list-grid">
			{accommodations.map((acc) => (
				// biome-ignore lint/a11y/noStaticElementInteractions: mouse hover for map highlight only
				<div
					key={acc.id}
					className="accommodation-card-wrapper"
					onMouseEnter={handleMouseEnter(acc.id)}
					onMouseLeave={handleMouseLeave}
				>
					<AccommodationCard accommodation={acc} />
				</div>
			))}
		</div>
	);
};

export default React.memo(AccommodationList);
