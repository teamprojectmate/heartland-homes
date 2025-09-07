// src/components/BaseMap.jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import setupLeaflet from '../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';

// 🔹 виправляємо дефолтні іконки
setupLeaflet();

// 🔹 завжди створюємо іконки
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

const BaseMap = ({ items = [], highlightedId = null, renderPopup }) => {
  const mapRef = useRef(null);

  // ✅ підганяємо карту під маркери
  useEffect(() => {
    if (mapRef.current && items.length > 0) {
      const bounds = items
        .filter((acc) => acc.latitude && acc.longitude)
        .map((acc) => [acc.latitude, acc.longitude]);

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <div
        style={{
          height: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          borderRadius: '8px'
        }}
      >
        <p style={{ color: '#6b7280' }}>Немає доступних даних для карти</p>
      </div>
    );
  }

  const defaultPosition = [
    items[0]?.latitude || 49.0,
    items[0]?.longitude || 31.0 // центр України
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
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

        {items.map((acc) => {
          if (!acc.latitude || !acc.longitude) return null;

          const isHighlighted = highlightedId && acc.id === highlightedId;

          return (
            <Marker
              key={acc.id}
              position={[acc.latitude, acc.longitude]}
              icon={isHighlighted ? highlightedIcon : defaultIcon}
            >
              <Popup>
                {renderPopup ? (
                  renderPopup(acc)
                ) : (
                  <div>
                    <strong>{acc.name}</strong>
                    <div>{acc.city}</div>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default BaseMap;
