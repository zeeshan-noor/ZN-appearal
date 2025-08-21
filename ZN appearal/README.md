## ZN Apparel — Full-stack Monorepo

This monorepo contains:

- apps/web: Next.js 14 (App Router) storefront for ZN Apparel
- apps/api: NestJS backend API with Prisma (PostgreSQL) and Swagger

### Quick start

1. Install dependencies

```bash
npm install
```

2. Environment

Create `.env` files:

- apps/api/.env
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="devsecret"
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

- apps/web/.env.local
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
PORT=3001
```

3. Dev

```bash
npm run dev
```

Frontend: http://localhost:3001
Backend: http://localhost:4000 (Swagger at /docs)

### Production build

```bash
npm run build && npm run start
```

### Tech

- Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- NestJS, Prisma, Zod, Swagger, JWT Auth
- PostgreSQL (use Docker for local DB)

### Seed data

```bash
npm --workspace apps/api run prisma:seed
```

