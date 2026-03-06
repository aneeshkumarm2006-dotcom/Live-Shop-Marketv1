/**
 * Tests for lib/email.ts
 *
 * We mock the Resend SDK so tests run without a real API key.
 */

// ── Mock Resend before importing our module ────────────────────────────────

const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: (...args: unknown[]) => mockSend(...args) };
  },
}));

// We need to control env vars per test
const originalEnv = { ...process.env };

beforeEach(() => {
  mockSend.mockReset();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

import {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSessionReminderEmail,
} from '@/lib/email';

// ── sendEmail (core) ───────────────────────────────────────────────────────

describe('sendEmail', () => {
  it('returns dev-mode-skipped when RESEND_API_KEY is placeholder', async () => {
    process.env.RESEND_API_KEY = 'your-resend-api-key';

    const result = await sendEmail({ to: 'a@b.com', subject: 'Test', html: '<p>Hi</p>' });

    expect(result.success).toBe(true);
    expect(result.id).toBe('dev-mode-skipped');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns dev-mode-skipped when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;

    const result = await sendEmail({ to: 'a@b.com', subject: 'Test', html: '<p>Hi</p>' });

    expect(result.success).toBe(true);
    expect(result.id).toBe('dev-mode-skipped');
  });

  it('sends email via Resend when API key is configured', async () => {
    process.env.RESEND_API_KEY = 're_live_abc123';
    mockSend.mockResolvedValue({ data: { id: 'msg-001' }, error: null });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
      text: 'Hi',
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: 'Hello',
        html: '<p>Hi</p>',
        text: 'Hi',
      })
    );
    expect(result).toEqual({ success: true, id: 'msg-001' });
  });

  it('returns error when Resend API returns an error object', async () => {
    process.env.RESEND_API_KEY = 're_live_abc123';
    mockSend.mockResolvedValue({ data: null, error: { message: 'Invalid API key' } });

    const result = await sendEmail({ to: 'a@b.com', subject: 'X', html: '<p></p>' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid API key');
  });

  it('returns error when Resend SDK throws an exception', async () => {
    process.env.RESEND_API_KEY = 're_live_abc123';
    mockSend.mockRejectedValue(new Error('Network timeout'));

    const result = await sendEmail({ to: 'a@b.com', subject: 'X', html: '<p></p>' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network timeout');
  });
});

// ── sendWelcomeEmail ───────────────────────────────────────────────────────

describe('sendWelcomeEmail', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_live_abc123';
    process.env.NEXTAUTH_URL = 'https://liveshopmarket.com';
    mockSend.mockResolvedValue({ data: { id: 'welcome-001' }, error: null });
  });

  it('sends a welcome email for a buyer', async () => {
    const result = await sendWelcomeEmail({ to: 'buyer@test.com', name: 'Jane', role: 'buyer' });

    expect(result.success).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'buyer@test.com',
        subject: expect.stringContaining('Welcome'),
      })
    );
    // HTML should contain the dashboard link
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.html).toContain('/dashboard');
    expect(callArgs.html).toContain('Jane');
  });

  it('sends a welcome email for a creator with creator-specific text', async () => {
    const result = await sendWelcomeEmail({
      to: 'creator@test.com',
      name: 'Alex',
      role: 'creator',
    });

    expect(result.success).toBe(true);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.html).toContain('creator');
  });
});

// ── sendPasswordResetEmail ─────────────────────────────────────────────────

describe('sendPasswordResetEmail', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_live_abc123';
    mockSend.mockResolvedValue({ data: { id: 'reset-001' }, error: null });
  });

  it('sends a password reset email with the reset URL', async () => {
    const resetUrl = 'https://liveshopmarket.com/reset-password?token=abc';
    const result = await sendPasswordResetEmail({ to: 'user@test.com', resetUrl });

    expect(result.success).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@test.com',
        subject: expect.stringContaining('Password Reset'),
      })
    );
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.html).toContain(resetUrl);
    expect(callArgs.html).toContain('1 hour');
  });
});

// ── sendSessionReminderEmail (Phase 2 stub) ────────────────────────────────

describe('sendSessionReminderEmail', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_live_abc123';
    mockSend.mockResolvedValue({ data: { id: 'reminder-001' }, error: null });
  });

  it('sends a session reminder email', async () => {
    const result = await sendSessionReminderEmail({
      to: 'fan@test.com',
      creatorName: 'ShopWithSarah',
      sessionTitle: 'Summer Beauty Haul',
      startsAt: '3:00 PM EST',
      sessionUrl: 'https://liveshopmarket.com/sessions/123',
    });

    expect(result.success).toBe(true);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.html).toContain('ShopWithSarah');
    expect(callArgs.html).toContain('Summer Beauty Haul');
    expect(callArgs.subject).toContain('going live');
  });
});
