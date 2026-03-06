import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import {
  uploadImage,
  deleteImage,
  CLOUDINARY_FOLDERS,
  TRANSFORMATIONS,
  type CloudinaryFolder,
} from '@/lib/cloudinary';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// ─── Allowed upload targets & their constraints ────────────────────────────

const UPLOAD_TARGETS = {
  profile: {
    folder: CLOUDINARY_FOLDERS.profileImages,
    transformation: TRANSFORMATIONS.profileAvatar,
    maxBytes: 2 * 1024 * 1024, // 2 MB
  },
  session: {
    folder: CLOUDINARY_FOLDERS.sessionThumbnails,
    transformation: TRANSFORMATIONS.sessionThumbnail,
    maxBytes: 5 * 1024 * 1024, // 5 MB
  },
  banner: {
    folder: CLOUDINARY_FOLDERS.brandBanners,
    transformation: TRANSFORMATIONS.brandBanner,
    maxBytes: 5 * 1024 * 1024, // 5 MB
  },
} as const;

type UploadTarget = keyof typeof UPLOAD_TARGETS;

// ─── POST /api/upload ──────────────────────────────────────────────────────

/**
 * Upload an image to Cloudinary.
 *
 * Body (JSON):
 *  - file: string   — base64 data-URI **or** public URL of the image
 *  - type: string   — "profile" | "session" | "banner"
 *
 * Returns: { url, publicId, width, height, format, bytes }
 */
export async function POST(req: NextRequest) {
  // Rate limit: write endpoint
  const rateLimitResponse = rateLimit(req, RATE_LIMIT_PRESETS.write);
  if (rateLimitResponse) return rateLimitResponse;

  // Auth guard
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const { file, type } = body as { file?: string; type?: string };

    // ── Validate input ──────────────────────────────────────────────────
    if (!file || typeof file !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "file" field. Provide a base64 data-URI or image URL.' },
        { status: 400 }
      );
    }

    if (!type || !Object.keys(UPLOAD_TARGETS).includes(type)) {
      return NextResponse.json(
        { error: `Invalid "type". Must be one of: ${Object.keys(UPLOAD_TARGETS).join(', ')}` },
        { status: 400 }
      );
    }

    const target = UPLOAD_TARGETS[type as UploadTarget];

    // ── Upload to Cloudinary ────────────────────────────────────────────
    const result = await uploadImage({
      file,
      folder: target.folder as CloudinaryFolder,
      transformation: target.transformation,
      maxBytes: target.maxBytes,
    });

    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('[Upload Error]', error);

    // Surface size-limit errors as 413
    if (message.includes('exceeds')) {
      return NextResponse.json({ error: message }, { status: 413 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE /api/upload ────────────────────────────────────────────────────

/**
 * Delete an image from Cloudinary.
 *
 * Body (JSON):
 *  - publicId: string — the Cloudinary public_id to delete
 */
export async function DELETE(req: NextRequest) {
  // Auth guard
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await req.json();
    const { publicId } = body as { publicId?: string };

    if (!publicId || typeof publicId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "publicId".' }, { status: 400 });
    }

    // Only allow deleting images within our application folders
    const allowedPrefixes = Object.values(CLOUDINARY_FOLDERS);
    const isAllowed = allowedPrefixes.some((prefix) => publicId.startsWith(prefix));
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Cannot delete images outside application folders.' },
        { status: 403 }
      );
    }

    const result = await deleteImage(publicId);

    return NextResponse.json({ message: 'Image deleted', result: result.result });
  } catch (error) {
    console.error('[Delete Image Error]', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
