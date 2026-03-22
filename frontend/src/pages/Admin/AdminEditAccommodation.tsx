import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getAccommodationById,
	updateAccommodation,
} from '../../api/accommodations/accommodationService';
import Notification from '../../components/Notification';
import { getApiErrorMessage, parseAmenities } from '../../utils/accommodationPayload';
import { getSafeImageUrl } from '../../utils/getSafeImageUrl';
import { getTypeTranslations, mapAmenity, mapType } from '../../utils/translations/index';
import {
	type AdminAccommodationFormData,
	adminAccommodationSchema,
} from '../../validation/schemas';

import '../../styles/components/admin/_admin-form.scss';

const AdminEditAccommodation = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<AdminAccommodationFormData>({
		resolver: zodResolver(adminAccommodationSchema),
		defaultValues: {
			name: '',
			type: '',
			location: '',
			city: '',
			latitude: '',
			longitude: '',
			size: '',
			amenities: '',
			dailyRate: '',
			image: '',
		},
	});

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchAccommodation = async () => {
			setLoading(true);
			try {
				if (!id) return;
				const data = await getAccommodationById(id);
				reset({
					name: data.name || '',
					type: data.type || '',
					location: data.location || data.address || '',
					city: data.city || '',
					latitude: String(data.latitude || ''),
					longitude: String(data.longitude || ''),
					size: String(data.size || ''),
					amenities: data.amenities?.join(', ') || '',
					dailyRate: String(data.dailyRate ?? ''),
					image: data.image || data.imageUrl || '',
				});
			} catch {
				setError(t('accommodations.errorLoading'));
			} finally {
				setLoading(false);
			}
		};
		fetchAccommodation();
	}, [id, reset, t]);

	const onSubmit = async (formData: AdminAccommodationFormData) => {
		setLoading(true);
		setError(null);

		try {
			const payload = {
				...formData,
				dailyRate: Number(formData.dailyRate),
				amenities: parseAmenities(formData.amenities),
			};
			if (!id) return;
			await updateAccommodation(id, payload);
			navigate('/admin/accommodations');
		} catch (err: unknown) {
			setError(getApiErrorMessage(err, t('accommodations.errorUpdating')));
		} finally {
			setLoading(false);
		}
	};

	const typeValue = watch('type');
	const amenitiesValue = watch('amenities');
	const imageValue = watch('image');

	if (loading) return <p className="text-center">{t('common.loading')}</p>;

	return (
		<div className="container page">
			<form onSubmit={handleSubmit(onSubmit)} className="admin-form">
				<h1>{t('accommodations.adminEditTitle')}</h1>
				{error && <Notification message={error} type="danger" />}

				<div className="form-group">
					<label htmlFor="admin-edit-name">{t('accommodationForm.name')}</label>
					<input type="text" id="admin-edit-name" {...register('name')} />
					{errors.name && <span className="form-error">{t(errors.name.message ?? '')}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="admin-edit-type">{t('accommodationForm.type')}</label>
					<select id="admin-edit-type" {...register('type')}>
						<option value="">{t('searchForm.selectType')}</option>
						{Object.entries(getTypeTranslations(t)).map(([key, { label }]) => (
							<option key={key} value={key}>
								{label}
							</option>
						))}
					</select>
					{errors.type && <span className="form-error">{t(errors.type.message ?? '')}</span>}

					{typeValue && (
						<div className="badge-group" style={{ marginTop: '0.5rem' }}>
							{(() => {
								const type = mapType(typeValue, t);
								return (
									<span className={`badge badge-type-${typeValue.toLowerCase()}`}>
										{type.icon} {type.label}
									</span>
								);
							})()}
						</div>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="admin-edit-location">{t('accommodationForm.locationLabel')}</label>
					<input type="text" id="admin-edit-location" {...register('location')} />
				</div>

				<div className="form-group">
					<label htmlFor="admin-edit-city">{t('accommodationForm.city')}</label>
					<input type="text" id="admin-edit-city" {...register('city')} />
					{errors.city && <span className="form-error">{t(errors.city.message ?? '')}</span>}
				</div>

				{/* Latitude */}
				<div className="form-group">
					<label htmlFor="admin-edit-latitude">{t('accommodationForm.latitude')}</label>
					<input type="text" id="admin-edit-latitude" {...register('latitude')} />
				</div>

				{/* Longitude */}
				<div className="form-group">
					<label htmlFor="admin-edit-longitude">{t('accommodationForm.longitude')}</label>
					<input type="text" id="admin-edit-longitude" {...register('longitude')} />
				</div>

				{/* Size */}
				<div className="form-group">
					<label htmlFor="admin-edit-size">{t('accommodationForm.bedroomCountShort')}</label>
					<input type="number" id="admin-edit-size" {...register('size')} />
				</div>

				{/* Amenities */}
				<div className="form-group">
					<label htmlFor="admin-edit-amenities">{t('accommodationForm.amenitiesLabel')}</label>
					<input type="text" id="admin-edit-amenities" {...register('amenities')} />
					<div className="badge-group" style={{ marginTop: '0.5rem' }}>
						{(amenitiesValue || '')
							.split(',')
							.map((a) => a.trim())
							.filter(Boolean)
							.map((a) => {
								const { label, icon, slug, color } = mapAmenity(a, t);
								return (
									<span
										key={slug}
										className={`badge badge-amenity ${slug}`}
										style={{ backgroundColor: color, color: '#fff' }}
									>
										{icon} {label}
									</span>
								);
							})}
					</div>
				</div>

				{/* Daily rate */}
				<div className="form-group">
					<label htmlFor="admin-edit-dailyRate">{t('accommodationForm.dailyRate')}</label>
					<input type="number" id="admin-edit-dailyRate" {...register('dailyRate')} />
					{errors.dailyRate && (
						<span className="form-error">{t(errors.dailyRate.message ?? '')}</span>
					)}
				</div>

				{/* Image */}
				<div className="form-group">
					<label htmlFor="admin-edit-image">{t('accommodationForm.imageUrl')}</label>
					<input type="text" id="admin-edit-image" {...register('image')} />
					{imageValue && (
						<div className="image-preview">
							<img
								src={getSafeImageUrl(imageValue)}
								alt={t('accommodationForm.imagePreview')}
								className="preview-img"
							/>
						</div>
					)}
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? t('common.updating') : t('common.save')}
				</button>
			</form>
		</div>
	);
};

export default AdminEditAccommodation;
