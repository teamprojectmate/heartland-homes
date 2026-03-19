import { zodResolver } from '@hookform/resolvers/zod';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getAccommodationById,
	updateMyAccommodation,
} from '../../api/accommodations/accommodationService';
import Notification from '../../components/Notification';
import setupLeaflet from '../../utils/leafletConfig';
import {
	type EditMyAccommodationFormData,
	editMyAccommodationSchema,
} from '../../validation/schemas';
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
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<EditMyAccommodationFormData>({
		resolver: zodResolver(editMyAccommodationSchema),
		defaultValues: {
			name: '',
			type: 'HOUSE',
			region: '',
			city: '',
			location: '',
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
	const [dataLoaded, setDataLoaded] = useState(false);

	// Завантаження + парсинг області та вулиці
	useEffect(() => {
		getAccommodationById(id)
			.then((data) => {
				const { region, rest } = stripRegionFromLocation(data.location || '');
				const streetOnly = normalizeStreetOnly(rest, data.city || '', region || '');
				const amenitiesStr = Array.isArray(data.amenities)
					? data.amenities.join(', ')
					: data.amenities || '';
				reset({
					name: data.name || '',
					type: data.type || 'HOUSE',
					region: region || '',
					city: data.city || '',
					location: streetOnly || '',
					size: data.size || '',
					latitude: String(data.latitude || ''),
					longitude: String(data.longitude || ''),
					amenities: amenitiesStr,
					dailyRate: String(data.dailyRate ?? ''),
					image: data.image || '',
				});
				setDataLoaded(true);
			})
			.catch(() => setError(t('accommodations.errorLoading')));
	}, [id, reset]);

	const setCoordinates = ({ latitude, longitude }: { latitude: string; longitude: string }) => {
		setValue('latitude', latitude);
		setValue('longitude', longitude);
	};

	const normalizeFormAddress = () => {
		const region = watch('region');
		const city = watch('city');
		const location = watch('location');
		setValue('region', normalizeRegion(region || ''));
		setValue('location', normalizeStreetOnly(location || '', city || '', region || ''));
	};

	const onSubmit = async (formData: EditMyAccommodationFormData) => {
		setLoading(true);
		setError(null);

		try {
			const locationFull = buildLocation({
				region: formData.region,
				city: formData.city,
				street: formData.location,
			});

			const amenities = String(formData.amenities || '')
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
				dailyRate: Number(formData.dailyRate),
				image: (formData.image || '').trim(),
			};

			await updateMyAccommodation(id, payload);
			navigate('/my-accommodations');
		} catch (err: unknown) {
			const message = (err as { response?: { data?: { message?: string } } })?.response?.data
				?.message;
			setError(message || t('accommodations.errorUpdating'));
		} finally {
			setLoading(false);
		}
	};

	if (!dataLoaded && !error) return <p>{t('common.loading')}</p>;

	const latValue = watch('latitude');
	const lngValue = watch('longitude');
	const lat = Number(latValue);
	const lng = Number(lngValue);
	const hasPoint =
		Number.isFinite(lat) && Number.isFinite(lng) && latValue !== '' && lngValue !== '';

	return (
		<div className="container page">
			<form onSubmit={handleSubmit(onSubmit)} className="admin-form">
				<h1>{t('accommodations.editTitle')}</h1>
				{error && <Notification message={error} type="danger" />}

				<div className="form-group">
					<label htmlFor="edit-name">{t('accommodationForm.name')}</label>
					<input type="text" id="edit-name" {...register('name')} />
					{errors.name && <span className="form-error">{errors.name.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="edit-type">{t('accommodationForm.type')}</label>
					<select id="edit-type" {...register('type')}>
						<option value="HOUSE">{t('accommodationType.house')}</option>
						<option value="APARTMENT">{t('accommodationType.apartment')}</option>
						<option value="HOTEL">{t('accommodationType.hotel')}</option>
						<option value="VACATION_HOME">{t('accommodationType.vacationHome')}</option>
						<option value="HOSTEL">{t('accommodationType.hostel')}</option>
					</select>
					{errors.type && <span className="form-error">{errors.type.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="edit-region">{t('accommodationForm.region')}</label>
					<input
						type="text"
						id="edit-region"
						placeholder="Івано-Франківська область"
						{...register('region')}
						onBlur={normalizeFormAddress}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="edit-city">{t('accommodationForm.city')}</label>
					<input
						type="text"
						id="edit-city"
						placeholder="Київ"
						{...register('city')}
						onBlur={normalizeFormAddress}
					/>
					{errors.city && <span className="form-error">{errors.city.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="edit-location">{t('accommodationForm.locationLabel')}</label>
					<input
						type="text"
						id="edit-location"
						placeholder="вул. Центральна, 15, кв. 3"
						{...register('location')}
						onBlur={normalizeFormAddress}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="edit-size">{t('accommodationForm.bedroomCount')}</label>
					<input type="text" id="edit-size" {...register('size')} />
				</div>

				<div className="form-group">
					<span>{t('accommodationForm.selectLocation')}</span>
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
						<p>{t('common.selectedCoordinates', { lat: String(lat), lng: String(lng) })}</p>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="edit-amenities">{t('accommodationForm.amenitiesLabel')}</label>
					<input type="text" id="edit-amenities" {...register('amenities')} />
				</div>

				<div className="form-group">
					<label htmlFor="edit-dailyRate">{t('accommodationForm.dailyRate')}</label>
					<input type="number" min="1" step="1" id="edit-dailyRate" {...register('dailyRate')} />
					{errors.dailyRate && <span className="form-error">{errors.dailyRate.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="edit-image">{t('accommodationForm.imageUrl')}</label>
					<input
						type="text"
						id="edit-image"
						placeholder="https://example.com/image.jpg"
						{...register('image')}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? t('common.updating') : t('common.update')}
				</button>
			</form>
		</div>
	);
};

export default EditMyAccommodation;
