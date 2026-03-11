'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORY_BANNERS } from '@/lib/assets';

/* ─────────────────────────────────────────────────────────────────────
   CategoryHeroBanner — DESIGN.md §7.3 / TODO §8.3
   Full-width gradient banner (~240px) with 3D illustrations and
   large centred white category name.
   ───────────────────────────────────────────────────────────────────── */

// ─── Gradient + illustration data keyed by slug ─────────────────────

interface CategoryVisuals {
  gradient: string;
  /** Decorative emoji-based illustrations (fallback until real SVGs exist) */
  illustrations: string[];
}

const CATEGORY_VISUALS: Record<string, CategoryVisuals> = {
  'tech-gadgets': {
    gradient: 'from-[#2563EB] via-[#06B6D4] to-[#10B981]',
    illustrations: ['🎮', '📱', '🚁'],
  },
  'beauty-personal-care': {
    gradient: 'from-[#FF6B9D] to-[#C71585]',
    illustrations: ['💄', '💅', '✨'],
  },
  wellness: {
    gradient: 'from-[#20D5C5] to-[#34D399]',
    illustrations: ['🧘', '💊', '🌿'],
  },
  'sports-fitness': {
    gradient: 'from-[#FF6B3D] to-[#FF4B2B]',
    illustrations: ['🎾', '⚡', '🏋️'],
  },
  fashion: {
    gradient: 'from-[#8B5CF6] to-[#3B82F6]',
    illustrations: ['👗', '👜', '👠'],
  },
};

const DEFAULT_VISUALS: CategoryVisuals = {
  gradient: 'from-gray-500 to-gray-700',
  illustrations: ['🛍️', '📦', '🏷️'],
};

// ─── Accent box color keyed by slug (darker shade of banner) ────────

const CATEGORY_BOX_COLORS: Record<string, string> = {
  'tech-gadgets': 'bg-[#2d6be0]',
  'beauty-personal-care': 'bg-[#e0288a]',
  wellness: 'bg-[#17b09a]',
  'sports-fitness': 'bg-[#e85f28]',
  fashion: 'bg-[#7c44e0]',
};

const DEFAULT_BOX_COLOR = 'bg-black/40';

// ─── Props ──────────────────────────────────────────────────────────

export interface CategoryHeroBannerProps {
  /** Category display name */
  name: string;
  /** Category slug for gradient lookup */
  slug: string;
  /** Optional description shown below the name */
  description?: string;
  /** Live / scheduled / total counts for the stat strip */
  stats?: {
    liveSessionCount?: number;
    scheduledSessionCount?: number;
    creatorCount?: number;
  };
}

export default function CategoryHeroBanner({
  name,
  slug,
  description,
  stats,
}: CategoryHeroBannerProps) {
  const visuals = CATEGORY_VISUALS[slug] ?? DEFAULT_VISUALS;
  const bannerSrc = CATEGORY_BANNERS[slug];
  const boxColor = CATEGORY_BOX_COLORS[slug] ?? DEFAULT_BOX_COLOR;

  return (
    <section
      className={`relative w-full overflow-hidden ${bannerSrc ? '' : `bg-gradient-to-br ${visuals.gradient}`}`}
      style={{ minHeight: 240 }}
    >
      {/* ── Banner image background ── */}
      {bannerSrc && (
        <Image
          src={bannerSrc}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          aria-hidden
        />
      )}

      {/* ── Decorative floating illustrations (hidden when banner is used) ── */}
      {!bannerSrc && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-6u opacity-30 select-none"
          aria-hidden
        >
          {visuals.illustrations.map((icon, i) => (
            <span
              key={i}
              className="text-[64px] drop-shadow-lg"
              style={{
                transform: `translateY(${i % 2 === 0 ? -12 : 12}px) rotate(${(i - 1) * 15}deg)`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1
          className={`${boxColor} px-6 py-3 text-banner-title text-white md:text-page-title shadow-[0_4px_16px_rgba(0,0,0,0.35)]`}
        >
          {name}
        </h1>
      </div>
    </section>
  );
}
