import { updateCreatorProfileSchema, createCreatorProfileSchema } from '@/lib/validators/creator';

const validObjectId = '507f1f77bcf86cd799439011';

// ─── createCreatorProfileSchema ─────────────────────────────────────────────

describe('createCreatorProfileSchema', () => {
  const valid = { displayName: 'Cool Creator' };

  it('accepts minimal valid input (displayName only)', () => {
    expect(createCreatorProfileSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts full input with all optional fields', () => {
    const result = createCreatorProfileSchema.safeParse({
      displayName: 'Cool Creator',
      bio: 'I love live shopping!',
      profileImage: 'https://img.example.com/pic.jpg',
      socialLinks: {
        instagram: 'https://www.instagram.com/cool',
        youtube: 'https://www.youtube.com/cool',
      },
      categories: [validObjectId],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty displayName', () => {
    expect(createCreatorProfileSchema.safeParse({ displayName: '' }).success).toBe(false);
  });

  it('rejects displayName over 100 characters', () => {
    expect(createCreatorProfileSchema.safeParse({ displayName: 'A'.repeat(101) }).success).toBe(
      false
    );
  });

  it('rejects bio over 500 characters', () => {
    expect(createCreatorProfileSchema.safeParse({ ...valid, bio: 'B'.repeat(501) }).success).toBe(
      false
    );
  });

  it('rejects invalid profileImage URL', () => {
    expect(
      createCreatorProfileSchema.safeParse({ ...valid, profileImage: 'not-a-url' }).success
    ).toBe(false);
  });

  it('rejects more than 10 categories', () => {
    const categories = Array.from({ length: 11 }, () => validObjectId);
    expect(createCreatorProfileSchema.safeParse({ ...valid, categories }).success).toBe(false);
  });

  it('rejects invalid ObjectId in categories', () => {
    expect(createCreatorProfileSchema.safeParse({ ...valid, categories: ['badid'] }).success).toBe(
      false
    );
  });

  it('rejects invalid social link URL', () => {
    expect(
      createCreatorProfileSchema.safeParse({
        ...valid,
        socialLinks: { instagram: 'https://www.youtube.com/notinstagram' },
      }).success
    ).toBe(false);
  });
});

// ─── updateCreatorProfileSchema ─────────────────────────────────────────────

describe('updateCreatorProfileSchema', () => {
  it('accepts empty object (no fields to update)', () => {
    expect(updateCreatorProfileSchema.safeParse({}).success).toBe(true);
  });

  it('accepts partial update (bio only)', () => {
    expect(updateCreatorProfileSchema.safeParse({ bio: 'Updated bio' }).success).toBe(true);
  });

  it('accepts null profileImage (to remove it)', () => {
    expect(updateCreatorProfileSchema.safeParse({ profileImage: null }).success).toBe(true);
  });

  it('rejects invalid social links', () => {
    expect(
      updateCreatorProfileSchema.safeParse({
        socialLinks: { tiktok: 'https://www.facebook.com/bad' },
      }).success
    ).toBe(false);
  });

  it('allows empty string social links (to clear)', () => {
    expect(
      updateCreatorProfileSchema.safeParse({
        socialLinks: { instagram: '' },
      }).success
    ).toBe(true);
  });
});
