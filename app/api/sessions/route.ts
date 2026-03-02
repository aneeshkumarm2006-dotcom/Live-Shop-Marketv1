import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';
import Category from '@/models/Category';
import { requireCreator } from '@/lib/auth-helpers';
import { createSessionSchema, sessionQuerySchema } from '@/lib/validators/session';

// ─── GET /api/sessions — List sessions with filters ────────────────────────

/**
 * GET /api/sessions
 *
 * Query params:
 *   - status:    "scheduled" | "live" | "ended"
 *   - categoryId: ObjectId string
 *   - creatorId:  ObjectId string
 *   - platform:  "youtube" | "instagram" | "tiktok" | "facebook" | "other"
 *   - page:      positive integer (default 1)
 *   - limit:     1–100 (default 20)
 *   - sortBy:    "scheduledAt" | "createdAt" | "startedAt" (default "createdAt")
 *   - sortOrder: "asc" | "desc" (default "desc")
 *
 * Returns paginated sessions with populated creator and category.
 * Phase 2: supports `promoted` filter and promotion-tier sorting.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Parse & validate query params
    const queryResult = sessionQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!queryResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: queryResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status, categoryId, creatorId, platform, page, limit, sortBy, sortOrder } =
      queryResult.data;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (categoryId) filter.categoryId = new mongoose.Types.ObjectId(categoryId);
    if (creatorId) filter.creatorId = new mongoose.Types.ObjectId(creatorId);
    if (platform) filter.platform = platform;

    // Sort
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    // Pagination
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      LiveSession.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('creatorId', 'displayName profileImage isVerified')
        .populate('categoryId', 'name slug gradient')
        .lean(),
      LiveSession.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// ─── POST /api/sessions — Create a live session ────────────────────────────

/**
 * POST /api/sessions
 *
 * Auth: Creator only.
 * Body: title, description?, externalUrl, platform, thumbnailUrl?,
 *        categoryId, status (default "scheduled"), scheduledAt?
 *
 * Validates external URL format against the selected platform.
 * Returns the created session document.
 */
export async function POST(request: Request) {
  try {
    // Auth: creator required
    const authResult = await requireCreator();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    // Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate
    const parseResult = createSessionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Verify categoryId exists
    const category = await Category.findById(data.categoryId).lean();
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Look up Creator document for the authenticated user
    const creator = await Creator.findOne({ userId: user.id }).lean();
    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Creator profile not found' },
        { status: 404 }
      );
    }

    // Build session document
    const sessionData: Record<string, unknown> = {
      creatorId: creator._id,
      title: data.title,
      description: data.description ?? null,
      externalUrl: data.externalUrl,
      platform: data.platform,
      thumbnailUrl: data.thumbnailUrl ?? null,
      categoryId: data.categoryId,
      status: data.status,
      scheduledAt: data.scheduledAt ?? null,
    };

    // If going live immediately, stamp startedAt
    if (data.status === 'live') {
      sessionData.startedAt = new Date();
    }

    const session = await LiveSession.create(sessionData);

    // Populate references for the response
    const populated = await LiveSession.findById(session._id)
      .populate('creatorId', 'displayName profileImage isVerified')
      .populate('categoryId', 'name slug gradient')
      .lean();

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error('POST /api/sessions error:', error);

    // Mongoose validation error
    if (error instanceof mongoose.Error.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const [field, err] of Object.entries(error.errors)) {
        fieldErrors[field] = err.message;
      }
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
