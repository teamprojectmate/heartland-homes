import { zodResolver } from '@hookform/resolvers/zod';
import L from 'leaflet';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { createAccommodation } from '../../api/accommodations/accommodationService';
import Notification from '../../components/Notification';
import setupLeaflet from '../../utils/leafletConfig';
import { type AccommodationFormData, accommodationSchema } from '../../validation/schemas';
import 'leaflet/dist/leaflet.css';

setupLeaflet();

const defaultIcon = new L.Icon({
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

// клік по карті
const LocationPicker = ({ setCoordinates }) => {
	useMapEvents({
		click(e) {
			setCoordinates({
				latitude: e.latlng.lat.toFixed(6),
				longitude: e.latlng.lng.toFixed(6),
			});
		},
	});
	return null;
};

// допоміжні нормалізації
const hasStreetPrefix = (s = '') =>
	/(вул\.|вулиця|просп\.|проспект|бульвар|пров\.|провулок|street|str\.)/i.test(s);

const normalizeRegion = (r = '') => {
	const s = r.trim();
	if (!s) return '';
	return /область$/i.test(s)
		? s
		: s.replace(/\s+обл\.?$/i, ' область').replace(/\s*$/, '') +
				(/(область)$/i.test(s) ? '' : ' область');
};

const buildLocation = ({ region, city, street, houseNumber, apartment }) => {
	const regionPart = normalizeRegion(region || '');
	const cityPart = city?.trim() ? `м. ${city.trim()}` : '';
	let streetPart = (street || '').trim();
	if (streetPart && !hasStreetPrefix(streetPart)) streetPart = `вул. ${streetPart}`;
	const housePart = (houseNumber || '').trim();
	const aptPart = (apartment || '').trim() ? `кв. ${apartment.trim()}` : '';

	return [regionPart, cityPart, [streetPart, housePart].filter(Boolean).join(' '), aptPart]
		.filter(Boolean)
		.join(', ')
		.replace(/\s+,/g, ',')
		.replace(/,\s*,/g, ', ')
		.trim();
};

const CreateAccommodation = () => {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<AccommodationFormData>({
		resolver: zodResolver(accommodationSchema),
		defaultValues: {
			name: '',
			type: 'HOUSE',
			region: '',
			city: '',
			street: '',
			houseNumber: '',
			apartment: '',
			size: '',
			latitude: '',
			longitude: '',
			amenities: '',
			dailyRate: '',
			image: '',
		},
	});

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const setCoordinates = ({ latitude, longitude }: { latitude: string; longitude: string }) => {
		setValue('latitude', latitude);
		setValue('longitude', longitude);
	};

	const onSubmit = async (formData: AccommodationFormData) => {
		setLoading(true);
		setError(null);

		try {
			const location = buildLocation({
				region: formData.region,
				city: formData.city,
				street: formData.street,
				houseNumber: formData.houseNumber,
				apartment: formData.apartment,
			});

			const payload = {
				name: (formData.name || '').trim(),
				type: formData.type,
				location,
				city: (formData.city || '').trim(),
				size: (formData.size || '—').trim(),
				latitude: String(formData.latitude || ''),
				longitude: String(formData.longitude || ''),
				amenities: String(formData.amenities || '')
					.split(',')
					.map((a) => a.trim())
					.filter(Boolean),
				dailyRate: Number(formData.dailyRate),
				image: (formData.image || '').trim(),
			};

			await createAccommodation(payload);
			navigate('/accommodations');
		} catch (err: unknown) {
			const message = (err as { response?: { data?: { message?: string } } })?.response?.data
				?.message;
			setError(message || 'Помилка при створенні');
		} finally {
			setLoading(false);
		}
	};

	const latValue = watch('latitude');
	const lngValue = watch('longitude');
	const lat = Number(latValue);
	const lng = Number(lngValue);
	const hasPoint =
		Number.isFinite(lat) && Number.isFinite(lng) && latValue !== '' && lngValue !== '';

	return (
		<div className="container page">
			<form onSubmit={handleSubmit(onSubmit)} className="admin-form">
				<h1>✨ Створити помешкання</h1>
				{error && <Notification message={error} type="danger" />}

				{/* Назва */}
				<div className="form-group">
					<label htmlFor="create-name">Назва</label>
					<input id="create-name" {...register('name')} />
					{errors.name && <span className="form-error">{errors.name.message}</span>}
				</div>

				{/* Тип */}
				<div className="form-group">
					<label htmlFor="create-type">Тип</label>
					<select id="create-type" {...register('type')}>
						<option value="HOUSE">Будинок</option>
						<option value="APARTMENT">Квартира</option>
						<option value="HOTEL">Готель</option>
						<option value="VACATION_HOME">Дім для відпочинку</option>
						<option value="HOSTEL">Хостел</option>
					</select>
					{errors.type && <span className="form-error">{errors.type.message}</span>}
				</div>

				{/* Область */}
				<div className="form-group">
					<label htmlFor="create-region">Область</label>
					<input id="create-region" placeholder="Київська область" {...register('region')} />
				</div>

				{/* Місто */}
				<div className="form-group">
					<label htmlFor="create-city">Місто</label>
					<input id="create-city" {...register('city')} />
					{errors.city && <span className="form-error">{errors.city.message}</span>}
				</div>

				{/* Вулиця */}
				<div className="form-group">
					<label htmlFor="create-street">Вулиця / район</label>
					<input id="create-street" {...register('street')} />
				</div>

				{/* Номер будинку */}
				<div className="form-group">
					<label htmlFor="create-houseNumber">Номер будинку</label>
					<input id="create-houseNumber" {...register('houseNumber')} />
				</div>

				{/* Квартира */}
				<div className="form-group">
					<label htmlFor="create-apartment">Квартира / офіс</label>
					<input id="create-apartment" {...register('apartment')} />
				</div>

				{/* Розмір */}
				<div className="form-group">
					<label htmlFor="create-size">Кількість спален (наприклад, 1)</label>
					<input id="create-size" {...register('size')} />
				</div>

				{/* Карта */}
				<div className="form-group">
					<span>Виберіть розташування на карті</span>
					<div style={{ height: 300, width: '100%', marginBottom: '1rem' }}>
						<MapContainer
							center={[50.45, 30.52]}
							zoom={12}
							style={{ height: '100%', width: '100%' }}
						>
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution="&copy; OpenStreetMap contributors"
							/>
							<LocationPicker setCoordinates={setCoordinates} />
							{hasPoint && <Marker position={[lat, lng]} icon={defaultIcon} />}
						</MapContainer>
					</div>
					{hasPoint && (
						<p>
							📍 Обрані координати: {lat}, {lng}
						</p>
					)}
				</div>

				{/* Зручності */}
				<div className="form-group">
					<label htmlFor="create-amenities">Зручності (через кому)</label>
					<input
						id="create-amenities"
						placeholder="Wi-Fi, кухня, кондиціонер…"
						{...register('amenities')}
					/>
				</div>

				{/* Ціна */}
				<div className="form-group">
					<label htmlFor="create-dailyRate">Ціна за добу</label>
					<input type="number" id="create-dailyRate" min="1" step="1" {...register('dailyRate')} />
					{errors.dailyRate && <span className="form-error">{errors.dailyRate.message}</span>}
				</div>

				{/* Зображення */}
				<div className="form-group">
					<label htmlFor="create-image">URL зображення</label>
					<input
						id="create-image"
						placeholder="https://example.com/image.jpg"
						{...register('image')}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? 'Створення...' : 'Створити'}
				</button>
			</form>
		</div>
	);
};

export default CreateAccommodation;
