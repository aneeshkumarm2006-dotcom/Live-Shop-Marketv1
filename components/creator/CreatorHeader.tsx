'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

/* ─────────────────────────────────────────────────────────────────────
   CreatorHeader — DESIGN.md §7.4 / TODO §8.4
   Banner (16:4) · Circular avatar (120px) · Name · Category tag ·
   Timestamp · Follower count · Top 3 badge · Favorite button
   ───────────────────────────────────────────────────────────────────── */

export interface CreatorHeaderProps {
  displayName: string;
  profileImage?: string;
  bannerImage?: string;
  categoryName?: string;
  followerCount: number;
  isVerified?: boolean;
  /** Creator rank within category — show "Top 3" badge if ≤ 3 */
  rank?: number;
  createdAt?: string;
  isFavorited: boolean;
  isFavoriteLoading?: boolean;
  onToggleFavorite: () => void;
}

export default function CreatorHeader({
  displayName,
  profileImage,
  bannerImage,
  categoryName,
  followerCount,
  isVerified,
  rank,
  createdAt,
  isFavorited,
  isFavoriteLoading = false,
  onToggleFavorite,
}: CreatorHeaderProps) {
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
      }).format(new Date(createdAt))
    : null;

  const formattedFollowers =
    followerCount >= 1000
      ? `${(followerCount / 1000).toFixed(1).replace(/\.0$/, '')}k`
      : String(followerCount);

  return (
    <section className="bg-neutral-gray/20">
      {/* ── Banner (16:4 ratio placeholder) ── */}
      <div className="relative mx-auto aspect-[16/4] max-w-container overflow-hidden bg-neutral-gray">
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt={`${displayName} banner`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal/30 text-body">
            Brand Hero Image
          </div>
        )}
      </div>

      {/* ── Profile info row ── */}
      <div className="mx-auto max-w-container px-3u">
        <div className="flex flex-col items-start gap-4u md:flex-row md:items-end -mt-[60px] relative z-10">
          {/* Avatar */}
          <div className="h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-neutral-gray shadow-card">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={displayName}
                width={120}
                height={120}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-page-title text-charcoal/30">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name & meta */}
          <div className="flex flex-1 flex-col gap-1.5 pb-4u">
            <div className="flex flex-wrap items-center gap-2u">
              <h1 className="text-page-title text-deep-navy">{displayName}</h1>
              {isVerified && (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
                  title="Verified creator"
                >
                  ✓
                </span>
              )}
              {rank != null && rank <= 3 && (
                <Badge variant="category" className="gap-1">
                  <Award className="h-3.5 w-3.5" aria-hidden />
                  Top {rank}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3u text-small text-charcoal/60">
              {categoryName && <Badge variant="category">{categoryName}</Badge>}
              {formattedDate && <span>Joined {formattedDate}</span>}
              <span className="font-semibold text-charcoal">
                {formattedFollowers} follower{followerCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Favorite button */}
          <div className="pb-4u md:ml-auto">
            <Button
              variant={isFavorited ? 'secondary' : 'primary'}
              size="md"
              isLoading={isFavoriteLoading}
              onClick={onToggleFavorite}
              className="gap-2"
              aria-label={
                isFavorited
                  ? `Remove ${displayName} from favorites`
                  : `Add ${displayName} to favorites`
              }
            >
              <motion.span
                key={isFavorited ? 'favorited' : 'not-favorited'}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={[
                    'h-5 w-5 transition-colors',
                    isFavorited
                      ? 'fill-favorite-heart text-favorite-heart'
                      : 'fill-none text-current',
                  ].join(' ')}
                />
              </motion.span>
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            {!isFavorited && (
              <p className="mt-1u text-center text-small text-charcoal/50 max-w-[260px]">
                Favorite this brand and get notified when they go live!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
