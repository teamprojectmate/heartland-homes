import React from 'react';
import BaseMap from '../../components/BaseMap';
import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

const AccommodationsMap = ({ accommodations = [], highlightedId }) => {
  const markers = accommodations.map((a) => ({
    id: a.id,
    lat: a.latitude,
    lng: a.longitude,
    highlighted: highlightedId === a.id,
    popup: (
      <div style={{ textAlign: 'center' }}>
        <img
          src={fixDropboxUrl(a.image || a.images?.[0])}
          alt={a.name}
          style={{
            width: '120px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '6px'
          }}
          onError={(e) => (e.target.src = '/no-image.png')}
        />
        <p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>{a.name}</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>{a.city}</p>
      </div>
    )
  }));

  return <BaseMap markers={markers} fitToMarkers height="500px" />;
};

export default AccommodationsMap;
