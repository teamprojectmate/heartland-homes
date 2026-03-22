import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, AccommodationType, AccommodationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function main() {
	console.log('Seeding database...');

	// ── Clean existing data ──
	await prisma.payment.deleteMany();
	await prisma.booking.deleteMany();
	await prisma.accommodation.deleteMany();
	await prisma.user.deleteMany();
	console.log('Cleaned existing data');

	// ── Users ──
	const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);

	const admin = await prisma.user.create({
		data: {
			email: 'admin@booking.com',
			password: hashedPassword,
			firstName: 'Admin',
			lastName: 'User',
			role: Role.MANAGER,
		},
	});

	const customer = await prisma.user.create({
		data: {
			email: 'john.doe@booking.com',
			password: hashedPassword,
			firstName: 'John',
			lastName: 'Doe',
			role: Role.CUSTOMER,
		},
	});

	const customer2 = await prisma.user.create({
		data: {
			email: 'jane.smith@booking.com',
			password: hashedPassword,
			firstName: 'Jane',
			lastName: 'Smith',
			role: Role.CUSTOMER,
		},
	});

	console.log(`Users: ${admin.email} (MANAGER), ${customer.email}, ${customer2.email}`);

	// ── Accommodations (24 items → 3 pages) ──
	const accommodations = [
		// ── Kyiv (7) ──
		{
			name: 'Затишна квартира на Хрещатику',
			type: AccommodationType.APARTMENT,
			city: 'Kyiv',
			location: 'вул. Хрещатик, 15',
			latitude: 50.4501,
			longitude: 30.5234,
			size: '55m²',
			bedrooms: 2,
			dailyRate: 250,
			amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Washing Machine'],
			image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
		},
		{
			name: 'Готель Royal Palace',
			type: AccommodationType.HOTEL,
			city: 'Kyiv',
			location: 'вул. Велика Васильківська, 100',
			latitude: 50.438,
			longitude: 30.5178,
			size: '40m²',
			bedrooms: 1,
			dailyRate: 500,
			amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Room Service', 'Gym'],
			image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
		},
		{
			name: 'Сімейний будинок на Оболоні',
			type: AccommodationType.HOUSE,
			city: 'Kyiv',
			location: 'вул. Оболонська набережна, 42',
			latitude: 50.5135,
			longitude: 30.4998,
			size: '120m²',
			bedrooms: 4,
			dailyRate: 350,
			amenities: ['WiFi', 'Kitchen', 'Parking', 'Garden', 'BBQ'],
			image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
		},
		{
			name: 'Хостел на Подолі',
			type: AccommodationType.HOSTEL,
			city: 'Kyiv',
			location: 'вул. Сагайдачного, 8',
			latitude: 50.4654,
			longitude: 30.516,
			size: '20m²',
			bedrooms: 1,
			dailyRate: 80,
			amenities: ['WiFi', 'Shared Kitchen', 'Laundry'],
			image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
		},
		{
			name: 'Лофт з видом на Дніпро',
			type: AccommodationType.APARTMENT,
			city: 'Kyiv',
			location: 'Набережне шосе, 25',
			latitude: 50.4475,
			longitude: 30.529,
			size: '45m²',
			bedrooms: 1,
			dailyRate: 180,
			amenities: ['WiFi', 'Kitchen', 'Balcony', 'River View'],
			image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
		},
		{
			name: 'Студія біля Золотих Воріт',
			type: AccommodationType.APARTMENT,
			city: 'Kyiv',
			location: 'вул. Золотоворітська, 3',
			latitude: 50.4488,
			longitude: 30.5098,
			size: '30m²',
			bedrooms: 1,
			dailyRate: 200,
			amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'City Center'],
			image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
		},
		{
			name: 'Пентхаус на Печерську',
			type: AccommodationType.APARTMENT,
			city: 'Kyiv',
			location: 'вул. Кловський узвіз, 7',
			latitude: 50.4363,
			longitude: 30.5385,
			size: '95m²',
			bedrooms: 3,
			dailyRate: 700,
			amenities: ['WiFi', 'Kitchen', 'Parking', 'Terrace', 'Panoramic View', 'Gym'],
			image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
		},

		// ── Lviv (5) ──
		{
			name: 'Квартира на площі Ринок',
			type: AccommodationType.APARTMENT,
			city: 'Lviv',
			location: 'пл. Ринок, 5',
			latitude: 49.8419,
			longitude: 24.0316,
			size: '60m²',
			bedrooms: 2,
			dailyRate: 300,
			amenities: ['WiFi', 'Kitchen', 'Garden', 'Historic Center'],
			image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
		},
		{
			name: 'Лісова хатинка біля Львова',
			type: AccommodationType.COTTAGE,
			city: 'Lviv',
			location: 'Шевченківський район, Брюховичі',
			latitude: 49.855,
			longitude: 24.01,
			size: '70m²',
			bedrooms: 2,
			dailyRate: 220,
			amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Forest View'],
			image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
		},
		{
			name: 'Гранд Готель Львів',
			type: AccommodationType.HOTEL,
			city: 'Lviv',
			location: 'просп. Свободи, 13',
			latitude: 49.843,
			longitude: 24.026,
			size: '35m²',
			bedrooms: 1,
			dailyRate: 450,
			amenities: ['WiFi', 'Restaurant', 'Spa', 'Gym', 'Concierge'],
			image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
		},
		{
			name: 'Хостел у центрі Львова',
			type: AccommodationType.HOSTEL,
			city: 'Lviv',
			location: 'вул. Вірменська, 12',
			latitude: 49.8415,
			longitude: 24.0335,
			size: '18m²',
			bedrooms: 1,
			dailyRate: 60,
			amenities: ['WiFi', 'Shared Kitchen', 'Lounge', 'City Center'],
			image: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=800',
		},
		{
			name: 'Вілла з садом у Львові',
			type: AccommodationType.HOUSE,
			city: 'Lviv',
			location: 'вул. Стрийська, 88',
			latitude: 49.822,
			longitude: 24.015,
			size: '140m²',
			bedrooms: 4,
			dailyRate: 480,
			amenities: ['WiFi', 'Kitchen', 'Parking', 'Garden', 'BBQ', 'Sauna'],
			image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
		},

		// ── Odesa (4) ──
		{
			name: 'Вілла біля моря в Аркадії',
			type: AccommodationType.HOUSE,
			city: 'Odesa',
			location: 'вул. Аркадійський пров., 3',
			latitude: 46.42,
			longitude: 30.753,
			size: '150m²',
			bedrooms: 5,
			dailyRate: 600,
			amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Sea View', 'BBQ'],
			image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
		},
		{
			name: 'Квартира на Дерибасівській',
			type: AccommodationType.APARTMENT,
			city: 'Odesa',
			location: 'вул. Дерибасівська, 20',
			latitude: 46.4843,
			longitude: 30.7326,
			size: '50m²',
			bedrooms: 1,
			dailyRate: 200,
			amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'City Center'],
			image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
		},
		{
			name: 'Хостел на пляжі Ланжерон',
			type: AccommodationType.HOSTEL,
			city: 'Odesa',
			location: 'вул. Ланжеронівська, 7',
			latitude: 46.475,
			longitude: 30.745,
			size: '18m²',
			bedrooms: 1,
			dailyRate: 70,
			amenities: ['WiFi', 'Shared Kitchen', 'Beach Access'],
			image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
		},
		{
			name: 'Апартаменти з видом на море',
			type: AccommodationType.APARTMENT,
			city: 'Odesa',
			location: 'Французький бульвар, 50',
			latitude: 46.455,
			longitude: 30.758,
			size: '65m²',
			bedrooms: 2,
			dailyRate: 350,
			amenities: ['WiFi', 'Kitchen', 'Balcony', 'Sea View', 'Parking'],
			image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
		},

		// ── Bukovel (3) ──
		{
			name: 'Гірський шале в Буковелі',
			type: AccommodationType.VACATION_HOME,
			city: 'Bukovel',
			location: 'Гірськолижний курорт, 1',
			latitude: 48.36,
			longitude: 24.42,
			size: '90m²',
			bedrooms: 3,
			dailyRate: 400,
			amenities: ['WiFi', 'Fireplace', 'Ski Storage', 'Kitchen', 'Mountain View', 'Sauna'],
			image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
		},
		{
			name: 'Карпатська хатинка',
			type: AccommodationType.COTTAGE,
			city: 'Bukovel',
			location: 'Лісова стежка, 15',
			latitude: 48.35,
			longitude: 24.43,
			size: '80m²',
			bedrooms: 2,
			dailyRate: 280,
			amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Hiking Trails'],
			image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
		},
		{
			name: 'Готель біля підйомника',
			type: AccommodationType.HOTEL,
			city: 'Bukovel',
			location: 'вул. Курортна, 22',
			latitude: 48.358,
			longitude: 24.415,
			size: '32m²',
			bedrooms: 1,
			dailyRate: 380,
			amenities: ['WiFi', 'Restaurant', 'Spa', 'Ski Storage', 'Shuttle'],
			image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
		},

		// ── Dnipro (3) ──
		{
			name: 'Квартира на набережній Дніпра',
			type: AccommodationType.APARTMENT,
			city: 'Dnipro',
			location: 'Набережна Перемоги, 50',
			latitude: 48.4647,
			longitude: 35.0462,
			size: '48m²',
			bedrooms: 1,
			dailyRate: 150,
			amenities: ['WiFi', 'Kitchen', 'Balcony', 'River View'],
			image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
		},
		{
			name: 'Сучасний лофт у центрі Дніпра',
			type: AccommodationType.APARTMENT,
			city: 'Dnipro',
			location: 'просп. Дмитра Яворницького, 30',
			latitude: 48.4622,
			longitude: 35.0395,
			size: '42m²',
			bedrooms: 1,
			dailyRate: 170,
			amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Smart TV'],
			image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
		},

		// ── Kharkiv (2) ──
		{
			name: 'Квартира біля площі Свободи',
			type: AccommodationType.APARTMENT,
			city: 'Kharkiv',
			location: 'вул. Сумська, 25',
			latitude: 49.9935,
			longitude: 36.2304,
			size: '52m²',
			bedrooms: 2,
			dailyRate: 180,
			amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'City Center'],
			image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
		},
		{
			name: 'Готель Харків Палас',
			type: AccommodationType.HOTEL,
			city: 'Kharkiv',
			location: 'пл. Свободи, 1',
			latitude: 49.9935,
			longitude: 36.2312,
			size: '38m²',
			bedrooms: 1,
			dailyRate: 320,
			amenities: ['WiFi', 'Restaurant', 'Gym', 'Room Service', 'Concierge'],
			image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
		},
	];

	for (const acc of accommodations) {
		await prisma.accommodation.create({
			data: {
				...acc,
				status: AccommodationStatus.PERMITTED,
				userId: admin.id,
			},
		});
	}

	console.log(`Accommodations: ${accommodations.length} created (all PERMITTED)`);

	// ── Bookings ──
	const allAccommodations = await prisma.accommodation.findMany({ orderBy: { id: 'asc' } });

	if (allAccommodations.length < 12) {
		console.log('Not enough accommodations for bookings, skipping...');
		return;
	}

	const bookings = [
		{
			accommodationId: allAccommodations[0]!.id,
			userId: customer.id,
			checkInDate: new Date('2026-04-10'),
			checkOutDate: new Date('2026-04-15'),
		},
		{
			accommodationId: allAccommodations[1]!.id,
			userId: customer.id,
			checkInDate: new Date('2026-05-01'),
			checkOutDate: new Date('2026-05-05'),
		},
		{
			accommodationId: allAccommodations[7]!.id,
			userId: customer2.id,
			checkInDate: new Date('2026-04-20'),
			checkOutDate: new Date('2026-04-25'),
		},
		{
			accommodationId: allAccommodations[12]!.id,
			userId: customer2.id,
			checkInDate: new Date('2026-06-01'),
			checkOutDate: new Date('2026-06-08'),
		},
		{
			accommodationId: allAccommodations[16]!.id,
			userId: customer.id,
			checkInDate: new Date('2026-12-20'),
			checkOutDate: new Date('2026-12-27'),
		},
		{
			accommodationId: allAccommodations[3]!.id,
			userId: customer2.id,
			checkInDate: new Date('2026-07-10'),
			checkOutDate: new Date('2026-07-14'),
		},
		{
			accommodationId: allAccommodations[9]!.id,
			userId: customer.id,
			checkInDate: new Date('2026-08-01'),
			checkOutDate: new Date('2026-08-10'),
		},
	];

	for (const booking of bookings) {
		const accommodation = allAccommodations.find((a) => a.id === booking.accommodationId);
		if (!accommodation) continue;

		const nights = Math.ceil(
			(booking.checkOutDate.getTime() - booking.checkInDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		const amount = nights * accommodation.dailyRate;

		const created = await prisma.booking.create({ data: booking });

		await prisma.payment.create({
			data: {
				bookingId: created.id,
				amount,
				currency: 'UAH',
			},
		});
	}

	console.log(`Bookings: ${bookings.length} created with payments`);

	console.log('Seed completed!');
}

main()
	.catch((e) => {
		console.error('Seed failed:', e);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
