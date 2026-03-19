import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import setupLeaflet from '../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';

setupLeaflet();

const defaultIcon = new L.Icon({
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

interface Coordinates {
	latitude: string;
	longitude: string;
}

interface ClickHandlerProps {
	onSelect: (coords: Coordinates) => void;
}

const ClickHandler = ({ onSelect }: ClickHandlerProps) => {
	useMapEvents({
		click(e) {
			onSelect({
				latitude: e.latlng.lat.toFixed(6),
				longitude: e.latlng.lng.toFixed(6),
			});
		},
	});
	return null;
};

interface MapPickerProps {
	position?: { lat: number; lng: number } | null;
	center?: [number, number];
	zoom?: number;
	height?: number;
	onSelect: (coords: Coordinates) => void;
}

const MapPicker = ({
	position,
	center = [50.45, 30.52],
	zoom = 12,
	height = 300,
	onSelect,
}: MapPickerProps) => {
	const mapCenter: [number, number] = position ? [position.lat, position.lng] : center;

	return (
		<div style={{ height, width: '100%' }}>
			<MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; OpenStreetMap contributors"
				/>
				<ClickHandler onSelect={onSelect} />
				{position && <Marker position={[position.lat, position.lng]} icon={defaultIcon} />}
			</MapContainer>
		</div>
	);
};

export default MapPicker;
