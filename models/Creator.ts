import mongoose, { Schema, Model } from 'mongoose';
import { ICreatorDocument } from '@/types/creator';

// ─── Sub-Schemas ────────────────────────────────────────────────────────────

const SocialLinksSchema = new Schema(
  {
    instagram: { type: String, default: null },
    tiktok: { type: String, default: null },
    youtube: { type: String, default: null },
    facebook: { type: String, default: null },
  },
  { _id: false }
);

// 🔮 Phase 2: Encrypted platform API tokens
const PlatformTokensSchema = new Schema(
  {
    instagram: { type: String, default: null },
    tiktok: { type: String, default: null },
    youtube: { type: String, default: null },
    facebook: { type: String, default: null },
  },
  { _id: false }
);

// 🔮 Phase 2: Analytics data
const AnalyticsDataSchema = new Schema(
  {
    totalViews: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    averageCTR: { type: Number, default: 0 },
    followerGrowth: { type: [Number], default: [] },
    lastUpdated: { type: Date, default: null },
  },
  { _id: false }
);

// ─── Schema Definition ─────────────────────────────────────────────────────

const CreatorSchema = new Schema<ICreatorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters'],
    },
    bio: {
      type: String,
      default: null,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    profileImage: {
      type: String,
      default: null,
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({}),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followerCount: {
      type: Number,
      default: 0,
      min: [0, 'Follower count cannot be negative'],
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    // ── 🔮 Phase 2 Fields ──────────────────────────────────────────────────
    platformTokens: {
      type: PlatformTokensSchema,
      default: null,
      select: false, // Don't include in queries by default (sensitive data)
    },
    analyticsData: {
      type: AnalyticsDataSchema,
      default: null,
    },
    promotionCredits: {
      type: Number,
      default: 0,
      min: [0, 'Promotion credits cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.__v;
        delete obj.platformTokens; // Never expose tokens in JSON
        return obj;
      },
    },
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────

// userId unique index is created by `unique: true` on the field
CreatorSchema.index({ followerCount: -1 });
CreatorSchema.index({ categories: 1 });
CreatorSchema.index({ createdAt: -1 });
CreatorSchema.index({ displayName: 'text' }, { name: 'creator_displayName_text' });

// ─── Model Export ───────────────────────────────────────────────────────────

const Creator: Model<ICreatorDocument> =
  mongoose.models.Creator || mongoose.model<ICreatorDocument>('Creator', CreatorSchema);

export default Creator;
