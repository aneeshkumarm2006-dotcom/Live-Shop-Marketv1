/**
 * @jest-environment node
 */

/**
 * Unit tests for POST /api/auth/forgot-password
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

jest.mock('@/lib/email', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { auth: {} },
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeBody: jest.fn((b: unknown) => b),
}));

import { POST } from '@/app/api/auth/forgot-password/route';
import User from '@/models/User';

const mockUserFindOne = User.findOne as jest.Mock;

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns success message even when user does not exist (prevents enumeration)', async () => {
    mockUserFindOne.mockResolvedValue(null);

    const res = await POST(makeRequest({ email: 'nobody@test.com' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toContain('password reset link');
  });

  it('returns success message when user exists', async () => {
    const mockUser = {
      email: 'alice@test.com',
      set: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };
    mockUserFindOne.mockResolvedValue(mockUser);

    const res = await POST(makeRequest({ email: 'alice@test.com' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toContain('password reset link');
    expect(mockUser.set).toHaveBeenCalledWith('passwordResetToken', expect.any(String));
    expect(mockUser.set).toHaveBeenCalledWith('passwordResetExpires', expect.any(Date));
  });

  it('returns 400 on validation failure (invalid email)', async () => {
    const res = await POST(makeRequest({ email: 'bad' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 on validation failure (empty email)', async () => {
    const res = await POST(makeRequest({ email: '' }));
    expect(res.status).toBe(400);
  });
});
