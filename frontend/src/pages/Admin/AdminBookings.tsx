import { TrashIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../api/user/userService';
import ErrorState from '../../components/ErrorState';
import StatusSelect from '../../components/selects/StatusSelect';
import { TableSkeleton } from '../../components/skeletons';
import { useEnrichedBookings } from '../../hooks/useEnrichedBookings';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	deleteBooking,
	fetchBookings,
	updateBookingStatus,
} from '../../store/slices/bookingsSlice';
import { fetchAllPayments } from '../../store/slices/paymentsSlice';
import type { Booking, Payment, User } from '../../types';
import { formatDate } from '../../utils/dateCalc';
import { localized } from '../../utils/translations';
import AdminBookingCard from './AdminBookingCard';
import AdminTable from './AdminTable';

import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';
import '../../styles/components/admin/_admin-tables.scss';

type EnrichedBookingRow = {
	id: number;
	userId?: number;
	user?: User | null;
	accommodation?: { name?: string } | null;
	checkInDate: string;
	checkOutDate: string;
	totalPrice?: number | null;
	status: string;
	payment?: { status?: string } | null;
};

const AdminBookings = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const dispatch = useAppDispatch();
	const { bookings, status, error } = useAppSelector((state) => state.bookings);
	const { payments } = useAppSelector((state) => state.payments);

	const [usersMap, setUsersMap] = useState<Record<string, User>>({});
	const isMobile = useIsMobile();

	const enrichedBookings = useEnrichedBookings(
		bookings as unknown as Booking[],
		payments as unknown as Payment[],
		usersMap,
	);

	useEffect(() => {
		dispatch(fetchBookings());
		dispatch(fetchAllPayments());

		getAllUsers()
			.then((users: { content?: User[] } & User[]) => {
				const map: Record<string, User> = {};
				for (const u of (users as { content?: User[] })?.content || users || []) {
					map[u.id] = u;
				}
				setUsersMap(map);
			})
			.catch(() => {
				// users load failed — enrichment will show IDs instead of names
			});
	}, [dispatch]);

	const handleStatusChange = useCallback(
		(booking: EnrichedBookingRow, newStatus: string) => {
			dispatch(updateBookingStatus({ booking, status: newStatus }));
		},
		[dispatch],
	);

	const handleDelete = useCallback(
		(id: number) => {
			dispatch(deleteBooking(id));
		},
		[dispatch],
	);

	if (status === 'loading') return <TableSkeleton rows={5} columns={7} />;
	if (error) return <ErrorState message={error} />;

	const columns = [
		{ key: 'id', label: 'ID' },
		{
			key: 'user',
			label: t('admin.user'),
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				return row.user
					? `${row.user.firstName} ${row.user.lastName} (${row.user.email})`
					: row.userId;
			},
		},
		{
			key: 'accommodation',
			label: t('admin.accommodation'),
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				return (
					localized(
						row.accommodation?.name,
						(row.accommodation as Record<string, unknown> | null)?.nameUk as string | undefined,
						lang,
					) || '—'
				);
			},
		},
		{
			key: 'checkInDate',
			label: t('admin.checkIn'),
			render: (r: Record<string, unknown>) => formatDate(r.checkInDate as string | undefined),
		},
		{
			key: 'checkOutDate',
			label: t('admin.checkOut'),
			render: (r: Record<string, unknown>) => formatDate(r.checkOutDate as string | undefined),
		},
		{
			key: 'totalPrice',
			label: t('admin.price'),
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				return row.totalPrice ? `${row.totalPrice} ${t('common.currency')}` : '—';
			},
		},
		{
			key: 'status',
			label: t('booking.bookingStatus'),
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				return (
					<StatusSelect
						type="booking"
						value={row.status}
						onChange={(newStatus: string) => handleStatusChange(row, newStatus)}
					/>
				);
			},
		},
		{
			key: 'paymentStatus',
			label: t('booking.paymentStatus'),
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				if (!row.payment) return '—';
				const isPaid = row.payment.status === 'PAID';
				return (
					<span className={`badge ${isPaid ? 'badge-status-paid' : 'badge-status-pending'}`}>
						{isPaid ? t('status.paid') : t('status.awaitingPayment')}
					</span>
				);
			},
		},
	];

	return (
		<div className="admin-bookings container admin-page-container">
			<h1 className="section-heading text-center">{t('admin.manageBookings')}</h1>

			{isMobile ? (
				<div className="admin-bookings-cards">
					{enrichedBookings.map((booking) => (
						<AdminBookingCard
							key={booking.id}
							booking={booking}
							onStatusChange={(booking: Record<string, unknown>, newStatus: string) =>
								handleStatusChange(booking as EnrichedBookingRow, newStatus)
							}
							onDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				<AdminTable
					columns={columns}
					data={enrichedBookings}
					actions={(b: Record<string, unknown>) => (
						<div className="action-buttons">
							<Link
								to={`/admin/bookings/${b.id}`}
								className="btn-icon btn-secondary"
								title={t('common.details')}
							>
								<FaInfoCircle />
							</Link>
							<button
								type="button"
								className="btn-icon btn-danger"
								onClick={() => handleDelete(b.id as number)}
								title={t('admin.deleteBooking')}
							>
								<TrashIcon className="w-4 h-4" />
							</button>
						</div>
					)}
				/>
			)}
		</div>
	);
};

export default AdminBookings;
