import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Notification from '../../components/Notification';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProfile, updateProfile } from '../../store/slices/userSlice';
import { type ProfileFormData, profileSchema } from '../../validation/schemas';

const Profile = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { profile, loading, error } = useAppSelector((state) => state.user);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: { email: '', firstName: '', lastName: '' },
	});

	useEffect(() => {
		dispatch(fetchProfile());
	}, [dispatch]);

	useEffect(() => {
		if (profile) {
			reset({
				email: profile.email || '',
				firstName: profile.firstName || '',
				lastName: profile.lastName || '',
			});
		}
	}, [profile, reset]);

	const onSubmit = (data: ProfileFormData) => {
		dispatch(updateProfile(data));
	};

	return (
		<div className="container page">
			<div className="profile-card">
				<h1 className="auth-title">{t('profile.title')}</h1>

				{error && <Notification message={error} type="danger" />}
				{loading && <p>{t('common.loading')}</p>}

				{!loading && profile && (
					<form onSubmit={handleSubmit(onSubmit)} className="profile-form">
						<div className="form-group">
							<input
								id="profile-email"
								type="email"
								className="form-control"
								placeholder=" "
								{...register('email')}
							/>
							<label htmlFor="profile-email">{t('profile.email')}</label>
							{errors.email && <span className="form-error">{errors.email.message}</span>}
						</div>

						<div className="form-group">
							<input
								id="profile-firstName"
								type="text"
								className="form-control"
								placeholder=" "
								{...register('firstName')}
							/>
							<label htmlFor="profile-firstName">{t('profile.firstName')}</label>
							{errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
						</div>

						<div className="form-group">
							<input
								id="profile-lastName"
								type="text"
								className="form-control"
								placeholder=" "
								{...register('lastName')}
							/>
							<label htmlFor="profile-lastName">{t('profile.lastName')}</label>
							{errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
						</div>

						<button className="btn btn-primary" type="submit" disabled={loading}>
							{loading ? t('common.saving') : t('profile.editProfile')}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default Profile;
