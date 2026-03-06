/**
 * @jest-environment node
 */

/**
 * Unit tests for GET/PATCH /api/users/me
 */

import { NextResponse } from 'next/server';

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/User', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock('@/models/Creator', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

let _mockRequireAuth: jest.Mock;
jest.mock('@/lib/auth-helpers', () => ({
  requireAuth: (...args: unknown[]) => _mockRequireAuth(...args),
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { read: {}, write: {} },
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeBody: jest.fn((b: unknown) => b),
}));

import { GET, PATCH } from '@/app/api/users/me/route';
import User from '@/models/User';
import Creator from '@/models/Creator';

const mockUserFindById = User.findById as jest.Mock;
const _mockUserFindByIdAndUpdate = User.findByIdAndUpdate as jest.Mock;
const mockCreatorFindOne = Creator.findOne as jest.Mock;
const mockRequireAuth = (_mockRequireAuth = jest.fn());

// ── Tests: GET /api/users/me ────────────────────────────────────────────────

describe('GET /api/users/me', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await GET(new Request('http://localhost:3000/api/users/me'));
    expect(res.status).toBe(401);
  });

  it('returns user profile for buyer', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: 'u1' } });

    const user = { _id: 'u1', name: 'Alice', email: 'alice@test.com', role: 'buyer' };
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(user),
      }),
    });

    const res = await GET(new Request('http://localhost:3000/api/users/me'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('Alice');
    expect(json.data.creatorProfile).toBeNull();
  });

  it('returns user profile with creator profile for creator', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: 'u2' } });

    const user = { _id: 'u2', name: 'Bob', email: 'bob@test.com', role: 'creator' };
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(user),
      }),
    });

    const creatorProfile = { _id: 'c1', displayName: 'Bob Creator', bio: 'Hi' };
    mockCreatorFindOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(creatorProfile),
        }),
      }),
    });

    const res = await GET(new Request('http://localhost:3000/api/users/me'));
    const json = await res.json();

    expect(json.data.creatorProfile).toBeTruthy();
    expect(json.data.creatorProfile.displayName).toBe('Bob Creator');
  });

  it('returns 404 if user not found in DB', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: 'u9' } });
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      }),
    });

    const res = await GET(new Request('http://localhost:3000/api/users/me'));
    expect(res.status).toBe(404);
  });
});

// ── Tests: PATCH /api/users/me ──────────────────────────────────────────────

describe('PATCH /api/users/me', () => {
  beforeEach(() => jest.clearAllMocks());

  function makeReq(body: Record<string, unknown>) {
    return new Request('http://localhost:3000/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('returns 401 if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await PATCH(makeReq({ name: 'New' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 on empty body', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: 'u1' } });

    const req = new Request('http://localhost:3000/api/users/me', {
      method: 'PATCH',
      body: '{}',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 on validation failure (unknown field)', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: 'u1' } });

    const res = await PATCH(makeReq({ name: 'OK', badField: 'x' }));
    expect(res.status).toBe(400);
  });
});
