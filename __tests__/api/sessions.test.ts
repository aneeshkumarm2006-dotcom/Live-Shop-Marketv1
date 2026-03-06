/**
 * @jest-environment node
 */

/**
 * Unit tests for GET/POST /api/sessions and GET/PATCH/DELETE /api/sessions/[id]
 * and PATCH /api/sessions/[id]/status
 */

import { NextResponse } from 'next/server';
import 'mongoose';

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/LiveSession', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/models/Creator', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock('@/models/Category', () => ({
  __esModule: true,
  default: { findById: jest.fn() },
}));

// Auth helpers — wrap in lazy arrow to avoid TDZ
let _mockRequireCreator: jest.Mock;
jest.mock('@/lib/auth-helpers', () => ({
  requireCreator: (...args: unknown[]) => _mockRequireCreator(...args),
  requireAuth: jest.fn(),
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { read: {}, write: {} },
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeBody: jest.fn((b: unknown) => b),
}));

import { GET, POST } from '@/app/api/sessions/route';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';
import Category from '@/models/Category';

const mockFind = LiveSession.find as jest.Mock;
const mockFindById = LiveSession.findById as jest.Mock;
const mockCountDocuments = LiveSession.countDocuments as jest.Mock;
const mockLiveSessionCreate = LiveSession.create as jest.Mock;
const mockCreatorFindOne = Creator.findOne as jest.Mock;
const mockCategoryFindById = Category.findById as jest.Mock;
const mockRequireCreator = (_mockRequireCreator = jest.fn());

// ── Helpers ─────────────────────────────────────────────────────────────────

const validObjectId = '507f1f77bcf86cd799439011';

function chain(
  value: unknown,
  methods: string[] = ['sort', 'skip', 'limit', 'populate', 'lean']
): Record<string, jest.Mock> {
  const obj: Record<string, jest.Mock> = {};
  for (const m of methods) {
    obj[m] = jest.fn().mockReturnValue(obj);
  }
  obj['lean'] = jest.fn().mockResolvedValue(value);
  return obj;
}

// ── Tests: GET /api/sessions ────────────────────────────────────────────────

describe('GET /api/sessions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns paginated sessions', async () => {
    const sessions = [{ _id: '1', title: 'Test' }];
    const c = chain(sessions);
    mockFind.mockReturnValue(c);
    mockCountDocuments.mockResolvedValue(1);

    const res = await GET(new Request('http://localhost:3000/api/sessions'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.pagination.total).toBe(1);
  });

  it('passes filters to find()', async () => {
    const c = chain([]);
    mockFind.mockReturnValue(c);
    mockCountDocuments.mockResolvedValue(0);

    await GET(new Request('http://localhost:3000/api/sessions?status=live&platform=youtube'));

    // The filter should have status and platform
    const filter = mockFind.mock.calls[0][0];
    expect(filter.status).toBe('live');
    expect(filter.platform).toBe('youtube');
  });

  it('returns 400 on invalid query params', async () => {
    const res = await GET(new Request('http://localhost:3000/api/sessions?page=-1'));
    expect(res.status).toBe(400);
  });

  it('returns 500 on DB error', async () => {
    mockFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('DB')),
              }),
            }),
          }),
        }),
      }),
    });
    mockCountDocuments.mockRejectedValue(new Error('DB'));

    const res = await GET(new Request('http://localhost:3000/api/sessions'));
    expect(res.status).toBe(500);
  });
});

// ── Tests: POST /api/sessions ───────────────────────────────────────────────

describe('POST /api/sessions', () => {
  beforeEach(() => jest.clearAllMocks());

  const futureDate = new Date(Date.now() + 86400000).toISOString();

  const validBody = {
    title: 'Live Stream',
    externalUrl: 'https://www.youtube.com/live/abc',
    platform: 'youtube',
    categoryId: validObjectId,
    status: 'scheduled',
    scheduledAt: futureDate,
  };

  function makeReq(body: Record<string, unknown>) {
    return new Request('http://localhost:3000/api/sessions', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('returns 401 if not authenticated', async () => {
    mockRequireCreator.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(401);
  });

  it('returns 403 if user is not a creator', async () => {
    mockRequireCreator.mockResolvedValue(
      NextResponse.json({ error: 'Creator access required' }, { status: 403 })
    );

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(403);
  });

  it('returns 400 on validation failure', async () => {
    mockRequireCreator.mockResolvedValue({
      user: { id: 'u1', role: 'creator' },
    });

    const res = await POST(makeReq({ title: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 if category not found', async () => {
    mockRequireCreator.mockResolvedValue({
      user: { id: 'u1', role: 'creator' },
    });
    mockCategoryFindById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(404);
  });

  it('returns 404 if creator profile not found', async () => {
    mockRequireCreator.mockResolvedValue({
      user: { id: 'u1', role: 'creator' },
    });
    mockCategoryFindById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: validObjectId }),
    });
    mockCreatorFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(404);
  });

  it('returns 201 on successful creation', async () => {
    mockRequireCreator.mockResolvedValue({
      user: { id: 'u1', role: 'creator' },
    });
    mockCategoryFindById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: validObjectId }),
    });
    mockCreatorFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'creator1' }),
    });
    mockLiveSessionCreate.mockResolvedValue({ _id: 'session1' });
    mockFindById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({ _id: 'session1', title: 'Live Stream' }),
        }),
      }),
    });

    const res = await POST(makeReq(validBody));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.title).toBe('Live Stream');
  });
});
