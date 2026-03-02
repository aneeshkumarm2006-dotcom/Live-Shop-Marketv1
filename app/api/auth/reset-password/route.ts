import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import { resetPasswordSchema } from '@/lib/validators/auth';

// ─── POST /api/auth/reset-password ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const { token, password } = parsed.data;

    await dbConnect();

    // Hash the incoming token and look up a user whose token matches + hasn't expired
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Update password (hashed automatically by pre-save hook)
    user.password = password;
    user.passwordResetToken = undefined as unknown as string;
    user.passwordResetExpires = undefined as unknown as Date;
    await user.save();

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error) {
    console.error('[Reset Password Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
