# S. Angelova Car Rentals & Taxi Services

Next.js website for a car rental and taxi business in Paphos, Cyprus: marketing
pages, a three-step booking form for cars and fixed-price transfers, and a
password-protected admin area where the owner sees and manages reservations.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, server actions) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4, with CSS modules for the booking
  form and carousel
- [Prisma 7](https://www.prisma.io) + PostgreSQL (Supabase) via `@prisma/adapter-pg`
- [zod](https://zod.dev) for validation shared by the client and server
- Session-cookie auth (`jose` + `bcryptjs`) — no external auth provider
- Optional [Upstash](https://upstash.com) Redis for shared rate limiting
- Deployed on Vercel

## Getting started

```bash
npm install
cp .env.example .env      # then fill in the values below
npx prisma generate
npx prisma migrate deploy # or `migrate dev` when changing the schema
npm run db:seed           # creates/updates the admin login
npm run dev
```

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Supabase **transaction pooler** URL, port 6543, `?pgbouncer=true` |
| `DIRECT_URL` | yes | Supabase **direct** URL, port 5432 — migrations only |
| `SESSION_SECRET` | yes | 32+ characters; the app refuses to start otherwise |
| `ADMIN_NAME` / `ADMIN_PASSWORD` | seeding | used only by `npm run db:seed` |
| `NEXT_PUBLIC_SITE_URL` | no | canonical URL; defaults to the vercel.app address |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | no | shared rate limiting; falls back to per-instance in-memory |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | `prisma generate` + production build |
| `npm run lint` | ESLint |
| `npm test` | vitest (pricing, availability, transfers, timezone) |
| `npm run db:seed` | create or reset the admin user from `.env` |

CI runs lint, `tsc --noEmit`, the tests and a production build on every push.

## Updating the site content

No code changes needed for any of this — edit the file, commit, and Vercel
redeploys.

- **Car prices and specs** — `prices.json`. One row per car: the five rate tiers
  (use `ASK` for "contact us"), plus `category`, `seats`, `transmission`, `fuel`,
  `bags`, `ac`. A car that is sold gets `"active": false`: it disappears from the
  site and the booking form, and its old bookings keep working in the admin.
- **How many of each car** — in the admin under **Fleet** (`/admin/fleet`), no
  deploy needed. A model stays bookable until every unit is booked at the same
  time; set 0 to pause a model.
- **Taxi and minibus transfers** — `taxi-rates.json`. One row per destination
  with a price for each passenger tier. Adding a destination automatically adds
  it to the price dialog, the booking form and the structured data. These fixed
  prices apply only to pickups in Kato Paphos (`FIXED_FARE_PICKUP` in
  `app/lib/taxi-data.ts`); any other pickup is saved with no price and flagged
  "Fare to confirm" in the admin.
- **Car photos** — drop 4:3 WebP images into `public/fleet` named after the car
  slug (`nissan-march.webp`, `nissan-march-2.webp`), then list them in
  `app/lib/fleet-data.ts`.
- **Phone, email, address, hours** — `app/lib/site-config.ts`.
- **FAQ answers** — `components/Faq.tsx`.

## How it fits together

- `app/(site)` — public pages. `/` and `/fleet` are cached and revalidated on
  demand whenever a booking is created or its status changes.
- `app/actions` — server actions: `bookings.ts` (public), `auth.ts`,
  `reservations.ts` and `admin.ts` (session-checked).
- `app/lib/booking-schema.ts` — the single validation schema. The form uses it
  per step; the server action always runs it in full.
- `app/lib/timezone.ts` — **all** date handling. Inputs are Cyprus wall-clock
  time, storage is `timestamptz`, display is always Europe/Nicosia. Never use
  `new Date(datetimeLocalString)` or `toLocaleDateString()` anywhere else.
- `app/lib/availability.ts` — which cars are free. A reservation blocks one unit
  of its model as soon as it is submitted; unconfirmed ones expire after 48 hours.
  A model is free for a date range while, at the busiest moment of that range,
  fewer bookings overlap than it has units (`CarModel.quantity`). The
  `enforce_car_capacity` Postgres trigger is the final guard against overbooking.
- `app/lib/pricing.ts` / `app/lib/quote.ts` — prices. A rental day is 24 hours
  plus a 2-hour grace period (`rentalDays`); the price is worked out on the server
  and saved with the booking, and the form, admin and emails all use the same
  functions.
- `app/admin` — dashboard, reservation detail, customers. Protected by `proxy.ts`
  and re-checked in each page via `verifySession()`.

## Admin access

The owner signs in at `/admin/login` with the name and password created by
`npm run db:seed`. Only the bcrypt hash is stored, so a forgotten password is
reset by re-running the seed with new values in `.env`.

## Open questions for the owner

See [FOLLOWUP.md](./FOLLOWUP.md).
