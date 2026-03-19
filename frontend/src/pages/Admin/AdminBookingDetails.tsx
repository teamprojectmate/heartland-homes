import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getAccommodationById } from '../../api/accommodations/accommodationService';
import { getAllUsers } from '../../api/user/userService';
import ErrorState from '../../components/ErrorState';
import { TableSkeleton } from '../../components/skeletons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	deleteBooking,
	fetchBookings,
	updateBookingStatus,
} from '../../store/slices/bookingsSlice';
import { calcNights } from '../../utils/dateCalc';
import AdminTable from '../Admin/AdminTable';

// стилі
import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';
import '../../styles/components/admin/_admin-tables.scss';

type BookingRow = Record<string, unknown> & {
	id: number;
	accommodation?: { name?: string } | null;
	user?: { firstName: string; lastName: string; email: string } | null;
	userId?: number;
	checkInDate: string;
	checkOutDate: string;
	totalPrice?: number | null;
	status: string;
};

const AdminBookingCard = ({
	booking,
	onStatusChange,
	onDelete,
}: {
	booking: BookingRow;
	onStatusChange: (booking: BookingRow, status: string) => void;
	onDelete: (id: number) => void;
}) => {
	return (
		<div className="admin-booking-card">
			<h3 className="admin-booking-title">{booking.accommodation?.name || 'Без назви'}</h3>
			<p>
				<strong>Користувач:</strong>{' '}
				{booking.user
					? `${booking.user.firstName} ${booking.user.lastName} (${booking.user.email})`
					: booking.userId || '—'}
			</p>
			<p>
				<strong>Дати:</strong> {booking.checkInDate} — {booking.checkOutDate}
			</p>
			<p>
				<strong>Ціна:</strong> {booking.totalPrice ? `${booking.totalPrice} грн` : '—'}
			</p>
			<p>
				<strong>Статус:</strong>{' '}
				<span className={`badge badge-status ${booking.status.toLowerCase()}`}>
					{booking.status === 'PENDING' && 'Очікує'}
					{booking.status === 'CONFIRMED' && 'Підтверджено'}
					{booking.status === 'CANCELED' && 'Скасовано'}
					{booking.status === 'EXPIRED' && 'Прострочено'}
				</span>
			</p>

			<div className="card-actions">
				<select value={booking.status} onChange={(e) => onStatusChange(booking, e.target.value)}>
					<option value="PENDING">Очікує</option>
					<option value="CONFIRMED">Підтверджено</option>
					<option value="CANCELED">Скасовано</option>
					<option value="EXPIRED">Прострочено</option>
				</select>
				<button
					type="button"
					className="btn-icon btn-danger"
					onClick={() => onDelete(booking.id)}
					title="Видалити бронювання"
				>
					<TrashIcon className="w-4 h-4 text-white" />
				</button>
			</div>
		</div>
	);
};

const AdminBookings = () => {
	const dispatch = useAppDispatch();
	const { bookings, status, error } = useAppSelector((state) => state.bookings);

	const [usersMap, setUsersMap] = useState<Record<string, Record<string, unknown>>>({});
	const [enrichedBookings, setEnrichedBookings] = useState<BookingRow[]>([]);
	const isMobile = useIsMobile();

	//  завантаження бронювань та користувачів
	useEffect(() => {
		dispatch(fetchBookings());

		getAllUsers().then((users: Record<string, unknown>[]) => {
			const map: Record<string, Record<string, unknown>> = {};
			(
				(users as unknown as { content?: Record<string, unknown>[] })?.content ||
				users ||
				[]
			).forEach((u: Record<string, unknown>) => {
				map[u.id as string] = u;
			});
			setUsersMap(map);
		});
	}, [dispatch]);

	//  enrichment житла та користувачів
	useEffect(() => {
		if (!bookings || bookings.length === 0) return;

		const enrichData = async () => {
			const results = await Promise.all(
				bookings.map(async (booking) => {
					let accommodation = null;
					let totalPrice: number | null = null;

					try {
						accommodation = await getAccommodationById(booking.accommodationId as number);
						if (accommodation && booking.checkInDate && booking.checkOutDate) {
							totalPrice =
								calcNights(booking.checkInDate as string, booking.checkOutDate as string) *
								(accommodation.dailyRate || 0);
						}
					} catch {
						/* accommodation not found */
					}

					const user = usersMap[booking.userId as string];
					return { ...booking, accommodation, user, totalPrice } as BookingRow;
				}),
			);
			setEnrichedBookings(results);
		};

		enrichData();
	}, [bookings, usersMap]);

	const handleStatusChange = (booking: BookingRow, newStatus: string) => {
		dispatch(updateBookingStatus({ booking, status: newStatus }));
	};

	const handleDelete = (id: number) => {
		dispatch(deleteBooking(id));
	};

	if (status === 'loading') return <TableSkeleton rows={5} columns={7} />;
	if (error) return <ErrorState message={error} />;

	//  колонки для AdminTable
	const columns = [
		{ key: 'id', label: 'ID' },
		{
			key: 'user',
			label: 'Користувач',
			render: (b: Record<string, unknown>) => {
				const user = b.user as { firstName: string; lastName: string; email: string } | null;
				return user
					? `${user.firstName} ${user.lastName} (${user.email})`
					: String(b.userId || '—');
			},
		},
		{
			key: 'accommodation',
			label: 'Помешкання',
			render: (b: Record<string, unknown>) => (b.accommodation as { name?: string })?.name || '—',
		},
		{ key: 'checkInDate', label: 'Заїзд' },
		{ key: 'checkOutDate', label: 'Виїзд' },
		{
			key: 'totalPrice',
			label: 'Ціна',
			render: (b: Record<string, unknown>) => (b.totalPrice ? `${b.totalPrice} грн` : '—'),
		},
		{
			key: 'status',
			label: 'Статус',
			render: (b: Record<string, unknown>) => (
				<select
					value={b.status as string}
					onChange={(e) => handleStatusChange(b as unknown as BookingRow, e.target.value)}
					className={`status-select ${(b.status as string).toLowerCase()}`}
				>
					<option value="PENDING">Очікує</option>
					<option value="CONFIRMED">Підтверджено</option>
					<option value="CANCELED">Скасовано</option>
					<option value="EXPIRED">Прострочено</option>
				</select>
			),
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
					actions={(b) => (
						<button
							type="button"
							className="btn-icon btn-danger"
							onClick={() => handleDelete(b.id as number)}
							title="Видалити бронювання"
						>
							<TrashIcon className="w-4 h-4 text-white" />
						</button>
					)}
				/>
			)}
		</div>
	);
};

export default AdminBookings;
