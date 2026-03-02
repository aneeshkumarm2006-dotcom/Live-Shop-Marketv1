import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import Creator from '@/models/Creator';
import { requireAuth } from '@/lib/auth-helpers';
import { updateUserProfileSchema } from '@/lib/validators/user';

// ─── GET /api/users/me — Get current user profile ─────────────────────────

/**
 * GET /api/users/me
 *
 * Auth: Authenticated user.
 *
 * Returns the current user's profile, including their Creator profile
 * if their role is "creator".
 */
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { user: sessionUser } = authResult;

    await dbConnect();

    const user = await User.findById(sessionUser.id)
      .select('-password -passwordResetToken -passwordResetExpires -__v')
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // If the user is a creator, attach their creator profile
    let creatorProfile = null;
    if (user.role === 'creator') {
      creatorProfile = await Creator.findOne({ userId: user._id })
        .select('-platformTokens -__v')
        .populate('categories', 'name slug gradient')
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        creatorProfile,
      },
    });
  } catch (error) {
    console.error('GET /api/users/me error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PATCH /api/users/me — Update current user profile ─────────────────────

/**
 * PATCH /api/users/me
 *
 * Auth: Authenticated user.
 * Body (all optional):
 *   - name:                      string
 *   - image:                     string | null
 *   - notificationPreferences:   { email?, push?, inApp? }
 *
 * Returns the updated user profile.
 */
export async function PATCH(request: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { user: sessionUser } = authResult;

    await dbConnect();

    // Parse & validate body
    const body = await request.json().catch(() => null);
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    const parseResult = updateUserProfileSchema.safeParse(body);
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

    // Build the $set payload, flattening notificationPreferences into dot
    // notation so we only overwrite the provided sub-fields.
    const setPayload: Record<string, unknown> = {};

    if (updates.name !== undefined) {
      setPayload.name = updates.name;
    }

    if (updates.image !== undefined) {
      setPayload.image = updates.image;
    }

    if (updates.notificationPreferences) {
      for (const [key, value] of Object.entries(updates.notificationPreferences)) {
        if (value !== undefined) {
          setPayload[`notificationPreferences.${key}`] = value;
        }
      }
    }

    if (Object.keys(setPayload).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      { $set: setPayload },
      { new: true, runValidators: true }
    )
      .select('-password -passwordResetToken -passwordResetExpires -__v')
      .lean();

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('PATCH /api/users/me error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
