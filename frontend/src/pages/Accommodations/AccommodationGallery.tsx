import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { getSafeImageUrl } from '../../utils/getSafeImageUrl';

const AccommodationGallery = ({ images }: { images: string[] }) => {
	if (!images || images.length === 0) {
		return (
			<div className="gallery-fallback">
				<img src="/no-image.png" alt="Немає зображення" />
			</div>
		);
	}

	if (images.length === 1) {
		return (
			<div className="single-image-container">
				<img src={getSafeImageUrl(images[0])} alt="Фото помешкання" />
			</div>
		);
	}

	return (
		<div className="accommodation-gallery">
			<Swiper
				modules={[Navigation, Pagination]}
				navigation
				pagination={{ clickable: true }}
				loop={true}
				className="gallery-swiper"
			>
				{images.map((img: string, idx: number) => (
					<SwiperSlide key={img}>
						<img src={getSafeImageUrl(img)} alt={`Фото ${idx + 1}`} />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default AccommodationGallery;
