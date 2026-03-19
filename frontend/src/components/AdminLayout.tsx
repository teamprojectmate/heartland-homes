import { CreditCardIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { FaMoneyBillWave } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import { Link, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const AdminLayout = () => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);

	return (
		<div className="admin-layout">
			{/*  Sidebar */}
			<aside className="admin-sidebar">
				<div className="admin-brand">Heartland Admin</div>
				<nav>
					<ul>
						<li>
							<Link to="/admin">
								<HomeIcon className="icon" /> Головна
							</Link>
						</li>
						<li>
							<Link to="/admin/accommodations">
								<MdAdminPanelSettings className="icon" /> Помешкання
							</Link>
						</li>
						<li>
							<Link to="/admin/bookings">
								<CreditCardIcon className="icon" /> Бронювання
							</Link>
						</li>
						<li>
							<Link to="/admin/payments">
								<FaMoneyBillWave className="icon" /> Платежі
							</Link>
						</li>
						<li>
							<Link to="/admin/users">
								<UserIcon className="icon" /> Користувачі
							</Link>
						</li>
					</ul>
				</nav>
			</aside>

			{/*  Контент */}
			<main className="admin-content">
				<header className="admin-header">
					<h2>Адмін-панель</h2>
					<div className="admin-user-actions">
						<span className="admin-user">
							👤 {user?.firstName || user?.email} ({user?.cleanRole})
						</span>
						<button type="button" className="btn-logout" onClick={() => dispatch(logout())}>
							Вийти
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
