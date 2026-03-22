import { CreditCardIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { FaMoneyBillWave } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import { Link, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const AdminLayout = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);

	return (
		<div className="admin-layout">
			<aside className="admin-sidebar">
				<div className="admin-brand">Heartland Admin</div>
				<nav>
					<ul>
						<li>
							<Link to="/admin">
								<HomeIcon className="icon" /> {t('nav.home')}
							</Link>
						</li>
						<li>
							<Link to="/admin/accommodations">
								<MdAdminPanelSettings className="icon" /> {t('admin.accommodations')}
							</Link>
						</li>
						<li>
							<Link to="/admin/bookings">
								<CreditCardIcon className="icon" /> {t('admin.bookings')}
							</Link>
						</li>
						<li>
							<Link to="/admin/payments">
								<FaMoneyBillWave className="icon" /> {t('admin.payments')}
							</Link>
						</li>
						<li>
							<Link to="/admin/users">
								<UserIcon className="icon" /> {t('admin.users')}
							</Link>
						</li>
					</ul>
				</nav>
			</aside>

			<main className="admin-content">
				<header className="admin-header">
					<h2>{t('admin.panelTitle')}</h2>
					<div className="admin-user-actions">
						<span className="admin-user">{user?.firstName || user?.email}</span>
						<button type="button" className="btn-logout" onClick={() => dispatch(logout())}>
							{t('nav.logout')}
						</button>
					</div>
				</header>
				<div className="admin-main">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default AdminLayout;
