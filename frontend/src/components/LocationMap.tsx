import BaseMap from './BaseMap';

type LocationMapProps = {
	location?: string;
	city?: string;
	latitude?: number;
	longitude?: number;
};

const LOCATION_MARKER_ID = 0;

const LocationMap = ({ location, city, latitude, longitude }: LocationMapProps) => {
	const items =
		latitude && longitude
			? [{ id: LOCATION_MARKER_ID, latitude, longitude, name: location, city }]
			: [];

	return (
		<div style={{ height: '300px', width: '100%' }}>
			<BaseMap items={items} highlightedId={LOCATION_MARKER_ID} />
		</div>
	);
};

export default LocationMap;
