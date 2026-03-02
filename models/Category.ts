import mongoose, { Schema, Model } from 'mongoose';
import { ICategoryDocument } from '@/types/category';

// ─── Sub-Schemas ────────────────────────────────────────────────────────────

const GradientSchema = new Schema(
  {
    from: { type: String, required: true },
    via: { type: String, default: null },
    to: { type: String, required: true },
  },
  { _id: false }
);

// ─── Schema Definition ─────────────────────────────────────────────────────

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    gradient: {
      type: GradientSchema,
      required: [true, 'Gradient is required'],
    },
    iconSet: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
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

// slug unique index is created by `unique: true` on the field
CategorySchema.index({ isFeatured: 1 });
CategorySchema.index({ sortOrder: 1 });

// ─── Model Export ───────────────────────────────────────────────────────────

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);

export default Category;
