/**
 * Static asset paths — centralised map for all images, icons, and illustrations.
 *
 * Usage:
 *   import { ASSETS } from '@/lib/assets';
 *   <Image src={ASSETS.categories.tech} alt="Tech & Gadgets" />
 */

/* ── Category 3D Illustrations (DESIGN.md §6.1) ── */
export const CATEGORY_IMAGES: Record<string, string> = {
  tech: '/images/categories/tech.svg',
  beauty: '/images/categories/beauty.svg',
  wellness: '/images/categories/wellness.svg',
  sports: '/images/categories/sports.svg',
  fashion: '/images/categories/fashion.svg',
} as const;

/* ── Category Banner Images (full-width banners for cards & hero) ── */
export const CATEGORY_BANNERS: Record<string, string> = {
  'tech-gadgets': '/og-category-tech.png',
  'beauty-personal-care': '/og-category-beauty.png',
  wellness: '/og-category-wellness.png',
  'sports-fitness': '/og-category-sports.png',
  fashion: '/og-category-fashion.png',
} as const;

/* ── Platform Icons (DESIGN.md §6.3) ── */
export const PLATFORM_ICONS: Record<string, string> = {
  youtube: '/icons/youtube.svg',
  instagram: '/icons/instagram.svg',
  tiktok: '/icons/tiktok.svg',
  facebook: '/icons/facebook.svg',
  qvc: '/icons/qvc.svg',
} as const;

/* ── Logo Variants ── */
export const LOGO = {
  dark: '/images/logo.svg',
  light: '/images/logo-light.svg',
} as const;

/* ── Favicon / App Icons ── */
export const APP_ICONS = {
  favicon: '/favicon.svg',
  appleTouchIcon: '/apple-touch-icon.svg',
} as const;

/* ── Hero / Decorative (DESIGN.md §6.2) ── */
export const HERO_IMAGES = {
  background: '/images/hero/hero-bg.svg',
  videoFrame: '/images/hero/video-frame.svg',
  abstractShape: '/images/hero/abstract-shape.svg',
  ctaBackground: '/images/hero/cta-bg.svg',
} as const;

/* ── Category Gradient CSS values (DESIGN.md §2.2) ── */
export const CATEGORY_GRADIENTS: Record<string, string> = {
  tech: 'linear-gradient(135deg, #2563EB, #06B6D4, #10B981)',
  beauty: 'linear-gradient(135deg, #FF6B9D, #C71585)',
  wellness: 'linear-gradient(135deg, #20D5C5, #34D399)',
  sports: 'linear-gradient(135deg, #FF6B3D, #FF4B2B)',
  fashion: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
} as const;

/* ── Tailwind gradient class names (defined in globals.css) ── */
export const CATEGORY_GRADIENT_CLASSES: Record<string, string> = {
  tech: 'gradient-tech',
  beauty: 'gradient-beauty',
  wellness: 'gradient-wellness',
  sports: 'gradient-sports',
  fashion: 'gradient-fashion',
} as const;

/* ── Aggregate export ── */
export const ASSETS = {
  categories: CATEGORY_IMAGES,
  categoryBanners: CATEGORY_BANNERS,
  platforms: PLATFORM_ICONS,
  logo: LOGO,
  appIcons: APP_ICONS,
  hero: HERO_IMAGES,
  gradients: CATEGORY_GRADIENTS,
  gradientClasses: CATEGORY_GRADIENT_CLASSES,
} as const;
