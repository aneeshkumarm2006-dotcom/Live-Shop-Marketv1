import { z } from 'zod';
import { socialLinksSchema } from './url';

// ─── MongoDB ObjectId pattern ───────────────────────────────────────────────

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');

// ─── Update Creator Profile ─────────────────────────────────────────────────

export const updateCreatorProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(100, 'Display name cannot exceed 100 characters')
    .optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').nullish(),
  profileImage: z.string().url('Profile image must be a valid URL').nullish(),
  socialLinks: socialLinksSchema.optional(),
  categories: z.array(objectIdSchema).max(10, 'Cannot select more than 10 categories').optional(),
});

export type UpdateCreatorProfileInput = z.infer<typeof updateCreatorProfileSchema>;

// ─── Create Creator Profile (during registration) ──────────────────────────

export const createCreatorProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(100, 'Display name cannot exceed 100 characters'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').nullish(),
  profileImage: z.string().url('Profile image must be a valid URL').nullish(),
  socialLinks: socialLinksSchema.optional(),
  categories: z.array(objectIdSchema).max(10, 'Cannot select more than 10 categories').optional(),
});

export type CreateCreatorProfileInput = z.infer<typeof createCreatorProfileSchema>;
