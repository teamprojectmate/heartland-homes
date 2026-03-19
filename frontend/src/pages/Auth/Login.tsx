import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaHome, FaLock } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import '../../styles/components/_auth.scss';
import { type LoginFormData, loginSchema } from '../../validation/schemas';

const Login = () => {
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

	//  Якщо користувач вже залогінений → редіректимо
	useEffect(() => {
		if (isAuthenticated) {
			const redirectPath = location.state?.from?.pathname || '/';
			navigate(redirectPath, { replace: true });
		}
	}, [isAuthenticated, navigate, location]);

	return (
		<div className="auth-layout">
			<div className="auth-card">
				<h2 className="auth-title">Вхід</h2>
				<p className="form-subtitle">
					Немає акаунта? <Link to="/register">Зареєструватися</Link>
				</p>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group with-icon">
						<FaEnvelope className="input-icon" />
						<input
							type="email"
							className="form-control"
							placeholder="Електронна пошта"
							{...register('email')}
						/>
						{errors.email && <span className="form-error">{errors.email.message}</span>}
					</div>

					<div className="form-group with-icon">
						<FaLock className="input-icon" />
						<input
							type="password"
							className="form-control"
							placeholder="Пароль"
							{...register('password')}
						/>
						{errors.password && <span className="form-error">{errors.password.message}</span>}
					</div>

					{isError && (
						<p className="form-error" data-testid="login-error">
							{message || 'Невірний логін або пароль'}
						</p>
					)}

					<button type="submit" disabled={isLoading}>
						{isLoading ? 'Зачекайте...' : 'Увійти'}
					</button>
				</form>

				{/* Кнопка Google Login */}
				<GoogleLoginButton />
			</div>

			<div className="auth-side login">
				<FaHome className="auth-icon" />
				<h2 className="auth-title">Ласкаво просимо 👋</h2>
				<p className="auth-subtitle">
					Увійдіть, щоб забронювати свій наступний будинок мрії з <strong>Heartland Homes</strong>.
				</p>
			</div>
		</div>
	);
};

export default Login;
