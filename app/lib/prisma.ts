import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless: keep connections per instance minimal; use the pooled URL.
  max: Number(process.env.PG_POOL_MAX ?? 3),
  idleTimeoutMillis: 10_000,
  // Fail fast instead of hanging until the OS-level ETIMEDOUT.
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
});
// Close idle connections before Vercel suspends the instance, so a resumed
// instance doesn't reuse dead sockets (ETIMEDOUT on the admin dashboard).
attachDatabasePool(pool);
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
