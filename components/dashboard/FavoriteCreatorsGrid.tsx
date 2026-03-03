'use client';

import React from 'react';
import { Heart, UserX } from 'lucide-react';
import BrandCard from '@/components/cards/BrandCard';
import Button from '@/components/ui/Button';
import type { BuyerDashboardFavorite } from '@/hooks/useBuyerDashboard';

/* ─────────────────────────────────────────────────────
   FavoriteCreatorsGrid — TODO §8.7 / PRD §6.1.8
   Grid of favorited creators with unfavorite action.
   ───────────────────────────────────────────────────── */

export interface FavoriteCreatorsGridProps {
  favorites: BuyerDashboardFavorite[];
  /** Total number of favorites (may exceed displayed items) */
  total: number;
  /** Creator IDs currently being toggled */
  togglingIds: Set<string>;
  /** Called when user clicks unfavorite */
  onUnfavorite: (creatorId: string) => void;
  /** Navigate to /favorites to see all */
  onViewAll?: () => void;
}

export default function FavoriteCreatorsGrid({
  favorites,
  total,
  togglingIds,
  onUnfavorite,
  onViewAll,
}: FavoriteCreatorsGridProps) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card bg-white p-10 shadow-card text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-gray/30 mb-4">
          <Heart className="h-8 w-8 text-charcoal/40" />
        </div>
        <h3 className="text-card-title font-semibold text-deep-navy mb-2">No favorites yet</h3>
        <p className="text-body text-charcoal/60 max-w-sm">
          Browse creators and tap the heart icon to add them to your favorites. You&apos;ll see
          their upcoming sessions right here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favorites.map((fav) => {
          const creator = fav.creatorId;
          if (!creator) return null;

          return (
            <BrandCard
              key={fav._id}
              id={creator._id}
              name={creator.displayName}
              profileImage={creator.profileImage}
              isFavorited
              isFavoriteLoading={togglingIds.has(creator._id)}
              onToggleFavorite={() => onUnfavorite(creator._id)}
            />
          );
        })}
      </div>

      {/* View all link when there are more favorites than displayed */}
      {total > favorites.length && onViewAll && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={onViewAll}>
            View all {total} favorites
          </Button>
        </div>
      )}
    </div>
  );
}
