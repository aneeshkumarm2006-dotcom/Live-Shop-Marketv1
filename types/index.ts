// LiveShopMarket — Shared TypeScript Types
// Barrel export for all type definitions

export type {
  IUser,
  IUserDocument,
  UserRole,
  SubscriptionTier,
  SubscriptionStatus,
  NotificationPreferences,
} from './user';

export type {
  ICreator,
  ICreatorDocument,
  SocialLinks,
  PlatformTokens,
  AnalyticsData,
} from './creator';

export type {
  ILiveSession,
  ILiveSessionDocument,
  Platform,
  SessionStatus,
  PromotionTier,
} from './liveSession';

export type { ICategory, ICategoryDocument, CategoryGradient } from './category';

export type { IFavorite, IFavoriteDocument } from './favorite';

export type {
  ISubscription,
  ISubscriptionDocument,
  NotifyChannel,
  SubscriptionPlanTier,
} from './subscription';

export type { INotification, INotificationDocument, NotificationType } from './notification';
