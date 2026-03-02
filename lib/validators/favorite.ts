import { z } from 'zod';

// ─── MongoDB ObjectId pattern ───────────────────────────────────────────────

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');

// ─── Toggle Favorite ────────────────────────────────────────────────────────

export const toggleFavoriteSchema = z.object({
  creatorId: objectIdSchema,
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;

// ─── Favorite Query Params ──────────────────────────────────────────────────

export const favoriteQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type FavoriteQueryInput = z.infer<typeof favoriteQuerySchema>;
