import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/models/Favorite';
import Creator from '@/models/Creator';
import LiveSession from '@/models/LiveSession';
import { requireAuth } from '@/lib/auth-helpers';
import { toggleFavoriteSchema, favoriteQuerySchema } from '@/lib/validators/favorite';

// ─── GET /api/favorites — List user's favorited creators ───────────────────

/**
 * GET /api/favorites
 *
 * Auth: Authenticated user.
 * Query params:
 *   - page:  positive integer (default 1)
 *   - limit: 1–100 (default 20)
 *
 * Returns the user's favorited creators with their latest session info.
 */
export async function GET(request: Request) {
  try {
    // Auth: any authenticated user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Parse & validate query params
    const queryResult = favoriteQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

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

    const { page, limit } = queryResult.data;

    const userId = new mongoose.Types.ObjectId(user.id);
    const skip = (page - 1) * limit;

    // Get total count and paginated favorites
    const [favorites, total] = await Promise.all([
      Favorite.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'creatorId',
          select: 'displayName bio profileImage isVerified followerCount categories socialLinks',
          populate: [
            { path: 'userId', select: 'name email image' },
            { path: 'categories', select: 'name slug gradient' },
          ],
        })
        .lean(),
      Favorite.countDocuments({ userId }),
    ]);

    // Gather creator IDs from populated favorites
    const creatorIds = favorites
      .filter((f) => f.creatorId)
      .map((f) => (f.creatorId as unknown as Record<string, unknown>)._id);

    // Fetch the latest session for each favorited creator
    const latestSessions = creatorIds.length
      ? await LiveSession.aggregate([
          {
            $match: {
              creatorId: { $in: creatorIds },
              status: { $in: ['live', 'scheduled'] },
            },
          },
          { $sort: { status: 1, scheduledAt: -1, createdAt: -1 } },
          {
            $group: {
              _id: '$creatorId',
              latestSession: { $first: '$$ROOT' },
            },
          },
        ])
      : [];

    const sessionMap = new Map<string, unknown>();
    for (const entry of latestSessions) {
      sessionMap.set(entry._id.toString(), entry.latestSession);
    }

    // Merge latest session info into each favorite
    const data = favorites.map((fav) => {
      const creator = fav.creatorId as unknown as Record<string, unknown> | null;
      const cid = creator?._id?.toString() ?? '';
      return {
        _id: fav._id,
        createdAt: fav.createdAt,
        creator,
        latestSession: sessionMap.get(cid) ?? null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data,
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
    console.error('GET /api/favorites error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// ─── POST /api/favorites — Add a creator to favorites ──────────────────────

/**
 * POST /api/favorites
 *
 * Auth: Any authenticated user (buyer or creator).
 * Body: { creatorId: string }
 *
 * Creates a Favorite document and increments the creator's followerCount.
 * Returns 409 if the creator is already favorited.
 */
export async function POST(request: Request) {
  try {
    // Auth: any authenticated user
    const authResult = await requireAuth();
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

    // Validate input
    const parseResult = toggleFavoriteSchema.safeParse(body);
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

    const { creatorId } = parseResult.data;

    // Verify the creator exists
    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    // Prevent users from favoriting their own creator profile
    if (creator.userId.toString() === user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot favorite yourself' },
        { status: 400 }
      );
    }

    // Check if already favorited (the unique index will also catch this)
    const existing = await Favorite.findOne({
      userId: user.id,
      creatorId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Creator already in favorites' },
        { status: 409 }
      );
    }

    // Create favorite and increment follower count atomically
    const [favorite] = await Promise.all([
      Favorite.create({
        userId: new mongoose.Types.ObjectId(user.id),
        creatorId: new mongoose.Types.ObjectId(creatorId),
      }),
      Creator.findByIdAndUpdate(creatorId, {
        $inc: { followerCount: 1 },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: favorite.toJSON(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate key error from unique index as a fallback
    if (
      error instanceof Error &&
      'code' in error &&
      (error as unknown as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: 'Creator already in favorites' },
        { status: 409 }
      );
    }

    console.error('POST /api/favorites error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add favorite' }, { status: 500 });
  }
}
