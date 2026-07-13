/**
 * Minimal in-memory rate limiter.
 *
 * This is sufficient for a single-instance deployment (e.g. one Docker container) and for this
 * MVP's demo/pilot scale. For a multi-instance production deployment, replace the in-memory Map
 * with a shared store (e.g. Redis / Upstash) so limits are enforced consistently across instances
 * — the function signature below would not need to change for calling code.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(key: string, maxAttempts: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterMs: 0 };
  }

  if (existing.count >= maxAttempts) {
    return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { allowed: true, remaining: maxAttempts - existing.count, retryAfterMs: 0 };
}

/** Brute-force protection for login: 5 attempts per 10 minutes per email. */
export function checkLoginRateLimit(email: string) {
  return rateLimit(`login:${email.toLowerCase()}`, 5, 10 * 60 * 1000);
}

/** Registration abuse protection: 5 accounts per hour per IP. */
export function checkRegisterRateLimit(ip: string) {
  return rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
}

/** Emergency form abuse protection: 3 submissions per 10 minutes per user. */
export function checkEmergencyRateLimit(userId: string) {
  return rateLimit(`emergency:${userId}`, 3, 10 * 60 * 1000);
}
