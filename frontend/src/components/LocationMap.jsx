import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/components/_location-map.scss';

// Виправлення іконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const LocationMap = ({ location, latitude, longitude }) => {
  if (!latitude || !longitude) {
    return <p className="text-muted">Карта недоступна для цього помешкання.</p>;
  }

  const position = [latitude, longitude];

  return (
    <div className="location-map-container">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <Marker position={position}>
          <Popup>{location || 'Помешкання'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;
