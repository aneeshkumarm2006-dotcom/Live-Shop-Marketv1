import { Resend } from 'resend';

// ─── Resend Client ─────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Config ────────────────────────────────────────────────────────────────

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'LiveShopMarket <noreply@liveshopmarket.com>';
const APP_NAME = 'LiveShopMarket';
const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ─── Core Send Function ────────────────────────────────────────────────────

/**
 * Send an email via Resend.
 * Returns `{ success: true, id }` on success, or `{ success: false, error }`.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<SendEmailResult> {
  // Skip sending when no API key is configured (dev mode)
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key') {
    console.warn(
      '[Email] RESEND_API_KEY not configured — email not sent. Subject:',
      subject,
      'To:',
      to
    );
    return { success: true, id: 'dev-mode-skipped' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      ...(text && { text }),
    });

    if (error) {
      console.error('[Email] Resend API error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Email] Failed to send:', message);
    return { success: false, error: message };
  }
}

// ─── Email Templates ───────────────────────────────────────────────────────

// Shared layout wrapper
function emailLayout(body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #FF6154, #FF8C42); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; }
    .body { padding: 32px 24px; color: #18181b; line-height: 1.6; }
    .body h2 { margin-top: 0; font-size: 20px; }
    .body p { margin: 12px 0; font-size: 15px; color: #3f3f46; }
    .btn { display: inline-block; padding: 12px 28px; background: #FF6154; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #a1a1aa; border-top: 1px solid #f4f4f5; }
    .footer a { color: #a1a1aa; }
    .code { display: inline-block; padding: 8px 16px; background: #f4f4f5; border-radius: 6px; font-family: monospace; font-size: 18px; letter-spacing: 2px; font-weight: 700; color: #18181b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_NAME}</h1>
    </div>
    <div class="body">
      ${body}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <p><a href="${BASE_URL}">${BASE_URL}</a></p>
    </div>
  </div>
</body>
</html>`.trim();
}

// ─── Welcome Email ─────────────────────────────────────────────────────────

interface WelcomeEmailData {
  to: string;
  name: string;
  role: 'buyer' | 'creator';
}

export async function sendWelcomeEmail({
  to,
  name,
  role,
}: WelcomeEmailData): Promise<SendEmailResult> {
  const roleText =
    role === 'creator'
      ? 'As a creator, you can list your live shopping sessions, grow your audience, and reach new buyers.'
      : 'Discover amazing live shopping sessions from your favourite creators across every platform.';

  const dashboardUrl = `${BASE_URL}/dashboard`;

  const html = emailLayout(`
    <h2>Welcome to ${APP_NAME}, ${name}! 🎉</h2>
    <p>Your account has been created successfully.</p>
    <p>${roleText}</p>
    <p>Head to your dashboard to get started:</p>
    <a class="btn" href="${dashboardUrl}">Go to Dashboard</a>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Happy shopping!</p>
  `);

  const text = `Welcome to ${APP_NAME}, ${name}!\n\n${roleText}\n\nVisit your dashboard: ${dashboardUrl}`;

  return sendEmail({ to, subject: `Welcome to ${APP_NAME}!`, html, text });
}

// ─── Password Reset Email ──────────────────────────────────────────────────

interface PasswordResetEmailData {
  to: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: PasswordResetEmailData): Promise<SendEmailResult> {
  const html = emailLayout(`
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <a class="btn" href="${resetUrl}">Reset Password</a>
    <p>This link will expire in <strong>1 hour</strong>.</p>
    <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <p style="font-size:13px; color:#71717a;">If the button doesn&rsquo;t work, copy and paste this URL into your browser:<br/><a href="${resetUrl}" style="color:#FF6154; word-break:break-all;">${resetUrl}</a></p>
  `);

  const text = `Reset your password\n\nVisit this link to set a new password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`;

  return sendEmail({ to, subject: `${APP_NAME} — Password Reset`, html, text });
}

// ─── Phase 2 Stubs 🔮 ─────────────────────────────────────────────────────

interface SessionReminderEmailData {
  to: string;
  creatorName: string;
  sessionTitle: string;
  startsAt: string;
  sessionUrl: string;
}

/**
 * Phase 2: Notify a user that a session they subscribed to is about to start.
 */
export async function sendSessionReminderEmail({
  to,
  creatorName,
  sessionTitle,
  startsAt,
  sessionUrl,
}: SessionReminderEmailData): Promise<SendEmailResult> {
  const html = emailLayout(`
    <h2>🔴 Going Live Soon!</h2>
    <p><strong>${creatorName}</strong> is about to go live with:</p>
    <p style="font-size:18px; font-weight:600;">${sessionTitle}</p>
    <p>Starting at: <strong>${startsAt}</strong></p>
    <a class="btn" href="${sessionUrl}">Watch Now</a>
  `);

  const text = `${creatorName} is going live: ${sessionTitle}\nStarting at: ${startsAt}\nWatch: ${sessionUrl}`;

  return sendEmail({ to, subject: `🔴 ${creatorName} is going live soon!`, html, text });
}

export default resend;
