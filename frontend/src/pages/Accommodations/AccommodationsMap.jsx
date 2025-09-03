import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/components/_map.scss';

// Створення спеціальних іконок для маркерів
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const highlightedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AccommodationsMap = ({ accommodations, highlightedId }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Після завантаження даних, переміщуємо карту, щоб вона показувала всі маркери
    if (mapRef.current && accommodations.length > 0) {
      const bounds = accommodations.map((acc) => [acc.latitude, acc.longitude]);
      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [accommodations]);

  const defaultPosition =
    accommodations.length > 0
      ? [accommodations[0].latitude, accommodations[0].longitude]
      : [49.0, 31.0]; // Центр України

  return (
    <div className="map-container">
      <MapContainer
        center={defaultPosition}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {accommodations.map((acc) => {
          const isHighlighted = highlightedId && acc.id === highlightedId;
          const markerIcon = isHighlighted ? highlightedIcon : defaultIcon;

          return (
            <Marker
              key={acc.id}
              position={[acc.latitude, acc.longitude]}
              icon={markerIcon}
            >
              <Popup>{`${acc.name}, ${acc.city}`}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AccommodationsMap;
