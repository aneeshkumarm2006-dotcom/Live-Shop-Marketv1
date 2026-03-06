/**
 * @jest-environment node
 */

/**
 * Unit tests for POST /api/auth/register
 *
 * Mocks: mongoose models, email service, rate limiter, sanitizer.
 * Tests: validation, duplicate email, successful buyer/creator registration, etc.
 */

import { NextRequest } from 'next/server';

// ── Mocks (inline jest.fn() — no outer const refs to avoid TDZ) ────────────

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/User', () => ({
  __esModule: true,
  default: { findOne: jest.fn(), create: jest.fn() },
}));

jest.mock('@/models/Creator', () => ({
  __esModule: true,
  default: { create: jest.fn() },
}));

jest.mock('@/lib/email', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { auth: {} },
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeBody: jest.fn((body: unknown) => body),
}));

import { POST } from '@/app/api/auth/register/route';
import User from '@/models/User';
import Creator from '@/models/Creator';

// Get mock references after import
const mockUserFindOne = User.findOne as jest.Mock;
const mockUserCreate = User.create as jest.Mock;
const mockCreatorCreate = Creator.create as jest.Mock;

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validBody = {
    name: 'Alice',
    email: 'alice@test.com',
    password: 'StrongPass1',
    role: 'buyer',
  };

  it('returns 201 on successful buyer registration', async () => {
    mockUserFindOne.mockResolvedValue(null);
    mockUserCreate.mockResolvedValue({
      _id: { toString: () => '123' },
      name: 'Alice',
      email: 'alice@test.com',
      role: 'buyer',
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.message).toBe('Account created successfully');
    expect(json.user.role).toBe('buyer');
    expect(mockCreatorCreate).not.toHaveBeenCalled();
  });

  it('creates Creator document for creator role', async () => {
    mockUserFindOne.mockResolvedValue(null);
    mockUserCreate.mockResolvedValue({
      _id: { toString: () => '456' },
      name: 'Bob',
      email: 'bob@test.com',
      role: 'creator',
    });
    mockCreatorCreate.mockResolvedValue({});

    const res = await POST(
      makeRequest({ ...validBody, name: 'Bob', email: 'bob@test.com', role: 'creator' })
    );
    expect(res.status).toBe(201);
    expect(mockCreatorCreate).toHaveBeenCalledWith({
      userId: { toString: expect.any(Function) },
      displayName: 'Bob',
    });
  });

  it('returns 400 on validation failure (empty name)', async () => {
    const res = await POST(makeRequest({ ...validBody, name: '' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
    expect(json.details).toBeDefined();
  });

  it('returns 400 on validation failure (weak password)', async () => {
    const res = await POST(makeRequest({ ...validBody, password: 'short' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 on validation failure (invalid email)', async () => {
    const res = await POST(makeRequest({ ...validBody, email: 'nope' }));
    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists', async () => {
    mockUserFindOne.mockResolvedValue({ _id: 'existing', email: 'alice@test.com' });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toContain('already exists');
  });

  it('returns 409 on duplicate key error (code 11000)', async () => {
    mockUserFindOne.mockResolvedValue(null);
    const dupError = Object.assign(new Error('duplicate key'), { code: 11000 });
    mockUserCreate.mockRejectedValue(dupError);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
  });

  it('returns 500 on unexpected error', async () => {
    mockUserFindOne.mockResolvedValue(null);
    mockUserCreate.mockRejectedValue(new Error('DB crash'));

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
