import {
  createSessionSchema,
  updateSessionSchema,
  scheduleSessionSchema,
  updateSessionStatusSchema,
  sessionQuerySchema,
} from '@/lib/validators/session';

// ─── createSessionSchema ────────────────────────────────────────────────────

describe('createSessionSchema', () => {
  const validObjectId = '507f1f77bcf86cd799439011';
  const futureDate = new Date(Date.now() + 86400000).toISOString(); // tomorrow

  const valid = {
    title: 'Live Tech Unboxing',
    externalUrl: 'https://www.youtube.com/live/abc123',
    platform: 'youtube' as const,
    categoryId: validObjectId,
    status: 'scheduled' as const,
    scheduledAt: futureDate,
  };

  it('accepts a valid session', () => {
    expect(createSessionSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts session with all optional fields', () => {
    const full = {
      ...valid,
      description: 'Check out the latest gadgets!',
      thumbnailUrl: 'https://img.example.com/thumb.jpg',
    };
    expect(createSessionSchema.safeParse(full).success).toBe(true);
  });

  it('defaults status to "scheduled"', () => {
    const { status: _status, ...noStatus } = valid;
    const result = createSessionSchema.safeParse(noStatus);
    // Without status it defaults to 'scheduled', but needs scheduledAt
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('scheduled');
    }
  });

  it('rejects empty title', () => {
    expect(createSessionSchema.safeParse({ ...valid, title: '' }).success).toBe(false);
  });

  it('rejects title exceeding 200 characters', () => {
    expect(createSessionSchema.safeParse({ ...valid, title: 'A'.repeat(201) }).success).toBe(false);
  });

  it('rejects description exceeding 2000 characters', () => {
    expect(createSessionSchema.safeParse({ ...valid, description: 'A'.repeat(2001) }).success).toBe(
      false
    );
  });

  it('rejects invalid external URL', () => {
    expect(createSessionSchema.safeParse({ ...valid, externalUrl: 'not-a-url' }).success).toBe(
      false
    );
  });

  it('rejects invalid platform enum', () => {
    expect(createSessionSchema.safeParse({ ...valid, platform: 'twitch' }).success).toBe(false);
  });

  it('rejects invalid categoryId (not ObjectId)', () => {
    expect(createSessionSchema.safeParse({ ...valid, categoryId: 'nope' }).success).toBe(false);
  });

  it('requires scheduledAt when status is "scheduled"', () => {
    const result = createSessionSchema.safeParse({ ...valid, scheduledAt: null });
    expect(result.success).toBe(false);
  });

  it('does not require scheduledAt when status is "live"', () => {
    const result = createSessionSchema.safeParse({
      ...valid,
      status: 'live',
      scheduledAt: null,
      externalUrl: 'https://www.youtube.com/live/xyz',
    });
    expect(result.success).toBe(true);
  });

  it('rejects YouTube platform with Instagram URL', () => {
    const result = createSessionSchema.safeParse({
      ...valid,
      platform: 'youtube',
      externalUrl: 'https://www.instagram.com/live/abc',
    });
    expect(result.success).toBe(false);
  });

  it('accepts "other" platform with any HTTPS URL', () => {
    const result = createSessionSchema.safeParse({
      ...valid,
      platform: 'other',
      externalUrl: 'https://mysite.com/live',
    });
    expect(result.success).toBe(true);
  });

  it('accepts Instagram platform with Instagram URL', () => {
    const result = createSessionSchema.safeParse({
      ...valid,
      platform: 'instagram',
      externalUrl: 'https://www.instagram.com/creator/live',
      status: 'live',
      scheduledAt: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts TikTok platform with TikTok URL', () => {
    const result = createSessionSchema.safeParse({
      ...valid,
      platform: 'tiktok',
      externalUrl: 'https://www.tiktok.com/@user/live',
      status: 'live',
      scheduledAt: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts Facebook platform with Facebook URL', () => {
    const result = createSessionSchema.safeParse({
      ...valid,
      platform: 'facebook',
      externalUrl: 'https://www.facebook.com/user/videos/123',
      status: 'live',
      scheduledAt: null,
    });
    expect(result.success).toBe(true);
  });
});

// ─── updateSessionSchema ────────────────────────────────────────────────────

describe('updateSessionSchema', () => {
  it('accepts partial update (title only)', () => {
    const result = updateSessionSchema.safeParse({ title: 'Updated Title' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object (no fields to update)', () => {
    const result = updateSessionSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects mismatched platform+URL combo', () => {
    const result = updateSessionSchema.safeParse({
      platform: 'youtube',
      externalUrl: 'https://www.instagram.com/foo',
    });
    expect(result.success).toBe(false);
  });

  it('allows valid platform+URL combo', () => {
    const result = updateSessionSchema.safeParse({
      platform: 'youtube',
      externalUrl: 'https://www.youtube.com/watch?v=abc',
    });
    expect(result.success).toBe(true);
  });

  it('allows URL without platform (skips cross-validation)', () => {
    const result = updateSessionSchema.safeParse({
      externalUrl: 'https://www.instagram.com/foo',
    });
    expect(result.success).toBe(true);
  });
});

// ─── scheduleSessionSchema ──────────────────────────────────────────────────

describe('scheduleSessionSchema', () => {
  it('accepts a future date', () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(scheduleSessionSchema.safeParse({ scheduledAt: future }).success).toBe(true);
  });

  it('rejects a past date', () => {
    const past = new Date('2020-01-01').toISOString();
    expect(scheduleSessionSchema.safeParse({ scheduledAt: past }).success).toBe(false);
  });

  it('rejects missing scheduledAt', () => {
    expect(scheduleSessionSchema.safeParse({}).success).toBe(false);
  });
});

// ─── updateSessionStatusSchema ──────────────────────────────────────────────

describe('updateSessionStatusSchema', () => {
  it.each(['scheduled', 'live', 'ended'] as const)('accepts status "%s"', (status) => {
    expect(updateSessionStatusSchema.safeParse({ status }).success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(updateSessionStatusSchema.safeParse({ status: 'paused' }).success).toBe(false);
  });

  it('rejects missing status', () => {
    expect(updateSessionStatusSchema.safeParse({}).success).toBe(false);
  });
});

// ─── sessionQuerySchema ─────────────────────────────────────────────────────

describe('sessionQuerySchema', () => {
  it('applies defaults when empty', () => {
    const result = sessionQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortBy).toBe('createdAt');
      expect(result.data.sortOrder).toBe('desc');
    }
  });

  it('coerces string page/limit to numbers', () => {
    const result = sessionQuerySchema.safeParse({ page: '3', limit: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(10);
    }
  });

  it('rejects page <= 0', () => {
    expect(sessionQuerySchema.safeParse({ page: '0' }).success).toBe(false);
    expect(sessionQuerySchema.safeParse({ page: '-1' }).success).toBe(false);
  });

  it('rejects limit > 100', () => {
    expect(sessionQuerySchema.safeParse({ limit: '101' }).success).toBe(false);
  });

  it('rejects limit < 1', () => {
    expect(sessionQuerySchema.safeParse({ limit: '0' }).success).toBe(false);
  });

  it('accepts all optional filters', () => {
    const result = sessionQuerySchema.safeParse({
      status: 'live',
      platform: 'youtube',
      categoryId: '507f1f77bcf86cd799439011',
      creatorId: '507f1f77bcf86cd799439012',
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid sortBy', () => {
    expect(sessionQuerySchema.safeParse({ sortBy: 'random' }).success).toBe(false);
  });

  it('rejects invalid sortOrder', () => {
    expect(sessionQuerySchema.safeParse({ sortOrder: 'up' }).success).toBe(false);
  });
});
