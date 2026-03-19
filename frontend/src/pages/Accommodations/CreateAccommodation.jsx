import L from 'leaflet';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { createAccommodation } from '../../api/accommodations/accommodationService';
import Notification from '../../components/Notification';
import setupLeaflet from '../../utils/leafletConfig';
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

	const [formData, setFormData] = useState({
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
	});

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const setCoordinates = ({ latitude, longitude }) => {
		setFormData((prev) => ({ ...prev, latitude, longitude }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// базова фронт-валідцація
			const rate =
				formData.dailyRate === '' || formData.dailyRate == null
					? undefined
					: Number(formData.dailyRate);

			if (rate === undefined || Number.isNaN(rate) || rate <= 0) {
				setError('Ціна за добу має бути більшою за 0');
				setLoading(false);
				return;
			}

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
				dailyRate: rate,
				image: (formData.image || '').trim(),
			};

			await createAccommodation(payload);
			navigate('/accommodations');
		} catch (err) {
			setError(err.response?.data?.message || 'Помилка при створенні');
		} finally {
			setLoading(false);
		}
	};

	const lat = Number(formData.latitude);
	const lng = Number(formData.longitude);
	const hasPoint = Number.isFinite(lat) && Number.isFinite(lng);

	return (
		<div className="container page">
			<form onSubmit={handleSubmit} className="admin-form">
				<h1>✨ Створити помешкання</h1>
				{error && <Notification message={error} type="danger" />}

				{/* Назва */}
				<div className="form-group">
					<label htmlFor="create-name">Назва</label>
					<input id="create-name" name="name" value={formData.name} onChange={handleChange} />
				</div>

				{/* Тип */}
				<div className="form-group">
					<label htmlFor="create-type">Тип</label>
					<select id="create-type" name="type" value={formData.type} onChange={handleChange}>
						<option value="HOUSE">Будинок</option>
						<option value="APARTMENT">Квартира</option>
						<option value="HOTEL">Готель</option>
						<option value="VACATION_HOME">Дім для відпочинку</option>
						<option value="HOSTEL">Хостел</option>
					</select>
				</div>

				{/* Область */}
				<div className="form-group">
					<label htmlFor="create-region">Область</label>
					<input
						id="create-region"
						name="region"
						placeholder="Київська область"
						value={formData.region}
						onChange={handleChange}
					/>
				</div>

				{/* Місто */}
				<div className="form-group">
					<label htmlFor="create-city">Місто</label>
					<input id="create-city" name="city" value={formData.city} onChange={handleChange} />
				</div>

				{/* Вулиця */}
				<div className="form-group">
					<label htmlFor="create-street">Вулиця / район</label>
					<input id="create-street" name="street" value={formData.street} onChange={handleChange} />
				</div>

				{/* Номер будинку */}
				<div className="form-group">
					<label htmlFor="create-houseNumber">Номер будинку</label>
					<input
						id="create-houseNumber"
						name="houseNumber"
						value={formData.houseNumber}
						onChange={handleChange}
					/>
				</div>

				{/* Квартира */}
				<div className="form-group">
					<label htmlFor="create-apartment">Квартира / офіс</label>
					<input
						id="create-apartment"
						name="apartment"
						value={formData.apartment}
						onChange={handleChange}
					/>
				</div>

				{/* Розмір */}
				<div className="form-group">
					<label htmlFor="create-size">Кількість спален (наприклад, 1)</label>
					<input id="create-size" name="size" value={formData.size} onChange={handleChange} />
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
						name="amenities"
						value={formData.amenities}
						onChange={handleChange}
						placeholder="Wi-Fi, кухня, кондиціонер…"
					/>
				</div>

				{/* Ціна */}
				<div className="form-group">
					<label htmlFor="create-dailyRate">Ціна за добу</label>
					<input
						type="number"
						id="create-dailyRate"
						name="dailyRate"
						min="1"
						step="1"
						value={formData.dailyRate}
						onChange={handleChange}
					/>
				</div>

				{/* Зображення */}
				<div className="form-group">
					<label htmlFor="create-image">URL зображення</label>
					<input
						id="create-image"
						name="image"
						value={formData.image}
						onChange={handleChange}
						placeholder="https://example.com/image.jpg"
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
