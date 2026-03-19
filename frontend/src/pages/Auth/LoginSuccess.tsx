import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../api/auth/authService';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';

const LoginSuccess = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');

		if (!token) {
			navigate('/login', { replace: true });
			return;
		}

		// Clean token from URL immediately (security: prevent leakage via history/referrer)
		window.history.replaceState({}, '', '/login-success');

		// Save token so getProfile() can use it
		sessionStorage.setItem('auth', JSON.stringify({ token }));

		authService
			.getProfile()
			.then((profile) => {
				const rawRole = profile.role || (profile.roles?.[0] ?? null);
				const cleanRole = rawRole?.startsWith('ROLE_') ? rawRole.replace('ROLE_', '') : rawRole;

				sessionStorage.setItem('userProfile', JSON.stringify(profile));
				dispatch(setUser({ token, ...profile, cleanRole }));
				navigate('/', { replace: true });
			})
			.catch(() => {
				sessionStorage.removeItem('auth');
				navigate('/login', { replace: true });
			});
	}, [location, navigate, dispatch]);

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h2>Обробка входу...</h2>
			<p>Зачекайте, будь ласка</p>
		</div>
	);
};

export default LoginSuccess;
