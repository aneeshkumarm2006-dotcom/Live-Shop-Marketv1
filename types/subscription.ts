import { Types, Document } from 'mongoose';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type NotifyChannel = 'email' | 'push' | 'inApp';

export type SubscriptionPlanTier = 'free' | 'basic' | 'pro' | 'enterprise';

// ─── Subscription (Phase 2 forward-compatible) ─────────────────────────────

export interface ISubscription {
  userId: Types.ObjectId;
  creatorId: Types.ObjectId;
  notifyVia: NotifyChannel[];
  isActive: boolean;

  // 🔮 Phase 2 fields
  stripeSubscriptionId?: string;
  tier: SubscriptionPlanTier;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends ISubscription, Document {
  _id: Types.ObjectId;
}
