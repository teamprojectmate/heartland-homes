# Heartland Homes

Short-term accommodation booking platform (Airbnb-like). Search, book, and pay for apartments, hotels, and vacation homes across Ukraine.

## Demo

[Live Demo](https://heartland-homes.vercel.app) | [NestJS API](https://heartland-homes-api.onrender.com) | [Spring Boot API](https://accommodation-booking-service.azurewebsites.net)

> **Note:** NestJS backend is hosted on Render free tier — first request may take 30-60s to wake up.
> Spring Boot backend was hosted on Azure (free tier expired) — currently inactive.

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | john.doe@booking.com | password123 |
| Admin | admin@booking.com | password123 |

Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## Screenshots

![Home page — light theme](docs/screenshots/home-light.png)

<details>
<summary>More screenshots (20+)</summary>

### Customer Pages

| Page | Screenshot |
|------|-----------|
| Home (logged in) | ![Home logged](docs/screenshots/home-logged.png) |
| Accommodations + Map (dark) | ![Accommodations dark](docs/screenshots/accommodations-dark.png) |
| Accommodation Details | ![Details](docs/screenshots/details.png) |
| Details (dark) | ![Details dark](docs/screenshots/details-dark.png) |
| Booking Form | ![Booking](docs/screenshots/booking-form.png) |
| My Bookings | ![Bookings](docs/screenshots/my-bookings.png) |

### Payments (Stripe Integration)

| Page | Screenshot |
|------|-----------|
| My Payments (3 statuses) | ![Payments](docs/screenshots/my-payments.png) |
| All Paid | ![Paid](docs/screenshots/my-payments-paid.png) |
| Payment Checkout | ![Payment](docs/screenshots/payment.png) |
| Stripe Checkout | ![Stripe](docs/screenshots/stripe-checkout.png) |
| Payment Issue | ![Cancel](docs/screenshots/payment-cancel.png) |

### Auth & Profile

| Page | Screenshot |
|------|-----------|
| Login | ![Login](docs/screenshots/login.png) |
| Register | ![Register](docs/screenshots/register.png) |
| Profile | ![Profile](docs/screenshots/profile.png) |

### Other Pages

| Page | Screenshot |
|------|-----------|
| Contact Us (light) | ![Support](docs/screenshots/support.png) |
| Contact Us (dark) | ![Support dark](docs/screenshots/support-dark.png) |
| Create Accommodation | ![Create](docs/screenshots/create-accommodation.png) |

### Admin Panel

| Page | Screenshot |
|------|-----------|
| Dashboard | ![Admin](docs/screenshots/admin-dashboard.png) |
| Bookings Management | ![Admin bookings](docs/screenshots/admin-bookings.png) |
| Users Management | ![Admin users](docs/screenshots/admin-users.png) |

</details>

## Tech Stack

**Frontend:** React 19, TypeScript (strict), Vite, Redux Toolkit, React Hook Form + Zod, SCSS, i18next (EN/UA), Leaflet maps, Stripe.js

**Backend (NestJS):** NestJS 11, TypeScript, Prisma v7, PostgreSQL, JWT + RBAC, Stripe Checkout + Webhooks, Helmet, ThrottlerGuard

**Backend (Spring Boot):** Java 17, Spring Boot 3, Spring Security + JWT, Stripe API, PostgreSQL, Docker

**Testing:** Vitest (frontend, 137 tests), Jest (NestJS backend, 51 tests — unit, integration, E2E)

**CI/CD:** GitHub Actions (typecheck + lint + build), Vercel (FE), Render (NestJS BE)

> **Team project** (2 developers): Frontend + NestJS backend — [Oksana Pokhvalenko](https://github.com/Opokhvalenko), Spring Boot backend — [Yaroslav Pryshchepa](https://github.com/yaroslav-pryshchepa). The project started with Spring Boot on Azure, later NestJS was added as an alternative backend with Prisma, Swagger, refresh tokens and Stripe webhooks.

## Features

### For Customers
- Search accommodations by city, type, and price range
- Interactive map with markers (Leaflet + OpenStreetMap)
- Booking with automatic price calculation (nights x daily rate)
- Stripe Checkout payments
- Google OAuth login
- Booking management (view, cancel)
- Payment history

### For Managers (Admin)
- Admin panel with CRUD for accommodations, bookings, users, payments
- Status management (booking confirmation, accommodation approval)
- Role-based access control (Customer / Manager)

### UX / Technical
- Full i18n support (English / Ukrainian) — 8 namespace files, 31 components
- Dark / Light theme with CSS custom properties
- Responsive design (desktop + mobile)
- Lazy loading for all pages
- Form validation (React Hook Form + Zod)
- TypeScript strict mode — zero `any`, zero implicit any
- Biome + Stylelint — zero warnings

## Architecture

```
heartland-homes/
├── frontend/              # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   ├── store/             # Redux Toolkit slices
│   │   ├── styles/            # SCSS modules (BEM-like)
│   │   ├── i18n/              # EN/UA translations
│   │   ├── validation/        # Zod schemas
│   │   └── utils/             # Helpers
│   └── ...
├── backend-nest/          # NestJS 11 + Prisma + PostgreSQL
│   ├── src/
│   │   ├── auth/              # JWT + Google OAuth + Refresh tokens
│   │   ├── users/             # User CRUD + roles
│   │   ├── accommodations/    # CRUD + search + status
│   │   ├── bookings/          # CRUD + overlap check
│   │   └── payments/          # Stripe Checkout + Webhooks
│   └── ...
├── backend-spring/        # Spring Boot 3 + Java 17 (team member)
│   └── ...
└── docker-compose.yml     # Full stack setup
```

## Getting Started

### Prerequisites
- Node.js 22+, PostgreSQL 15+, Stripe account (test mode)
- Java 17+ (for Spring Boot backend)

### Quick Start (NestJS)

```bash
# Clone
git clone https://github.com/teamprojectmate/heartland-homes.git
cd heartland-homes

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173

# NestJS Backend (in another terminal)
cd backend-nest
cp .env.example .env       # fill in DB + Stripe keys
npm install
npx prisma generate
npx prisma migrate dev
npx nest start             # http://localhost:3000
```

### Quick Start (Spring Boot)

```bash
# Spring Boot Backend
cd backend-spring
./mvnw spring-boot:run     # http://localhost:8080
```

### Docker Compose (full stack)
```bash
docker compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

## Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (`backend-nest/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/heartland_homes"
JWT_SECRET="your-jwt-secret-key-min-32-chars"
JWT_EXPIRATION="1h"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

## API Endpoints (26 total)

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/registration`, `POST /auth/login` |
| Users | `GET/PUT /users/me`, `GET /users`, `PUT /users/:id/role`, `DELETE /users/:id` |
| Accommodations | `GET/POST /accommodations`, `GET/PUT/DELETE /accommodations/:id`, `GET /accommodations/search`, `PATCH /accommodations/:id/status` |
| Bookings | `GET/POST /bookings`, `GET/PUT/DELETE /bookings/:id`, `GET /bookings/my`, `POST /bookings/:id/payment` |
| Payments | `POST /payments`, `GET /payments`, `POST /payments/webhook` |

## Testing

```bash
# Frontend (115 tests — utils, validation, Redux, i18n)
cd frontend && npm run test:run

# Backend unit + integration (37 tests)
cd backend-nest && npm test

# Backend E2E (14 tests)
cd backend-nest && npm run test:e2e
```

## Challenges & Solutions

See [CHALLENGES.md](CHALLENGES.md) for detailed technical challenges encountered during development and how they were solved.

## License

MIT
