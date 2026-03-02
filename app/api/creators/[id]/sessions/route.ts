import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';

// ─── GET /api/creators/[id]/sessions — Get all sessions for a creator ──────

/**
 * GET /api/creators/[id]/sessions
 *
 * Query params:
 *   - status:    "scheduled" | "live" | "ended" — filter by status
 *   - page:      positive integer (default 1)
 *   - limit:     1–100 (default 20)
 *   - sortBy:    "scheduledAt" | "createdAt" | "startedAt" (default "createdAt")
 *   - sortOrder: "asc" | "desc" (default "desc")
 *
 * Returns paginated sessions for the specified creator.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid creator ID format' },
        { status: 400 }
      );
    }

    // Verify creator exists
    const creatorExists = await Creator.exists({ _id: id });
    if (!creatorExists) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);

    // Parse query params
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate status
    const validStatuses = ['scheduled', 'live', 'ended'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate sortBy
    const validSortFields = ['scheduledAt', 'createdAt', 'startedAt'];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid sortBy. Must be one of: ${validSortFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate sortOrder
    if (!['asc', 'desc'].includes(sortOrder)) {
      return NextResponse.json(
        { success: false, error: "sortOrder must be 'asc' or 'desc'" },
        { status: 400 }
      );
    }

    // Build filter
    const filter: Record<string, unknown> = {
      creatorId: new mongoose.Types.ObjectId(id),
    };
    if (status) filter.status = status;

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
    console.error('GET /api/creators/[id]/sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creator sessions' },
      { status: 500 }
    );
  }
}
