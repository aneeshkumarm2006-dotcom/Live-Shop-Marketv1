/**
 * @jest-environment node
 */

/**
 * Unit tests for POST /api/auth/reset-password
 */

import { NextRequest } from 'next/server';

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/User', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { auth: {} },
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeBody: jest.fn((b: unknown) => b),
}));

import { POST } from '@/app/api/auth/reset-password/route';
import User from '@/models/User';

const mockUserFindOne = User.findOne as jest.Mock;

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => jest.clearAllMocks());

  const validBody = {
    token: 'abcdef123456',
    password: 'NewPass99',
    confirmPassword: 'NewPass99',
  };

  it('returns success on valid reset', async () => {
    const mockUser = {
      password: 'old',
      set: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toContain('reset successfully');
    expect(mockUser.password).toBe('NewPass99');
  });

  it('returns 400 for invalid/expired token', async () => {
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Invalid or expired');
  });

  it('returns 400 on validation failure (mismatched passwords)', async () => {
    const res = await POST(makeRequest({ ...validBody, confirmPassword: 'WrongConfirm1' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 on validation failure (weak password)', async () => {
    const res = await POST(
      makeRequest({ ...validBody, password: 'weak', confirmPassword: 'weak' })
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 on validation failure (empty token)', async () => {
    const res = await POST(makeRequest({ ...validBody, token: '' }));
    expect(res.status).toBe(400);
  });
});
