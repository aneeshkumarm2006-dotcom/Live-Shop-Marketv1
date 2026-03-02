import { z } from 'zod';

// ─── Platform URL Patterns ─────────────────────────────────────────────────

const YOUTUBE_PATTERN = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

const INSTAGRAM_PATTERN = /^https?:\/\/(www\.)?instagram\.com\/.+$/i;

const TIKTOK_PATTERN = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+$/i;

const FACEBOOK_PATTERN = /^https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/.+$/i;

// ─── URL Validators ────────────────────────────────────────────────────────

export const youtubeUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(YOUTUBE_PATTERN, 'Must be a valid YouTube URL');

export const instagramUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(INSTAGRAM_PATTERN, 'Must be a valid Instagram URL');

export const tiktokUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(TIKTOK_PATTERN, 'Must be a valid TikTok URL');

export const facebookUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(FACEBOOK_PATTERN, 'Must be a valid Facebook URL');

// ─── General external URL (for "other" platform) ───────────────────────────

export const externalUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(/^https?:\/\//, 'URL must start with http:// or https://');

// ─── Platform-aware URL validator ───────────────────────────────────────────

/**
 * Returns the appropriate Zod schema for a given platform.
 */
export function getUrlSchemaForPlatform(
  platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'other'
) {
  switch (platform) {
    case 'youtube':
      return youtubeUrlSchema;
    case 'instagram':
      return instagramUrlSchema;
    case 'tiktok':
      return tiktokUrlSchema;
    case 'facebook':
      return facebookUrlSchema;
    case 'other':
      return externalUrlSchema;
  }
}

// ─── Social Links Schema ───────────────────────────────────────────────────

export const socialLinksSchema = z
  .object({
    instagram: z
      .string()
      .url('Must be a valid URL')
      .regex(INSTAGRAM_PATTERN, 'Must be a valid Instagram URL')
      .nullish()
      .or(z.literal('')),
    tiktok: z
      .string()
      .url('Must be a valid URL')
      .regex(TIKTOK_PATTERN, 'Must be a valid TikTok URL')
      .nullish()
      .or(z.literal('')),
    youtube: z
      .string()
      .url('Must be a valid URL')
      .regex(YOUTUBE_PATTERN, 'Must be a valid YouTube URL')
      .nullish()
      .or(z.literal('')),
    facebook: z
      .string()
      .url('Must be a valid URL')
      .regex(FACEBOOK_PATTERN, 'Must be a valid Facebook URL')
      .nullish()
      .or(z.literal('')),
  })
  .partial();
