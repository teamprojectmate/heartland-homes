import { useEffect, useMemo, useRef, useState } from 'react';
import { getAccommodationById } from '../api/accommodations/accommodationService';
import type { Accommodation, Booking, Payment, User } from '../types';
import { calcNights } from '../utils/dateCalc';
import { normalizeBooking } from '../utils/normalizeBooking';

type EnrichedBooking = Booking & {
	accommodation?: Accommodation | null;
	totalPrice?: number | null;
	user?: User | null;
	payment?: Payment | null;
};

export const useEnrichedBookings = (
	bookings: Booking[],
	payments: Payment[] = [],
	usersMap: Record<string, User> = {},
): EnrichedBooking[] => {
	const [enrichedBookings, setEnrichedBookings] = useState<EnrichedBooking[]>([]);
	const accCacheRef = useRef<Record<number, Accommodation>>({});

	const bookingIds = useMemo(() => bookings.map((b) => b.id).join(','), [bookings]);
	const paymentIds = useMemo(() => payments.map((p) => p.id).join(','), [payments]);
	const usersKey = useMemo(() => Object.keys(usersMap).sort().join(','), [usersMap]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: using stable string keys to prevent infinite re-fetch loops
	useEffect(() => {
		if (!bookings || bookings.length === 0) {
			setEnrichedBookings([]);
			return;
		}

		let cancelled = false;

		const enrich = async () => {
			const uniqueIds = [...new Set(bookings.map((b) => b.accommodationId))];
			const missingIds = uniqueIds.filter((id) => !(id in accCacheRef.current));

			const fetched = await Promise.all(
				missingIds.map(async (id) => {
					try {
						const acc = await getAccommodationById(id);
						return acc ? ([id, acc] as const) : null;
					} catch {
						return null;
					}
				}),
			);

			if (cancelled) return;

			for (const entry of fetched) {
				if (entry) accCacheRef.current[entry[0]] = entry[1];
			}

			const results: EnrichedBooking[] = bookings.map((booking) => {
				const accommodation = accCacheRef.current[booking.accommodationId] ?? null;

				let totalPrice: number | null = null;
				if (accommodation && booking.checkInDate && booking.checkOutDate) {
					const nights = calcNights(booking.checkInDate, booking.checkOutDate);
					totalPrice = nights * (accommodation.dailyRate || 0);
				}

				const user = usersMap[booking.userId ?? ''] ?? null;
				const payment = payments.find((p) => p.bookingId === booking.id) ?? null;

				return normalizeBooking({
					...booking,
					accommodation,
					user,
					totalPrice,
					payment,
				}) as EnrichedBooking;
			});

			if (!cancelled) {
				setEnrichedBookings(results);
			}
		};

		enrich();

		return () => {
			cancelled = true;
		};
	}, [bookingIds, paymentIds, usersKey]);

	return enrichedBookings;
};
