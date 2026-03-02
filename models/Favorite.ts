import mongoose, { Schema, Model } from 'mongoose';
import { IFavoriteDocument } from '@/types/favorite';

// ─── Schema Definition ─────────────────────────────────────────────────────

const FavoriteSchema = new Schema<IFavoriteDocument>(
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

// Compound unique index: a user can only favorite a creator once
FavoriteSchema.index({ userId: 1, creatorId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1 });
FavoriteSchema.index({ creatorId: 1 });

// ─── Model Export ───────────────────────────────────────────────────────────

const Favorite: Model<IFavoriteDocument> =
  mongoose.models.Favorite || mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);

export default Favorite;
