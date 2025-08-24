import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/components/_map.scss';

// Виправлення іконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const Map = ({ accommodations = [] }) => {
  if (!accommodations.length) return null;

  const defaultPosition = [
    accommodations[0]?.latitude || 50.45,
    accommodations[0]?.longitude || 30.52
  ];

  return (
    <div className="map-container" style={{ height: '400px' }}>
      <MapContainer
        center={defaultPosition}
        zoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        {accommodations.map(({ id, latitude, longitude, location, city }) => (
          <Marker key={id} position={[latitude || 50.45, longitude || 30.52]}>
            <Popup>{`${location}, ${city}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
