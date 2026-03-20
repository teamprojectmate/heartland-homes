import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import ErrorState from '../../components/ErrorState';
import Notification from '../../components/Notification';
import RoleSelect from '../../components/selects/RoleSelect';
import { TableSkeleton } from '../../components/skeletons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers, removeUser, updateUserRole } from '../../store/slices/userSlice';
import AdminTable from '../Admin/AdminTable';
import AdminUserCard from './AdminUserCard';

import '../../styles/components/admin/_admin-users.scss';
import '../../styles/components/admin/_admin-tables.scss';

const AdminUsers = () => {
	const dispatch = useAppDispatch();
	const { items, loading, error } = useAppSelector((s) => s.user);

	const isMobile = useIsMobile();

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const handleUpdateRole = (id: number, role: string) => {
		dispatch(updateUserRole({ id, role }));
	};

	const handleDeleteUser = (id: number) => {
		if (window.confirm('Видалити користувача?')) {
			dispatch(removeUser(id));
		}
	};

	if (loading) return <TableSkeleton />;
	if (error) return <ErrorState message={String(error)} onRetry={() => dispatch(fetchUsers())} />;

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'email', label: 'Email' },
		{ key: 'firstName', label: 'Ім’я' },
		{ key: 'lastName', label: 'Прізвище' },
		{
			key: 'role',
			label: 'Роль',
			render: (u: Record<string, unknown>) => (
				<RoleSelect
					value={u.role as string}
					onChange={(newRole: string) => handleUpdateRole(u.id as number, newRole)}
				/>
			),
		},
	];

	return (
		<div className="container admin-page-container">
			<h1 className="section-heading text-center">Користувачі</h1>
			{error && <Notification message={error} type="danger" />}

			{isMobile ? (
				<div className="admin-users-cards">
					{items.map((u) => (
						<AdminUserCard
							key={u.id as number}
							user={
								u as unknown as {
									id: number;
									firstName: string;
									lastName?: string;
									email: string;
									role?: string;
								}
							}
							onUpdateRole={handleUpdateRole}
							onDelete={handleDeleteUser}
						/>
					))}
				</div>
			) : (
				<AdminTable
					columns={columns}
					data={items}
					actions={(u) => (
						<button
							type="button"
							className="btn-inline btn-danger"
							onClick={() => handleDeleteUser(u.id as number)}
							title="Видалити користувача"
						>
							<TrashIcon className="w-4 h-4" />
							Видалити
						</button>
					)}
				/>
			)}
		</div>
	);
};

export default AdminUsers;
