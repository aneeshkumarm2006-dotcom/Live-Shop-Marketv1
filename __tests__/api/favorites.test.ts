/**
 * @jest-environment node
 */

/**
 * Unit tests for GET/POST /api/favorites and DELETE /api/favorites/[creatorId]
 */

import { NextResponse } from 'next/server';
import 'mongoose';

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/Favorite', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

jest.mock('@/models/Creator', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock('@/models/LiveSession', () => ({
  __esModule: true,
  default: { aggregate: jest.fn().mockResolvedValue([]) },
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

import { GET, POST } from '@/app/api/favorites/route';
import { DELETE } from '@/app/api/favorites/[creatorId]/route';
import Favorite from '@/models/Favorite';
import Creator from '@/models/Creator';

const mockFavoriteFind = Favorite.find as jest.Mock;
const mockFavoriteCountDocuments = Favorite.countDocuments as jest.Mock;
const _mockFavoriteCreate = Favorite.create as jest.Mock;
const _mockFavoriteFindOne = Favorite.findOne as jest.Mock;
const mockFavoriteFindOneAndDelete = Favorite.findOneAndDelete as jest.Mock;
const _mockCreatorFindById = Creator.findById as jest.Mock;
const mockCreatorFindByIdAndUpdate = Creator.findByIdAndUpdate as jest.Mock;
const mockCreatorUpdateOne = Creator.updateOne as jest.Mock;
const mockRequireAuth = (_mockRequireAuth = jest.fn());

const validCreatorId = '507f1f77bcf86cd799439011';
const validUserId = '507f1f77bcf86cd799439022';

// ── Tests: GET /api/favorites ───────────────────────────────────────────────

describe('GET /api/favorites', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await GET(new Request('http://localhost:3000/api/favorites'));
    expect(res.status).toBe(401);
  });

  it('returns paginated favorites', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: validUserId } });

    const chain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    };
    mockFavoriteFind.mockReturnValue(chain);
    mockFavoriteCountDocuments.mockResolvedValue(0);

    const res = await GET(new Request('http://localhost:3000/api/favorites'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.pagination).toBeDefined();
  });
});

// ── Tests: POST /api/favorites ──────────────────────────────────────────────

describe('POST /api/favorites', () => {
  beforeEach(() => jest.clearAllMocks());

  function makeReq(body: Record<string, unknown>) {
    return new Request('http://localhost:3000/api/favorites', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('returns 401 if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await POST(makeReq({ creatorId: validCreatorId }));
    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid creatorId', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: validUserId } });

    const res = await POST(makeReq({ creatorId: 'nope' }));
    expect(res.status).toBe(400);
  });
});

// ── Tests: DELETE /api/favorites/[creatorId] ────────────────────────────────

describe('DELETE /api/favorites/[creatorId]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await DELETE(
      new Request('http://localhost:3000/api/favorites/' + validCreatorId, { method: 'DELETE' }),
      { params: { creatorId: validCreatorId } }
    );
    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid ObjectId', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: validUserId } });

    const res = await DELETE(
      new Request('http://localhost:3000/api/favorites/badid', { method: 'DELETE' }),
      { params: { creatorId: 'badid' } }
    );
    expect(res.status).toBe(400);
  });

  it('returns 404 if favorite not found', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: validUserId } });
    mockFavoriteFindOneAndDelete.mockResolvedValue(null);

    const res = await DELETE(
      new Request('http://localhost:3000/api/favorites/' + validCreatorId, { method: 'DELETE' }),
      { params: { creatorId: validCreatorId } }
    );
    expect(res.status).toBe(404);
  });

  it('returns 200 on successful delete', async () => {
    mockRequireAuth.mockResolvedValue({ user: { id: validUserId } });
    mockFavoriteFindOneAndDelete.mockResolvedValue({ _id: 'fav1' });
    mockCreatorFindByIdAndUpdate.mockResolvedValue({});
    mockCreatorUpdateOne.mockResolvedValue({});

    const res = await DELETE(
      new Request('http://localhost:3000/api/favorites/' + validCreatorId, { method: 'DELETE' }),
      { params: { creatorId: validCreatorId } }
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
