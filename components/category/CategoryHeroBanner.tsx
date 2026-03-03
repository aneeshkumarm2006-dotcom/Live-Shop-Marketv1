'use client';

import React from 'react';

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

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-br ${visuals.gradient}`}
      style={{ minHeight: 240 }}
    >
      {/* ── Decorative floating illustrations ── */}
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

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center justify-center px-3u py-8u text-center">
        <h1 className="text-banner-title text-white drop-shadow-md md:text-page-title">{name}</h1>

        {description && <p className="mt-2u max-w-xl text-body text-white/80">{description}</p>}

        {/* ── Stat strip ── */}
        {stats && (
          <div className="mt-4u flex items-center gap-6u text-small font-semibold text-white/90">
            {typeof stats.liveSessionCount === 'number' && stats.liveSessionCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-white animate-live-pulse" />
                {stats.liveSessionCount} Live Now
              </span>
            )}
            {typeof stats.scheduledSessionCount === 'number' && (
              <span>{stats.scheduledSessionCount} Upcoming</span>
            )}
            {typeof stats.creatorCount === 'number' && <span>{stats.creatorCount} Brands</span>}
          </div>
        )}
      </div>
    </section>
  );
}
