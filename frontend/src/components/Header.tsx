import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	FaBuilding,
	FaClipboardList,
	FaCreditCard,
	FaHome,
	FaSignInAlt,
	FaSignOutAlt,
	FaUser,
	FaUserCog,
	FaUserPlus,
} from 'react-icons/fa';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

import '../styles/components/header/_index.scss';
import '../styles/components/_buttons.scss';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { isAuthenticated, user } = useAppSelector((s) => s.auth);
	const [open, setOpen] = useState(false);
	const [adminMode, setAdminMode] = useState(false);

	const handleLogout = () => {
		dispatch(logout());
		setOpen(false);
		navigate('/login');
	};

	const closeDrawer = () => {
		setOpen(false);
	};

	useEffect(() => {
		document.body.classList.toggle('no-scroll', open);
		return () => document.body.classList.remove('no-scroll');
	}, [open]);

	const userRole = user?.cleanRole || (Array.isArray(user?.roles) ? user.roles[0] : user?.role);

	const isManager = userRole === 'MANAGER';
	const isCustomer = userRole === 'CUSTOMER';

	useEffect(() => {
		if (location.pathname.startsWith('/admin')) {
			setAdminMode(true);
		} else {
			setAdminMode(false);
		}
	}, [location]);

	return (
		<>
			<header className="main-header">
				<div className="container header-container">
					<Link className="brand" to="/" aria-label="Heartland Homes">
						<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 2.4c-3.9 0-7 3-7 6.7 0 5.5 7 12.3 7 12.3s7-6.8 7-12.3c0-3.7-3.1-6.7-7-6.7Zm0 9.1a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z"
							/>
						</svg>
						<span>Heartland Homes</span>
					</Link>

					{/* Desktop nav */}
					<nav className="nav-desktop" aria-label={t('nav.mainNav')}>
						<ul>
							<li>
								<NavLink to="/" end className="nav-link">
									<FaHome className="nav-icon" /> {t('nav.home')}
								</NavLink>
							</li>
							<li>
								<NavLink to="/my-bookings" className="nav-link">
									<FaClipboardList className="nav-icon" /> {t('nav.myBookings')}
								</NavLink>
							</li>
							<li>
								<NavLink to="/my-payments" className="nav-link">
									<FaCreditCard className="nav-icon" /> {t('nav.myPayments')}
								</NavLink>
							</li>

							{isCustomer && (
								<li>
									<NavLink to="/my-accommodations" className="nav-link">
										<FaBuilding className="nav-icon" /> {t('nav.myAccommodations')}
									</NavLink>
								</li>
							)}

							{isManager && (
								<li>
									<NavLink to="/admin" className="nav-link">
										<FaUserCog className="nav-icon" /> {t('nav.adminPanel')}
									</NavLink>
								</li>
							)}
							<li>
								<NavLink to="/profile" className="nav-link">
									<FaUser className="nav-icon" /> {t('nav.profile')}
								</NavLink>
							</li>
						</ul>

						{isAuthenticated ? (
							<div className="nav-actions">
								<LanguageSwitcher />
								<button type="button" className="btn-chip logout" onClick={handleLogout}>
									<FaSignOutAlt className="nav-icon" /> {t('nav.logout')}
								</button>
							</div>
						) : (
							<div className="nav-actions">
								<LanguageSwitcher />
								<NavLink to="/login" className="btn-chip primary">
									<FaSignInAlt className="nav-icon" /> {t('nav.login')}
								</NavLink>
								<NavLink to="/register" className="btn-chip secondary">
									<FaUserPlus className="nav-icon" /> {t('nav.register')}
								</NavLink>
							</div>
						)}
					</nav>

					{/* Burger */}
					<button
						type="button"
						className={`burger ${open ? 'open' : ''}`}
						aria-label={t('nav.menu')}
						aria-controls="mobile-drawer"
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
					>
						<span />
						<span />
						<span />
					</button>
				</div>
			</header>

			{/* Drawer */}
			<div
				id="mobile-drawer"
				className={`drawer ${open ? 'open' : ''} ${adminMode ? 'admin-mode' : ''}`}
				role="dialog"
				aria-modal="true"
				aria-label={t('nav.mobileMenu')}
			>
				<div className={`drawer-content ${open ? 'open' : ''}`}>
					<button
						type="button"
						className="drawer-close"
						aria-label={t('nav.closeMenu')}
						onClick={closeDrawer}
					/>

					{adminMode ? (
						<>
							<h2>{t('nav.adminPanel')}</h2>
							<ul className="drawer-nav">
								<li>
									<NavLink onClick={closeDrawer} to="/admin">
										<FaHome className="nav-icon" /> {t('nav.home')}
									</NavLink>
								</li>
								<li>
									<NavLink onClick={closeDrawer} to="/admin/accommodations">
										<FaClipboardList className="nav-icon" /> {t('nav.accommodations')}
									</NavLink>
								</li>
								<li>
									<NavLink onClick={closeDrawer} to="/admin/bookings">
										<FaCreditCard className="nav-icon" /> {t('admin.bookings')}
									</NavLink>
								</li>
								<li>
									<NavLink onClick={closeDrawer} to="/admin/users">
										<FaUser className="nav-icon" /> {t('admin.users')}
									</NavLink>
								</li>
							</ul>
							<div className="drawer-actions">
								<LanguageSwitcher />
								<NavLink to="/" onClick={() => setOpen(false)} className="btn-primary">
									{t('nav.backToHome')}
								</NavLink>
							</div>
						</>
					) : (
						<>
							<ul className="drawer-nav">
								<li>
									<NavLink onClick={closeDrawer} to="/" end>
										<FaHome className="nav-icon" /> {t('nav.home')}
									</NavLink>
								</li>
								<li>
									<NavLink onClick={closeDrawer} to="/my-bookings">
										<FaClipboardList className="nav-icon" /> {t('nav.myBookings')}
									</NavLink>
								</li>
								<li>
									<NavLink onClick={closeDrawer} to="/my-payments">
										<FaCreditCard className="nav-icon" /> {t('nav.myPayments')}
									</NavLink>
								</li>

								{isCustomer && (
									<li>
										<NavLink onClick={closeDrawer} to="/my-accommodations">
											<FaBuilding className="nav-icon" /> {t('nav.myAccommodations')}
										</NavLink>
									</li>
								)}

								{isManager && (
									<li>
										<NavLink onClick={closeDrawer} to="/admin">
											<FaUserCog className="nav-icon" /> {t('nav.adminPanel')}
										</NavLink>
									</li>
								)}
								<li>
									<NavLink onClick={closeDrawer} to="/profile">
										<FaUser className="nav-icon" /> {t('nav.profile')}
									</NavLink>
								</li>
							</ul>

							{isAuthenticated ? (
								<div className="drawer-actions">
									<LanguageSwitcher />
									<button type="button" className="btn-primary" onClick={handleLogout}>
										<FaSignOutAlt className="nav-icon" /> {t('nav.logout')}
									</button>
								</div>
							) : (
								<div className="drawer-actions">
									<LanguageSwitcher />
									<NavLink onClick={closeDrawer} to="/login" className="btn-primary">
										<FaSignInAlt className="nav-icon" /> {t('nav.login')}
									</NavLink>
									<NavLink onClick={closeDrawer} to="/register" className="btn-secondary">
										<FaUserPlus className="nav-icon" /> {t('nav.register')}
									</NavLink>
								</div>
							)}
						</>
					)}
				</div>

				<button
					type="button"
					className="drawer-backdrop"
					onClick={closeDrawer}
					aria-label={t('nav.closeMenu')}
				/>
			</div>
		</>
	);
};

export default Header;
