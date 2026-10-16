// Runs `prisma migrate deploy` as part of `npm run build`, so a production
// deploy never ships code that expects columns or tables the database doesn't
// have yet. If a migration fails the build fails, and Vercel keeps the
// previous deployment live.
//
// Only Vercel production builds migrate: preview builds (feature branches)
// share the same database and must not change it, and local or CI builds
// leave the database alone.
import { execFileSync } from "node:child_process";

if (process.env.VERCEL_ENV !== "production") {
  console.log(`migrate-on-deploy: skipping (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"})`);
  process.exit(0);
}

// The transaction pooler (DATABASE_URL) can't hold the lock Prisma takes
// while migrating, so require the direct connection rather than hang.
if (!process.env.DIRECT_URL) {
  console.error(
    "migrate-on-deploy: DIRECT_URL is not set for Production in Vercel. " +
      "Add the Supabase direct connection URL (port 5432) and redeploy."
  );
  process.exit(1);
}

execFileSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit" });
