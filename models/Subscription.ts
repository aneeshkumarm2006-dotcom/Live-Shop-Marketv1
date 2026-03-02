import mongoose, { Schema, Model } from 'mongoose';
import { ISubscriptionDocument } from '@/types/subscription';

/**
 * Subscription Model (Phase 2 Forward-Compatible)
 *
 * Schema defined now for Phase 2 readiness.
 * API endpoints will be built in Phase 2.
 */

// ─── Schema Definition ─────────────────────────────────────────────────────

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Creator',
      required: [true, 'Creator ID is required'],
    },
    notifyVia: {
      type: [
        {
          type: String,
          enum: {
            values: ['email', 'push', 'inApp'],
            message: 'Notification channel must be email, push, or inApp',
          },
        },
      ],
      default: ['email', 'inApp'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── 🔮 Phase 2 Fields ──────────────────────────────────────────────────
    stripeSubscriptionId: {
      type: String,
      default: null,
      sparse: true,
    },
    tier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free',
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.__v;
        return obj;
      },
    },
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────

// Compound unique: a user can only subscribe to a creator once
SubscriptionSchema.index({ userId: 1, creatorId: 1 }, { unique: true });
SubscriptionSchema.index({ userId: 1, isActive: 1 });
SubscriptionSchema.index({ creatorId: 1, isActive: 1 });

// ─── Model Export ───────────────────────────────────────────────────────────

const Subscription: Model<ISubscriptionDocument> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);

export default Subscription;
