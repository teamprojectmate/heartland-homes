import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorState from '../../components/ErrorState';
import Pagination from '../../components/Pagination';
import { TableSkeleton } from '../../components/skeletons';
import StatusBadge from '../../components/status/StatusBadge';
import AdminTable from '../../pages/Admin/AdminTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllPayments } from '../../store/slices/paymentsSlice';

import '../../styles/components/admin/_admin-tables.scss';

const AdminPayments = () => {
	const { t } = useTranslation();
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
		{ key: 'bookingId', label: t('admin.bookingId') },
		{
			key: 'amount',
			label: t('admin.amount'),
			render: (p: Record<string, unknown>) => `${p.amount} ${t('common.currency')}`,
		},
		{
			key: 'paymentType',
			label: t('admin.type'),
			render: () => `💳 ${t('payment.typePayment')}`,
		},
		{
			key: 'status',
			label: t('admin.status'),
			render: (p: Record<string, unknown>) => (
				<StatusBadge status={p.status as string} context="payment" />
			),
		},
	];

	return (
		<div className="admin-payments container admin-page-container">
			<h1 className="section-heading text-center">{t('admin.managePayments')}</h1>

			<div className="filter-bar mb-3 text-center">
				<select
					value={statusFilter}
					onChange={(e) => {
						setPage(0);
						setStatusFilter(e.target.value);
					}}
				>
					<option value="">{t('admin.all')}</option>
					<option value="PENDING">{t('status.awaitingPayment')}</option>
					<option value="PAID">{t('status.paid')}</option>
					<option value="FAILED">{t('status.failed')}</option>
					<option value="CANCELED">{t('status.cancelled')}</option>
				</select>
			</div>

			<AdminTable columns={columns} data={payments} />

			<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
		</div>
	);
};

export default AdminPayments;
