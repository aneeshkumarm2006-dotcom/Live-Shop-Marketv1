import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Creator from '@/models/Creator';
import Favorite from '@/models/Favorite';

// ─── GET /api/creators — List creators with filters ────────────────────────

/**
 * GET /api/creators
 *
 * Query params:
 *   - categoryId: ObjectId string — filter by category
 *   - search:     string — text search on displayName
 *   - sort:       "followers" | "recent" (default "recent")
 *   - page:       positive integer (default 1)
 *   - limit:      1–100 (default 20)
 *
 * Returns paginated creators with follower count computed from Favorites.
 */
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Parse query params
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'recent';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));

    // Validate categoryId format
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId format' },
        { status: 400 }
      );
    }

    // Build filter
    const filter: Record<string, unknown> = {};

    if (categoryId) {
      filter.categories = new mongoose.Types.ObjectId(categoryId);
    }

    if (search && search.trim()) {
      // Use text index for display name search
      filter.$text = { $search: search.trim() };
    }

    // Sort
    let sortObj: Record<string, 1 | -1>;
    if (sort === 'followers') {
      sortObj = { followerCount: -1, createdAt: -1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [creators, total] = await Promise.all([
      Creator.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email image')
        .populate('categories', 'name slug gradient')
        .lean(),
      Creator.countDocuments(filter),
    ]);

    // Compute live follower counts from Favorites collection
    const creatorIds = creators.map((c) => c._id);
    const followerCounts = await Favorite.aggregate([
      { $match: { creatorId: { $in: creatorIds } } },
      { $group: { _id: '$creatorId', count: { $sum: 1 } } },
    ]);

    const followerMap = new Map<string, number>();
    for (const fc of followerCounts) {
      followerMap.set(fc._id.toString(), fc.count);
    }

    // Merge live follower count into response
    const data = creators.map((creator) => ({
      ...creator,
      followerCount: followerMap.get(creator._id.toString()) ?? creator.followerCount,
    }));

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
    console.error('GET /api/creators error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}
