import { useTranslation } from 'react-i18next';
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import SettingsBar from '../SettingsBar';
import NavLinks from './NavLinks';

type DesktopNavProps = {
	isAuthenticated: boolean;
	isCustomer: boolean;
	isManager: boolean;
	onLogout: () => void;
};

const DesktopNav = ({ isAuthenticated, isCustomer, isManager, onLogout }: DesktopNavProps) => {
	const { t } = useTranslation();

	return (
		<nav className="nav-desktop" aria-label={t('nav.mainNav')}>
			<ul>
				<NavLinks isCustomer={isCustomer} isManager={isManager} />
			</ul>

			{isAuthenticated ? (
				<div className="nav-actions">
					<SettingsBar />
					<button type="button" className="btn-chip logout" onClick={onLogout}>
						<FaSignOutAlt className="nav-icon" /> {t('nav.logout')}
					</button>
				</div>
			) : (
				<div className="nav-actions">
					<SettingsBar />
					<NavLink to="/login" className="btn-chip primary">
						<FaSignInAlt className="nav-icon" /> {t('nav.login')}
					</NavLink>
					<NavLink to="/register" className="btn-chip secondary">
						<FaUserPlus className="nav-icon" /> {t('nav.register')}
					</NavLink>
				</div>
			)}
		</nav>
	);
};

export default DesktopNav;
