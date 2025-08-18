// src/components/Map.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "../styles/components/_map.scss";

// Для коректного відображення іконок маркерів
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({ accommodations }) => {
  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  // Використовуємо координати першого помешкання як центр карти
  const defaultPosition = [accommodations[0].latitude, accommodations[0].longitude];

  return (
    <div className="map-container">
      <MapContainer center={defaultPosition} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {accommodations.map((acc) => (
          <Marker key={acc.id} position={[acc.latitude, acc.longitude]}>
            <Popup>
              {acc.title}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
