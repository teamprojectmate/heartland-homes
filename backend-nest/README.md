# Heartland Homes — Backend API

REST API for the Heartland Homes vacation rental platform. Built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | NestJS 11, TypeScript (strict mode) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe Checkout |
| Validation | class-validator + class-transformer |
| Docs | Swagger (auto-generated) |
| Security | Helmet, CORS, ThrottlerGuard, bcrypt |
| Linter | Biome (strict config) |
| Tests | Jest (unit + e2e) |

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL 15+
- npm v9+

### Setup

```bash
cd backend-nest
npm install
cp .env.example .env   # edit with your credentials
npx prisma migrate dev
npm run dev
```

API: http://localhost:3000
Swagger: http://localhost:3000/api/docs

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (watch mode) |
| `npm run build` | Production build |
| `npm run start:prod` | Start production server |
| `npm run type-check` | TypeScript check |
| `npm run biome:check` | Lint check |
| `npm run check` | type-check + biome:check |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:cov` | Test coverage |

## Project Structure

```
src/
├── auth/           JWT strategy, login, register, guards
├── users/          User CRUD, roles management
├── accommodations/ CRUD, search, filters, pagination
├── bookings/       CRUD, price calculation
├── payments/       Stripe integration, webhooks
├── prisma/         Prisma service
├── common/         Shared DTOs, filters, interceptors, decorators
├── config/         Environment validation
├── app.module.ts   Root module
└── main.ts         Bootstrap + global setup
```

## Environment Variables

See `.env.example` for required variables.

## License

MIT
