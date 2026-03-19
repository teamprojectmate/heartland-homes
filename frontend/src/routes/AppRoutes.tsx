import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Login from '../pages/Auth/Login';
import LoginSuccess from '../pages/Auth/LoginSuccess';
import ProtectedRoute from '../pages/Auth/ProtectedRoute';
import Register from '../pages/Auth/Register';

// ── Lazy-loaded pages ────────────────────────────────────────────────

// Public
const Home = lazy(() => import('../pages/Home'));
const Accommodations = lazy(() => import('../pages/Accommodations/Accommodations'));
const AccommodationDetails = lazy(() => import('../pages/Accommodations/AccommodationDetails'));

// User
const Profile = lazy(() => import('../pages/User/Profile'));
const MyBookings = lazy(() => import('../pages/User/MyBookings'));
const BookingDetails = lazy(() => import('../pages/BookingDetails'));
const Payment = lazy(() => import('../pages/User/Payment'));
const PaymentSuccess = lazy(() => import('../pages/User/PaymentSuccess'));
const PaymentCancel = lazy(() => import('../pages/User/PaymentCancel'));
const PaymentsList = lazy(() => import('../pages/User/PaymentsList'));

// Accommodations management (CUSTOMER + MANAGER)
const CreateAccommodation = lazy(() => import('../pages/Accommodations/CreateAccommodation'));
const MyAccommodations = lazy(() => import('../pages/Accommodations/MyAccommodations'));
const EditMyAccommodation = lazy(() => import('../pages/Accommodations/EditMyAccommodation'));

// Admin (MANAGER only)
const AdminLayout = lazy(() => import('../components/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminAccommodations = lazy(() => import('../pages/Admin/AdminAccommodations'));
const AdminEditAccommodation = lazy(() => import('../pages/Admin/AdminEditAccommodation'));
const AdminBookings = lazy(() => import('../pages/Admin/AdminBookings'));
const AdminBookingDetails = lazy(() => import('../pages/Admin/AdminBookingDetails'));
const AdminUsers = lazy(() => import('../pages/Admin/AdminUsers'));
const AdminPayments = lazy(() => import('../pages/Admin/AdminPayments'));

// Info pages
const FAQ = lazy(() => import('../pages/Info/FAQ'));
const Support = lazy(() => import('../pages/Info/Support'));
const About = lazy(() => import('../pages/Info/About'));
const OffersPage = lazy(() => import('../pages/Info/OffersPage'));
const Terms = lazy(() => import('../pages/Info/Terms'));
const Privacy = lazy(() => import('../pages/Info/Privacy'));
const Popular = lazy(() => import('../pages/Info/Popular'));
const Partners = lazy(() => import('../pages/Info/Partners'));
const Cookies = lazy(() => import('../pages/Info/Cookies'));

const NotFound = lazy(() => import('../pages/NotFound'));

// ── Routes ───────────────────────────────────────────────────────────

const AppRoutes = () => {
	const { t } = useTranslation();

	return (
		<Routes>
			{/* ── Public routes ──────────────────────────── */}
			<Route
				path="/"
				element={
					<PageWrapper title={t('pages.home')}>
						<Home />
					</PageWrapper>
				}
			/>
			<Route
				path="/accommodations"
				element={
					<PageWrapper title={t('pages.allAccommodations')}>
						<Accommodations />
					</PageWrapper>
				}
			/>
			<Route
				path="/accommodations/:id"
				element={
					<PageWrapper title={t('pages.accommodationDetails')}>
						<AccommodationDetails />
					</PageWrapper>
				}
			/>

			{/* ── Auth routes ────────────────────────────── */}
			<Route
				path="/login"
				element={
					<PageWrapper title={t('pages.login')}>
						<Login />
					</PageWrapper>
				}
			/>
			<Route path="/auth/success" element={<LoginSuccess />} />
			<Route path="/login/success" element={<LoginSuccess />} />
			<Route
				path="/register"
				element={
					<PageWrapper title={t('pages.register')}>
						<Register />
					</PageWrapper>
				}
			/>

			{/* ── Accommodation management (CUSTOMER + MANAGER) ── */}
			<Route
				path="/accommodations/new"
				element={
					<ProtectedRoute requiredRole={['CUSTOMER', 'MANAGER']}>
						<PageWrapper title={t('pages.createAccommodation')}>
							<CreateAccommodation />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/my-accommodations"
				element={
					<ProtectedRoute requiredRole={['CUSTOMER', 'MANAGER']}>
						<PageWrapper title={t('pages.myAccommodations')}>
							<MyAccommodations />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/my-accommodations/edit/:id"
				element={
					<ProtectedRoute requiredRole={['CUSTOMER', 'MANAGER']}>
						<PageWrapper title={t('pages.editMyAccommodation')}>
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
						<PageWrapper title={t('pages.myBookings')}>
							<MyBookings />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/my-bookings/:id"
				element={
					<ProtectedRoute>
						<PageWrapper title={t('pages.bookingDetails')}>
							<BookingDetails />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<PageWrapper title={t('pages.myProfile')}>
							<Profile />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/payment/:bookingId"
				element={
					<ProtectedRoute>
						<PageWrapper title={t('pages.payment')}>
							<Payment />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/payments/success"
				element={
					<ProtectedRoute>
						<PageWrapper title={t('pages.paymentSuccess')}>
							<PaymentSuccess />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/payments/cancel"
				element={
					<ProtectedRoute>
						<PageWrapper title={t('pages.paymentCancelled')}>
							<PaymentCancel />
						</PageWrapper>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/my-payments"
				element={
					<ProtectedRoute>
						<PageWrapper title={t('pages.myPayments')}>
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
						<PageWrapper title={t('pages.allAccommodations')}>
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
					<PageWrapper title={t('pages.faq')}>
						<FAQ />
					</PageWrapper>
				}
			/>
			<Route
				path="/support"
				element={
					<PageWrapper title={t('pages.contactUs')}>
						<Support />
					</PageWrapper>
				}
			/>
			<Route
				path="/about"
				element={
					<PageWrapper title={t('pages.aboutUs')}>
						<About />
					</PageWrapper>
				}
			/>
			<Route
				path="/offers"
				element={
					<PageWrapper title={t('pages.offersDiscounts')}>
						<OffersPage />
					</PageWrapper>
				}
			/>
			<Route
				path="/popular"
				element={
					<PageWrapper title={t('pages.popularDestinations')}>
						<Popular />
					</PageWrapper>
				}
			/>
			<Route
				path="/partners"
				element={
					<PageWrapper title={t('pages.partners')}>
						<Partners />
					</PageWrapper>
				}
			/>
			<Route
				path="/terms"
				element={
					<PageWrapper title={t('pages.termsOfUse')}>
						<Terms />
					</PageWrapper>
				}
			/>
			<Route
				path="/privacy"
				element={
					<PageWrapper title={t('pages.privacyPolicy')}>
						<Privacy />
					</PageWrapper>
				}
			/>
			<Route
				path="/cookies"
				element={
					<PageWrapper title={t('pages.cookies')}>
						<Cookies />
					</PageWrapper>
				}
			/>

			{/* ── Catch-all ──────────────────────────────── */}
			<Route
				path="*"
				element={
					<PageWrapper title={t('pages.notFound')}>
						<NotFound />
					</PageWrapper>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
