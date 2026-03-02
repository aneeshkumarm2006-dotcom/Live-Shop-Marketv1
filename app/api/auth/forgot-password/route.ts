import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import { forgotPasswordSchema } from '@/lib/validators/auth';

// ─── POST /api/auth/forgot-password ────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const { email } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate a cryptographically-secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store hashed token + 1-hour expiry on user
    user.set('passwordResetToken', hashedToken);
    user.set('passwordResetExpires', new Date(Date.now() + 60 * 60 * 1000));
    await user.save({ validateBeforeSave: false });

    // Build the reset URL the frontend will consume
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // ── Send email ──────────────────────────────────────────────────────
    // In production, integrate with Resend / SendGrid.
    // For now, log the URL so development can continue without an email provider.
    console.log(`[Password Reset] Link for ${email}: ${resetUrl}`);

    // TODO: Replace with actual email sending when lib/email.ts is implemented
    // await sendPasswordResetEmail({ to: email, resetUrl });

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('[Forgot Password Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
