import { Types, Document } from 'mongoose';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'other';

export type SessionStatus = 'scheduled' | 'live' | 'ended';

export type PromotionTier = 'none' | 'basic' | 'featured' | 'spotlight';

// ─── Live Session ───────────────────────────────────────────────────────────

export interface ILiveSession {
  creatorId: Types.ObjectId;
  title: string;
  description?: string;
  externalUrl: string;
  platform: Platform;
  thumbnailUrl?: string;
  categoryId: Types.ObjectId;
  status: SessionStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;

  // 🔮 Phase 2 fields
  viewerCount: number;
  clickCount: number;
  isPromoted: boolean;
  promotionTier: PromotionTier;
  promotionExpiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ILiveSessionDocument extends ILiveSession, Document {
  _id: Types.ObjectId;
}
