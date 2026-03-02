import mongoose, { Schema, Model } from 'mongoose';
import { ILiveSessionDocument } from '@/types/liveSession';

// ─── Schema Definition ─────────────────────────────────────────────────────

const LiveSessionSchema = new Schema<ILiveSessionDocument>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Creator',
      required: [true, 'Creator ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: null,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    externalUrl: {
      type: String,
      required: [true, 'External URL is required'],
      trim: true,
    },
    platform: {
      type: String,
      enum: {
        values: ['youtube', 'instagram', 'tiktok', 'facebook', 'other'],
        message: 'Platform must be youtube, instagram, tiktok, facebook, or other',
      },
      required: [true, 'Platform is required'],
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'live', 'ended'],
        message: 'Status must be scheduled, live, or ended',
      },
      default: 'scheduled',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },

    // ── 🔮 Phase 2 Fields ──────────────────────────────────────────────────
    viewerCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    promotionTier: {
      type: String,
      enum: ['none', 'basic', 'featured', 'spotlight'],
      default: 'none',
    },
    promotionExpiresAt: {
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

LiveSessionSchema.index({ status: 1 });
LiveSessionSchema.index({ creatorId: 1 });
LiveSessionSchema.index({ categoryId: 1 });
LiveSessionSchema.index({ scheduledAt: -1 });
LiveSessionSchema.index({ createdAt: -1 });

// Compound indexes for common query patterns
LiveSessionSchema.index({ status: 1, categoryId: 1 });
LiveSessionSchema.index({ creatorId: 1, status: 1 });
LiveSessionSchema.index({ status: 1, scheduledAt: -1 });
LiveSessionSchema.index({ status: 1, createdAt: -1 });

// 🔮 Phase 2: Index for promoted sessions
LiveSessionSchema.index({ isPromoted: 1, promotionTier: 1 });

// ─── Model Export ───────────────────────────────────────────────────────────

const LiveSession: Model<ILiveSessionDocument> =
  mongoose.models.LiveSession ||
  mongoose.model<ILiveSessionDocument>('LiveSession', LiveSessionSchema);

export default LiveSession;
