import { v2 as cloudinary } from 'cloudinary';

// ─── Cloudinary Configuration ──────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Upload Presets / Folders ──────────────────────────────────────────────

export const CLOUDINARY_FOLDERS = {
  profileImages: 'liveshopmarket/profiles',
  sessionThumbnails: 'liveshopmarket/sessions',
  brandBanners: 'liveshopmarket/banners',
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

// ─── Transformation Presets ────────────────────────────────────────────────

export const TRANSFORMATIONS = {
  /** Profile avatar: 256×256, face-cropped, webp */
  profileAvatar: {
    width: 256,
    height: 256,
    crop: 'fill' as const,
    gravity: 'face' as const,
    format: 'webp' as const,
    quality: 'auto' as const,
  },
  /** Session thumbnail: 640×360 (16:9), webp */
  sessionThumbnail: {
    width: 640,
    height: 360,
    crop: 'fill' as const,
    format: 'webp' as const,
    quality: 'auto' as const,
  },
  /** Brand banner: 1200×400, webp */
  brandBanner: {
    width: 1200,
    height: 400,
    crop: 'fill' as const,
    format: 'webp' as const,
    quality: 'auto' as const,
  },
} as const;

// ─── Upload Result Type ────────────────────────────────────────────────────

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// ─── Upload Helper ─────────────────────────────────────────────────────────

interface UploadOptions {
  /** The image data — base64 string or remote URL */
  file: string;
  /** Target folder in Cloudinary */
  folder: CloudinaryFolder;
  /** Optional public_id override (without folder prefix) */
  publicId?: string;
  /** Eager transformations to generate on upload */
  transformation?: Record<string, unknown>;
  /** Max file size in bytes (default 5 MB) */
  maxBytes?: number;
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Upload an image to Cloudinary.
 *
 * @returns The upload result with `secure_url`, `public_id`, dimensions, etc.
 * @throws Error if upload fails or file exceeds size limit.
 */
export async function uploadImage({
  file,
  folder,
  publicId,
  transformation,
  maxBytes = DEFAULT_MAX_BYTES,
}: UploadOptions): Promise<CloudinaryUploadResult> {
  // Rough check for base64-encoded data size
  if (file.startsWith('data:')) {
    const base64Length = file.split(',')[1]?.length ?? 0;
    const estimatedBytes = (base64Length * 3) / 4;
    if (estimatedBytes > maxBytes) {
      throw new Error(
        `File size (~${Math.round(estimatedBytes / 1024)} KB) exceeds the ${Math.round(maxBytes / 1024)} KB limit.`
      );
    }
  }

  const result = await cloudinary.uploader.upload(file, {
    folder,
    ...(publicId && { public_id: publicId }),
    overwrite: true,
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    ...(transformation && { eager: [transformation] }),
  });

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

// ─── Delete Helper ─────────────────────────────────────────────────────────

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  const res = await cloudinary.uploader.destroy(publicId);
  return { result: res.result };
}

// ─── URL Builder ───────────────────────────────────────────────────────────

/**
 * Build an optimized Cloudinary URL with on-the-fly transformations.
 */
export function buildImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
}

export default cloudinary;
