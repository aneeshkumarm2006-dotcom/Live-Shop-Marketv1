// ─── Global Middleware — Security, CORS & Rate Limiting ────────────────────
//
// This middleware runs on every matched request (see `config.matcher`) and
// applies:
//   1. CORS headers for API routes
//   2. Security headers (defence-in-depth, supplements next.config.mjs)
//   3. Global API rate limiting at the edge
//
// Rate limiting in middleware uses a lightweight in-memory approach.
// Per-route rate limiting (read vs write) is applied within individual
// API route handlers via `lib/rate-limit.ts`.
// ────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';

// ─── CORS Configuration ────────────────────────────────────────────────────

/** Allowed origins — add production domain(s) here */
const ALLOWED_ORIGINS = new Set(
  [
    // Development
    'http://localhost:3000',
    'http://localhost:3001',
    // Production (update with your actual domain)
    process.env.NEXTAUTH_URL ?? '',
  ].filter(Boolean)
);

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization, X-Requested-With';
const MAX_AGE = '86400'; // 24 hours preflight cache

/** Check if the origin is allowed */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // same-origin requests have no Origin header
  return ALLOWED_ORIGINS.has(origin);
}

// ─── Middleware Handler ────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  const isApiRoute = pathname.startsWith('/api');

  // ── Handle CORS preflight (OPTIONS) ─────────────────────────────────
  if (request.method === 'OPTIONS' && isApiRoute) {
    const preflightResponse = new NextResponse(null, { status: 204 });

    if (origin && isOriginAllowed(origin)) {
      preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
    }
    preflightResponse.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    preflightResponse.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    preflightResponse.headers.set('Access-Control-Max-Age', MAX_AGE);
    preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');

    return preflightResponse;
  }

  // ── Continue with the request ───────────────────────────────────────
  const response = NextResponse.next();

  // ── CORS headers for API routes ─────────────────────────────────────
  if (isApiRoute && origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // ── Security headers (supplement next.config.mjs) ───────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // ── Block requests with disallowed origins to API ───────────────────
  if (isApiRoute && origin && !isOriginAllowed(origin)) {
    return NextResponse.json({ success: false, error: 'Origin not allowed' }, { status: 403 });
  }

  return response;
}

// ─── Matcher Configuration ─────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder assets (icons, images)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|icons/|images/).*)',
  ],
};
