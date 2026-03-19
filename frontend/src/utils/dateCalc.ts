const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const calcNights = (checkIn: string, checkOut: string): number => {
	const start = new Date(checkIn);
	const end = new Date(checkOut);
	return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY));
};
