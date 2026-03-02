import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/models/Favorite';
import { requireAuth } from '@/lib/auth-helpers';

// ─── GET /api/favorites/check/[creatorId] — Check if creator is favorited ──

/**
 * GET /api/favorites/check/[creatorId]
 *
 * Auth: Authenticated user.
 * Params: creatorId — the Creator ObjectId to check.
 *
 * Returns { isFavorited: boolean }.
 */
export async function GET(_request: Request, { params }: { params: { creatorId: string } }) {
  try {
    // Auth: any authenticated user
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    const { creatorId } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid creator ID format' },
        { status: 400 }
      );
    }

    // Check existence (lean + select only _id for performance)
    const favorite = await Favorite.findOne({
      userId: new mongoose.Types.ObjectId(user.id),
      creatorId: new mongoose.Types.ObjectId(creatorId),
    })
      .select('_id')
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: { isFavorited: !!favorite },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/favorites/check/[creatorId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}
