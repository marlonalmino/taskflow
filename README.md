# TaskFlow — Scalable REST API & Interactive Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://taskflow-app.vercel.app)
[![API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://taskflow-api.onrender.com/api/docs)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

> Production-ready task management platform demonstrating scalable backend architecture, strict data validation, dual-token JWT authentication with token rotation, and a modern dark-mode Next.js App Router dashboard.

---

## 🌐 Live Demos

- **Frontend Dashboard:** [https://taskflow-app.vercel.app](https://taskflow-app.vercel.app)
- **Interactive API Documentation (Swagger):** [https://taskflow-api.onrender.com/api/docs](https://taskflow-api.onrender.com/api/docs)
- **Backend Base URL:** [https://taskflow-api.onrender.com](https://taskflow-api.onrender.com)

---

## ⚡ Core Features

- **Dual-Token Authentication Flow:** Short-lived access JWT in-memory + HttpOnly secure cookie refresh token rotation with token family reuse revocation.
- **Task Management (Full CRUD):**
  - Granular ownership enforcement (users can only access their own resources).
  - Soft deletion support (`deletedAt` timestamps excluded by default).
  - Flexible status pipeline (`TODO` ⇄ `IN_PROGRESS` ⇄ `DONE`).
- **Query & Pagination Engine:** Server-side pagination, status filters, keyword search, and dynamic sorting (`sortBy`, `order`).
- **Dashboard Metrics & Analytics:** Dedicated `/tasks/stats` endpoint delivering real-time task counts and calculated completion percentages.
- **Interactive API Documentation:** Full OpenAPI 3.0 / Swagger integration with authorization try-it-out capabilities.
- **Modern Dark Aesthetic:** Minimalist slate & indigo interface inspired by Linear and Vercel Dashboard, complete with loading skeletons, toasts, and modal workflows.

---

## 🏗️ Architecture & Tech Stack

```
taskflow/
├── taskflow-api/              # Backend REST API
│   ├── src/
│   │   ├── auth/              # JWT strategy, guards, cookies & rotation logic
│   │   ├── common/            # DTOs, transform interceptors, exception filters
│   │   ├── prisma/            # Global Prisma Client service
│   │   └── tasks/             # Task CRUD, filters, soft delete & stats service
│   ├── prisma/
│   │   └── schema.prisma      # Relational PostgreSQL models (User, Task, RefreshToken)
│   ├── Dockerfile             # Multi-stage production container
│   └── docker-compose.yml     # Local PostgreSQL + API orchestration
│
└── taskflow-app/              # Frontend Dashboard
    ├── src/
    │   ├── app/               # Next.js App Router (Landing, Auth, Dashboard, Tasks)
    │   ├── components/        # UI primitives, layout sidebar/header & task cards/forms
    │   └── lib/               # Typed fetch client with auto-refresh queue & Auth Context
```

### Backend (`taskflow-api`)
- **Runtime:** Node.js 22+ (TypeScript 5+)
- **Framework:** NestJS (Modular Architecture)
- **Database & ORM:** PostgreSQL (NeonDB Serverless) + Prisma ORM
- **Security & Auth:** Passport.js + JWT (`@nestjs/jwt`), bcrypt password hashing, HttpOnly SameSite cookies
- **Validation & Docs:** `class-validator`, `class-transformer`, `@nestjs/swagger`
- **Deployment:** Docker / Render

### Frontend (`taskflow-app`)
- **Framework:** Next.js (App Router, Server & Client Components)
- **Language & Styling:** TypeScript, Tailwind CSS v4
- **Icons & State:** Lucide React, React Context Auth Provider
- **HTTP Client:** Native Fetch wrapper with automatic 401 interception and token refresh queue
- **Deployment:** Vercel

---

## 🚀 Quickstart (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/marlonalmino/taskflow.git
cd taskflow
```

### 2. Configure Environment Variables

**Backend (`taskflow-api/.env`):**
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="dev-secret-key-min-32-chars-long"
JWT_EXPIRATION="15m"
REFRESH_TOKEN_EXPIRATION_DAYS=7
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend (`taskflow-app/.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

### 3. Run Backend (`taskflow-api`)

```bash
cd taskflow-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
- API will be live at: `http://localhost:3001`
- Swagger documentation: `http://localhost:3001/api/docs`

---

### 4. Run Frontend (`taskflow-app`)

```bash
cd taskflow-app
npm install
npm run dev
```
- Dashboard will be live at: `http://localhost:3000`

---

## 📦 API Response Contract

All endpoints follow a standardized envelope:

```json
// Single Resource
{
  "data": { "id": "cmu123", "title": "Deploy to Render", "status": "DONE" },
  "meta": null
}

// Paginated Query
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

---

## 📄 License
MIT License. Developed as a production portfolio piece.
