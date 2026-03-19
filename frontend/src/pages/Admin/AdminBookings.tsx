import { TrashIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllUsers } from '../../api/user/userService';
import ErrorState from '../../components/ErrorState';
import StatusSelect from '../../components/selects/StatusSelect';
import { TableSkeleton } from '../../components/skeletons';
import { useEnrichedBookings } from '../../hooks/useEnrichedBookings';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	deleteBooking,
	fetchBookings,
	updateBookingStatus,
} from '../../store/slices/bookingsSlice';
import { fetchAllPayments } from '../../store/slices/paymentsSlice';
import type { User } from '../../types';
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
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const enrichedBookings = useEnrichedBookings(bookings, payments, usersMap);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		dispatch(fetchBookings({}) as any);
		dispatch(fetchAllPayments({}) as any);

		getAllUsers()
			.then((users: any) => {
				const map: Record<string, User> = {};
				for (const u of users?.content || users || []) {
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
			render: (b: EnrichedBookingRow) =>
				b.user ? `${b.user.firstName} ${b.user.lastName} (${b.user.email})` : b.userId,
		},
		{
			key: 'accommodation',
			label: 'Помешкання',
			render: (b: EnrichedBookingRow) => b.accommodation?.name || '—',
		},
		{ key: 'checkInDate', label: 'Заїзд' },
		{ key: 'checkOutDate', label: 'Виїзд' },
		{
			key: 'totalPrice',
			label: 'Ціна',
			render: (b: EnrichedBookingRow) => (b.totalPrice ? `${b.totalPrice} грн` : '—'),
		},
		{
			key: 'status',
			label: 'Статус бронювання',
			render: (b: EnrichedBookingRow) => (
				<StatusSelect
					type="booking"
					value={b.status}
					onChange={(newStatus: string) => handleStatusChange(b, newStatus)}
				/>
			),
		},
		{
			key: 'paymentStatus',
			label: 'Статус оплати',
			render: (b: EnrichedBookingRow) => {
				if (!b.payment) return '—';
				const isPaid = b.payment.status === 'PAID';
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
							onStatusChange={handleStatusChange}
							onDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				<AdminTable
					columns={columns}
					data={enrichedBookings}
					actions={(b: EnrichedBookingRow) => (
						<button
							type="button"
							className="btn-inline btn-danger"
							onClick={() => handleDelete(b.id)}
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
