# Heartland Homes 🏡

Повноцінний сервіс для пошуку, бронювання та управління помешканнями.  
Проєкт складається з **Frontend (React + Vite)** та **Backend (Spring Boot)**.

---

## 🌍 Демо

- **Frontend (Vercel):** [https://heartland-homes.vercel.app](https://heartland-homes.vercel.app)  
- **Backend (Microsoft Azure):** [https://accommodation-booking-service.azurewebsites.net](https://accommodation-booking-service.azurewebsites.net)

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
- Управління всіма помешканнями.
- Керування бронюваннями.
- Перегляд користувачів.
- Панель адміністратора.

---

## 🛠 Використані технології

### Frontend
- **React 19 + Vite**
- React Router DOM
- Redux Toolkit
- Axios
- Leaflet (карти)
- Stripe
- SCSS (модульна структура)

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
- Biome linter, Jest

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
| Customer | browsertest@example.com | TestPass123! |

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
## локально
```bash
VITE_API_URL=http://localhost:8080
```

## продакшен (на Vercel)
### VITE_API_URL=https://api.heartland-homes.com


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

### Docker Compose (бекенд + база)
```bash
cd backend
docker compose up --build
```
---

### 🧪 Тестування
**Backend:**
```bash
./mvnw test
```
**Frontend:**
```bash
npm test
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
- Розширення RBAC
- Відгуки, фаворити
- i18n
- Webhooks Stripe
- Моніторинг

---

### 📄 Ліцензія
MIT
