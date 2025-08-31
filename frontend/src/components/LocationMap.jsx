import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import setupLeaflet from '../utils/leafletConfig';
import '../styles/components/_location-map.scss';

const LocationMap = ({ location, city, latitude, longitude }) => {
  // Налаштовуємо Leaflet один раз
  useEffect(() => {
    setupLeaflet();
  }, []);

  const position = latitude && longitude ? [latitude, longitude] : [50.45, 30.52];

  return (
    <div className="location-map-container" style={{ height: '300px' }}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {latitude && longitude && (
          <Marker position={position}>
            <Popup>{`${location}, ${city}`}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
