import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';
import { requireCreator } from '@/lib/auth-helpers';
import { updateSessionStatusSchema } from '@/lib/validators/session';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { sanitizeBody } from '@/lib/sanitize';

// ─── Types ──────────────────────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─── Valid state transitions ────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  scheduled: ['live', 'ended'],
  live: ['ended'],
  ended: [], // terminal state — no transitions allowed
};

// ─── PATCH /api/sessions/[id]/status — Change session status ────────────────

/**
 * PATCH /api/sessions/[id]/status
 *
 * Auth: Session owner (creator) only.
 * Body: { status: "scheduled" | "live" | "ended" }
 *
 * Valid transitions:
 *   scheduled → live   (sets startedAt)
 *   scheduled → ended  (sets endedAt — cancelled before going live)
 *   live      → ended  (sets endedAt)
 *
 * Phase 2: Triggers notification to subscribers when status → "live".
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const rateLimitResponse = rateLimit(request, RATE_LIMIT_PRESETS.write);
    if (rateLimitResponse) return rateLimitResponse;

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' }, { status: 400 });
    }

    // Auth: creator required
    const authResult = await requireCreator();
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    await dbConnect();

    // Parse body
    let body: unknown;
    try {
      body = sanitizeBody(await request.json());
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate
    const parseResult = updateSessionStatusSchema.safeParse(body);
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

    const { status: newStatus } = parseResult.data;

    // Find the session
    const existingSession = await LiveSession.findById(id).lean();
    if (!existingSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // Ownership check
    const creator = await Creator.findOne({ userId: user.id }).lean();
    if (!creator || !existingSession.creatorId.equals(creator._id)) {
      return NextResponse.json(
        { success: false, error: 'You can only change status of your own sessions' },
        { status: 403 }
      );
    }

    // Validate state transition
    const currentStatus = existingSession.status;
    const allowed = VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status transition: "${currentStatus}" → "${newStatus}". Allowed transitions from "${currentStatus}": ${
            allowed.length > 0 ? allowed.join(', ') : 'none'
          }`,
        },
        { status: 400 }
      );
    }

    // Build update
    const update: Record<string, unknown> = { status: newStatus };
    const now = new Date();

    if (newStatus === 'live') {
      update.startedAt = now;
    }

    if (newStatus === 'ended') {
      update.endedAt = now;
    }

    const updated = await LiveSession.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate('creatorId', 'displayName profileImage isVerified')
      .populate('categoryId', 'name slug gradient')
      .lean();

    // 🔮 Phase 2: Trigger notification to subscribers when going live
    // if (newStatus === "live") {
    //   await notifySubscribers(creator._id, updated);
    // }

    return NextResponse.json(
      {
        success: true,
        data: updated,
        message: `Session status changed to "${newStatus}"`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/sessions/[id]/status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update session status' },
      { status: 500 }
    );
  }
}
