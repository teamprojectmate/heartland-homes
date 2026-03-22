import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

import '../styles/components/header/_index.scss';
import '../styles/components/_buttons.scss';
import DesktopNav from './header/DesktopNav';
import MobileDrawer from './header/MobileDrawer';

const Header = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { isAuthenticated, user } = useAppSelector((s) => s.auth);
	const [open, setOpen] = useState(false);

	const userRole = user?.cleanRole || (Array.isArray(user?.roles) ? user.roles[0] : user?.role);
	const isManager = userRole === 'MANAGER';
	const isCustomer = userRole === 'CUSTOMER';
	const adminMode = location.pathname.startsWith('/admin');

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

					<DesktopNav
						isAuthenticated={isAuthenticated}
						isCustomer={isCustomer}
						isManager={isManager}
						onLogout={handleLogout}
					/>

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

			<MobileDrawer
				open={open}
				adminMode={adminMode}
				isAuthenticated={isAuthenticated}
				isCustomer={isCustomer}
				isManager={isManager}
				onClose={closeDrawer}
				onLogout={handleLogout}
			/>
		</>
	);
};

export default Header;
