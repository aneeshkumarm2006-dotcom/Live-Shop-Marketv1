import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import Creator from '@/models/Creator';
import { loginSchema } from '@/lib/validators/auth';

// ─── Extend NextAuth types ─────────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: 'buyer' | 'creator';
    };
  }

  interface User {
    id: string;
    role: 'buyer' | 'creator';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'buyer' | 'creator';
  }
}

// ─── NextAuth Configuration ────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // ── Credentials Provider (email + password) ─────────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate input
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error('Invalid email or password');
        }

        await dbConnect();

        // Find user WITH password field (normally excluded via select: false)
        const user = await User.findOne({ email: parsed.data.email }).select('+password');

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await user.comparePassword(parsed.data.password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role,
        };
      },
    }),

    // ── Google OAuth Provider ───────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    // ── Sign-in callback: handle OAuth user creation / linking ───────
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await dbConnect();

        const email = user.email as string;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          // Create new user from Google sign-in (defaults to "buyer")
          const newUser = await User.create({
            name: user.name ?? 'User',
            email,
            image: user.image ?? undefined,
            role: 'buyer',
          });
          user.id = newUser._id.toString();
          user.role = newUser.role;
        } else {
          // Update image if the user already exists
          if (user.image && existingUser.image !== user.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
        }
      }
      return true;
    },

    // ── JWT callback: persist id + role in token ─────────────────────
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // ── Session callback: expose id + role on client session ─────────
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
