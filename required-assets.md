# Required Assets — LiveShopMarket

Complete inventory of every image / icon / illustration the project references.  
**Status:** ✅ = file exists on disk | ❌ = missing, must be created

---

## 1. Favicons & App Icons

| # | File Name | Folder Path | Description | Used In | Status |
|---|-----------|-------------|-------------|---------|--------|
| 1 | `favicon.svg` | `/public/` | Site favicon — small "LSM" monogram or shopping-bag icon in Deep Navy (`#1A1A2E`) with a neon-green accent. Should look crisp at 32×32. | Browser tab; defined in `lib/assets.ts → APP_ICONS.favicon` | ✅ |
| 2 | `apple-touch-icon.svg` | `/public/` | iOS home-screen icon — same brand mark as the favicon but padded for a 180×180 touch target with a solid white or dark background. | iOS "Add to Home Screen"; defined in `lib/assets.ts → APP_ICONS.appleTouchIcon` | ✅ |

---

## 2. Logos

| # | File Name | Folder Path | Description | Used In | Status |
|---|-----------|-------------|-------------|---------|--------|
| 3 | `logo.svg` | `/public/images/` | Primary dark logo — bold rounded sans-serif wordmark **"LiveShopMarket"** in Deep Navy (`#1A1A2E`). Clean vector, no tagline. | `lib/assets.ts → LOGO.dark` (available for Header/Footer but currently text-only) | ✅ |
| 4 | `logo-light.svg` | `/public/images/` | Light/white variant of the logo for use on dark or gradient backgrounds. Same wordmark in white (`#FFFFFF`). | `lib/assets.ts → LOGO.light` (for dark-bg contexts) | ✅ |

---

## 3. Hero / Decorative Images

| # | File Name | Folder Path | Description | Used In | Status |
|---|-----------|-------------|-------------|---------|--------|
| 5 | `hero-bg.svg` | `/public/images/hero/` | Full-width abstract background for the homepage hero — vibrant blue-to-cyan gradient (`#2563EB → #06B6D4`) with subtle floating geometric shapes (rounded rectangles simulating video frames, glowing circles). | `lib/assets.ts → HERO_IMAGES.background`; `components/home/HeroSection.tsx` (hero section backdrop) | ✅ |
| 6 | `video-frame.svg` | `/public/images/hero/` | Decorative floating video-frame element — a rounded rectangle with a semi-transparent white border and a faint frosted-glass fill, slightly rotated. Used as a repeating decorative motif. | `lib/assets.ts → HERO_IMAGES.videoFrame`; scattered across the hero section | ✅ |
| 7 | `abstract-shape.svg` | `/public/images/hero/` | Soft neon-green or orange glowing blob/circle with blur, used as a floating accent behind hero content. | `lib/assets.ts → HERO_IMAGES.abstractShape`; hero decorative layer | ✅ |
| 8 | `cta-bg.svg` | `/public/images/hero/` | Background pattern or gradient shape for the CTA (Call-to-Action) banner section — could be a wave or angular gradient sweep in brand blues. | `lib/assets.ts → HERO_IMAGES.ctaBackground`; CTA banner section on homepage | ✅ |

---

## 4. Category 3D Isometric Illustrations

Per DESIGN.md §6.1 — playful, rounded 3D objects with soft shadows matching each category gradient.

| # | File Name | Folder Path | Description | Used In | Status |
|---|-----------|-------------|-------------|---------|--------|
| 9 | `tech.svg` | `/public/images/categories/` | 3D isometric illustration of tech gadgets — game controller, drone, smartphone, laptop, headphones — in blue-cyan-green tones matching `gradient-tech`. | `lib/assets.ts → CATEGORY_IMAGES.tech`; `CategoryGradientBg`, `CategoryCard`, `CategoryHeroBanner` | ✅ |
| 10 | `beauty.svg` | `/public/images/categories/` | 3D isometric illustration of beauty products — perfume bottles, makeup compacts, hair dryer — in pink-magenta tones matching `gradient-beauty`. | `lib/assets.ts → CATEGORY_IMAGES.beauty`; `CategoryGradientBg`, `CategoryCard`, `CategoryHeroBanner` | ✅ |
| 11 | `wellness.svg` | `/public/images/categories/` | 3D isometric illustration of wellness items — supplement bottles, yoga mat, herb leaf — in teal-mint tones matching `gradient-wellness`. | `lib/assets.ts → CATEGORY_IMAGES.wellness`; `CategoryGradientBg`, `CategoryCard`, `CategoryHeroBanner` | ✅ |
| 12 | `sports.svg` | `/public/images/categories/` | 3D isometric illustration of sports gear — tennis racket, basketball, lightning bolt, dumbbell — in orange-red tones matching `gradient-sports`. | `lib/assets.ts → CATEGORY_IMAGES.sports`; `CategoryGradientBg`, `CategoryCard`, `CategoryHeroBanner` | ✅ |
| 13 | `fashion.svg` | `/public/images/categories/` | 3D isometric illustration of fashion items — dress, handbag, high-heel shoe, shopping bag — in purple-blue tones matching `gradient-fashion`. | `lib/assets.ts → CATEGORY_IMAGES.fashion`; `CategoryGradientBg`, `CategoryCard`, `CategoryHeroBanner` | ✅ |

---

## 5. Platform Icons

| # | File Name | Folder Path | Description | Used In | Status |
|---|-----------|-------------|-------------|---------|--------|
| 14 | `youtube.svg` | `/public/icons/` | YouTube brand icon — red play-button logo or simplified monochrome version. | `LiveSessionCard`, `UpcomingSessionCard`, `CreatorBio`, `UpcomingStreams`, `LiveNotificationBanner` | ✅ |
| 15 | `instagram.svg` | `/public/icons/` | Instagram brand icon — camera/gradient outline or simplified monochrome version. | `LiveSessionCard`, `UpcomingSessionCard`, `CreatorBio`, `UpcomingStreams`, `LiveNotificationBanner` | ✅ |
| 16 | `tiktok.svg` | `/public/icons/` | TikTok brand icon — musical note "d" shape or simplified monochrome version. | `LiveSessionCard`, `UpcomingSessionCard`, `CreatorBio`, `UpcomingStreams`, `LiveNotificationBanner` | ✅ |
| 17 | `facebook.svg` | `/public/icons/` | Facebook brand icon — "f" lettermark or simplified monochrome version. | `LiveSessionCard`, `UpcomingSessionCard`, `CreatorBio`, `UpcomingStreams`, `LiveNotificationBanner` | ✅ |
| 18 | `qvc.svg` | `/public/icons/` | QVC brand icon — "QVC" text or simplified monochrome version for the QVC shopping network. | `lib/assets.ts → PLATFORM_ICONS.qvc` (used in platform badge components) | ✅ |

---

## 6. Open Graph / Social-Sharing Images

All OG images should be **1200 × 630 px PNG** format for optimal social-media previews.

| # | File Name | Folder Path | Description | Used In | Status |
|---|-----------|-------------|-------------|---------|--------|
| 19 | `og-default.png` | `/public/images/` | Default site-wide social preview — "LiveShopMarket" wordmark centered on a vibrant blue gradient background with tagline "Discover Live Shopping Streams". Include floating video-frame decorations. | `app/layout.tsx` (global OpenGraph + Twitter metadata); `app/(auth)/signup/layout.tsx` | ✅ |
| 20 | `og-categories.png` | `/public/images/` | Categories listing page social preview — show all five category gradient swatches (Tech, Beauty, Wellness, Sports, Fashion) in a grid/row with "Browse Categories" headline. | `app/(public)/categories/page.tsx` (OpenGraph metadata) | ✅ |
| 21 | `og-category-tech.png` | `/public/images/` | Tech category social preview — blue-cyan-green gradient background with the tech 3D illustration and text "Tech & Gadgets — Live Shopping Streams". | `app/(public)/categories/[slug]/page.tsx` (dynamic OG for slug `tech`) | ❌ |
| 22 | `og-category-beauty.png` | `/public/images/` | Beauty category social preview — pink-magenta gradient background with the beauty 3D illustration and text "Beauty — Live Shopping Streams". | `app/(public)/categories/[slug]/page.tsx` (dynamic OG for slug `beauty`) | ❌ |
| 23 | `og-category-wellness.png` | `/public/images/` | Wellness category social preview — teal-mint gradient background with the wellness 3D illustration and text "Wellness — Live Shopping Streams". | `app/(public)/categories/[slug]/page.tsx` (dynamic OG for slug `wellness`) | ❌ |
| 24 | `og-category-sports.png` | `/public/images/` | Sports category social preview — orange-red gradient background with the sports 3D illustration and text "Sports & Fitness — Live Shopping Streams". | `app/(public)/categories/[slug]/page.tsx` (dynamic OG for slug `sports`) | ❌ |
| 25 | `og-category-fashion.png` | `/public/images/` | Fashion category social preview — purple-blue gradient background with the fashion 3D illustration and text "Fashion — Live Shopping Streams". | `app/(public)/categories/[slug]/page.tsx` (dynamic OG for slug `fashion`) | ❌ |

---

## Summary

| Category | Count | Existing | Missing |
|----------|------:|:--------:|:-------:|
| Favicons & App Icons | 2 | 2 | 0 |
| Logos | 2 | 2 | 0 |
| Hero / Decorative | 4 | 4 | 0 |
| Category Illustrations | 5 | 5 | 0 |
| Platform Icons | 5 | 5 | 0 |
| OG / Social Images | 7 | 2 | **5** |
| **Total** | **25** | **20** | **5** |

---

## Notes

- **Dynamic/user-uploaded images** (creator profile photos, session thumbnails, brand banners) are hosted on **Cloudinary** and not listed here — they are uploaded at runtime via `/api/upload`.
- **UI icons** (heart, play, bell, search, menu, etc.) are sourced from **Lucide React** and require no asset files.
- The 5 missing OG category images (`og-category-*.png`) are referenced dynamically in `app/(public)/categories/[slug]/page.tsx` at line 56 via the template `` `/images/og-category-${slug}.png` ``. These should be created as **1200 × 630 px PNGs** following the same style as `og-default.png`.
