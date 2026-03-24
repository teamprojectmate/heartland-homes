# Heartland Homes — Frontend

Short-term vacation rental platform (similar to Airbnb). Built with React 19, TypeScript, Redux Toolkit, and Vite.

## Features

- **Authentication:** Email/password + Google OAuth, JWT-based session, role-based access (Customer/Manager)
- **Accommodations:** Search with filters (city, type, price), interactive map (Leaflet), gallery
- **Bookings:** Create, view, cancel bookings with date validation and price calculation
- **Payments:** Stripe Checkout integration with payment status tracking
- **Admin Panel:** Manage accommodations, bookings, users, payments (Manager role)
- **Dark/Light Theme:** CSS custom properties with WCAG AA contrast
- **i18n:** English and Ukrainian translations

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19, TypeScript 5.9 (strict mode) |
| Build | Vite 7 |
| State | Redux Toolkit (typed hooks) |
| Forms | React Hook Form + Zod validation |
| Styling | SCSS with CSS custom properties |
| Maps | Leaflet + React Leaflet |
| Payments | Stripe |
| Auth | JWT + Google OAuth |
| i18n | i18next (EN/UA) |
| Linter | Biome (strict: noExplicitAny, noDoubleEquals, a11y rules) |
| Tests | Vitest (137 tests) + Cypress (E2E) |

## Getting Started

### Prerequisites
- Node.js v20+
- npm v9+

### Setup

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

Output: `dist/`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript check |
| `npm run biome:check` | Lint (errors only) |
| `npm run biome:fix` | Lint + autofix |
| `npm run test` | Run tests (watch) |
| `npm run test:run` | Run tests (137 tests) |
| `npm run check` | type-check + biome:check |

## Project Structure

```
src/
├── api/            Typed API services (Promise<T>, Axios interceptors)
├── components/     Reusable UI (MapPicker, Skeletons, BookingCard)
├── hooks/          Custom hooks (useEnrichedBookings, useIsMobile)
├── pages/          Route pages by feature (Auth, Admin, User, Info)
├── routes/         AppRoutes (lazy-loaded with React.lazy)
├── store/          Redux Toolkit (5 slices, typed RootState/AppDispatch)
├── styles/         SCSS (CSS custom properties, z-index scale, theme)
├── types/          Centralized TypeScript types
├── utils/          Pure functions (dateCalc, addressNormalization)
├── validation/     Zod schemas for forms
└── i18n/           Translations (en.json, uk.json)
```

## Quality Gates

| When | What runs |
|------|-----------|
| `git commit` | lint-staged (biome fix) + tsc |
| `git push` | type-check + biome:check + build |
| PR (GitHub) | CI: tsc + biome + build |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@booking.com` | `password123` |
| User | `john.doe@booking.com` | `password123` |

## License

MIT
