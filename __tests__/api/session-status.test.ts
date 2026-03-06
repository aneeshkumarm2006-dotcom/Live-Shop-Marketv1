/**
 * @jest-environment node
 */

/**
 * Unit tests for PATCH /api/sessions/[id]/status — state machine transitions
 */

import { NextResponse } from 'next/server';

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/LiveSession', () => ({
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

let _mockRequireCreator: jest.Mock;
jest.mock('@/lib/auth-helpers', () => ({
  requireCreator: (...args: unknown[]) => _mockRequireCreator(...args),
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { write: {} },
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeBody: jest.fn((b: unknown) => b),
}));

import { PATCH } from '@/app/api/sessions/[id]/status/route';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';

const mockFindById = LiveSession.findById as jest.Mock;
const mockFindByIdAndUpdate = LiveSession.findByIdAndUpdate as jest.Mock;
const mockCreatorFindOne = Creator.findOne as jest.Mock;
const mockRequireCreator = (_mockRequireCreator = jest.fn());

const validId = '507f1f77bcf86cd799439011';
const creatorObjectId = { equals: (other: unknown) => other === 'creator1' };

function makeReq(body: Record<string, unknown>) {
  return new Request('http://localhost:3000/api/sessions/test/status', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function setupAuth() {
  mockRequireCreator.mockResolvedValue({
    user: { id: 'u1', role: 'creator' },
  });
}

function setupSession(status: string) {
  mockFindById.mockReturnValue({
    lean: jest.fn().mockResolvedValue({
      _id: validId,
      creatorId: creatorObjectId,
      status,
    }),
  });
}

function setupCreator() {
  mockCreatorFindOne.mockReturnValue({
    lean: jest.fn().mockResolvedValue({ _id: 'creator1' }),
  });
}

function setupUpdateReturn() {
  mockFindByIdAndUpdate.mockReturnValue({
    populate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ _id: validId, status: 'live' }),
      }),
    }),
  });
}

describe('PATCH /api/sessions/[id]/status', () => {
  beforeEach(() => jest.clearAllMocks());

  // Helper to call the route
  async function callPatch(body: Record<string, unknown>) {
    return PATCH(makeReq(body), { params: Promise.resolve({ id: validId }) });
  }

  it('succeeds: scheduled → live', async () => {
    setupAuth();
    setupSession('scheduled');
    setupCreator();
    setupUpdateReturn();

    const res = await callPatch({ status: 'live' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('succeeds: scheduled → ended', async () => {
    setupAuth();
    setupSession('scheduled');
    setupCreator();
    setupUpdateReturn();

    const res = await callPatch({ status: 'ended' });
    expect(res.status).toBe(200);
  });

  it('succeeds: live → ended', async () => {
    setupAuth();
    setupSession('live');
    setupCreator();
    setupUpdateReturn();

    const res = await callPatch({ status: 'ended' });
    expect(res.status).toBe(200);
  });

  it('rejects invalid transition: ended → live', async () => {
    setupAuth();
    setupSession('ended');
    setupCreator();

    const res = await callPatch({ status: 'live' });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Invalid status transition');
  });

  it('rejects invalid transition: ended → scheduled', async () => {
    setupAuth();
    setupSession('ended');
    setupCreator();

    const res = await callPatch({ status: 'scheduled' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid transition: live → scheduled', async () => {
    setupAuth();
    setupSession('live');
    setupCreator();

    const res = await callPatch({ status: 'scheduled' });
    expect(res.status).toBe(400);
  });

  it('returns 401 if not authenticated', async () => {
    mockRequireCreator.mockResolvedValue(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    );

    const res = await callPatch({ status: 'live' });
    expect(res.status).toBe(401);
  });

  it('returns 404 if session not found', async () => {
    setupAuth();
    mockFindById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const res = await callPatch({ status: 'live' });
    expect(res.status).toBe(404);
  });

  it('returns 403 if not session owner', async () => {
    setupAuth();
    setupSession('scheduled');
    mockCreatorFindOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'different-creator' }),
    });

    const res = await callPatch({ status: 'live' });
    expect(res.status).toBe(403);
  });

  it('returns 400 on validation failure (invalid status value)', async () => {
    setupAuth();

    const res = await callPatch({ status: 'paused' });
    expect(res.status).toBe(400);
  });
});
