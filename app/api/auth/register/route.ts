import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import Creator from '@/models/Creator';
import { registerSchema } from '@/lib/validators/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { rateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { sanitizeBody } from '@/lib/sanitize';

// ─── POST /api/auth/register ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(req, RATE_LIMIT_PRESETS.auth);
    if (rateLimitResponse) return rateLimitResponse;

    const body = sanitizeBody(await req.json());

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user (password is hashed automatically via pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Auto-create Creator profile when role is "creator"
    if (role === 'creator') {
      await Creator.create({
        userId: user._id,
        displayName: name,
      });
    }

    // Send welcome email (non-blocking — don't fail registration if email fails)
    sendWelcomeEmail({ to: user.email, name: user.name, role: user.role }).catch((err) =>
      console.error('[Register] Welcome email failed:', err)
    );

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle MongoDB duplicate key error
    if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    console.error('[Register Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
