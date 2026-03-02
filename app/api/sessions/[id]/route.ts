import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';
import { requireCreator } from '@/lib/auth-helpers';
import { updateSessionSchema } from '@/lib/validators/session';

// ─── Helpers ────────────────────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// ─── GET /api/sessions/[id] — Get session details ──────────────────────────

/**
 * GET /api/sessions/[id]
 *
 * Returns full session details with populated creator and category.
 * Phase 2: will increment viewerCount on access.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' }, { status: 400 });
    }

    await dbConnect();

    const session = await LiveSession.findById(id)
      .populate('creatorId', 'displayName profileImage isVerified socialLinks bio followerCount')
      .populate('categoryId', 'name slug gradient description')
      .lean();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // 🔮 Phase 2: Increment viewerCount
    // await LiveSession.findByIdAndUpdate(id, { $inc: { viewerCount: 1 } });

    return NextResponse.json({ success: true, data: session }, { status: 200 });
  } catch (error) {
    console.error('GET /api/sessions/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 });
  }
}

// ─── PATCH /api/sessions/[id] — Update session ─────────────────────────────

/**
 * PATCH /api/sessions/[id]
 *
 * Auth: Session owner (creator) only.
 * Body: partial session fields (title, description, externalUrl, etc.)
 *
 * Cannot update status through this endpoint — use PATCH /api/sessions/[id]/status.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' }, { status: 400 });
    }

    // Auth: creator required
    const authResult = await requireCreator();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    // Find the session
    const existingSession = await LiveSession.findById(id).lean();
    if (!existingSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // Ownership check: the creator must own this session
    const creator = await Creator.findOne({ userId: user.id }).lean();
    if (!creator || !existingSession.creatorId.equals(creator._id)) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own sessions' },
        { status: 403 }
      );
    }

    // Cannot edit ended sessions
    if (existingSession.status === 'ended') {
      return NextResponse.json(
        { success: false, error: 'Cannot edit an ended session' },
        { status: 400 }
      );
    }

    // Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate
    const parseResult = updateSessionSchema.safeParse(body);
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

    // Strip status from PATCH body — must use /status endpoint
    if ('status' in updates) {
      delete (updates as Record<string, unknown>).status;
    }

    const updated = await LiveSession.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('creatorId', 'displayName profileImage isVerified')
      .populate('categoryId', 'name slug gradient')
      .lean();

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/sessions/[id] error:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      for (const [field, err] of Object.entries(error.errors)) {
        fieldErrors[field] = err.message;
      }
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/sessions/[id] — Delete session ─────────────────────────────

/**
 * DELETE /api/sessions/[id]
 *
 * Auth: Session owner (creator) only.
 * Permanently removes the session document.
 */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' }, { status: 400 });
    }

    // Auth: creator required
    const authResult = await requireCreator();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    // Find the session
    const existingSession = await LiveSession.findById(id).lean();
    if (!existingSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // Ownership check
    const creator = await Creator.findOne({ userId: user.id }).lean();
    if (!creator || !existingSession.creatorId.equals(creator._id)) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own sessions' },
        { status: 403 }
      );
    }

    await LiveSession.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Session deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/sessions/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
