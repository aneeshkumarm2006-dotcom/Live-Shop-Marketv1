// ─── In-Memory Sliding-Window Rate Limiter ─────────────────────────────────
//
// Provides per-IP rate limiting for Next.js API routes.
// Uses a simple in-memory store suitable for single-instance deployments.
// For multi-instance / serverless at scale, swap to Upstash Redis adapter.
// ────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';

// ─── Types ──────────────────────────────────────────────────────────────────

interface RateLimitEntry {
  /** Timestamps of requests within the current window */
  timestamps: number[];
}

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of remaining requests in the current window */
  remaining: number;
  /** Unix timestamp (seconds) when the window resets */
  resetAt: number;
  /** The configured limit */
  limit: number;
}

// ─── Presets ────────────────────────────────────────────────────────────────

/** Rate limit presets matching TODO.md Section 14 requirements */
export const RATE_LIMIT_PRESETS = {
  /** 100 requests per minute — for GET / read endpoints */
  read: { limit: 100, windowMs: 60_000 } satisfies RateLimitConfig,
  /** 20 requests per minute — for POST/PUT/PATCH/DELETE write endpoints */
  write: { limit: 20, windowMs: 60_000 } satisfies RateLimitConfig,
  /** 5 requests per minute — for sensitive auth endpoints (login, register, password reset) */
  auth: { limit: 5, windowMs: 60_000 } satisfies RateLimitConfig,
} as const;

// ─── In-Memory Store ────────────────────────────────────────────────────────

const store = new Map<string, RateLimitEntry>();

/** Periodically prune expired entries to prevent memory leaks */
const CLEANUP_INTERVAL_MS = 5 * 60_000; // 5 minutes

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanupTimer() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      // Remove entries with no recent timestamps
      if (
        entry.timestamps.length === 0 ||
        entry.timestamps[entry.timestamps.length - 1] < now - 120_000
      ) {
        store.delete(key);
      }
    });
  }, CLEANUP_INTERVAL_MS);
  // Allow Node.js to exit even if the timer is still running
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

// ─── Core Rate Limit Check ─────────────────────────────────────────────────

/**
 * Check whether a given key (typically IP + route) is within the rate limit.
 */
function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  ensureCleanupTimer();

  const now = Date.now();
  const windowStart = now - config.windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  const resetAt = Math.ceil((now + config.windowMs) / 1000);

  if (entry.timestamps.length >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      limit: config.limit,
    };
  }

  // Record this request
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.limit - entry.timestamps.length,
    resetAt,
    limit: config.limit,
  };
}

// ─── IP Extraction ──────────────────────────────────────────────────────────

/**
 * Extract the client IP from the request.
 * Handles `x-forwarded-for` (Vercel, proxies) and `x-real-ip` headers.
 */
function getClientIp(request: Request): string {
  const forwarded = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim();
  if (forwarded) return forwarded;

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return '127.0.0.1';
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Apply rate limiting to an API route handler.
 *
 * Returns `null` if the request is within the limit, or a `NextResponse`
 * (429 Too Many Requests) if the limit has been exceeded.
 *
 * Usage:
 * ```ts
 * import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
 *
 * export async function GET(request: Request) {
 *   const rateLimitResponse = rateLimit(request, RATE_LIMIT_PRESETS.read);
 *   if (rateLimitResponse) return rateLimitResponse;
 *   // … handle request
 * }
 * ```
 */
export function rateLimit(
  request: Request,
  config: RateLimitConfig = RATE_LIMIT_PRESETS.read
): NextResponse | null {
  const ip = getClientIp(request);
  const url = new URL(request.url);
  const key = `${ip}:${url.pathname}`;

  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.resetAt),
          'Retry-After': String(Math.ceil(config.windowMs / 1000)),
        },
      }
    );
  }

  // We return null to signal "allowed" — the caller proceeds with the handler.
  // Rate limit headers are not added to successful responses to keep the API
  // simple; callers may add them if needed.
  return null;
}
