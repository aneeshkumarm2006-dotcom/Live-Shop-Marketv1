import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Category from '@/models/Category';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

/**
 * GET /api/categories/[slug] — Get single category with stats
 *
 * Returns category details along with:
 *   - count of live sessions (status: "live")
 *   - count of scheduled sessions
 *   - count of total sessions
 *   - count of creators in this category
 */
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const rateLimitResponse = rateLimit(_request, RATE_LIMIT_PRESETS.read);
    if (rateLimitResponse) return rateLimitResponse;

    await dbConnect();

    const { slug } = params;

    // Find the category by slug
    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Gather stats in parallel for performance
    const [liveSessionCount, scheduledSessionCount, totalSessionCount, creatorCount] =
      await Promise.all([
        LiveSession.countDocuments({
          categoryId: category._id,
          status: 'live',
        }),
        LiveSession.countDocuments({
          categoryId: category._id,
          status: 'scheduled',
        }),
        LiveSession.countDocuments({
          categoryId: category._id,
        }),
        Creator.countDocuments({
          categories: category._id,
        }),
      ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...category,
          stats: {
            liveSessionCount,
            scheduledSessionCount,
            totalSessionCount,
            creatorCount,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/categories/[slug] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
      },
      { status: 500 }
    );
  }
}
