'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   BrandCard — DESIGN.md §5.4 / TODO §7.3
   Square format card with creator thumbnail, favorite heart icon
   (top-right), and brand name centred below.
   ───────────────────────────────────────────────────────────────────── */

export interface BrandCardProps {
  /** Creator / brand ID for linking */
  id: string;
  /** Creator display name */
  name: string;
  /** Profile image URL */
  profileImage?: string;
  /** Whether the current user has favorited this creator */
  isFavorited?: boolean;
  /** Callback when the favorite heart is toggled */
  onToggleFavorite?: () => void;
  /** Disable the favorite button (e.g. while mutation is in-flight) */
  isFavoriteLoading?: boolean;
  /** Hide the favorite button entirely (e.g. for logged-out users) */
  hideFavorite?: boolean;
  className?: string;
}

export default function BrandCard({
  id,
  name,
  profileImage,
  isFavorited = false,
  onToggleFavorite,
  isFavoriteLoading = false,
  hideFavorite = false,
  className = '',
}: BrandCardProps) {
  return (
    <div
      className={[
        'group relative flex flex-col items-center',
        'transition-all duration-hover',
        'hover:-translate-y-1 hover:scale-[1.02]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Square thumbnail ── */}
      <Link
        href={`/creators/${id}`}
        className="relative block aspect-square w-full overflow-hidden rounded-card-sm bg-neutral-gray shadow-card transition-shadow duration-hover group-hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green"
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-hover group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-body text-charcoal/40">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* ── Favorite heart (top-right, DESIGN.md §5.4) ── */}
        {!hideFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // prevent Link navigation
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            disabled={isFavoriteLoading}
            aria-label={isFavorited ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
            className={[
              'absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm',
              'transition-all duration-hover',
              'hover:bg-white hover:scale-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-favorite-heart',
              isFavoriteLoading && 'animate-pulse cursor-wait',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Heart
              className={[
                'h-4 w-4 transition-colors duration-hover',
                isFavorited
                  ? 'fill-favorite-heart text-favorite-heart'
                  : 'fill-none text-charcoal/60',
              ].join(' ')}
            />
          </button>
        )}
      </Link>

      {/* ── Brand name (centered below card per DESIGN.md §5.4) ── */}
      <Link
        href={`/creators/${id}`}
        className="mt-2u text-center text-card-title text-charcoal hover:underline focus-visible:outline-none focus-visible:underline line-clamp-1"
      >
        {name}
      </Link>
    </div>
  );
}
