import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorState from '../../components/ErrorState';
import Notification from '../../components/Notification';
import { TableSkeleton } from '../../components/skeletons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers, removeUser } from '../../store/slices/userSlice';
import AdminTable from '../Admin/AdminTable';
import AdminUserCard from './AdminUserCard';

import '../../styles/components/admin/_admin-users.scss';
import '../../styles/components/admin/_admin-tables.scss';

const AdminUsers = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { items, loading, error } = useAppSelector((s) => s.user);
	const { user: currentUser } = useAppSelector((s) => s.auth);

	const isMobile = useIsMobile();

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const handleDeleteUser = (id: number) => {
		if (id === currentUser?.id) return;
		if (window.confirm(t('admin.deleteUser'))) {
			dispatch(removeUser(id));
		}
	};

	if (loading) return <TableSkeleton />;
	if (error) return <ErrorState message={String(error)} onRetry={() => dispatch(fetchUsers())} />;

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'email', label: t('auth.email') },
		{ key: 'firstName', label: t('auth.firstName') },
		{ key: 'lastName', label: t('auth.lastName') },
		{
			key: 'role',
			label: t('admin.role'),
			render: (u: Record<string, unknown>) => (
				<span>{u.role === 'MANAGER' ? t('roles.manager') : t('roles.customer')}</span>
			),
		},
	];

	return (
		<div className="container admin-page-container">
			<h1 className="section-heading text-center">{t('admin.users')}</h1>
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
							onDelete={handleDeleteUser}
						/>
					))}
				</div>
			) : (
				<AdminTable
					columns={columns}
					data={items}
					actions={(u) =>
						u.id === currentUser?.id ? null : (
							<button
								type="button"
								className="btn-inline btn-danger"
								onClick={() => handleDeleteUser(u.id as number)}
								title={t('admin.deleteUser')}
							>
								<TrashIcon className="w-4 h-4" />
								{t('common.delete')}
							</button>
						)
					}
				/>
			)}
		</div>
	);
};

export default AdminUsers;
