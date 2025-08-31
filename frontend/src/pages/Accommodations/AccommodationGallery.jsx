//src/pages/Accommodations/AccommodationGallery.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { fixDropboxUrl } from '../../utils/fixDropboxUrl';

const AccommodationGallery = ({ images }) => {
  // Якщо немає фото → fallback
  if (!images || images.length === 0) {
    return (
      <div className="gallery-fallback">
        <img src="/no-image.png" alt="Немає зображення" />
      </div>
    );
  }

  // Якщо тільки одне фото
  if (images.length === 1) {
    return (
      <div className="single-image-container">
        <img
          src={fixDropboxUrl(images[0])}
          alt="Фото помешкання"
          onError={(e) => (e.target.src = '/no-image.png')}
        />
      </div>
    );
  }

  // Якщо більше фото → Swiper
  return (
    <div className="accommodation-gallery">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="gallery-swiper"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={fixDropboxUrl(img)}
              alt={`Фото ${idx + 1}`}
              onError={(e) => (e.target.src = '/no-image.png')}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AccommodationGallery;
