import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import setupLeaflet from '../utils/leafletConfig'; // Імпортуємо нову функцію
import '../styles/components/_map.scss';

const Map = ({ accommodations = [] }) => {
  // Налаштовуємо Leaflet один раз
  useEffect(() => {
    setupLeaflet();
  }, []);

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