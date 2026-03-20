import { useEffect, useState } from 'react';
import ErrorState from '../../components/ErrorState';
import Pagination from '../../components/Pagination';
import { TableSkeleton } from '../../components/skeletons';
import StatusBadge from '../../components/status/StatusBadge';
import AdminTable from '../../pages/Admin/AdminTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllPayments } from '../../store/slices/paymentsSlice';

import '../../styles/components/admin/_admin-tables.scss';

const AdminPayments = () => {
	const dispatch = useAppDispatch();
	const { payments, fetchStatus, error, totalPages } = useAppSelector((state) => state.payments);

	const [statusFilter, setStatusFilter] = useState('');
	const [page, setPage] = useState(0);

	useEffect(() => {
		dispatch(fetchAllPayments({ page, size: 5, status: statusFilter || undefined }));
	}, [dispatch, page, statusFilter]);

	if (fetchStatus === 'loading') return <TableSkeleton rows={5} columns={5} />;
	if (error) return <ErrorState message={error} />;

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'bookingId', label: 'Бронювання ID' },
		{
			key: 'amountToPay',
			label: 'Сума',
			render: (p: Record<string, unknown>) => `${p.amountToPay} грн`,
		},
		{ key: 'paymentType', label: 'Тип' },
		{
			key: 'status',
			label: 'Статус',
			render: (p: Record<string, unknown>) => <StatusBadge status={p.status as string} />,
		},
	];

	return (
		<div className="admin-payments container admin-page-container">
			<h1 className="section-heading text-center">Управління платежами</h1>

			{/*  Фільтр */}
			<div className="filter-bar mb-3 text-center">
				<select
					value={statusFilter}
					onChange={(e) => {
						setPage(0); // скидаємо на першу сторінку при зміні фільтра
						setStatusFilter(e.target.value);
					}}
				>
					<option value="">Всі</option>
					<option value="PENDING">Очікує оплату</option>
					<option value="PAID">Оплачено</option>
				</select>
			</div>

			<AdminTable columns={columns} data={payments} />

			{/*  Пагінація */}
			<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
		</div>
	);
};

export default AdminPayments;
