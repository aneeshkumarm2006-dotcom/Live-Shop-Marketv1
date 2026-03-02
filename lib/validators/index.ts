// ─── Auth Validators ────────────────────────────────────────────────────────
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
} from './auth';

// ─── Session Validators ────────────────────────────────────────────────────
export {
  createSessionSchema,
  updateSessionSchema,
  scheduleSessionSchema,
  updateSessionStatusSchema,
  sessionQuerySchema,
  type CreateSessionInput,
  type UpdateSessionInput,
  type ScheduleSessionInput,
  type UpdateSessionStatusInput,
  type SessionQueryInput,
} from './session';

// ─── Creator Validators ────────────────────────────────────────────────────
export {
  updateCreatorProfileSchema,
  createCreatorProfileSchema,
  type UpdateCreatorProfileInput,
  type CreateCreatorProfileInput,
} from './creator';

// ─── Favorite Validators ───────────────────────────────────────────────────
export {
  toggleFavoriteSchema,
  favoriteQuerySchema,
  type ToggleFavoriteInput,
  type FavoriteQueryInput,
} from './favorite';

// ─── User Validators ───────────────────────────────────────────────────────
export {
  updateUserProfileSchema,
  dashboardQuerySchema,
  type UpdateUserProfileInput,
  type DashboardQueryInput,
} from './user';

// ─── URL Validators ────────────────────────────────────────────────────────
export {
  youtubeUrlSchema,
  instagramUrlSchema,
  tiktokUrlSchema,
  facebookUrlSchema,
  externalUrlSchema,
  socialLinksSchema,
  getUrlSchemaForPlatform,
} from './url';
