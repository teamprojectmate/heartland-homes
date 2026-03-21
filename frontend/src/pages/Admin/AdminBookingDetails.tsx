import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { calcNights, formatDate } from '../../utils/dateCalc';
import AdminBookingDetailCard, { type BookingRow } from './AdminBookingDetailCard';
import AdminTable from './AdminTable';

import '../../styles/components/badges/_badges.scss';
import '../../styles/components/admin/_admin-bookings.scss';
import '../../styles/components/admin/_admin-tables.scss';

const AdminBookings = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { bookings, status, error } = useAppSelector((state) => state.bookings);

	const [usersMap, setUsersMap] = useState<Record<string, Record<string, unknown>>>({});
	const [enrichedBookings, setEnrichedBookings] = useState<BookingRow[]>([]);
	const accCacheRef = useRef<Record<number, Record<string, unknown>>>({});
	const isMobile = useIsMobile();

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

	useEffect(() => {
		if (!bookings || bookings.length === 0) return;

		let cancelled = false;

		const enrichData = async () => {
			const uniqueIds = [...new Set(bookings.map((b) => b.accommodationId as number))];
			const missingIds = uniqueIds.filter((id) => !(id in accCacheRef.current));

			if (missingIds.length > 0) {
				const fetched = await Promise.all(
					missingIds.map(async (id) => {
						try {
							return { id, data: await getAccommodationById(id) };
						} catch {
							return { id, data: null };
						}
					}),
				);
				for (const { id, data } of fetched) {
					if (data) accCacheRef.current[id] = data;
				}
			}

			if (cancelled) return;

			const results = bookings.map((booking) => {
				const accommodation = accCacheRef.current[booking.accommodationId as number] || null;
				let totalPrice: number | null = null;

				if (accommodation && booking.checkInDate && booking.checkOutDate) {
					totalPrice =
						calcNights(booking.checkInDate as string, booking.checkOutDate as string) *
						((accommodation as { dailyRate?: number }).dailyRate || 0);
				}

				const user = usersMap[booking.userId as string];
				return { ...booking, accommodation, user, totalPrice } as unknown as BookingRow;
			});
			setEnrichedBookings(results);
		};

		enrichData();
		return () => {
			cancelled = true;
		};
	}, [bookings, usersMap]);

	const handleStatusChange = (booking: BookingRow, newStatus: string) => {
		dispatch(updateBookingStatus({ booking, status: newStatus }));
	};

	const handleDelete = (id: number) => {
		dispatch(deleteBooking(id));
	};

	if (status === 'loading') return <TableSkeleton rows={5} columns={7} />;
	if (error) return <ErrorState message={error} />;

	const columns = [
		{ key: 'id', label: 'ID' },
		{
			key: 'user',
			label: t('admin.user'),
			render: (b: Record<string, unknown>) => {
				const user = b.user as { firstName: string; lastName: string; email: string } | null;
				return user
					? `${user.firstName} ${user.lastName} (${user.email})`
					: String(b.userId || '—');
			},
		},
		{
			key: 'accommodation',
			label: t('admin.accommodation'),
			render: (b: Record<string, unknown>) => (b.accommodation as { name?: string })?.name || '—',
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
			render: (b: Record<string, unknown>) =>
				b.totalPrice ? `${b.totalPrice} ${t('common.currency')}` : '—',
		},
		{
			key: 'status',
			label: t('admin.status'),
			render: (b: Record<string, unknown>) => (
				<select
					value={b.status as string}
					onChange={(e) => handleStatusChange(b as unknown as BookingRow, e.target.value)}
					className={`status-select ${(b.status as string).toLowerCase()}`}
				>
					<option value="PENDING">{t('bookingStatus.pending')}</option>
					<option value="CONFIRMED">{t('bookingStatus.confirmed')}</option>
					<option value="CANCELED">{t('bookingStatus.canceled')}</option>
					<option value="EXPIRED">{t('bookingStatus.expired')}</option>
				</select>
			),
		},
	];

	return (
		<div className="admin-bookings container admin-page-container">
			<h1 className="section-heading text-center">{t('admin.manageBookings')}</h1>

			{isMobile ? (
				<div className="admin-bookings-cards">
					{enrichedBookings.map((booking) => (
						<AdminBookingDetailCard
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
							title={t('admin.deleteBooking')}
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
