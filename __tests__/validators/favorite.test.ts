import { toggleFavoriteSchema, favoriteQuerySchema } from '@/lib/validators/favorite';

const validObjectId = '507f1f77bcf86cd799439011';

// ─── toggleFavoriteSchema ───────────────────────────────────────────────────

describe('toggleFavoriteSchema', () => {
  it('accepts a valid ObjectId', () => {
    expect(toggleFavoriteSchema.safeParse({ creatorId: validObjectId }).success).toBe(true);
  });

  it('rejects invalid ObjectId', () => {
    expect(toggleFavoriteSchema.safeParse({ creatorId: 'abc' }).success).toBe(false);
  });

  it('rejects missing creatorId', () => {
    expect(toggleFavoriteSchema.safeParse({}).success).toBe(false);
  });
});

// ─── favoriteQuerySchema ────────────────────────────────────────────────────

describe('favoriteQuerySchema', () => {
  it('applies defaults when empty', () => {
    const result = favoriteQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it('coerces string values', () => {
    const result = favoriteQuerySchema.safeParse({ page: '2', limit: '50' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(50);
    }
  });

  it('rejects limit over 100', () => {
    expect(favoriteQuerySchema.safeParse({ limit: '101' }).success).toBe(false);
  });

  it('rejects page <= 0', () => {
    expect(favoriteQuerySchema.safeParse({ page: '0' }).success).toBe(false);
  });
});
