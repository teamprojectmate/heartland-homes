import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createAccommodation } from '../../api/accommodations/accommodationService';
import MapPicker from '../../components/MapPicker';
import Notification from '../../components/Notification';
import { getApiErrorMessage, parseAmenities } from '../../utils/accommodationPayload';
import { buildLocation } from '../../utils/addressNormalization';
import { type AccommodationFormData, accommodationSchema } from '../../validation/schemas';

const CreateAccommodation = () => {
	const { t } = useTranslation();
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

	const handleMapSelect = ({ latitude, longitude }: { latitude: string; longitude: string }) => {
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
				amenities: parseAmenities(formData.amenities || ''),
				dailyRate: Number(formData.dailyRate),
				image: (formData.image || '').trim(),
			};

			await createAccommodation(payload);
			navigate('/accommodations');
		} catch (err: unknown) {
			setError(getApiErrorMessage(err, t('accommodations.errorCreating')));
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
				<h1>{t('accommodations.createTitle')}</h1>
				{error && <Notification message={error} type="danger" />}

				<div className="form-group">
					<label htmlFor="create-name">{t('accommodationForm.name')}</label>
					<input id="create-name" {...register('name')} />
					{errors.name && <span className="form-error">{errors.name.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="create-type">{t('accommodationForm.type')}</label>
					<select id="create-type" {...register('type')}>
						<option value="HOUSE">{t('accommodationType.house')}</option>
						<option value="APARTMENT">{t('accommodationType.apartment')}</option>
						<option value="HOTEL">{t('accommodationType.hotel')}</option>
						<option value="VACATION_HOME">{t('accommodationType.vacationHome')}</option>
						<option value="HOSTEL">{t('accommodationType.hostel')}</option>
					</select>
					{errors.type && <span className="form-error">{errors.type.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="create-region">{t('accommodationForm.region')}</label>
					<input id="create-region" {...register('region')} />
				</div>

				<div className="form-group">
					<label htmlFor="create-city">{t('accommodationForm.city')}</label>
					<input id="create-city" {...register('city')} />
					{errors.city && <span className="form-error">{errors.city.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="create-street">{t('accommodationForm.street')}</label>
					<input id="create-street" {...register('street')} />
				</div>

				<div className="form-group">
					<label htmlFor="create-houseNumber">{t('accommodationForm.houseNumber')}</label>
					<input id="create-houseNumber" {...register('houseNumber')} />
				</div>

				<div className="form-group">
					<label htmlFor="create-apartment">{t('accommodationForm.apartment')}</label>
					<input id="create-apartment" {...register('apartment')} />
				</div>

				<div className="form-group">
					<label htmlFor="create-size">{t('accommodationForm.bedroomCount')}</label>
					<input id="create-size" {...register('size')} />
				</div>

				<div className="form-group">
					<span>{t('accommodationForm.selectLocation')}</span>
					<MapPicker
						position={hasPoint ? { lat, lng } : null}
						onSelect={handleMapSelect}
					/>
					{hasPoint && (
						<p>{t('common.selectedCoordinates', { lat: String(lat), lng: String(lng) })}</p>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="create-amenities">{t('accommodationForm.amenitiesLabel')}</label>
					<input
						id="create-amenities"
						placeholder={t('accommodationForm.amenitiesPlaceholder')}
						{...register('amenities')}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="create-dailyRate">{t('accommodationForm.dailyRate')}</label>
					<input type="number" id="create-dailyRate" min="1" step="1" {...register('dailyRate')} />
					{errors.dailyRate && <span className="form-error">{errors.dailyRate.message}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="create-image">{t('accommodationForm.imageUrl')}</label>
					<input
						id="create-image"
						placeholder="https://example.com/image.jpg"
						{...register('image')}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? t('common.creating') : t('common.create')}
				</button>
			</form>
		</div>
	);
};

export default CreateAccommodation;
