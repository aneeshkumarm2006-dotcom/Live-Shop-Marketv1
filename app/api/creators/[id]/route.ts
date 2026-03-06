import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Creator from '@/models/Creator';
import LiveSession from '@/models/LiveSession';
import Favorite from '@/models/Favorite';
import { requireCreator, AuthSession } from '@/lib/auth-helpers';
import { updateCreatorProfileSchema } from '@/lib/validators/creator';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { sanitizeBody } from '@/lib/sanitize';

// ─── GET /api/creators/[id] — Get creator profile ──────────────────────────

/**
 * GET /api/creators/[id]
 *
 * Returns the full creator profile with:
 *   - Populated user & categories
 *   - Live follower count from Favorites collection
 *   - Active sessions (live + scheduled)
 *   - Session counts by status
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimitResponse = rateLimit(_request, RATE_LIMIT_PRESETS.read);
    if (rateLimitResponse) return rateLimitResponse;

    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid creator ID format' },
        { status: 400 }
      );
    }

    const creator = await Creator.findById(id)
      .populate('userId', 'name email image')
      .populate('categories', 'name slug gradient')
      .lean();

    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    // Compute live follower count from Favorites collection
    const [followerCount, activeSessions, sessionCounts] = await Promise.all([
      Favorite.countDocuments({ creatorId: creator._id }),
      LiveSession.find({
        creatorId: creator._id,
        status: { $in: ['live', 'scheduled'] },
      })
        .sort({ scheduledAt: 1, createdAt: -1 })
        .populate('categoryId', 'name slug gradient')
        .lean(),
      LiveSession.aggregate([
        { $match: { creatorId: creator._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    // Build session count map
    const counts: Record<string, number> = { live: 0, scheduled: 0, ended: 0 };
    for (const sc of sessionCounts) {
      counts[sc._id as string] = sc.count;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...creator,
          followerCount,
          activeSessions,
          sessionCounts: counts,
          totalSessions: counts.live + counts.scheduled + counts.ended,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/creators/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch creator' }, { status: 500 });
  }
}

// ─── PATCH /api/creators/[id] — Update creator profile ─────────────────────

/**
 * PATCH /api/creators/[id]
 *
 * Auth: Authenticated user who owns this creator profile.
 * Updates: displayName, bio, profileImage, socialLinks, categories
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rateLimitResponse = rateLimit(request, RATE_LIMIT_PRESETS.write);
    if (rateLimitResponse) return rateLimitResponse;

    // Require creator role
    const authResult = await requireCreator();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult as AuthSession;

    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid creator ID format' },
        { status: 400 }
      );
    }

    // Fetch the creator to verify ownership
    const creator = await Creator.findById(id);

    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    // Ownership check: the authenticated user must own this creator profile
    if (creator.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only update your own profile' },
        { status: 403 }
      );
    }

    // Parse & validate request body
    const body = sanitizeBody(await request.json());
    const parseResult = updateCreatorProfileSchema.safeParse(body);

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

    const updates = parseResult.data;

    // Apply updates
    const updatedCreator = await Creator.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email image')
      .populate('categories', 'name slug gradient')
      .lean();

    return NextResponse.json({ success: true, data: updatedCreator }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/creators/[id] error:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update creator' },
      { status: 500 }
    );
  }
}
