import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import Creator from '@/models/Creator';
import Favorite from '@/models/Favorite';
import LiveSession from '@/models/LiveSession';
import { requireAuth } from '@/lib/auth-helpers';
import { dashboardQuerySchema } from '@/lib/validators/user';

// ─── GET /api/users/me/dashboard — Personalized dashboard data ─────────────

/**
 * GET /api/users/me/dashboard
 *
 * Auth: Authenticated user.
 * Query params:
 *   - favoritesLimit:  1–50 (default 10)
 *   - sessionsLimit:   1–50 (default 10)
 *
 * Returns role-specific dashboard data:
 *
 * **Buyer:**
 *   - user profile summary
 *   - favorited creators (with latest session)
 *   - upcoming sessions from favorited creators
 *
 * **Creator:**
 *   - user profile summary
 *   - creator profile summary (followerCount, etc.)
 *   - live sessions (current)
 *   - scheduled sessions (upcoming)
 *   - recent past sessions
 *   - follower count
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { user: sessionUser } = authResult;

    await dbConnect();

    // Parse query params
    const { searchParams } = new URL(request.url);
    const queryResult = dashboardQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

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

    const { favoritesLimit, sessionsLimit } = queryResult.data;

    // Fetch user (lightweight)
    const user = await User.findById(sessionUser.id)
      .select('name email image role createdAt')
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // ── Route to role-specific handler ─────────────────────────────────────
    if (user.role === 'creator') {
      return buildCreatorDashboard(sessionUser.id, user, sessionsLimit);
    }

    return buildBuyerDashboard(sessionUser.id, user, favoritesLimit, sessionsLimit);
  } catch (error) {
    console.error('GET /api/users/me/dashboard error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── Buyer Dashboard ────────────────────────────────────────────────────────

async function buildBuyerDashboard(
  userId: string,
  user: unknown,
  favoritesLimit: number,
  sessionsLimit: number
) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 1. Favorited creators (with populated data)
  const favorites = await Favorite.find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .limit(favoritesLimit)
    .populate({
      path: 'creatorId',
      select: 'displayName bio profileImage isVerified followerCount categories socialLinks',
      populate: [
        { path: 'userId', select: 'name email image' },
        { path: 'categories', select: 'name slug gradient' },
      ],
    })
    .lean();

  const favoriteCreatorIds = favorites
    .filter((f) => f.creatorId)
    .map((f) => (f.creatorId as unknown as { _id: mongoose.Types.ObjectId })._id);

  // 2. Upcoming & live sessions from favorited creators
  const upcomingSessions = favoriteCreatorIds.length
    ? await LiveSession.find({
        creatorId: { $in: favoriteCreatorIds },
        status: { $in: ['live', 'scheduled'] },
      })
        .sort({ status: 1, scheduledAt: 1, createdAt: -1 })
        .limit(sessionsLimit)
        .populate({
          path: 'creatorId',
          select: 'displayName profileImage isVerified',
        })
        .populate('categoryId', 'name slug gradient')
        .lean()
    : [];

  // 3. Total favorites count
  const totalFavorites = await Favorite.countDocuments({ userId: userObjectId });

  return NextResponse.json({
    success: true,
    data: {
      user,
      role: 'buyer',
      favorites: {
        items: favorites,
        total: totalFavorites,
        limit: favoritesLimit,
      },
      upcomingSessions: {
        items: upcomingSessions,
        total: upcomingSessions.length,
      },
    },
  });
}

// ─── Creator Dashboard ──────────────────────────────────────────────────────

async function buildCreatorDashboard(userId: string, user: unknown, sessionsLimit: number) {
  // Find the creator profile
  const creator = await Creator.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .select('-platformTokens -__v')
    .populate('categories', 'name slug gradient')
    .lean();

  if (!creator) {
    return NextResponse.json(
      { success: false, error: 'Creator profile not found' },
      { status: 404 }
    );
  }

  const creatorId = creator._id;

  // Run queries in parallel for performance
  const [liveSessions, scheduledSessions, pastSessions, followerCount] = await Promise.all([
    // Current live sessions
    LiveSession.find({ creatorId, status: 'live' })
      .sort({ startedAt: -1 })
      .limit(sessionsLimit)
      .populate('categoryId', 'name slug gradient')
      .lean(),

    // Upcoming scheduled sessions
    LiveSession.find({ creatorId, status: 'scheduled' })
      .sort({ scheduledAt: 1 })
      .limit(sessionsLimit)
      .populate('categoryId', 'name slug gradient')
      .lean(),

    // Past (ended) sessions — most recent first
    LiveSession.find({ creatorId, status: 'ended' })
      .sort({ endedAt: -1 })
      .limit(sessionsLimit)
      .populate('categoryId', 'name slug gradient')
      .lean(),

    // Follower count (from Creator doc, but verified via Favorite count)
    Favorite.countDocuments({ creatorId }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      user,
      role: 'creator',
      creatorProfile: creator,
      liveSessions: {
        items: liveSessions,
        total: liveSessions.length,
      },
      scheduledSessions: {
        items: scheduledSessions,
        total: scheduledSessions.length,
      },
      pastSessions: {
        items: pastSessions,
        total: pastSessions.length,
      },
      followerCount,
    },
  });
}
