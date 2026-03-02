import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserDocument } from '@/types/user';

// ─── Schema Definition ─────────────────────────────────────────────────────

const NotificationPreferencesSchema = new Schema(
  {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: ['buyer', 'creator'],
        message: 'Role must be either buyer or creator',
      },
      required: [true, 'Role is required'],
      default: 'buyer',
    },

    // ── Password Reset Fields ────────────────────────────────────────────
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    // ── 🔮 Phase 2 Fields ──────────────────────────────────────────────────
    notificationPreferences: {
      type: NotificationPreferencesSchema,
      default: () => ({ email: true, push: false, inApp: true }),
    },
    stripeCustomerId: {
      type: String,
      default: null,
      sparse: true,
    },
    subscriptionTier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'trialing', 'unpaid'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.password;
        delete obj.__v;
        return obj;
      },
    },
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────

// email unique index is created by `unique: true` on the field
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// ─── Pre-save Hook: Hash Password ──────────────────────────────────────────

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Method: Compare Password ─────────────────────────────────────

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Model Export ───────────────────────────────────────────────────────────

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
