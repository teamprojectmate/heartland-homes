import { addDays, format, isAfter, parseISO } from 'date-fns';

const DATE_KEY_FORMAT = 'yyyy-MM-dd';
const DATE_KEY_LENGTH = DATE_KEY_FORMAT.length;

export type BookedRange = { checkInDate: string; checkOutDate: string };

/**
 * Calendar day of a local date as 'yyyy-MM-dd'.
 * Not `toISOString()`: that converts to UTC, so local midnight in UTC+2/+3 becomes the previous day.
 */
export const toDateKey = (date: Date): string => format(date, DATE_KEY_FORMAT);

/** 'yyyy-MM-dd' (or an ISO datetime) → local midnight of that calendar day. */
export const fromDateKey = (value: string): Date => parseISO(value.slice(0, DATE_KEY_LENGTH));

/** Every booked night: check-in day up to, but not including, the check-out day. */
export const expandBookedNights = (ranges: BookedRange[]): Date[] => {
	const nights: Date[] = [];
	for (const range of ranges) {
		const end = fromDateKey(range.checkOutDate);
		for (let day = fromDateKey(range.checkInDate); day < end; day = addDays(day, 1)) {
			nights.push(day);
		}
	}
	return nights;
};

/** First booked night after check-in: the latest possible check-out, so a stay cannot jump over another booking. */
export const firstBookedNightAfter = (checkIn: Date, bookedNights: Date[]): Date | undefined =>
	bookedNights
		.filter((night) => isAfter(night, checkIn))
		.reduce<Date | undefined>(
			(earliest, night) => (!earliest || night < earliest ? night : earliest),
			undefined,
		);
