import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBuilding, FaClipboardList, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import '../../styles/components/admin/_admin-dashboard.scss';

const AdminDashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (!user || user.cleanRole !== 'MANAGER') {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<div className="container page admin-dashboard">
			<div className="dashboard-grid mt-5">
				<Link to="/admin/accommodations" className="dashboard-card accent-green fade-in">
					<FaBuilding className="dashboard-icon" />
					<h3>{t('admin.accommodations')}</h3>
					<p>{t('admin.manageObjects')}</p>
				</Link>

				<Link to="/admin/bookings" className="dashboard-card accent-blue fade-in delay-1">
					<FaClipboardList className="dashboard-icon" />
					<h3>{t('admin.bookings')}</h3>
					<p>{t('admin.viewConfirmBookings')}</p>
				</Link>

				<Link to="/admin/payments" className="dashboard-card accent-orange fade-in delay-2">
					<FaMoneyBillWave className="dashboard-icon" />
					<h3>{t('admin.payments')}</h3>
					<p>{t('admin.viewManagePayments')}</p>
				</Link>

				<Link to="/admin/users" className="dashboard-card accent-purple fade-in delay-3">
					<FaUsers className="dashboard-icon" />
					<h3>{t('admin.users')}</h3>
					<p>{t('admin.manageAccess')}</p>
				</Link>
			</div>
		</div>
	);
};

export default AdminDashboard;
