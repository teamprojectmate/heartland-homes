import { TrashIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
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
			label: 'Користувач',
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				return row.user
					? `${row.user.firstName} ${row.user.lastName} (${row.user.email})`
					: row.userId;
			},
		},
		{
			key: 'accommodation',
			label: 'Помешкання',
			render: (b: Record<string, unknown>) =>
				(b as unknown as EnrichedBookingRow).accommodation?.name || '—',
		},
		{ key: 'checkInDate', label: 'Заїзд' },
		{ key: 'checkOutDate', label: 'Виїзд' },
		{
			key: 'totalPrice',
			label: 'Ціна',
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				return row.totalPrice ? `${row.totalPrice} грн` : '—';
			},
		},
		{
			key: 'status',
			label: 'Статус бронювання',
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
			label: 'Статус оплати',
			render: (b: Record<string, unknown>) => {
				const row = b as unknown as EnrichedBookingRow;
				if (!row.payment) return '—';
				const isPaid = row.payment.status === 'PAID';
				return (
					<span className={`badge ${isPaid ? 'badge-status-paid' : 'badge-status-pending'}`}>
						{isPaid ? 'Оплачено' : 'Очікує оплату'}
					</span>
				);
			},
		},
	];

	return (
		<div className="admin-bookings container admin-page-container">
			<h1 className="section-heading text-center">Управління бронюваннями</h1>

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
						<button
							type="button"
							className="btn-inline btn-danger"
							onClick={() => handleDelete(b.id as number)}
							title="Видалити бронювання"
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

export default AdminBookings;
