import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register as registerUser, reset } from '../../store/slices/authSlice';
import '../../styles/components/_auth.scss';
import { type RegisterFormData, registerSchema } from '../../validation/schemas';

const Register = () => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { isLoading, isError, isSuccess, message } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (isSuccess) {
			navigate('/login');
		}
		dispatch(reset());
	}, [isSuccess, navigate, dispatch]);

	const onSubmit = (data: RegisterFormData) => {
		const { confirmPassword, ...payload } = data;
		dispatch(registerUser(payload));
	};

	return (
		<div className="auth-layout">
			<div className="auth-card">
				<h2 className="auth-title">{t('auth.registerTitle')}</h2>

				{isError && <Notification message={message} type="error" />}
				{isSuccess && <Notification message={t('auth.registerSuccess')} type="success" />}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group with-icon">
						<FaUser className="input-icon" />
						<input
							type="text"
							id="firstName"
							className="form-control"
							placeholder={t('auth.firstName')}
							autoComplete="given-name"
							{...register('firstName')}
						/>
						{errors.firstName && (
							<span className="form-error">{t(errors.firstName.message ?? '')}</span>
						)}
					</div>

					<div className="form-group with-icon">
						<FaUser className="input-icon" />
						<input
							type="text"
							id="lastName"
							className="form-control"
							placeholder={t('auth.lastName')}
							autoComplete="family-name"
							{...register('lastName')}
						/>
						{errors.lastName && (
							<span className="form-error">{t(errors.lastName.message ?? '')}</span>
						)}
					</div>

					<div className="form-group with-icon">
						<FaEnvelope className="input-icon" />
						<input
							type="email"
							id="email"
							className="form-control"
							placeholder={t('auth.email')}
							autoComplete="email"
							{...register('email')}
						/>
						{errors.email && <span className="form-error">{t(errors.email.message ?? '')}</span>}
					</div>

					<div className="form-group with-icon">
						<FaLock className="input-icon" />
						<input
							type="password"
							id="password"
							className="form-control"
							placeholder={t('auth.password')}
							autoComplete="new-password"
							{...register('password')}
						/>
						{errors.password && (
							<span className="form-error">{t(errors.password.message ?? '')}</span>
						)}
					</div>

					<div className="form-group with-icon">
						<FaLock className="input-icon" />
						<input
							type="password"
							id="confirmPassword"
							className="form-control"
							placeholder={t('auth.confirmPassword')}
							autoComplete="new-password"
							{...register('confirmPassword')}
						/>
						{errors.confirmPassword && (
							<span className="form-error">{t(errors.confirmPassword.message ?? '')}</span>
						)}
					</div>

					<button
						type="submit"
						className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
						disabled={isLoading}
					>
						{isLoading ? t('auth.registering') : t('auth.registerLink')}
					</button>
				</form>

				<p className="form-subtitle text-center">
					{t('auth.haveAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
				</p>
			</div>

			<div className="auth-side register">
				<span className="auth-icon">✨</span>
				<h2 className="auth-title">{t('auth.welcomeTitle')}!</h2>
				<p className="auth-subtitle">
					<Trans i18nKey="auth.welcomeRegisterSubtitle" components={{ strong: <strong /> }} />
				</p>
			</div>
		</div>
	);
};

export default Register;
