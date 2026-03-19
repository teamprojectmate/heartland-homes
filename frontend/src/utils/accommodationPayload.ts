/**
 * Parse comma-separated amenities string into a trimmed array.
 */
export const parseAmenities = (amenities: string): string[] =>
	amenities
		.split(',')
		.map((a) => a.trim())
		.filter(Boolean);

/**
 * Extract API error message from Axios-style error.
 */
export const getApiErrorMessage = (err: unknown, fallback: string): string => {
	const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
	return message || fallback;
};
