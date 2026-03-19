import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { FaEnvelope, FaHome, FaLock } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import '../../styles/components/_auth.scss';
import { type LoginFormData, loginSchema } from '../../validation/schemas';

const Login = () => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { isAuthenticated, isLoading, isError, message } = useAppSelector((s) => s.auth);

	const onSubmit = (data: LoginFormData) => {
		dispatch(login(data));
	};

	useEffect(() => {
		if (isAuthenticated) {
			const redirectPath = location.state?.from?.pathname || '/';
			navigate(redirectPath, { replace: true });
		}
	}, [isAuthenticated, navigate, location]);

	return (
		<div className="auth-layout">
			<div className="auth-card">
				<h2 className="auth-title">{t('auth.loginTitle')}</h2>
				<p className="form-subtitle">
					{t('auth.noAccount')} <Link to="/register">{t('auth.registerLink')}</Link>
				</p>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group with-icon">
						<FaEnvelope className="input-icon" />
						<input
							type="email"
							className="form-control"
							placeholder={t('auth.email')}
							{...register('email')}
						/>
						{errors.email && <span className="form-error">{errors.email.message}</span>}
					</div>

					<div className="form-group with-icon">
						<FaLock className="input-icon" />
						<input
							type="password"
							className="form-control"
							placeholder={t('auth.password')}
							{...register('password')}
						/>
						{errors.password && <span className="form-error">{errors.password.message}</span>}
					</div>

					{isError && (
						<p className="form-error" data-testid="login-error">
							{message || t('auth.invalidCredentials')}
						</p>
					)}

					<button type="submit" disabled={isLoading}>
						{isLoading ? t('auth.wait') : t('nav.login')}
					</button>
				</form>

				<GoogleLoginButton />
			</div>

			<div className="auth-side login">
				<FaHome className="auth-icon" />
				<h2 className="auth-title">{t('auth.welcomeTitle')}</h2>
				<p className="auth-subtitle">
					<Trans i18nKey="auth.welcomeLoginSubtitle" components={{ strong: <strong /> }} />
				</p>
			</div>
		</div>
	);
};

export default Login;
