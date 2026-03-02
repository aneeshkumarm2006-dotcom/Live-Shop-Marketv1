import { getServerSession as nextAuthGetServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: 'buyer' | 'creator';
  };
}

// ─── Get Server Session ────────────────────────────────────────────────────

/**
 * Retrieve the current authenticated session (or null).
 * Use this when you want to optionally read the session without blocking.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const session = await nextAuthGetServerSession(authOptions);
  return session as AuthSession | null;
}

// ─── Require Auth ──────────────────────────────────────────────────────────

/**
 * Require an authenticated user. Returns the session or a 401 JSON response.
 *
 * Usage in API routes:
 * ```ts
 * const authResult = await requireAuth();
 * if (authResult instanceof NextResponse) return authResult;
 * const { user } = authResult;
 * ```
 */
export async function requireAuth(): Promise<AuthSession | NextResponse> {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  return session;
}

// ─── Require Creator ───────────────────────────────────────────────────────

/**
 * Require an authenticated user with the "creator" role.
 * Returns the session or a 401/403 JSON response.
 *
 * Usage in API routes:
 * ```ts
 * const authResult = await requireCreator();
 * if (authResult instanceof NextResponse) return authResult;
 * const { user } = authResult;
 * ```
 */
export async function requireCreator(): Promise<AuthSession | NextResponse> {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (session.user.role !== 'creator') {
    return NextResponse.json({ error: 'Creator access required' }, { status: 403 });
  }

  return session;
}
