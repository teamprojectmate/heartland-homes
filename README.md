# Heartland Homes

Short-term accommodation booking platform (Airbnb-like). Search, book, and pay for apartments, hotels, and vacation homes across Ukraine.

## Demo

[Live Demo](https://heartland-homes.vercel.app) | [API](https://heartland-homes-api.onrender.com)

> **Note:** Backend is hosted on Render free tier — first request may take 30-60s to wake up.

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | john.doe@booking.com | password123 |
| Admin | admin@booking.com | password123 |

Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## Screenshots

![Home page — light theme](docs/screenshots/home-light.png)

<details>
<summary>More screenshots</summary>

| Page | Screenshot |
|------|-----------|
| Home (logged in) | ![Home logged](docs/screenshots/home-logged.png) |
| Accommodations + Map (dark) | ![Accommodations dark](docs/screenshots/accommodations-dark.png) |
| Accommodation Details | ![Details](docs/screenshots/details.png) |
| Details (dark) | ![Details dark](docs/screenshots/details-dark.png) |
| Payment Checkout | ![Payment](docs/screenshots/payment.png) |
| Stripe Checkout | ![Stripe](docs/screenshots/stripe-checkout.png) |
| Login | ![Login](docs/screenshots/login.png) |
| Register | ![Register](docs/screenshots/register.png) |
| Profile | ![Profile](docs/screenshots/profile.png) |
| Create Accommodation | ![Create](docs/screenshots/create-accommodation.png) |
| Contact Us (light) | ![Support](docs/screenshots/support.png) |
| Contact Us (dark) | ![Support dark](docs/screenshots/support-dark.png) |
| Admin Dashboard | ![Admin](docs/screenshots/admin-dashboard.png) |
| Admin Bookings | ![Admin bookings](docs/screenshots/admin-bookings.png) |
| Admin Users | ![Admin users](docs/screenshots/admin-users.png) |

</details>

## Tech Stack

**Frontend:** React 19, TypeScript (strict), Vite, Redux Toolkit, React Hook Form + Zod, SCSS, i18next (EN/UA), Leaflet maps, Stripe.js

**Backend:** NestJS 11, TypeScript, Prisma v7, PostgreSQL, JWT + RBAC, Stripe Checkout + Webhooks, Helmet, ThrottlerGuard

**Testing:** Vitest (frontend, 137 tests), Jest (backend, 51 tests — unit, integration, E2E)

**CI/CD:** GitHub Actions (typecheck + lint + build), Vercel (FE), Render (BE)

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
├── frontend/          # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   ├── store/         # Redux Toolkit slices
│   │   ├── styles/        # SCSS modules (BEM-like)
│   │   ├── i18n/          # EN/UA translations
│   │   ├── validation/    # Zod schemas
│   │   └── utils/         # Helpers
│   └── ...
├── backend-nest/      # NestJS 11 + Prisma + PostgreSQL
│   ├── src/
│   │   ├── auth/          # JWT + Google OAuth
│   │   ├── users/         # User CRUD + roles
│   │   ├── accommodations/# CRUD + search + status
│   │   ├── bookings/      # CRUD + overlap check
│   │   └── payments/      # Stripe integration
│   └── ...
└── docker-compose.yml # Full stack setup
```

## Getting Started

### Prerequisites
- Node.js 22+, PostgreSQL 15+, Stripe account (test mode)

### Quick Start

```bash
# Clone
git clone https://github.com/teamprojectmate/heartland-homes.git
cd heartland-homes

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173

# Backend (in another terminal)
cd backend-nest
cp .env.example .env       # fill in DB + Stripe keys
npm install
npx prisma generate
npx prisma migrate dev
npx nest start             # http://localhost:3000
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
