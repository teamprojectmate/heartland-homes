export type UserRole = 'customer' | 'manager' | 'admin';

export type AccommodationType =
	| 'HOUSE'
	| 'APARTMENT'
	| 'HOTEL'
	| 'VACATION_HOME'
	| 'HOSTEL'
	| 'COTTAGE';

export type AccommodationStatus = 'REQUIRES_VERIFICATION' | 'PERMITTED' | 'REJECTED';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELED';

export type User = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	role?: string;
	roles?: string[];
	cleanRole?: UserRole;
};

export type Accommodation = {
	id: number;
	name: string;
	type: AccommodationType;
	status: AccommodationStatus;
	city: string;
	address: string;
	latitude: number;
	longitude: number;
	bedrooms: number;
	dailyRate: number;
	amenities: string[];
	imageUrl: string;
	image?: string;
	description?: string;
	userId?: number;
	size?: number;
	location?: string;
	images?: string[];
};

export type Booking = {
	id: number;
	accommodationId: number;
	userId?: number;
	checkInDate: string;
	checkOutDate: string;
	status: BookingStatus;
	totalPrice?: number;
	accommodation?: Accommodation;
	user?: User;
	payment?: Payment;
};

export type Payment = {
	id: number;
	bookingId: number;
	amount: number;
	currency: string;
	status: PaymentStatus;
	sessionUrl?: string;
	createdAt?: string;
};

export type PaginatedResponse<T> = {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
};
