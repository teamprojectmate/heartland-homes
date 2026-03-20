import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getAccommodationById,
	updateMyAccommodation,
} from '../../api/accommodations/accommodationService';
import MapPicker from '../../components/MapPicker';
import Notification from '../../components/Notification';
import { getApiErrorMessage, parseAmenities } from '../../utils/accommodationPayload';
import {
	buildLocation,
	normalizeRegion,
	normalizeStreetOnly,
	stripRegionFromLocation,
} from '../../utils/addressNormalization';
import {
	type EditMyAccommodationFormData,
	editMyAccommodationSchema,
} from '../../validation/schemas';

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
				const streetOnly = normalizeStreetOnly(rest, data.city || '');
				const amenitiesStr = Array.isArray(data.amenities)
					? data.amenities.join(', ')
					: data.amenities || '';
				reset({
					name: data.name || '',
					type: data.type || 'HOUSE',
					region: region || '',
					city: data.city || '',
					location: streetOnly || '',
					size: String(data.size || ''),
					latitude: String(data.latitude || ''),
					longitude: String(data.longitude || ''),
					amenities: amenitiesStr,
					dailyRate: String(data.dailyRate ?? ''),
					image: data.image || '',
				});
				setDataLoaded(true);
			})
			.catch(() => setError(t('accommodations.errorLoading')));
	}, [id, reset, t]);

	const handleMapSelect = ({ latitude, longitude }: { latitude: string; longitude: string }) => {
		setValue('latitude', latitude);
		setValue('longitude', longitude);
	};

	const normalizeFormAddress = () => {
		const region = watch('region');
		const city = watch('city');
		const location = watch('location');
		setValue('region', normalizeRegion(region || ''));
		setValue('location', normalizeStreetOnly(location || '', city || ''));
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

			const payload = {
				name: (formData.name || '').trim(),
				type: formData.type,
				location: locationFull,
				city: (formData.city || '').trim(),
				latitude: String(formData.latitude || ''),
				longitude: String(formData.longitude || ''),
				size: (formData.size || '—').trim(),
				amenities: parseAmenities(formData.amenities || ''),
				dailyRate: Number(formData.dailyRate),
				image: (formData.image || '').trim(),
			};

			await updateMyAccommodation(id, payload);
			navigate('/my-accommodations');
		} catch (err: unknown) {
			setError(getApiErrorMessage(err, t('accommodations.errorUpdating')));
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
					<MapPicker position={hasPoint ? { lat, lng } : null} onSelect={handleMapSelect} />
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
