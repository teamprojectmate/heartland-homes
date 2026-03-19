import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getAccommodationById,
	updateMyAccommodation,
} from '../../api/accommodations/accommodationService';
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

// Клік по карті -> задаємо координати
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

//  хелпери адреси (область/місто/вулиця)

const stripRegionFromLocation = (loc = '') => {
	if (!loc) return { region: '', rest: '' };
	let s = loc.trim();

	const re = /^(.+?(?:область|обл\.))\s*,\s*/i;
	const m = s.match(re);
	if (m) {
		const regionRaw = m[1].trim();
		const regionNorm = regionRaw.replace(/обл\./i, 'область');
		s = s.replace(re, '').trim();
		return { region: regionNorm, rest: s };
	}
	return { region: '', rest: s };
};

const stripCityFromLocation = (loc = '', city = '') => {
	const c = (city || '').trim();
	if (!loc) return '';
	let s = loc.trim();
	if (!c) return s;

	const patterns = [
		new RegExp(`^м\\.?\\s*${c}\\s*,\\s*`, 'i'),
		new RegExp(`^місто\\s*${c}\\s*,\\s*`, 'i'),
		new RegExp(`^${c}\\s*,\\s*`, 'i'),
	];
	patterns.forEach((re) => {
		s = s.replace(re, '');
	});
	return s.trim();
};

const hasStreetPrefix = (s = '') =>
	/(вул\.|вулиця|просп\.|проспект|бульвар|пров\.|провулок|street|str\.)/i.test(s);

const normalizeRegion = (r = '') => {
	const s = r.trim();
	if (!s) return '';
	if (/область$/i.test(s)) return s;
	if (/обл\.$/i.test(s)) return s.replace(/обл\.$/i, 'область');
	return `${s} область`;
};

const buildLocation = ({ region, city, street }) => {
	const regionPart = normalizeRegion(region || '');
	const cityPart = city?.trim() ? `м. ${city.trim()}` : '';

	let streetPart = (street || '').trim();
	if (streetPart && !hasStreetPrefix(streetPart)) streetPart = `вул. ${streetPart}`;

	return [regionPart, cityPart, streetPart]
		.filter(Boolean)
		.join(', ')
		.replace(/\s+,/g, ',')
		.replace(/,\s*,/g, ', ')
		.trim();
};

const normalizeStreetOnly = (raw, city, _region) => {
	const s = (raw || '').trim();
	const afterRegion = stripRegionFromLocation(s).rest;
	const afterCity = stripCityFromLocation(afterRegion, city);
	if (afterCity && !hasStreetPrefix(afterCity)) return `вул. ${afterCity}`;
	return afterCity;
};

const EditMyAccommodation = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Завантаження + парсинг області та вулиці
	useEffect(() => {
		getAccommodationById(id)
			.then((data) => {
				const { region, rest } = stripRegionFromLocation(data.location || '');
				const streetOnly = normalizeStreetOnly(rest, data.city || '', region || '');
				setFormData({
					...data,
					region: region || '',
					location: streetOnly || '',
				});
			})
			.catch(() => setError('Не вдалося завантажити помешкання'));
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const setCoordinates = ({ latitude, longitude }) => {
		setFormData((prev) => ({ ...prev, latitude, longitude }));
	};

	const normalizeFormAddress = () =>
		setFormData((prev) => ({
			...prev,
			region: normalizeRegion(prev.region || ''),
			location: normalizeStreetOnly(prev.location || '', prev.city || '', prev.region || ''),
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// проста фронт-валідцація dailyRate (>0)
			const rate =
				formData.dailyRate === '' || formData.dailyRate == null
					? undefined
					: Number(formData.dailyRate);

			if (rate === undefined || Number.isNaN(rate) || rate <= 0) {
				setError('Ціна за добу має бути більшою за 0');
				setLoading(false);
				return;
			}

			const locationFull = buildLocation({
				region: formData.region,
				city: formData.city,
				street: formData.location,
			});

			// гарантуємо масив рядків для amenities
			const amenities = Array.isArray(formData.amenities)
				? formData.amenities
				: String(formData.amenities || '')
						.split(',')
						.map((a) => a.trim())
						.filter(Boolean);

			const payload = {
				name: (formData.name || '').trim(),
				type: formData.type,
				location: locationFull,
				city: (formData.city || '').trim(),
				latitude: String(formData.latitude || ''),
				longitude: String(formData.longitude || ''),
				size: (formData.size || '—').trim(),
				amenities,
				dailyRate: rate,
				image: (formData.image || '').trim(),
			};

			await updateMyAccommodation(id, payload);
			navigate('/my-accommodations');
		} catch (err) {
			setError(err.response?.data?.message || 'Помилка при оновленні');
		} finally {
			setLoading(false);
		}
	};

	if (!formData) return <p>Завантаження...</p>;

	const lat = Number(formData.latitude);
	const lng = Number(formData.longitude);
	const hasPoint = Number.isFinite(lat) && Number.isFinite(lng);

	return (
		<div className="container page">
			<form onSubmit={handleSubmit} className="admin-form">
				<h1>✨ ✏️ Редагувати моє помешкання</h1>
				{error && <Notification message={error} type="danger" />}

				{/* Назва */}
				<div className="form-group">
					<label htmlFor="edit-name">Назва</label>
					<input
						type="text"
						id="edit-name"
						name="name"
						value={formData.name || ''}
						onChange={handleChange}
					/>
				</div>

				{/* Тип */}
				<div className="form-group">
					<label htmlFor="edit-type">Тип</label>
					<select
						id="edit-type"
						name="type"
						value={formData.type || 'HOUSE'}
						onChange={handleChange}
					>
						<option value="HOUSE">Будинок</option>
						<option value="APARTMENT">Квартира</option>
						<option value="HOTEL">Готель</option>
						<option value="VACATION_HOME">Дім для відпочинку</option>
						<option value="HOSTEL">Хостел</option>
					</select>
				</div>

				{/* Область */}
				<div className="form-group">
					<label htmlFor="edit-region">Область</label>
					<input
						type="text"
						id="edit-region"
						name="region"
						placeholder="Івано-Франківська область"
						value={formData.region || ''}
						onChange={handleChange}
						onBlur={normalizeFormAddress}
					/>
				</div>

				{/* Місто */}
				<div className="form-group">
					<label htmlFor="edit-city">Місто</label>
					<input
						type="text"
						id="edit-city"
						name="city"
						placeholder="Київ"
						value={formData.city || ''}
						onChange={handleChange}
						onBlur={normalizeFormAddress}
					/>
				</div>

				{/* Локація (вулиця/будинок/кв.) */}
				<div className="form-group">
					<label htmlFor="edit-location">Локація</label>
					<input
						type="text"
						id="edit-location"
						name="location"
						placeholder="вул. Центральна, 15, кв. 3"
						value={formData.location || ''}
						onChange={handleChange}
						onBlur={normalizeFormAddress}
					/>
				</div>

				{/* Кількість спалень / розмір */}
				<div className="form-group">
					<label htmlFor="edit-size">Кількість спален (наприклад, 1)</label>
					<input
						type="text"
						id="edit-size"
						name="size"
						value={formData.size || ''}
						onChange={handleChange}
					/>
				</div>

				{/* Карта */}
				<div className="form-group">
					<span>Виберіть розташування на карті</span>
					<div style={{ height: '300px', width: '100%', marginBottom: '1rem' }}>
						<MapContainer
							center={[hasPoint ? lat : 50.45, hasPoint ? lng : 30.52]}
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
					<label htmlFor="edit-amenities">Зручності (через кому)</label>
					<input
						type="text"
						id="edit-amenities"
						name="amenities"
						value={
							Array.isArray(formData.amenities)
								? formData.amenities.join(', ')
								: formData.amenities || ''
						}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								amenities: e.target.value
									.split(',')
									.map((a) => a.trim())
									.filter(Boolean),
							}))
						}
					/>
				</div>

				{/* Ціна за добу */}
				<div className="form-group">
					<label htmlFor="edit-dailyRate">Ціна за добу</label>
					<input
						type="number"
						min="1"
						step="1"
						id="edit-dailyRate"
						name="dailyRate"
						value={formData.dailyRate ?? ''}
						onChange={handleChange}
					/>
				</div>

				{/* URL зображення */}
				<div className="form-group">
					<label htmlFor="edit-image">URL зображення</label>
					<input
						type="text"
						id="edit-image"
						name="image"
						value={formData.image || ''}
						onChange={handleChange}
						placeholder="https://example.com/image.jpg"
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? 'Оновлення...' : 'Оновити'}
				</button>
			</form>
		</div>
	);
};

export default EditMyAccommodation;
