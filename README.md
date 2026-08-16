# S. Angelova Car Rentals & Taxi Services

A Next.js website for a car rental & taxi services business: public marketing
pages, a booking/reservation form, and a password-protected admin dashboard
for viewing submitted reservations.

All business content (name, phone, fleet, pricing) currently in the site is
**placeholder data** — see `app/lib/site-config.ts` and
`app/lib/placeholder-data.ts` to replace it with real details.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Prisma](https://www.prisma.io) 7 + SQLite (`@prisma/adapter-better-sqlite3`)
- Custom session-cookie auth (`jose` + `bcryptjs`) for the admin dashboard —
  no external auth provider required

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   - `SESSION_SECRET` — random secret used to sign the admin session cookie.
     Generate one with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
   - `ADMIN_NAME` / `ADMIN_PASSWORD` — credentials for the admin account
     (only used by the seed script below; not read at runtime).

3. Create the database and apply migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Seed the admin user (creates/updates one admin login from `ADMIN_NAME`/`ADMIN_PASSWORD`):

   ```bash
   npm run db:seed
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the public site,
   and [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   to sign in to the admin dashboard.

## Project structure

- `app/(site)/` — public marketing pages (home, fleet, taxi, pricing, contact, booking)
- `app/admin/` — admin login + reservations dashboard (protected by `proxy.ts`)
- `app/actions/` — Server Actions (`bookings.ts` for reservations, `auth.ts` for admin login/logout)
- `app/lib/` — Prisma client, session/auth helpers, site content
- `prisma/schema.prisma` — `Reservation` and `AdminUser` models
- `scripts/seed-admin.ts` — seeds/updates the admin login from env vars

## Useful commands

```bash
npm run dev          # start the dev server
npm run build         # production build
npx prisma studio      # browse the SQLite database in a GUI
npx prisma migrate dev # create/apply a new migration after schema changes
npm run db:seed        # (re)seed the admin user
```
