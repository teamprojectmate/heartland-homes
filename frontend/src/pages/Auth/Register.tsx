import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register as registerUser, reset } from '../../store/slices/authSlice';
import '../../styles/components/_auth.scss';
import { type RegisterFormData, registerSchema } from '../../validation/schemas';

const Register = () => {
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

	//  Редірект після успішної реєстрації
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
				<h2 className="auth-title">Реєстрація</h2>

				{isError && <Notification message={message} type="error" />}
				{isSuccess && (
					<Notification message="Реєстрація успішна! Тепер ви можете увійти." type="success" />
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group with-icon">
						<FaUser className="input-icon" />
						<input
							type="text"
							id="firstName"
							className="form-control"
							placeholder="Ім'я"
							{...register('firstName')}
						/>
						{errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
					</div>

					<div className="form-group with-icon">
						<FaUser className="input-icon" />
						<input
							type="text"
							id="lastName"
							className="form-control"
							placeholder="Прізвище"
							{...register('lastName')}
						/>
						{errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
					</div>

					<div className="form-group with-icon">
						<FaEnvelope className="input-icon" />
						<input
							type="email"
							id="email"
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
							id="password"
							className="form-control"
							placeholder="Пароль"
							{...register('password')}
						/>
						{errors.password && <span className="form-error">{errors.password.message}</span>}
					</div>

					<div className="form-group with-icon">
						<FaLock className="input-icon" />
						<input
							type="password"
							id="confirmPassword"
							className="form-control"
							placeholder="Підтвердіть пароль"
							{...register('confirmPassword')}
						/>
						{errors.confirmPassword && (
							<span className="form-error">{errors.confirmPassword.message}</span>
						)}
					</div>

					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{isLoading ? 'Реєстрація...' : 'Зареєструватися'}
					</button>
				</form>

				<p className="form-subtitle text-center">
					Вже маєте акаунт? <Link to="/login">Увійти</Link>
				</p>
			</div>

			{/*  Додаємо модифікатор register */}
			<div className="auth-side register">
				<span className="auth-icon">✨</span>
				<h2 className="auth-title">Ласкаво просимо!</h2>
				<p className="auth-subtitle">
					Зареєструйтесь, щоб знайти свій ідеальний дім разом з <strong>Heartland Homes</strong>.
				</p>
			</div>
		</div>
	);
};

export default Register;
