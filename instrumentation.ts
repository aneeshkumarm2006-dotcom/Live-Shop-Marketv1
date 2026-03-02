/**
 * Next.js Instrumentation
 *
 * This file runs once when the Next.js server starts up.
 * Used here to establish the MongoDB connection on boot so we see
 * "✅ MongoDB connected successfully" in the terminal immediately.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Only connect on the Node.js server runtime, not in Edge
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dbConnect = (await import('@/lib/db/mongoose')).default;
    try {
      await dbConnect();
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB on startup:', error);
    }
  }
}
