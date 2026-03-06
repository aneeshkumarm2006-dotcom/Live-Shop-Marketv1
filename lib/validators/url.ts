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

// ─── Platform Detection ────────────────────────────────────────────────────

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'other';

/**
 * Detect the platform from a URL string.
 * Returns 'other' for unrecognised domains.
 */
export function detectPlatform(url: string): Platform {
  if (YOUTUBE_PATTERN.test(url)) return 'youtube';
  if (INSTAGRAM_PATTERN.test(url)) return 'instagram';
  if (TIKTOK_PATTERN.test(url)) return 'tiktok';
  if (FACEBOOK_PATTERN.test(url)) return 'facebook';
  return 'other';
}

// ─── Live Stream URL Patterns ──────────────────────────────────────────────

const YOUTUBE_LIVE_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/live|youtube\.com\/watch\?v=|youtu\.be\/)/i;
const INSTAGRAM_LIVE_PATTERN = /^https?:\/\/(www\.)?instagram\.com\/[^/]+\/live/i;
const TIKTOK_LIVE_PATTERN = /^https?:\/\/(www\.)?(tiktok\.com\/@[^/]+\/live|vm\.tiktok\.com)/i;
const FACEBOOK_LIVE_PATTERN = /^https?:\/\/(www\.)?(facebook\.com\/.+\/videos|fb\.watch)/i;

/**
 * Validate whether a URL looks like a live stream link for the given platform.
 * This performs a best-effort check — platform APIs should be used for
 * definitive live status verification.
 */
export function isLikelyLiveStreamUrl(url: string): boolean {
  return (
    YOUTUBE_LIVE_PATTERN.test(url) ||
    INSTAGRAM_LIVE_PATTERN.test(url) ||
    TIKTOK_LIVE_PATTERN.test(url) ||
    FACEBOOK_LIVE_PATTERN.test(url)
  );
}

// ─── URL Sanitisation ──────────────────────────────────────────────────────

/**
 * Sanitise a user-supplied URL:
 * - Trim whitespace
 * - Add https:// if missing scheme
 * - Reject javascript: and data: URIs
 *
 * Returns the sanitised URL or null if invalid.
 */
export function sanitizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Block dangerous schemes
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;

  // Prefix with https:// when the user omits the scheme
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    new URL(withScheme); // validates structure
    return withScheme;
  } catch {
    return null;
  }
}

// ─── Zod Schema for Live Session External URL ──────────────────────────────

export const liveStreamUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(/^https?:\/\//, 'URL must start with http:// or https://')
  .refine(
    (url) => {
      // Must belong to a known streaming platform OR be a generic https URL
      return (
        YOUTUBE_PATTERN.test(url) ||
        INSTAGRAM_PATTERN.test(url) ||
        TIKTOK_PATTERN.test(url) ||
        FACEBOOK_PATTERN.test(url) ||
        /^https:\/\//.test(url)
      );
    },
    { message: 'URL must be from a supported platform or use HTTPS' }
  );
