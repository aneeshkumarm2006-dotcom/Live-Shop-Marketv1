'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORY_IMAGES, CATEGORY_GRADIENT_CLASSES } from '@/lib/assets';

/* ─────────────────────────────────────────────────────────────────────
   CategoryGradientBg — reusable gradient + illustration backdrop
   Renders the category-specific gradient (DESIGN.md §2.2) with an
   optional 3D isometric illustration overlay (§6.1).
   ───────────────────────────────────────────────────────────────────── */

export interface CategoryGradientBgProps {
  /** Category slug (e.g. 'tech', 'beauty', 'wellness', 'sports', 'fashion') */
  slug: string;
  /** Show the 3D illustration on top of the gradient (default: true) */
  showIllustration?: boolean;
  /** Height class (default: h-60) */
  heightClass?: string;
  /** Children rendered on top of background */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Map common DB slugs to the short keys used in assets.ts.
 * E.g. "tech-gadgets" → "tech", "beauty-personal-care" → "beauty"
 */
const SLUG_MAP: Record<string, string> = {
  'tech-gadgets': 'tech',
  tech: 'tech',
  'beauty-personal-care': 'beauty',
  beauty: 'beauty',
  wellness: 'wellness',
  'sports-fitness': 'sports',
  sports: 'sports',
  fashion: 'fashion',
};

export default function CategoryGradientBg({
  slug,
  showIllustration = true,
  heightClass = 'h-60',
  children,
  className = '',
}: CategoryGradientBgProps) {
  const key = SLUG_MAP[slug] ?? slug;
  const gradientClass = CATEGORY_GRADIENT_CLASSES[key] ?? 'bg-gray-500';
  const illustrationSrc = CATEGORY_IMAGES[key];

  return (
    <div className={`relative w-full overflow-hidden ${gradientClass} ${heightClass} ${className}`}>
      {/* 3D illustration overlay */}
      {showIllustration && illustrationSrc && (
        <div className="absolute inset-0 flex items-center justify-end opacity-60 pr-8">
          <Image
            src={illustrationSrc}
            alt=""
            width={320}
            height={240}
            className="object-contain"
            priority={false}
          />
        </div>
      )}

      {/* Content */}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
