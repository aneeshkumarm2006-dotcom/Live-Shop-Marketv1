'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────
   CategoryCard — DESIGN.md §5.2 / TODO §7.3
   Rectangular card with category-specific gradient background and
   3D isometric illustrations. 16px border-radius, hover lift effect.
   ───────────────────────────────────────────────────────────────────── */

// ─── Gradient map keyed by category slug ────────────────────────────

const CATEGORY_GRADIENTS: Record<string, string> = {
  'tech-gadgets': 'from-category-tech-start via-category-tech-mid to-category-tech-end',
  'beauty-personal-care': 'from-category-beauty-start to-category-beauty-end',
  wellness: 'from-category-wellness-start to-category-wellness-end',
  'sports-fitness': 'from-category-sports-start to-category-sports-end',
  fashion: 'from-category-fashion-start to-category-fashion-end',
};

// Fallback gradient for unknown / new categories
const DEFAULT_GRADIENT = 'from-gray-400 to-gray-600';

// ─── Props ──────────────────────────────────────────────────────────

export interface CategoryCardProps {
  /** Category name displayed on the card */
  name: string;
  /** URL-friendly slug used for gradient lookup and link */
  slug: string;
  /** Optional description shown beneath the name */
  description?: string;
  /** Path to a 3D illustration image (e.g. `/images/categories/tech.svg`) */
  illustrationSrc?: string;
  /** Number of live/scheduled sessions to display as a count badge */
  sessionCount?: number;
  /** Override the default link destination */
  href?: string;
  className?: string;
}

export default function CategoryCard({
  name,
  slug,
  description,
  illustrationSrc,
  sessionCount,
  href,
  className = '',
}: CategoryCardProps) {
  const gradient = CATEGORY_GRADIENTS[slug] ?? DEFAULT_GRADIENT;
  const linkHref = href ?? `/categories/${slug}`;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      <Link
        href={linkHref}
        className={[
          'group relative block aspect-[3/2] overflow-hidden rounded-card',
          'transition-shadow duration-hover hover:shadow-card-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green',
        ].join(' ')}
      >
        {/* ── Gradient background ── */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} aria-hidden />

        {/* ── 3D illustration (positioned right/bottom) ── */}
        {illustrationSrc && (
          <div className="absolute right-3 bottom-3 h-3/5 w-3/5 opacity-80 transition-transform duration-hover group-hover:scale-105">
            <Image
              src={illustrationSrc}
              alt=""
              fill
              className="object-contain object-right-bottom"
              sizes="(max-width: 768px) 60vw, 300px"
            />
          </div>
        )}

        {/* ── Content overlay ── */}
        <div className="relative z-10 flex h-full flex-col justify-end p-4u">
          {/* Session count badge */}
          {typeof sessionCount === 'number' && sessionCount > 0 && (
            <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
            </span>
          )}

          {/* Title chip (semi-transparent rounded rectangle per DESIGN.md §5.2) */}
          <span className="inline-flex w-fit rounded-lg bg-black/25 px-3 py-1.5 text-card-title text-white backdrop-blur-sm">
            {name}
          </span>

          {description && (
            <p className="mt-1 max-w-[80%] text-small text-white/80 line-clamp-2">{description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
