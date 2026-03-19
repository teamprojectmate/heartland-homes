import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import Notification from '../../components/Notification';
import RoleSelect from '../../components/selects/RoleSelect';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers, removeUser, updateUserRole } from '../../store/slices/userSlice';
import AdminTable from '../Admin/AdminTable';
import AdminUserCard from './AdminUserCard';

import '../../styles/components/admin/_admin-users.scss';
import '../../styles/components/admin/_admin-tables.scss';

const AdminUsers = () => {
	const dispatch = useAppDispatch();
	const { items, loading, error } = useAppSelector((s) => s.user);

	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleUpdateRole = (id, role) => {
		dispatch(updateUserRole({ id, role }));
	};

	const handleDeleteUser = (id) => {
		if (window.confirm('Видалити користувача?')) {
			dispatch(removeUser(id));
		}
	};

	if (loading) return <p className="text-center mt-4">⏳ Завантаження...</p>;

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'email', label: 'Email' },
		{ key: 'firstName', label: 'Ім’я' },
		{ key: 'lastName', label: 'Прізвище' },
		{
			key: 'role',
			label: 'Роль',
			render: (u) => (
				<RoleSelect value={u.role} onChange={(newRole) => handleUpdateRole(u.id, newRole)} />
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
							key={u.id}
							user={u}
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
							onClick={() => handleDeleteUser(u.id)}
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
