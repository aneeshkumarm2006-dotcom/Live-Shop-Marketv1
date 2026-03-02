import { Types, Document } from 'mongoose';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'creator';

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'unpaid';

// ─── Notification Preferences (Phase 2) ────────────────────────────────────

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

// ─── User ───────────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  image?: string;
  role: UserRole;

  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // 🔮 Phase 2 fields
  notificationPreferences: NotificationPreferences;
  stripeCustomerId?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
