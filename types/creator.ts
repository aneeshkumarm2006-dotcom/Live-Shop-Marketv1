import { Types, Document } from 'mongoose';

// ─── Social Links ───────────────────────────────────────────────────────────

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
}

// ─── Platform Tokens (Phase 2 — encrypted) ─────────────────────────────────

export interface PlatformTokens {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
}

// ─── Analytics Data (Phase 2) ───────────────────────────────────────────────

export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  averageCTR: number;
  followerGrowth: number[];
  lastUpdated?: Date;
}

// ─── Creator ────────────────────────────────────────────────────────────────

export interface ICreator {
  userId: Types.ObjectId;
  displayName: string;
  bio?: string;
  profileImage?: string;
  socialLinks: SocialLinks;
  isVerified: boolean;
  followerCount: number;
  categories: Types.ObjectId[];

  // 🔮 Phase 2 fields
  platformTokens?: PlatformTokens;
  analyticsData?: AnalyticsData;
  promotionCredits: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatorDocument extends ICreator, Document {
  _id: Types.ObjectId;
}
