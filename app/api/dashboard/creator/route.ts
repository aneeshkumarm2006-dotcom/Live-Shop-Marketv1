import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';
import Favorite from '@/models/Favorite';
import { requireCreator } from '@/lib/auth-helpers';

// ─── GET /api/dashboard/creator — Creator dashboard data ────────────────────

/**
 * GET /api/dashboard/creator
 *
 * Auth: Creator only.
 * Returns:
 *   - creator profile (display name, follower count, etc.)
 *   - live sessions (status === "live")
 *   - scheduled sessions (status === "scheduled", sorted by scheduledAt asc)
 *   - past sessions (status === "ended", paginated)
 *   - summary stats: total followers, live count, scheduled count, past count
 *
 * Query params:
 *   - pastPage:  page for past sessions (default 1)
 *   - pastLimit: items per page for past sessions (default 10)
 *
 * 🔮 Phase 2: Include analytics summary, promotion stats.
 */
export async function GET(request: Request) {
  try {
    // Auth: creator required
    const authResult = await requireCreator();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    // Find the creator profile for this user
    const creator = await Creator.findOne({ userId: user.id })
      .populate('categories', 'name slug')
      .lean();

    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Creator profile not found' },
        { status: 404 }
      );
    }

    const creatorId = creator._id;

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const pastPage = Math.max(1, Number(searchParams.get('pastPage')) || 1);
    const pastLimit = Math.min(100, Math.max(1, Number(searchParams.get('pastLimit')) || 10));
    const pastSkip = (pastPage - 1) * pastLimit;

    // Fetch all session groups + counts in parallel
    const [
      liveSessions,
      scheduledSessions,
      pastSessions,
      liveCount,
      scheduledCount,
      pastCount,
      followerCount,
    ] = await Promise.all([
      // Live sessions
      LiveSession.find({ creatorId, status: 'live' })
        .sort({ startedAt: -1 })
        .populate('categoryId', 'name slug gradient')
        .lean(),

      // Scheduled sessions (upcoming first)
      LiveSession.find({ creatorId, status: 'scheduled' })
        .sort({ scheduledAt: 1 })
        .populate('categoryId', 'name slug gradient')
        .lean(),

      // Past sessions (most recent first, paginated)
      LiveSession.find({ creatorId, status: 'ended' })
        .sort({ endedAt: -1 })
        .skip(pastSkip)
        .limit(pastLimit)
        .populate('categoryId', 'name slug gradient')
        .lean(),

      // Counts
      LiveSession.countDocuments({ creatorId, status: 'live' }),
      LiveSession.countDocuments({ creatorId, status: 'scheduled' }),
      LiveSession.countDocuments({ creatorId, status: 'ended' }),

      // Real-time follower count from the Favorite collection
      Favorite.countDocuments({ creatorId }),
    ]);

    // If the real-time count differs, update Creator.followerCount (eventual consistency)
    if (followerCount !== creator.followerCount) {
      Creator.updateOne({ _id: creatorId }, { followerCount }).catch(() => {
        /* non-blocking */
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          creator: {
            _id: creator._id,
            displayName: creator.displayName,
            bio: creator.bio,
            profileImage: creator.profileImage,
            socialLinks: creator.socialLinks,
            isVerified: creator.isVerified,
            followerCount,
            categories: creator.categories,
          },
          stats: {
            followerCount,
            liveCount,
            scheduledCount,
            pastCount,
          },
          liveSessions,
          scheduledSessions,
          pastSessions,
          pastPagination: {
            page: pastPage,
            limit: pastLimit,
            total: pastCount,
            totalPages: Math.ceil(pastCount / pastLimit),
            hasNextPage: pastPage * pastLimit < pastCount,
            hasPrevPage: pastPage > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/dashboard/creator error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creator dashboard data' },
      { status: 500 }
    );
  }
}
