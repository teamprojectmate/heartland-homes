import { TrashIcon } from '@heroicons/react/24/solid';
import RoleSelect from '../../components/selects/RoleSelect';

const roleBadges: Record<string, { label: string; icon: string; color: string }> = {
	MANAGER: { label: 'Менеджер', icon: '🛠', color: '#2563eb' },
	USER: { label: 'Клієнт', icon: '👤', color: '#059669' },
};

type AdminUserCardProps = {
	user: { id: number; firstName: string; lastName?: string; email: string; role?: string };
	onUpdateRole: (id: number, role: string) => void;
	onDelete: (id: number) => void;
};

const AdminUserCard = ({ user, onUpdateRole, onDelete }: AdminUserCardProps) => {
	const role = roleBadges[user.role?.toUpperCase() || ''] || {
		label: user.role || 'Невідомо',
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

				<RoleSelect
					value={user.role || ''}
					onChange={(newRole: string) => onUpdateRole(user.id, newRole)}
				/>
			</div>

			<div className="card-actions">
				<button type="button" className="btn-inline btn-danger" onClick={() => onDelete(user.id)}>
					<TrashIcon className="w-4 h-4" />
					Видалити
				</button>
			</div>
		</div>
	);
};

export default AdminUserCard;
