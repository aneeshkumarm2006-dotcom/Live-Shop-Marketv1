import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Favorite from '@/models/Favorite';
import Creator from '@/models/Creator';
import { requireAuth } from '@/lib/auth-helpers';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// ─── DELETE /api/favorites/[creatorId] — Remove a creator from favorites ───

/**
 * DELETE /api/favorites/[creatorId]
 *
 * Auth: Owner of the favorite (authenticated user).
 * Params: creatorId — the Creator ObjectId to un-favorite.
 *
 * Removes the Favorite document and decrements the creator's followerCount.
 * Returns 404 if the favorite does not exist.
 */
export async function DELETE(_request: Request, { params }: { params: { creatorId: string } }) {
  try {
    const rateLimitResponse = rateLimit(_request, RATE_LIMIT_PRESETS.write);
    if (rateLimitResponse) return rateLimitResponse;

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

    // Find and delete the favorite in one operation
    const deleted = await Favorite.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(user.id),
      creatorId: new mongoose.Types.ObjectId(creatorId),
    });

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Favorite not found' }, { status: 404 });
    }

    // Decrement follower count (ensure it doesn't go below 0)
    await Creator.findByIdAndUpdate(creatorId, {
      $inc: { followerCount: -1 },
    });

    // Safety: clamp followerCount at 0 if it went negative
    await Creator.updateOne(
      { _id: creatorId, followerCount: { $lt: 0 } },
      { $set: { followerCount: 0 } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Creator removed from favorites',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/favorites/[creatorId] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
