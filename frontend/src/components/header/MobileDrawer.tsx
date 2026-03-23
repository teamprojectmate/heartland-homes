import { useTranslation } from 'react-i18next';
import {
	FaClipboardList,
	FaCreditCard,
	FaHome,
	FaSignInAlt,
	FaSignOutAlt,
	FaUser,
	FaUserPlus,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import SettingsBar from '../SettingsBar';
import NavLinks from './NavLinks';

type MobileDrawerProps = {
	open: boolean;
	adminMode: boolean;
	isAuthenticated: boolean;
	isCustomer: boolean;
	isManager: boolean;
	onClose: () => void;
	onLogout: () => void;
};

const MobileDrawer = ({
	open,
	adminMode,
	isAuthenticated,
	isCustomer,
	isManager,
	onClose,
	onLogout,
}: MobileDrawerProps) => {
	const { t } = useTranslation();

	return (
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
					onClick={onClose}
				/>

				{adminMode ? (
					<>
						<h2>{t('nav.adminPanel')}</h2>
						<ul className="drawer-nav">
							<li>
								<NavLink onClick={onClose} to="/admin">
									<FaHome className="nav-icon" /> {t('nav.home')}
								</NavLink>
							</li>
							<li>
								<NavLink onClick={onClose} to="/admin/accommodations">
									<FaClipboardList className="nav-icon" /> {t('nav.accommodations')}
								</NavLink>
							</li>
							<li>
								<NavLink onClick={onClose} to="/admin/bookings">
									<FaCreditCard className="nav-icon" /> {t('admin.bookings')}
								</NavLink>
							</li>
							<li>
								<NavLink onClick={onClose} to="/admin/users">
									<FaUser className="nav-icon" /> {t('admin.users')}
								</NavLink>
							</li>
						</ul>
						<div className="drawer-actions">
							<SettingsBar />
							<NavLink to="/" onClick={onClose} className="btn-primary">
								{t('nav.backToHome')}
							</NavLink>
						</div>
					</>
				) : (
					<>
						<ul className="drawer-nav">
							<NavLinks
								isAuthenticated={isAuthenticated}
								isCustomer={isCustomer}
								isManager={isManager}
								onClick={onClose}
							/>
						</ul>

						{isAuthenticated ? (
							<div className="drawer-actions">
								<SettingsBar />
								<button type="button" className="btn-primary" onClick={onLogout}>
									<FaSignOutAlt className="nav-icon" /> {t('nav.logout')}
								</button>
							</div>
						) : (
							<div className="drawer-actions">
								<SettingsBar />
								<NavLink onClick={onClose} to="/login" className="btn-primary">
									<FaSignInAlt className="nav-icon" /> {t('nav.login')}
								</NavLink>
								<NavLink onClick={onClose} to="/register" className="btn-secondary">
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
				onClick={onClose}
				aria-label={t('nav.closeMenu')}
			/>
		</div>
	);
};

export default MobileDrawer;
