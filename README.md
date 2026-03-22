# Heartland Homes 🏡

Повноцінний сервіс для пошуку, бронювання та управління помешканнями.
Проєкт складається з **Frontend (React + Vite)**, **Backend (Spring Boot)** та **Backend (NestJS)**.

---

## 🌍 Демо

- **Frontend (Vercel):** [heartland-homes.vercel.app](https://heartland-homes.vercel.app)
- **Backend — NestJS (Render):** [heartland-homes-api.onrender.com](https://heartland-homes-api.onrender.com)
- **Backend — Spring Boot (Azure):** [accommodation-booking-service.azurewebsites.net](https://accommodation-booking-service.azurewebsites.net)

---

## 🚀 Основні можливості

### Для користувачів
- Реєстрація та вхід (JWT).
- Пошук і фільтрація помешкань.
- Перегляд деталей житла з фото та зручностями.
- Бронювання і оплата (Stripe).
- Управління профілем.
- Перегляд історії бронювань.

### Для адміністраторів
- Управління всіма помешканнями (CRUD, статуси).
- Керування бронюваннями (деталі, зміна статусу, видалення).
- Управління платежами (перегляд, фільтр).
- Управління користувачами (перегляд, видалення — не може видалити себе).

### i18n
- Повна підтримка EN/UA (31 компонент).
- Мультимовний контент з БД (nameUk, locationUk).
- Переклад API помилок (44 повідомлення).
- 6 міст + 32 amenities з перекладами та іконками.

---

## 🛠 Використані технології

### Frontend
- **React 19 + Vite + TypeScript**
- Redux Toolkit
- React Hook Form + Zod
- i18next (EN/UA, 8 namespace files)
- Axios
- Leaflet (карти)
- Stripe.js
- SCSS (модульна структура)
- Dark/Light theme
- Vitest (115 тестів)

### Backend (Spring Boot — legacy)
- Spring Boot
- Spring Security + JWT
- Stripe API
- Docker
- PostgreSQL

### Backend (NestJS — active)
- NestJS 11, TypeScript (strict mode)
- Prisma v7, PostgreSQL
- JWT auth, RBAC (Customer/Manager)
- Stripe Checkout + Webhooks
- Helmet, CORS, ThrottlerGuard, ValidationPipe
- Biome linter
- Jest (51 тестів — unit, integration, E2E)

---

## NestJS Backend — Quick Start

### Prerequisites
- Node.js 22+, PostgreSQL 15+, Stripe account (test mode)

### Setup
```bash
cd backend-nest
cp .env.example .env    # fill in your values
npm install
npx prisma generate
npx prisma migrate dev
npx nest start          # http://localhost:3000
```

### Environment Variables (`backend-nest/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/heartland_homes"
JWT_SECRET="your-jwt-secret-key-min-32-chars"
JWT_EXPIRATION="1h"
STRIPE_SECRET_KEY="sk_test_..."       # https://dashboard.stripe.com/test/apikeys
STRIPE_WEBHOOK_SECRET="whsec_..."
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin (Manager) | admin@booking.com | password123 |
| Customer | john.doe@booking.com | password123 |
| Customer | jane.smith@booking.com | password123 |

### Stripe Test Card
- Card: `4242 4242 4242 4242`
- Expiry: any future date (e.g. `12/34`)
- CVC: any 3 digits (e.g. `123`)

### API Endpoints (26 total)

| Module | Endpoints |
|--------|-----------|
| Auth | POST /auth/registration, POST /auth/login |
| Users | GET/PUT /users/me, GET /users, PUT /users/:id/role, DELETE /users/:id |
| Accommodations | GET/POST /accommodations, GET/PUT/DELETE /accommodations/:id, GET /accommodations/search, PATCH /accommodations/:id/status |
| Bookings | GET/POST /bookings, GET/PUT/DELETE /bookings/:id, GET /bookings/my, POST /bookings/:id/payment |
| Payments | POST /payments, GET /payments, POST /payments/webhook |

### NestJS Scripts
```bash
npx nest start       # dev server
npx nest build       # production build
npm run type-check   # tsc --noEmit
npm run biome:check  # lint
npm run test         # jest
```

---

## ⚙️ Налаштування середовища

```env
# Frontend (.env.example)
```
## локально (NestJS)
```bash
VITE_API_URL=http://localhost:3000
```

## продакшен (Vercel)
```bash
VITE_API_URL=https://heartland-homes-api.onrender.com
```


## Backend (.env.template)

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/booking
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
STRIPE_SECRET_KEY=stripe_secret_key_placeholder
CORS_ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=your-secret
```

## ▶️ Локальний запуск

### Backend
```bash
cd backend
cp .env.template .env
./mvnw clean package -DskipTests
java -jar target/*.jar
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Docker Compose (fullstack — NestJS + PostgreSQL + Frontend)
```bash
docker compose up --build
```
Відкрити: frontend [http://localhost:5173](http://localhost:5173), backend [http://localhost:3000](http://localhost:3000)

### Docker Compose (Spring Boot бекенд + база)
```bash
cd backend
docker compose up --build
```
---

### 🧪 Тестування

**Frontend (115 тестів — utils, validation, Redux, translations):**
```bash
cd frontend && npm run test:run
```

**Backend NestJS — unit + integration (37 тестів):**
```bash
cd backend-nest && npm test
```

**Backend NestJS — E2E (14 тестів):**
```bash
cd backend-nest && npm run test:e2e
```

**Backend Spring Boot:**
```bash
cd backend && ./mvnw test
```

---

### 🧰 Корисні скрипти
**Frontend**
```json
{
  "scripts": {
    "dev": "vite",
    "start": "react-scripts start",
    "build": "vite build",
    "preview": "vite preview",
    "test": "react-scripts test",
    "lint": "eslint \"src/**/*.{js,jsx}\"",
    "format": "prettier --write ."
  }
}
```
**Backend**
```bash
./mvnw spring-boot:run
./mvnw clean package
./mvnw test
```

### 🔧 Траблшутінг
- **CORS:** перевірте `CORS_ALLOWED_ORIGINS`.
- **Stripe:** перевірте ключі та редіректи.
- **JWT expired:** оновіть токен.
- **Telegram:** перевірте `BOT_TOKEN`/`CHAT_ID`.
- **DB:** перевірте підключення.

---

### 🗺 Roadmap
- ~~i18n~~ ✅
- ~~Webhooks Stripe~~ ✅
- ~~166 тестів (unit, integration, E2E)~~ ✅
- Відгуки, фаворити
- Availability calendar
- Docker Compose
- Swagger @ApiOperation/@ApiResponse

---

### 📄 Ліцензія
MIT
