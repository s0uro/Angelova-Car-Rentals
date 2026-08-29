import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting for the public booking action and the admin login.
//
// In production set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (free
// tier is plenty). Without them we fall back to a per-instance in-memory
// window, which still stops naive abuse in dev/preview but is not shared
// between serverless instances.

type Rule = { limit: number; windowSeconds: number };

export const RATE_LIMITS = {
  booking: { limit: 5, windowSeconds: 60 * 60 }, // 5 reservations / IP / hour
  login: { limit: 5, windowSeconds: 15 * 60 }, // 5 failed logins / IP / 15 min
} satisfies Record<string, Rule>;

type Bucket = keyof typeof RATE_LIMITS;

const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const upstashLimiters: Partial<Record<Bucket, Ratelimit>> = {};

function upstashFor(bucket: Bucket): Ratelimit {
  if (!upstashLimiters[bucket]) {
    const rule = RATE_LIMITS[bucket];
    upstashLimiters[bucket] = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(rule.limit, `${rule.windowSeconds} s`),
      prefix: `angelova:${bucket}`,
    });
  }
  return upstashLimiters[bucket]!;
}

// In-memory fallback (dev / no Upstash configured).
const memory = new Map<string, number[]>();

function memoryCheck(bucket: Bucket, id: string): boolean {
  const rule = RATE_LIMITS[bucket];
  const now = Date.now();
  const key = `${bucket}:${id}`;
  const hits = (memory.get(key) ?? []).filter(
    (t) => now - t < rule.windowSeconds * 1000
  );
  if (hits.length >= rule.limit) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  // Opportunistic cleanup so the map doesn't grow forever.
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (v.every((t) => now - t >= rule.windowSeconds * 1000)) memory.delete(k);
    }
  }
  return true;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/** Returns true when the request is allowed, false when the limit is hit. */
export async function checkRateLimit(bucket: Bucket, id?: string): Promise<boolean> {
  const key = id ?? (await getClientIp());
  if (hasUpstash) {
    try {
      const { success } = await upstashFor(bucket).limit(key);
      return success;
    } catch (error) {
      console.error("Rate limiter unavailable, allowing request:", error);
      return true;
    }
  }
  return memoryCheck(bucket, key);
}
