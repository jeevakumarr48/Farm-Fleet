# FarmFleet

FarmFleet is a responsive Custom Hiring Centre operations system for India. It includes a React + TypeScript frontend and an Express + Prisma + PostgreSQL REST API.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Start PostgreSQL, then run `npm install` from this directory.
3. Run `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed`.
4. Start the API with `npm run dev:api`.
5. Start the frontend with `npm run dev`.

Prototype logins: `admin@farmfleet.in`, `manager@farmfleet.in`, `ravi@farmfleet.in`, or `rajesh@farmfleet.in`, all with password `password123`.

Users can change their display name, the username portion of their `@farmfleet.in` login, phone, and password from **My profile**. The domain stays fixed.

The frontend deliberately falls back to synthetic sample data when the API is unavailable, so the operations surfaces can be reviewed without a database. API writes use the same endpoint contract and replace the fallback as soon as the backend is running.

## Vercel deployment

Create one Vercel project with the project root set to `farmfleet`. The included `vercel.json` builds the frontend and routes `/api/*` to the Express backend service.

Set these Vercel environment variables for Production, Preview, and Development:

```env
DATABASE_URL=your-hosted-postgresql-connection-string
JWT_SECRET=your-long-random-secret
CLIENT_ORIGIN=https://your-project.vercel.app
SPEECH_TO_TEXT_API_KEY=
MAPS_API_KEY=
```

Use a hosted PostgreSQL provider such as Neon, Supabase, or Railway. Run `npm run db:migrate` and `npm run db:seed` against that database before testing the deployed API. No `VITE_API_URL` is needed on Vercel because the frontend uses the same-domain `/api` route.

If no `DATABASE_URL` is present, the API starts in prototype mode: health and demo login work, data endpoints return a clear `DATABASE_NOT_CONFIGURED` response, and the frontend uses synthetic sample data instead of crashing.

## Workspace

- `frontend/src/components`: shell, forms, voice assistant, and UI primitives
- `frontend/src/pages`: role dashboards, bookings, schedule, machines, people, farmer requests, and operator tasks
- `frontend/src/services/api.ts`: React Query-facing API client
- `backend/src/controllers`: request/response handlers
- `backend/src/services`: booking, duration, voice, and schedule logic
- `backend/src/routes`: authenticated role-aware routes
- `backend/prisma`: schema, initial migration, and seed data
