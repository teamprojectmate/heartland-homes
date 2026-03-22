import { Suspense, useEffect } from 'react';
import authService from './api/auth/authService';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import { PageSkeleton } from './components/skeletons';
import AppRoutes from './routes/AppRoutes';
import { useAppDispatch } from './store/hooks';
import { setUser } from './store/slices/authSlice';

import './styles/main.scss';

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const stored = JSON.parse(sessionStorage.getItem('auth') || 'null');
		if (!stored?.token) {
			dispatch(setUser(null));
			return;
		}

		authService
			.getProfile()
			.then((profile) => {
				const cleanRole = profile.role?.startsWith('ROLE_')
					? profile.role.replace('ROLE_', '')
					: profile.role;
				dispatch(setUser({ token: stored.token, ...profile, cleanRole }));
			})
			.catch(() => {
				sessionStorage.removeItem('auth');
				sessionStorage.removeItem('userProfile');
				dispatch(setUser(null));
			});
	}, [dispatch]);

	return (
		<div className="main-layout">
			<img src="/assets/bg-home.jpg" alt="" className="bg-photo" aria-hidden="true" />
			<Header />
			<main className="main-content">
				<ScrollToTop />
				<ErrorBoundary>
					<Suspense fallback={<PageSkeleton />}>
						<AppRoutes />
					</Suspense>
				</ErrorBoundary>
			</main>
			<Footer />
		</div>
	);
}

export default App;
