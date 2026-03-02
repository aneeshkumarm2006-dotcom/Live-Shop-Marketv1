import mongoose from 'mongoose';

/**
 * MongoDB Connection Utility
 *
 * Implements a singleton connection pattern optimized for serverless environments
 * like Next.js API routes and Server Components. Uses global caching to prevent
 * multiple connections during hot reloads in development.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local\n' +
      'See .env.example for the required format.'
  );
}

/**
 * Cached connection interface stored on the Node.js global object.
 * Prevents re-creating connections on every serverless invocation.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include our cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB with connection pooling and caching.
 *
 * - In development: uses a cached connection to survive hot reloads.
 * - In production: the cache lives for the lifetime of the serverless function.
 *
 * @returns The mongoose connection instance.
 */
async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Fail fast if not connected
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2, // Minimum connections to maintain
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      heartbeatFrequencyMS: 30000, // How often to check server health
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        // Reset promise so next call will retry
        cached.promise = null;
        console.error('❌ MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
