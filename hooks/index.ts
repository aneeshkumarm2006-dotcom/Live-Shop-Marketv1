// LiveShopMarket — React Query Hooks
// Barrel export for all data-fetching hooks

export {
  useSessions,
  useSession,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
  useUpdateSessionStatus,
  sessionKeys,
  type SessionsQueryParams,
  type CreateSessionPayload,
  type UpdateSessionPayload,
  type UpdateSessionStatusPayload,
} from './useSessions';

export {
  useCategories,
  useCategory,
  categoryKeys,
  type CategoriesQueryParams,
  type CategoryWithStats,
  type CategoryStats,
} from './useCategories';

export {
  useCreators,
  useCreator,
  useCreatorSessions,
  useUpdateCreator,
  creatorKeys,
  type CreatorsQueryParams,
  type UpdateCreatorPayload,
  type CreatorSessionsQueryParams,
} from './useCreators';

export {
  useFavorites,
  useIsFavorited,
  useToggleFavorite,
  favoriteKeys,
  type FavoritesQueryParams,
  type FavoriteCheckResponse,
} from './useFavorites';

export {
  useUser,
  useUpdateUser,
  useDashboard,
  userKeys,
  type UpdateUserPayload,
  type DashboardQueryParams,
} from './useUser';
