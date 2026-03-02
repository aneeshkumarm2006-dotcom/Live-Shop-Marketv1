import { Types, Document } from 'mongoose';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type NotificationType = 'live_now' | 'reminder' | 'system';

// ─── Notification (Phase 2 forward-compatible) ─────────────────────────────

export interface INotification {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedSessionId?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

export interface INotificationDocument extends INotification, Document {
  _id: Types.ObjectId;
}
