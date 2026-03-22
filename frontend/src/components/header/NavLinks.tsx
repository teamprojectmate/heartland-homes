import { useTranslation } from 'react-i18next';
import {
	FaBuilding,
	FaClipboardList,
	FaCreditCard,
	FaHome,
	FaUser,
	FaUserCog,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

type NavLinksProps = {
	isCustomer: boolean;
	isManager: boolean;
	onClick?: () => void;
};

const NavLinks = ({ isCustomer, isManager, onClick }: NavLinksProps) => {
	const { t } = useTranslation();

	return (
		<>
			<li>
				<NavLink to="/" end className="nav-link" onClick={onClick}>
					<FaHome className="nav-icon" /> {t('nav.home')}
				</NavLink>
			</li>
			<li>
				<NavLink to="/my-bookings" className="nav-link" onClick={onClick}>
					<FaClipboardList className="nav-icon" /> {t('nav.myBookings')}
				</NavLink>
			</li>
			<li>
				<NavLink to="/my-payments" className="nav-link" onClick={onClick}>
					<FaCreditCard className="nav-icon" /> {t('nav.myPayments')}
				</NavLink>
			</li>
			{isCustomer && (
				<li>
					<NavLink to="/my-accommodations" className="nav-link" onClick={onClick}>
						<FaBuilding className="nav-icon" /> {t('nav.myAccommodations')}
					</NavLink>
				</li>
			)}
			{isManager && (
				<li>
					<NavLink to="/admin" className="nav-link" onClick={onClick}>
						<FaUserCog className="nav-icon" /> {t('nav.adminPanel')}
					</NavLink>
				</li>
			)}
			<li>
				<NavLink to="/profile" className="nav-link" onClick={onClick}>
					<FaUser className="nav-icon" /> {t('nav.profile')}
				</NavLink>
			</li>
		</>
	);
};

export default NavLinks;
