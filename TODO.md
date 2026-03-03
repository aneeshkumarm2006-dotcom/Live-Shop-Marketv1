# LiveShopMarket — Development TODO List

> **Generated from:** PRD.md, TECH_STACK.md, DESIGN.md
> **Scope:** Phase 1 (with Phase 2 forward-compatibility noted via 🔮)
> **Task granularity:** 1–4 hours each

---

## 1. Project Setup & Configuration

### 1.1 Initialize Project

- [ ] **Initialize Next.js 14 project with App Router & TypeScript**
  - Files: `package.json`, `tsconfig.json`, `next.config.js`, `app/layout.tsx`
  - Run `npx create-next-app@14 --typescript --app --tailwind`
  - Dependencies: None

- [ ] **Install and configure Tailwind CSS with design tokens**
  - Files: `tailwind.config.ts`, `app/globals.css`
  - Add custom colors from DESIGN.md (Neon Yellow-Green `#D4FF00`, Deep Navy `#1A1A2E`, Charcoal `#333333`, category gradients)
  - Add spacing scale (8px base unit), border-radius tokens, font config
  - Dependencies: Project init

- [ ] **Install core dependencies**
  - Packages: `mongoose`, `next-auth`, `zustand`, `@tanstack/react-query`, `axios`, `react-hook-form`, `zod`, `bcrypt`, `jsonwebtoken`, `framer-motion`, `lucide-react`, `@headlessui/react`
  - Dependencies: Project init

- [ ] **Install dev dependencies & configure linting**
  - Packages: `eslint`, `prettier`, `husky`, `lint-staged`, `jest`, `@testing-library/react`, `playwright`
  - Files: `.eslintrc.json`, `.prettierrc`, `.husky/pre-commit`, `jest.config.ts`
  - Dependencies: Project init

- [ ] **Set up environment variables structure**
  - Files: `.env.local`, `.env.example`
  - Variables: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDINARY_*`, `SENDGRID_API_KEY`
  - 🔮 Phase 2: Reserve `STRIPE_*`, `REDIS_URL`, `FIREBASE_*`, `KLAVIYO_*` in `.env.example`
  - Dependencies: Project init

- [ ] **Set up project folder structure**
  - Create directories:
    ```
    app/(auth)/ , app/(dashboard)/ , app/(public)/
    components/ui/ , components/layout/ , components/cards/ , components/forms/
    lib/ , lib/db/ , lib/validators/
    models/
    hooks/
    store/
    types/
    public/icons/ , public/images/
    ```
  - Dependencies: Project init

### 1.2 Database Setup

- [ ] **Set up MongoDB Atlas cluster (or local Docker instance)**
  - Create M0 free-tier cluster for development
  - Configure network access and DB user credentials
  - Dependencies: None

- [ ] **Create MongoDB connection utility**
  - Files: `lib/db/mongoose.ts`
  - Implement singleton connection with connection pooling
  - Handle connection caching for serverless environment
  - Dependencies: MongoDB Atlas setup, core dependencies

---

## 2. Database Schemas

### 2.1 User Schema

- [ ] **Define User model**
  - Files: `models/User.ts`, `types/user.ts`
  - Fields: `name`, `email`, `password` (hashed), `image`, `role` (enum: `buyer` | `creator`), `createdAt`, `updatedAt`
  - 🔮 Phase 2 fields (include now, default null): `notificationPreferences` (object: `email`, `push`, `inApp` booleans), `stripeCustomerId`, `subscriptionTier`, `subscriptionStatus`
  - Indexes: unique on `email`, index on `role`
  - Dependencies: MongoDB connection utility

### 2.2 Creator Schema

- [ ] **Define Creator model**
  - Files: `models/Creator.ts`, `types/creator.ts`
  - Fields: `userId` (ref User), `displayName`, `bio`, `profileImage`, `socialLinks` (object: `instagram`, `tiktok`, `youtube`, `facebook`), `isVerified`, `followerCount` (default 0), `categories` (array of refs), `createdAt`, `updatedAt`
  - 🔮 Phase 2 fields: `platformTokens` (encrypted object for API tokens), `analyticsData` (object), `promotionCredits`
  - Indexes: index on `userId` (unique), `followerCount`, `categories`, text index on `displayName`
  - Dependencies: User model

### 2.3 LiveSession Schema

- [ ] **Define LiveSession model**
  - Files: `models/LiveSession.ts`, `types/liveSession.ts`
  - Fields: `creatorId` (ref Creator), `title`, `description`, `externalUrl`, `platform` (enum: `youtube` | `instagram` | `tiktok` | `facebook` | `other`), `thumbnailUrl`, `categoryId` (ref Category), `status` (enum: `scheduled` | `live` | `ended`), `scheduledAt` (Date, nullable), `startedAt`, `endedAt`, `createdAt`, `updatedAt`
  - 🔮 Phase 2 fields: `viewerCount`, `clickCount`, `isPromoted`, `promotionTier`, `promotionExpiresAt`
  - Indexes: index on `status`, `creatorId`, `categoryId`, `scheduledAt`, compound index `{status, categoryId}`, `{creatorId, status}`
  - Dependencies: Creator model, Category model

### 2.4 Category Schema

- [ ] **Define Category model**
  - Files: `models/Category.ts`, `types/category.ts`
  - Fields: `name`, `slug`, `description`, `gradient` (object: `from`, `via?`, `to`), `iconSet` (array of icon identifiers), `isFeatured`, `sortOrder`, `createdAt`
  - Indexes: unique on `slug`, index on `isFeatured`
  - Dependencies: MongoDB connection utility

- [ ] **Create category seed script**
  - Files: `lib/db/seed-categories.ts`
  - Seed: Tech & Gadgets, Beauty & Personal Care, Wellness, Sports & Fitness, Fashion (with gradients from DESIGN.md)
  - Dependencies: Category model

### 2.5 Favorite Schema

- [ ] **Define Favorite model**
  - Files: `models/Favorite.ts`, `types/favorite.ts`
  - Fields: `userId` (ref User), `creatorId` (ref Creator), `createdAt`
  - Indexes: compound unique index `{userId, creatorId}`, index on `userId`, `creatorId`
  - Dependencies: User model, Creator model

### 2.6 Subscription Schema (Phase 2 forward-compatible)

- [ ] **Define Subscription model stub** 🔮
  - Files: `models/Subscription.ts`, `types/subscription.ts`
  - Fields: `userId` (ref User), `creatorId` (ref Creator), `notifyVia` (array: `email` | `push` | `inApp`), `isActive`, `createdAt`, `updatedAt`
  - 🔮 Phase 2 fields: `stripeSubscriptionId`, `tier`, `expiresAt`
  - Indexes: compound unique index `{userId, creatorId}`
  - Note: Schema defined now; API endpoints built in Phase 2
  - Dependencies: User model, Creator model

### 2.7 Notification Schema Stub 🔮

- [ ] **Define Notification model stub**
  - Files: `models/Notification.ts`, `types/notification.ts`
  - Fields: `userId` (ref User), `type` (enum: `live_now` | `reminder` | `system`), `title`, `message`, `relatedSessionId` (ref LiveSession), `isRead`, `createdAt`
  - Note: Schema defined now; logic built in Phase 2
  - Dependencies: User model, LiveSession model

---

## 3. Zod Validators

- [ ] **Create Zod validation schemas for API input**
  - Files: `lib/validators/auth.ts`, `lib/validators/session.ts`, `lib/validators/creator.ts`, `lib/validators/favorite.ts`
  - Validate: registration input, login input, session creation/update, creator profile update, URL format validation (YouTube, Instagram, TikTok, Facebook patterns)
  - Dependencies: Types defined

---

## 4. Authentication System

- [ ] **Configure NextAuth.js with credentials provider**
  - Files: `app/api/auth/[...nextauth]/route.ts`, `lib/auth.ts`
  - Implement email/password credentials provider
  - Configure JWT strategy with role in token payload
  - Set up session callback to include `userId`, `role`
  - Dependencies: User model, bcrypt

- [ ] **Add Google OAuth provider**
  - Files: update `lib/auth.ts`
  - Configure Google provider with client ID/secret
  - Handle account linking for existing email users
  - Dependencies: NextAuth credentials setup

- [ ] **Build registration API endpoint**
  - Files: `app/api/auth/register/route.ts`
  - Accept: `name`, `email`, `password`, `role` (buyer/creator)
  - Hash password with bcrypt, create User document
  - If role is `creator`, also create Creator profile document
  - Validate with Zod
  - Dependencies: User model, Creator model, Zod validators

- [ ] **Create auth middleware/helpers**
  - Files: `lib/auth-helpers.ts`
  - Helper: `getServerSession()` wrapper, `requireAuth()`, `requireCreator()` middleware
  - Dependencies: NextAuth config

- [ ] **Build password reset flow**
  - Files: `app/api/auth/forgot-password/route.ts`, `app/api/auth/reset-password/route.ts`
  - Generate secure reset token, send email via SendGrid/Resend
  - Token expiry (1 hour)
  - Dependencies: User model, email service integration

---

## 5. API Endpoints

### 5.1 Category APIs

- [ ] **GET /api/categories — List all categories**
  - Files: `app/api/categories/route.ts`
  - Return all categories sorted by `sortOrder`
  - Cache-friendly (ISR compatible)
  - Dependencies: Category model

- [ ] **GET /api/categories/[slug] — Get single category with stats**
  - Files: `app/api/categories/[slug]/route.ts`
  - Return category details + count of live sessions + count of creators
  - Dependencies: Category model, LiveSession model

### 5.2 Live Session APIs

- [ ] **POST /api/sessions — Create a live session**
  - Files: `app/api/sessions/route.ts`
  - Auth: Creator only
  - Validate external URL format
  - Accept all LiveSession fields
  - Dependencies: LiveSession model, auth middleware, Zod validators

- [ ] **GET /api/sessions — List sessions with filters**
  - Files: `app/api/sessions/route.ts`
  - Query params: `status` (live/scheduled/ended), `categoryId`, `creatorId`, `sort` (recent/popular), `page`, `limit`
  - Populate creator name & profile image
  - 🔮 Phase 2: Add `promoted` filter, sort by promotion tier
  - Dependencies: LiveSession model

- [ ] **GET /api/sessions/[id] — Get session details**
  - Files: `app/api/sessions/[id]/route.ts`
  - Return full session with populated creator and category
  - 🔮 Phase 2: Increment `viewerCount` on access
  - Dependencies: LiveSession model

- [ ] **PUT /api/sessions/[id] — Update session**
  - Files: `app/api/sessions/[id]/route.ts`
  - Auth: Session owner only
  - Allow updating all editable fields including `status` transitions
  - Dependencies: LiveSession model, auth middleware

- [ ] **DELETE /api/sessions/[id] — Delete session**
  - Files: `app/api/sessions/[id]/route.ts`
  - Auth: Session owner only
  - Dependencies: LiveSession model, auth middleware

- [ ] **PATCH /api/sessions/[id]/status — Update session status (go live / end)**
  - Files: `app/api/sessions/[id]/status/route.ts`
  - Auth: Session owner only
  - Transitions: `scheduled → live`, `live → ended`
  - Set `startedAt` / `endedAt` timestamps
  - 🔮 Phase 2: Trigger notification to subscribers when status → `live`
  - Dependencies: LiveSession model, auth middleware

### 5.3 Creator APIs

- [ ] **GET /api/creators — List creators with filters**
  - Files: `app/api/creators/route.ts`
  - Query params: `categoryId`, `search`, `sort` (followers/recent), `page`, `limit`
  - Dependencies: Creator model

- [ ] **GET /api/creators/[id] — Get creator profile**
  - Files: `app/api/creators/[id]/route.ts`
  - Return full profile with follower count, social links, active sessions
  - Dependencies: Creator model, LiveSession model

- [ ] **PUT /api/creators/[id] — Update creator profile**
  - Files: `app/api/creators/[id]/route.ts`
  - Auth: Profile owner only
  - Update: `displayName`, `bio`, `profileImage`, `socialLinks`, `categories`
  - Dependencies: Creator model, auth middleware

### 5.4 Favorites APIs

- [x] **POST /api/favorites — Add a favorite**
  - Files: `app/api/favorites/route.ts`
  - Auth: Buyer or any authenticated user
  - Increment `followerCount` on Creator document
  - Dependencies: Favorite model, Creator model, auth middleware

- [x] **DELETE /api/favorites/[creatorId] — Remove a favorite**
  - Files: `app/api/favorites/[creatorId]/route.ts`
  - Auth: Owner of the favorite
  - Decrement `followerCount` on Creator document
  - Dependencies: Favorite model, Creator model, auth middleware

- [x] **GET /api/favorites — List user's favorites**
  - Files: `app/api/favorites/route.ts`
  - Auth: Authenticated user
  - Return favorited creators with latest session info
  - Dependencies: Favorite model, Creator model, LiveSession model

- [x] **GET /api/favorites/check/[creatorId] — Check if creator is favorited**
  - Files: `app/api/favorites/check/[creatorId]/route.ts`
  - Auth: Authenticated user
  - Return `{ isFavorited: boolean }`
  - Dependencies: Favorite model

### 5.5 Dashboard APIs

- [ ] **GET /api/dashboard/creator — Creator dashboard data**
  - Files: `app/api/dashboard/creator/route.ts`
  - Auth: Creator only
  - Return: live sessions, scheduled sessions, past sessions (paginated), follower count
  - 🔮 Phase 2: Include analytics summary, promotion stats
  - Dependencies: LiveSession model, Creator model, Favorite model

- [ ] **GET /api/dashboard/buyer — Buyer dashboard data**
  - Files: `app/api/dashboard/buyer/route.ts`
  - Auth: Authenticated buyer
  - Return: favorited creators list, upcoming sessions from favorited creators
  - Dependencies: Favorite model, LiveSession model, Creator model

### 5.6 Image Upload API

- [ ] **POST /api/upload — Upload image to Cloudinary**
  - Files: `app/api/upload/route.ts`
  - Auth: Authenticated user
  - Accept image file, upload to Cloudinary, return URL
  - Use for: profile images, session thumbnails, brand banners
  - Dependencies: Cloudinary SDK setup

---

## 6. State Management & Data Fetching Setup

- [ ] **Configure React Query (TanStack Query) provider**
  - Files: `components/providers/QueryProvider.tsx`, update `app/layout.tsx`
  - Set default stale time, cache time, retry config
  - Dependencies: Core dependencies installed

- [ ] **Create Zustand stores**
  - Files: `store/useAuthStore.ts`, `store/useUIStore.ts`
  - Auth store: current user, role, login status
  - UI store: mobile menu open, active filters, search query
  - Dependencies: Zustand installed

- [ ] **Create React Query hooks for API calls**
  - Files: `hooks/useCategories.ts`, `hooks/useSessions.ts`, `hooks/useCreators.ts`, `hooks/useFavorites.ts`
  - Wrap all API endpoints with `useQuery` / `useMutation` hooks
  - Handle optimistic updates for favorites toggle
  - Dependencies: React Query provider, API endpoints defined

---

## 7. Frontend — Layout & Shared Components

### 7.1 App Layout

- [ ] **Build root layout with font & metadata config**
  - Files: `app/layout.tsx`
  - Configure Inter font via `next/font`
  - Set base metadata: title, description, OG tags
  - Wrap with QueryProvider, SessionProvider (NextAuth)
  - Dependencies: React Query provider, NextAuth config

- [ ] **Build navigation header component**
  - Files: `components/layout/Header.tsx`
  - Fixed white header (72px height) with subtle shadow
  - Logo "LiveShopMarket" in Deep Navy bold left-aligned
  - Center nav links: Home, Categories, (How It Works)
  - Right: "Sign Up" button (neon yellow-green, 24px radius) when logged out; "My Account" dropdown when logged in
  - Mobile: Hamburger menu with Headless UI `Disclosure`
  - Dependencies: Design tokens in Tailwind, auth state

- [ ] **Build footer component**
  - Files: `components/layout/Footer.tsx`
  - Links, social icons, copyright
  - Dependencies: None

- [ ] **Build mobile navigation drawer**
  - Files: `components/layout/MobileNav.tsx`
  - Headless UI `Dialog` for slide-out navigation
  - Full nav links + auth actions
  - Dependencies: Header component

### 7.2 UI Primitives

- [ ] **Build Button component variants**
  - Files: `components/ui/Button.tsx`
  - Variants: `primary` (neon yellow-green), `secondary` (white/border), `ghost`, `danger`
  - Sizes: `sm`, `md`, `lg`
  - States: hover (darken 10%), disabled, loading spinner
  - 24px border radius for primary, 20px for secondary
  - Dependencies: Tailwind config

- [ ] **Build Badge component**
  - Files: `components/ui/Badge.tsx`
  - Variants: `live` (orange `#FF6B3D` pill with play icon, pulse animation), `scheduled`, `ended`, `category`
  - Dependencies: Framer Motion (for pulse), Lucide icons

- [ ] **Build Search Bar component**
  - Files: `components/ui/SearchBar.tsx`
  - Pill-shaped (24px radius), white background, light border
  - Magnifying glass icon right-aligned
  - Placeholder text, debounced `onChange`
  - Dependencies: Lucide icons

- [ ] **Build Modal / Dialog component**
  - Files: `components/ui/Modal.tsx`
  - Headless UI `Dialog` wrapper with overlay, transitions
  - Sizes: `sm`, `md`, `lg`, `xl` (for sign-up split modal)
  - Dependencies: Headless UI, Framer Motion

- [ ] **Build Avatar component**
  - Files: `components/ui/Avatar.tsx`
  - Circular image with fallback initials
  - Sizes: `sm` (32px), `md` (48px), `lg` (120px for profile)
  - Next.js `<Image>` optimized
  - Dependencies: None

- [ ] **Build Sort/Filter controls component**
  - Files: `components/ui/SortFilter.tsx`
  - Dropdown for sort (Recent, Popular)
  - Category filter pills / dropdown
  - Dependencies: Headless UI

### 7.3 Card Components

- [x] **Build Category Card component**
  - Files: `components/cards/CategoryCard.tsx`
  - 3:2 aspect ratio, 16px border radius
  - Category-specific gradient backgrounds (from DESIGN.md palette)
  - White title text on semi-transparent rounded rectangle
  - Hover: lift 4px + shadow expansion, scale 1.02, 200ms ease
  - Placeholder state: light gray `#E5E5E5`
  - Dependencies: Category type, Framer Motion

- [x] **Build Live Stream Card component**
  - Files: `components/cards/LiveStreamCard.tsx`
  - Vertical card: thumbnail (16:9), title, metadata
  - LIVE badge (orange pill, top-left) with pulse animation
  - Platform badge ("Watch on Instagram/TikTok/QVC" with logos)
  - Brand name in gray below title
  - Click navigates to session detail or external link
  - Dependencies: Badge component, platform icons

- [x] **Build Brand/Creator Card component**
  - Files: `components/cards/BrandCard.tsx`
  - Square format, 12px border radius
  - Gray placeholder thumbnail
  - Heart icon (outline/filled) top-right for favorite toggle
  - Brand name centered below
  - Dependencies: Avatar component, Favorite hook

- [x] **Build Upcoming Session Row component**
  - Files: `components/cards/UpcomingSessionRow.tsx`
  - Table-style row: Date, Time, Stream Title, Platforms, "Remind Me" button
  - Clean white with light dividers
  - Dependencies: Button component

---

## 8. Frontend — Pages

### 8.1 Homepage

- [x] **Build homepage hero section**
  - Files: `app/page.tsx`, `components/home/HeroSection.tsx`
  - Vibrant blue gradient background with floating video frame elements
  - Large "LiveShopMarket" title in white
  - Tagline text
  - Centered prominent search bar
  - Dependencies: SearchBar component, design tokens

- [x] **Build homepage category sections (horizontally scrollable)**
  - Files: `components/home/CategoryRow.tsx`
  - Labeled rows: "Fashion", "Tech & Gadgets", "Health & Wellness"
  - 4–5 brand cards per visible row, horizontal scroll
  - Section header with category name + arrow icon link to full category page
  - Dependencies: BrandCard component, useCategories hook, useSessions hook

- [x] **Build homepage CTA banner**
  - Files: `components/home/CTABanner.tsx`
  - Deep blue background with lifestyle photography
  - "Never Miss a Live Moment" headline
  - "Sign Up for Free" yellow-green button
  - Dependencies: Button component

- [x] **Build live stream notification banner**
  - Files: `components/home/LiveNotificationBanner.tsx`
  - Sticky bottom banner: yellow-green gradient with coral accent
  - Megaphone icon, bold message, multiple "Watch on" buttons
  - Bell icon with shake animation
  - Slide-up entry (300ms ease-out)
  - Show when a favorited creator goes live
  - Dependencies: Framer Motion, platform icons, Zustand UI store

### 8.2 All Categories Page

- [ ] **Build all categories page**
  - Files: `app/(public)/categories/page.tsx`
  - Light gray header with breadcrumb
  - "All Categories" centered title
  - 3-column grid (responsive to 2/1) of full category cards with gradients + illustrations
  - Gray placeholders for future categories
  - Dependencies: CategoryCard component, useCategories hook

### 8.3 Single Category Page

- [ ] **Build category hero banner**
  - Files: `app/(public)/categories/[slug]/page.tsx`, `components/category/CategoryHeroBanner.tsx`
  - Full-width gradient banner with 3D illustrations (~240px height)
  - Large category name centered in white
  - Dependencies: Category data, design tokens

- [ ] **Build category filter controls bar**
  - Files: `components/category/CategoryFilters.tsx`
  - Left: yellow-green "Browse Live Brands" button
  - Right: search bar + sort icon
  - Dependencies: SearchBar, SortFilter, Button components

- [ ] **Build category live streams grid**
  - Files: `components/category/LiveStreamsSection.tsx`
  - Top section: prominent display of live-now sessions (up to 3)
  - Below: brand/creator grid (5 columns desktop)
  - Dependencies: LiveStreamCard, BrandCard components, useSessions hook

### 8.4 Brand/Creator Profile Page

- [x] **Build creator profile header section**
  - Files: `app/(public)/creators/[id]/page.tsx`, `components/creator/CreatorHeader.tsx`
  - Light gray background with breadcrumb
  - Gray banner placeholder (16:4 ratio)
  - Circular avatar (120px), creator name, category tag, timestamp, follower count
  - "Top 3" badge if applicable
  - Multi-line bio
  - Social media icons (TikTok, Instagram, QVC links)
  - Favorite button: heart icon + "Favorite this brand and get notified when they go live!"
  - Dependencies: Avatar, Badge, Button components, useCreators hook, useFavorites hook

- [x] **Build creator upcoming streams table**
  - Files: `components/creator/UpcomingStreams.tsx`
  - Table columns: Date, Time, Stream Title, Platforms, Actions
  - "Remind Me" yellow-green button per row
  - Empty state when no upcoming streams
  - Dependencies: UpcomingSessionRow component, useSessions hook

- [x] **Build creator previous streams grid**
  - Files: `components/creator/PreviousStreams.tsx`
  - Horizontal scrollable thumbnail grid of past streams
  - Dependencies: LiveStreamCard component, useSessions hook

### 8.5 Authentication Pages

- [x] **Build sign-up modal (split layout)**
  - Files: `app/(auth)/signup/page.tsx`
  - Left panel: white form — Email, Password, Name, Role selector (Buyer/Creator)
  - Right panel: yellow-green gradient + megaphone icon + text callout
  - "Create My Account" full-width yellow-green button
  - Mobile: single-column with image header
  - Dependencies: Modal component, react-hook-form, Zod, registration API

- [x] **Build login modal**
  - Files: `app/(auth)/login/page.tsx`
  - Email + password fields
  - "Forgot password?" link
  - Google OAuth button
  - Dependencies: Modal component, NextAuth signIn

- [x] **Build forgot password page**
  - Files: `app/(auth)/forgot-password/page.tsx`
  - Email input, submit button
  - Success message state
  - Dependencies: Password reset API

- [x] **Build reset password page**
  - Files: `app/(auth)/reset-password/page.tsx`
  - Token from URL, new password + confirm fields
  - Dependencies: Password reset API

### 8.6 Creator Dashboard

- [ ] **Build creator dashboard layout & overview**
  - Files: `app/(dashboard)/dashboard/creator/page.tsx`, `components/dashboard/CreatorOverview.tsx`
  - Summary cards: total followers, live now count, scheduled count, past sessions count
  - 🔮 Phase 2: analytics charts placeholder area
  - Dependencies: Dashboard API, auth (creator guard)

- [ ] **Build creator sessions management table**
  - Files: `components/dashboard/CreatorSessionsTable.tsx`
  - Tabs: "Live Now", "Scheduled", "Past"
  - Table with: title, status, date, platform, actions (edit/delete/go-live)
  - Pagination
  - Dependencies: useSessions hook, Button/Badge components

- [ ] **Build create/edit session form**
  - Files: `components/dashboard/SessionForm.tsx`
  - Fields: title, description, external URL (with platform auto-detect), thumbnail upload, category select, schedule date/time (optional)
  - URL validation with real-time feedback
  - Dependencies: react-hook-form, Zod, upload API, useCategories hook

- [ ] **Build "Go Live" / "End Session" quick actions**
  - Files: `components/dashboard/SessionActions.tsx`
  - One-click status transitions with confirmation dialog
  - Dependencies: Session status API, Modal component

### 8.7 Buyer Dashboard

- [x] **Build buyer dashboard page**
  - Files: `app/(dashboard)/dashboard/buyer/page.tsx`
  - Section: "My Favorite Creators" list with avatars, names, live status indicator
  - Section: "Upcoming From Favorites" — sessions from favorited creators
  - Quick unfavorite action
  - Dependencies: Dashboard buyer API, BrandCard, UpcomingSessionRow components

### 8.8 Session Detail Page (optional standalone)

- [ ] **Build session detail page**
  - Files: `app/(public)/sessions/[id]/page.tsx`
  - Full session info: title, description, thumbnail, creator card, category
  - Prominent "Watch on [Platform]" CTA button
  - Related sessions from same creator or category
  - Dependencies: Session API, CreatorHeader components

---

## 9. 3D Illustrations & Static Assets

- [ ] **Create/source 3D isometric illustrations for categories**
  - Files: `public/images/categories/tech.svg`, `beauty.svg`, `wellness.svg`, `sports.svg`, `fashion.svg`
  - Style: playful rounded 3D objects with soft shadows per DESIGN.md
  - Dependencies: None (can be done in parallel)

- [ ] **Add platform logo icons**
  - Files: `public/icons/youtube.svg`, `instagram.svg`, `tiktok.svg`, `facebook.svg`, `qvc.svg`
  - Dependencies: None

- [ ] **Create hero section decorative elements**
  - Files: `public/images/hero/` — floating video frames, abstract shapes
  - Dependencies: None

---

## 10. Animations & Micro-interactions

- [ ] **Implement card hover animations**
  - Files: Update card components
  - Lift 4px + shadow expansion, scale 1.02, 200ms ease transition
  - Dependencies: Card components built

- [ ] **Implement LIVE badge pulse animation**
  - Files: `components/ui/Badge.tsx`
  - CSS or Framer Motion: 1.05 scale pulse, 1.5s infinite, subtle orange glow
  - Dependencies: Badge component

- [ ] **Implement favorite icon interaction**
  - Files: Update `BrandCard.tsx`, `CreatorHeader.tsx`
  - Scale pulse on click + fill transition
  - Optimistic UI update via React Query
  - Dependencies: Favorite API, React Query hooks

- [ ] **Implement navigation link hover underline**
  - Files: `components/layout/Header.tsx`
  - Underline slide-in from left, 200ms
  - Dependencies: Header component

- [ ] **Implement notification banner slide-up animation**
  - Files: `components/home/LiveNotificationBanner.tsx`
  - Framer Motion: slide up from bottom, 300ms ease-out
  - Bell icon continuous gentle shake
  - Dependencies: Framer Motion, banner component

---

## 11. SEO & Performance Optimization

- [ ] **Configure Next.js metadata API for all pages**
  - Files: Each page's `metadata` export or `generateMetadata()`
  - Dynamic OG images for category and creator pages
  - Dependencies: All pages built

- [ ] **Implement ISR for category pages**
  - Files: `app/(public)/categories/page.tsx`, `app/(public)/categories/[slug]/page.tsx`
  - `revalidate` interval: 60s for category listings
  - Dependencies: Category pages built

- [ ] **Implement Next.js Image optimization across all components**
  - Files: All components using images
  - Use `<Image>` with proper `width`, `height`, `priority` for above-fold
  - Dependencies: All image-using components built

- [ ] **Add loading skeletons for all data-fetching pages**
  - Files: `app/(public)/loading.tsx`, `app/(public)/categories/loading.tsx`, etc.
  - Card skeleton grid, hero skeleton
  - Dependencies: Page structures defined

---

## 12. Integrations

- [ ] **Set up Cloudinary SDK for image uploads**
  - Files: `lib/cloudinary.ts`
  - Configure upload presets, transformation configs
  - Dependencies: Cloudinary account, env vars

- [ ] **Set up SendGrid / Resend for transactional emails**
  - Files: `lib/email.ts`
  - Templates: welcome email, password reset email
  - 🔮 Phase 2: live notification email, session reminder email
  - Dependencies: SendGrid/Resend account, env vars

- [ ] **Create URL validation utility for external platforms**
  - Files: `lib/validators/url.ts`
  - Validate and detect platform from URL (YouTube, Instagram, TikTok, Facebook)
  - Extract platform-specific metadata if possible
  - Dependencies: None

---

## 13. Real-Time Features (Optional Phase 1 / Phase 2 Bridge)

- [ ] **Evaluate and prototype Socket.io for live status updates** 🔮
  - Files: `lib/socket.ts`, `app/api/socket/route.ts`
  - Broadcast when a session transitions to `live`
  - Client listener to update session cards in real-time
  - Note: Can defer to Phase 2; use polling as Phase 1 fallback
  - Dependencies: Socket.io installed

- [ ] **Implement polling fallback for live session status**
  - Files: Update `hooks/useSessions.ts`
  - React Query `refetchInterval` (30s) for live session lists
  - Dependencies: React Query hooks

---

## 14. Security & Middleware

- [ ] **Add rate limiting to API routes**
  - Files: `lib/rate-limit.ts`, apply in API routes
  - Use in-memory or Upstash Redis rate limiter
  - Limits: 100 req/min for reads, 20 req/min for writes
  - Dependencies: API routes built

- [ ] **Add CORS and security headers**
  - Files: `next.config.js`, `middleware.ts`
  - CSP headers, X-Frame-Options, X-Content-Type-Options
  - Dependencies: None

- [ ] **Add input sanitization middleware**
  - Files: `lib/sanitize.ts`
  - Sanitize all user-generated text inputs (XSS protection)
  - Dependencies: Zod validators

---

## 15. Testing

- [ ] **Write unit tests for Zod validators**
  - Files: `__tests__/validators/*.test.ts`
  - Test all validation schemas with valid/invalid inputs
  - Dependencies: Validators defined, Jest configured

- [ ] **Write unit tests for API route handlers**
  - Files: `__tests__/api/*.test.ts`
  - Test CRUD operations, auth guards, error responses
  - Dependencies: API routes built, Jest configured

- [ ] **Write component tests for card components**
  - Files: `__tests__/components/*.test.tsx`
  - Test rendering, hover states, click handlers
  - Dependencies: Components built, React Testing Library

- [ ] **Write E2E tests for critical user flows**
  - Files: `e2e/auth.spec.ts`, `e2e/discovery.spec.ts`, `e2e/creator-dashboard.spec.ts`
  - Flows: Sign up → browse → favorite → dashboard
  - Creator: Register → create session → go live → end
  - Dependencies: Playwright configured, full app running

---

## 16. Deployment & CI/CD

- [ ] **Set up Vercel project and connect GitHub repo**
  - Configure environment variables in Vercel dashboard
  - Set up preview deployments for PRs
  - Dependencies: GitHub repo created

- [ ] **Configure GitHub Actions CI pipeline**
  - Files: `.github/workflows/ci.yml`
  - Steps: install → lint → type-check → test → build
  - Dependencies: Linting and testing configured

- [ ] **Set up MongoDB Atlas production cluster**
  - Upgrade to M10 (or appropriate tier)
  - Configure IP whitelisting for Vercel
  - Set up automated daily backups
  - Dependencies: Vercel deployment

- [ ] **Set up Sentry for error monitoring**
  - Files: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
  - Configure source maps upload
  - Dependencies: Sentry account, Vercel deployment

- [ ] **Set up Vercel Analytics**
  - Files: update `app/layout.tsx` with `<Analytics />`
  - Dependencies: Vercel deployment

---

## 17. Documentation

- [ ] **Write API documentation**
  - Files: `docs/API.md`
  - Document all endpoints: method, path, auth requirements, request/response schemas
  - Dependencies: All APIs built

- [ ] **Write local development setup guide**
  - Files: `README.md`
  - Prerequisites, env setup, seed data, run commands
  - Dependencies: Project structure finalized

---

## Dependency Graph (Build Order)

```
1. Project Setup (1.1)
   └─► 2. Database Setup (1.2)
       └─► 3. Schemas (2.x)
           ├─► 4. Validators (3)
           │   └─► 5. Auth System (4)
           │       └─► 6. API Endpoints (5.x)
           │           └─► 7. React Query Hooks (6)
           │               └─► 8. Pages & Features (8.x)
           └─► Seed Script (2.4)
   └─► UI Primitives (7.2) ──► Card Components (7.3) ──► Pages (8.x)
   └─► Static Assets (9) ──► Pages (8.x)
   └─► Layout Components (7.1) ──► Pages (8.x)

Integration & Polish (10-14) ──► Testing (15) ──► Deployment (16)
```

---

## Phase 2 Reminder Checklist 🔮

These items were deliberately designed with Phase 2 extensibility:

- [ ] User schema includes `notificationPreferences`, `stripeCustomerId`, `subscriptionTier`
- [ ] Creator schema includes `platformTokens`, `analyticsData`, `promotionCredits`
- [ ] LiveSession schema includes `viewerCount`, `clickCount`, `isPromoted`, `promotionTier`
- [ ] Subscription model stub is defined and indexed
- [ ] Notification model stub is defined
- [ ] Session status API has hook point for triggering notifications
- [ ] Session list API supports `promoted` filter
- [ ] Creator dashboard has analytics placeholder area
- [ ] Email service is set up and extensible for notification templates
- [ ] Socket.io prototype or polling is in place for real-time updates
