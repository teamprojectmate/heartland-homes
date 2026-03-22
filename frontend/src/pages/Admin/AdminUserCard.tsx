import { TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/hooks';

const roleBadgeConfig: Record<string, { i18nKey: string; icon: string; color: string }> = {
	MANAGER: { i18nKey: 'roles.manager', icon: '🛠', color: '#2563eb' },
	USER: { i18nKey: 'roles.user', icon: '👤', color: '#059669' },
};

type AdminUserCardProps = {
	user: { id: number; firstName: string; lastName?: string; email: string; role?: string };
	onDelete: (id: number) => void;
};

const AdminUserCard = ({ user, onDelete }: AdminUserCardProps) => {
	const { t } = useTranslation();
	const { user: currentUser } = useAppSelector((s) => s.auth);

	const config = roleBadgeConfig[user.role?.toUpperCase() || ''];
	const role = config
		? { label: t(config.i18nKey), icon: config.icon, color: config.color }
		: {
				label: user.role || t('roles.unknown'),
				icon: '❔',
				color: '#6b7280',
			};

	return (
		<div className="admin-user-card">
			<div className="user-card-content">
				<div className="card-header">
					<h3 className="user-name">
						{user.firstName} {user.lastName || ''}
					</h3>
					<span className="role-badge" style={{ backgroundColor: role.color }}>
						{role.icon} {role.label}
					</span>
				</div>

				<p className="user-email">{user.email}</p>
			</div>

			{user.id !== currentUser?.id && (
				<div className="card-actions">
					<button type="button" className="btn-inline btn-danger" onClick={() => onDelete(user.id)}>
						<TrashIcon className="w-4 h-4" />
						{t('common.delete')}
					</button>
				</div>
			)}
		</div>
	);
};

export default AdminUserCard;
