import { z } from 'zod';

// ─── Update User Profile ────────────────────────────────────────────────────

/**
 * Schema for PATCH /api/users/me — update the current user's profile.
 * All fields are optional; only supplied fields are updated.
 */
export const updateUserProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),

    image: z.string().url('Image must be a valid URL').nullable().optional(),

    notificationPreferences: z
      .object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        inApp: z.boolean().optional(),
      })
      .optional(),
  })
  .strict(); // reject unknown keys

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

// ─── Dashboard Query ────────────────────────────────────────────────────────

/**
 * Schema for GET /api/users/me/dashboard query params.
 */
export const dashboardQuerySchema = z.object({
  favoritesLimit: z.coerce.number().int().min(1).max(50).default(10),

  sessionsLimit: z.coerce.number().int().min(1).max(50).default(10),
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
