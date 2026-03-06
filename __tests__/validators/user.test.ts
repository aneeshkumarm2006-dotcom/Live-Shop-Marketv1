import { updateUserProfileSchema, dashboardQuerySchema } from '@/lib/validators/user';

// ─── updateUserProfileSchema ────────────────────────────────────────────────

describe('updateUserProfileSchema', () => {
  it('accepts valid partial update (name)', () => {
    expect(updateUserProfileSchema.safeParse({ name: 'New Name' }).success).toBe(true);
  });

  it('accepts empty object', () => {
    expect(updateUserProfileSchema.safeParse({}).success).toBe(true);
  });

  it('accepts valid image URL', () => {
    expect(
      updateUserProfileSchema.safeParse({ image: 'https://img.example.com/pic.jpg' }).success
    ).toBe(true);
  });

  it('accepts null image (to remove)', () => {
    expect(updateUserProfileSchema.safeParse({ image: null }).success).toBe(true);
  });

  it('rejects invalid image URL', () => {
    expect(updateUserProfileSchema.safeParse({ image: 'not-a-url' }).success).toBe(false);
  });

  it('rejects name exceeding 100 characters', () => {
    expect(updateUserProfileSchema.safeParse({ name: 'A'.repeat(101) }).success).toBe(false);
  });

  it('rejects empty name (after trim)', () => {
    expect(updateUserProfileSchema.safeParse({ name: '   ' }).success).toBe(false);
  });

  it('accepts notification preferences partial update', () => {
    expect(
      updateUserProfileSchema.safeParse({
        notificationPreferences: { email: true },
      }).success
    ).toBe(true);
  });

  it('accepts full notification preferences', () => {
    expect(
      updateUserProfileSchema.safeParse({
        notificationPreferences: { email: true, push: false, inApp: true },
      }).success
    ).toBe(true);
  });

  it('rejects unknown fields (strict mode)', () => {
    expect(updateUserProfileSchema.safeParse({ name: 'OK', unknownField: 'bad' }).success).toBe(
      false
    );
  });
});

// ─── dashboardQuerySchema ───────────────────────────────────────────────────

describe('dashboardQuerySchema', () => {
  it('applies defaults when empty', () => {
    const result = dashboardQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.favoritesLimit).toBe(10);
      expect(result.data.sessionsLimit).toBe(10);
    }
  });

  it('coerces string values', () => {
    const result = dashboardQuerySchema.safeParse({
      favoritesLimit: '5',
      sessionsLimit: '15',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.favoritesLimit).toBe(5);
      expect(result.data.sessionsLimit).toBe(15);
    }
  });

  it('rejects favoritesLimit > 50', () => {
    expect(dashboardQuerySchema.safeParse({ favoritesLimit: '51' }).success).toBe(false);
  });

  it('rejects sessionsLimit < 1', () => {
    expect(dashboardQuerySchema.safeParse({ sessionsLimit: '0' }).success).toBe(false);
  });
});
