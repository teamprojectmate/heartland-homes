import React from 'react';
import BaseMap from '../components/BaseMap';

const Map = ({ accommodations = [] }) => {
  const markers = accommodations.map((a) => ({
    id: a.id,
    lat: a.latitude,
    lng: a.longitude,
    popup: `${a.location}, ${a.city}`
  }));

  return <BaseMap markers={markers} fitToMarkers height="400px" />;
};

export default Map;
