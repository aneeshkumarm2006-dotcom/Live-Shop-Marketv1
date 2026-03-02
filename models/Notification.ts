import mongoose, { Schema, Model } from 'mongoose';
import { INotificationDocument } from '@/types/notification';

/**
 * Notification Model (Phase 2 Forward-Compatible)
 *
 * Schema defined now for Phase 2 readiness.
 * Notification logic will be built in Phase 2.
 */

// ─── Schema Definition ─────────────────────────────────────────────────────

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['live_now', 'reminder', 'system'],
        message: 'Type must be live_now, reminder, or system',
      },
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    relatedSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'LiveSession',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only createdAt per spec
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

NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });

// TTL index: auto-delete notifications older than 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// ─── Model Export ───────────────────────────────────────────────────────────

const Notification: Model<INotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<INotificationDocument>('Notification', NotificationSchema);

export default Notification;
