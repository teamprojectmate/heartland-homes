import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import PageWrapper from './components/PageWrapper';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Auth/Login';
import LoginSuccess from './pages/Auth/LoginSuccess';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import Register from './pages/Auth/Register';
import { useAppDispatch } from './store/hooks';

// ── Lazy-loaded pages ────────────────────────────────────────────────

// Public
const Home = lazy(() => import('./pages/Home'));
const Accommodations = lazy(() => import('./pages/Accommodations/Accommodations'));
const AccommodationDetails = lazy(() => import('./pages/Accommodations/AccommodationDetails'));

// User
const Profile = lazy(() => import('./pages/User/Profile'));
const MyBookings = lazy(() => import('./pages/User/MyBookings'));
const BookingDetails = lazy(() => import('./pages/BookingDetails'));
const Payment = lazy(() => import('./pages/User/Payment'));
const PaymentSuccess = lazy(() => import('./pages/User/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/User/PaymentCancel'));
const PaymentsList = lazy(() => import('./pages/User/PaymentsList'));

// Accommodations management (CUSTOMER + MANAGER)
const CreateAccommodation = lazy(() => import('./pages/Accommodations/CreateAccommodation'));
const MyAccommodations = lazy(() => import('./pages/Accommodations/MyAccommodations'));
const EditMyAccommodation = lazy(() => import('./pages/Accommodations/EditMyAccommodation'));

// Admin (MANAGER only)
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminAccommodations = lazy(() => import('./pages/Admin/AdminAccommodations'));
const AdminEditAccommodation = lazy(() => import('./pages/Admin/AdminEditAccommodation'));
const AdminBookings = lazy(() => import('./pages/Admin/AdminBookings'));
const AdminBookingDetails = lazy(() => import('./pages/Admin/AdminBookingDetails'));
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'));
const AdminPayments = lazy(() => import('./pages/Admin/AdminPayments'));

// Info pages
const FAQ = lazy(() => import('./pages/Info/FAQ'));
const Support = lazy(() => import('./pages/Info/Support'));
const About = lazy(() => import('./pages/Info/About'));
const OffersPage = lazy(() => import('./pages/Info/OffersPage'));
const Terms = lazy(() => import('./pages/Info/Terms'));
const Privacy = lazy(() => import('./pages/Info/Privacy'));
const Popular = lazy(() => import('./pages/Info/Popular'));
const Partners = lazy(() => import('./pages/Info/Partners'));
const Cookies = lazy(() => import('./pages/Info/Cookies'));

const NotFound = lazy(() => import('./pages/NotFound'));

// ── Styles & services ────────────────────────────────────────────────

import './styles/main.scss';

import authService from './api/auth/authService';
import { setUser } from './store/slices/authSlice';

// ── App ──────────────────────────────────────────────────────────────

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem('auth') || 'null');
		if (stored?.token) {
			authService
				.getProfile()
				.then((profile) => {
					const cleanRole = profile.role?.startsWith('ROLE_')
						? profile.role.replace('ROLE_', '')
						: profile.role;
					dispatch(setUser({ token: stored.token, ...profile, cleanRole }));
				})
				.catch(() => {
					localStorage.removeItem('auth');
					localStorage.removeItem('userProfile');
				});
		}
	}, [dispatch]);

	return (
		<div className="main-layout">
			<Header />
			<main className="main-content">
				<ScrollToTop />
				<ErrorBoundary>
					<Suspense fallback={<p className="text-center mt-5">Завантаження...</p>}>
						<Routes>
							{/* ── Public routes ──────────────────────────── */}
							<Route
								path="/"
								element={
									<PageWrapper title="Головна">
										<Home />
									</PageWrapper>
								}
							/>
							<Route
								path="/accommodations"
								element={
									<PageWrapper title="Усі помешкання">
										<Accommodations />
									</PageWrapper>
								}
							/>
							<Route
								path="/accommodations/:id"
								element={
									<PageWrapper title="Деталі помешкання">
										<AccommodationDetails />
									</PageWrapper>
								}
							/>

							{/* ── Auth routes ────────────────────────────── */}
							<Route
								path="/login"
								element={
									<PageWrapper title="Вхід">
										<Login />
									</PageWrapper>
								}
							/>
							<Route path="/auth/success" element={<LoginSuccess />} />
							<Route path="/login/success" element={<LoginSuccess />} />
							<Route
								path="/register"
								element={
									<PageWrapper title="Реєстрація">
										<Register />
									</PageWrapper>
								}
							/>

							{/* ── Accommodation management (CUSTOMER + MANAGER) ── */}
							<Route
								path="/accommodations/new"
								element={
									<ProtectedRoute requiredRole={['CUSTOMER', 'MANAGER']}>
										<PageWrapper title="Створити помешкання">
											<CreateAccommodation />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/my-accommodations"
								element={
									<ProtectedRoute requiredRole={['CUSTOMER', 'MANAGER']}>
										<PageWrapper title="Мої помешкання">
											<MyAccommodations />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/my-accommodations/edit/:id"
								element={
									<ProtectedRoute requiredRole={['CUSTOMER', 'MANAGER']}>
										<PageWrapper title="Редагувати моє помешкання">
											<EditMyAccommodation />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>

							{/* ── User routes (authenticated) ────────────── */}
							<Route
								path="/my-bookings"
								element={
									<ProtectedRoute>
										<PageWrapper title="Мої бронювання">
											<MyBookings />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/my-bookings/:id"
								element={
									<ProtectedRoute>
										<PageWrapper title="Деталі бронювання">
											<BookingDetails />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<PageWrapper title="Мій профіль">
											<Profile />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/payment/:bookingId"
								element={
									<ProtectedRoute>
										<PageWrapper title="Оплата">
											<Payment />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/payments/success"
								element={
									<ProtectedRoute>
										<PageWrapper title="Оплата успішна">
											<PaymentSuccess />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/payments/cancel"
								element={
									<ProtectedRoute>
										<PageWrapper title="Оплату скасовано">
											<PaymentCancel />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/my-payments"
								element={
									<ProtectedRoute>
										<PageWrapper title="Мої платежі">
											<PaymentsList />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>

							{/* ── Admin routes (MANAGER only) ────────────── */}
							<Route
								path="/admin/accommodations"
								element={
									<ProtectedRoute requiredRole="MANAGER">
										<PageWrapper title="Усі помешкання">
											<AdminAccommodations />
										</PageWrapper>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/*"
								element={
									<ProtectedRoute requiredRole="MANAGER">
										<AdminLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<AdminDashboard />} />
								<Route path="accommodations/edit/:id" element={<AdminEditAccommodation />} />
								<Route path="bookings" element={<AdminBookings />} />
								<Route path="bookings/:id" element={<AdminBookingDetails />} />
								<Route path="users" element={<AdminUsers />} />
								<Route path="payments" element={<AdminPayments />} />
							</Route>

							{/* ── Info / static pages ─────────────────────── */}
							<Route
								path="/faq"
								element={
									<PageWrapper title="FAQ">
										<FAQ />
									</PageWrapper>
								}
							/>
							<Route
								path="/support"
								element={
									<PageWrapper title="Зв'язатися з нами">
										<Support />
									</PageWrapper>
								}
							/>
							<Route
								path="/about"
								element={
									<PageWrapper title="Про нас">
										<About />
									</PageWrapper>
								}
							/>
							<Route
								path="/offers"
								element={
									<PageWrapper title="Акції та знижки">
										<OffersPage />
									</PageWrapper>
								}
							/>
							<Route
								path="/popular"
								element={
									<PageWrapper title="Популярні напрямки">
										<Popular />
									</PageWrapper>
								}
							/>
							<Route
								path="/partners"
								element={
									<PageWrapper title="Партнери">
										<Partners />
									</PageWrapper>
								}
							/>
							<Route
								path="/terms"
								element={
									<PageWrapper title="Умови використання">
										<Terms />
									</PageWrapper>
								}
							/>
							<Route
								path="/privacy"
								element={
									<PageWrapper title="Політика конфіденційності">
										<Privacy />
									</PageWrapper>
								}
							/>
							<Route
								path="/cookies"
								element={
									<PageWrapper title="Файли Cookie">
										<Cookies />
									</PageWrapper>
								}
							/>

							{/* ── Catch-all ──────────────────────────────── */}
							<Route
								path="*"
								element={
									<PageWrapper title="Сторінку не знайдено">
										<NotFound />
									</PageWrapper>
								}
							/>
						</Routes>
					</Suspense>
				</ErrorBoundary>
			</main>
			<Footer />
		</div>
	);
}

export default App;
