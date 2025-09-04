import React from 'react';
import BaseMap from '../components/BaseMap';

const LocationMap = ({ location, city, latitude, longitude }) => {
  const markers =
    latitude && longitude
      ? [
          {
            id: 1,
            lat: latitude,
            lng: longitude,
            popup: `${location}, ${city}`
          }
        ]
      : [];

  return (
    <BaseMap
      center={[latitude || 50.45, longitude || 30.52]}
      markers={markers}
      height="300px"
    />
  );
};

export default LocationMap;
