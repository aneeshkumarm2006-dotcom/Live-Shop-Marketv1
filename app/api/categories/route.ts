import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Category from '@/models/Category';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/categories — List all categories
 *
 * Returns all categories sorted by `sortOrder`.
 * Supports optional query params:
 *   - featured=true  → only featured categories
 *
 * Cache-friendly: returns consistent ordering for ISR compatibility.
 */
export async function GET(request: Request) {
  try {
    const rateLimitResponse = rateLimit(request, RATE_LIMIT_PRESETS.read);
    if (rateLimitResponse) return rateLimitResponse;
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    // Build query filter
    const filter: Record<string, unknown> = {};
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const categories = await Category.find(filter).sort({ sortOrder: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: categories,
        count: categories.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
