import { z } from 'zod';
import { externalUrlSchema, getUrlSchemaForPlatform } from './url';

// ─── Platform & Status Enums ────────────────────────────────────────────────

const platformEnum = z.enum(
  ['youtube', 'instagram', 'tiktok', 'facebook', 'other'],
  'Platform must be youtube, instagram, tiktok, facebook, or other'
);

const sessionStatusEnum = z.enum(
  ['scheduled', 'live', 'ended'],
  'Status must be scheduled, live, or ended'
);

// ─── MongoDB ObjectId pattern ───────────────────────────────────────────────

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');

// ─── Create Session ─────────────────────────────────────────────────────────

export const createSessionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Session title is required')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z.string().max(2000, 'Description cannot exceed 2000 characters').nullish(),
    externalUrl: externalUrlSchema,
    platform: platformEnum,
    thumbnailUrl: z.string().url('Thumbnail must be a valid URL').nullish(),
    categoryId: objectIdSchema,
    status: sessionStatusEnum.default('scheduled'),
    scheduledAt: z.coerce.date().nullish(),
  })
  .refine(
    (data) => {
      // If status is "scheduled", scheduledAt must be provided
      if (data.status === 'scheduled' && !data.scheduledAt) {
        return false;
      }
      return true;
    },
    {
      message: "Scheduled date is required when status is 'scheduled'",
      path: ['scheduledAt'],
    }
  )
  .refine(
    (data) => {
      // Validate externalUrl matches the selected platform
      if (data.platform === 'other') return true;
      const urlSchema = getUrlSchemaForPlatform(data.platform);
      return urlSchema.safeParse(data.externalUrl).success;
    },
    {
      message: 'External URL must match the selected platform',
      path: ['externalUrl'],
    }
  );

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// ─── Update Session ─────────────────────────────────────────────────────────

export const updateSessionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Session title is required')
      .max(200, 'Title cannot exceed 200 characters')
      .optional(),
    description: z.string().max(2000, 'Description cannot exceed 2000 characters').nullish(),
    externalUrl: externalUrlSchema.optional(),
    platform: platformEnum.optional(),
    thumbnailUrl: z.string().url('Thumbnail must be a valid URL').nullish(),
    categoryId: objectIdSchema.optional(),
    status: sessionStatusEnum.optional(),
    scheduledAt: z.coerce.date().nullish(),
  })
  .refine(
    (data) => {
      // If platform and externalUrl are both provided, validate match
      if (data.platform && data.externalUrl && data.platform !== 'other') {
        const urlSchema = getUrlSchemaForPlatform(data.platform);
        return urlSchema.safeParse(data.externalUrl).success;
      }
      return true;
    },
    {
      message: 'External URL must match the selected platform',
      path: ['externalUrl'],
    }
  );

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

// ─── Schedule Session ───────────────────────────────────────────────────────

export const scheduleSessionSchema = z.object({
  scheduledAt: z.coerce
    .date('Scheduled date is required')
    .refine((date) => date > new Date(), 'Scheduled date must be in the future'),
});

export type ScheduleSessionInput = z.infer<typeof scheduleSessionSchema>;

// ─── Update Session Status ──────────────────────────────────────────────────

export const updateSessionStatusSchema = z.object({
  status: sessionStatusEnum,
});

export type UpdateSessionStatusInput = z.infer<typeof updateSessionStatusSchema>;

// ─── Session Query Params ───────────────────────────────────────────────────

export const sessionQuerySchema = z.object({
  status: sessionStatusEnum.optional(),
  platform: platformEnum.optional(),
  categoryId: objectIdSchema.optional(),
  creatorId: objectIdSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['scheduledAt', 'createdAt', 'startedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SessionQueryInput = z.infer<typeof sessionQuerySchema>;
