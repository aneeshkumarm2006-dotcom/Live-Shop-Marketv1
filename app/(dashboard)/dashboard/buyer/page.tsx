'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useBuyerDashboard, buyerDashboardKeys } from '@/hooks/useBuyerDashboard';
import { useToggleFavorite, favoriteKeys } from '@/hooks/useFavorites';
import apiClient from '@/lib/api-client';

import BuyerOverview from '@/components/dashboard/BuyerOverview';
import FavoriteCreatorsGrid from '@/components/dashboard/FavoriteCreatorsGrid';
import UpcomingFavoriteSessions from '@/components/dashboard/UpcomingFavoriteSessions';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

/* ─────────────────────────────────────────────────────
   Buyer Dashboard Page — TODO §8.7 / PRD §6.1.8
   Routes: /dashboard/buyer
   ───────────────────────────────────────────────────── */

const FAVORITES_LIMIT = 20;
const SESSIONS_LIMIT = 15;

export default function BuyerDashboardPage() {
  const { data: authSession, status: authStatus } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Track which creator IDs are in the process of being unfavorited
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  // ── Data fetching ──
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useBuyerDashboard({
    favoritesLimit: FAVORITES_LIMIT,
    sessionsLimit: SESSIONS_LIMIT,
  });

  // ── Helpers ──
  const invalidateDashboard = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: buyerDashboardKeys.all });
    queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
  }, [queryClient]);

  // ── Unfavorite handler ──
  const handleUnfavorite = useCallback(
    async (creatorId: string) => {
      setTogglingIds((prev) => new Set(prev).add(creatorId));
      try {
        await apiClient.delete(`/favorites/${creatorId}`);
        // Invalidate dashboard + favorites caches
        invalidateDashboard();
        queryClient.invalidateQueries({
          queryKey: favoriteKeys.check(creatorId),
        });
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(creatorId);
          return next;
        });
      }
    },
    [invalidateDashboard, queryClient]
  );

  // ── Auth guard ──
  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated' || !authSession) {
    router.push('/');
    return null;
  }

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading your dashboard…" />
      </div>
    );
  }

  // ── Error state ──
  if (isError || !dashboardData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-section-heading font-bold text-deep-navy">Something went wrong</h2>
        <p className="text-body text-charcoal/60">
          {(error as Error)?.message ?? 'Failed to load dashboard data.'}
        </p>
        <Button onClick={() => invalidateDashboard()}>Retry</Button>
      </div>
    );
  }

  const { user, favorites, upcomingSessions } = dashboardData.data;

  // Count live sessions from the upcoming list
  const liveNowCount = upcomingSessions.items.filter((s) => s.status === 'live').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-page-title font-bold text-deep-navy">My Dashboard</h1>
        <p className="text-body text-charcoal/60 mt-1">Welcome back, {user.name}</p>
      </div>

      {/* ── Stats overview ── */}
      <BuyerOverview
        totalFavorites={favorites.total}
        upcomingSessionsCount={upcomingSessions.total - liveNowCount}
        liveNowCount={liveNowCount}
      />

      {/* ── Upcoming sessions from favorites ── */}
      <section>
        <h2 className="text-section-heading font-semibold text-deep-navy mb-4">
          Upcoming from Favorites
        </h2>
        <UpcomingFavoriteSessions sessions={upcomingSessions.items} />
      </section>

      {/* ── Favorited creators ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-section-heading font-semibold text-deep-navy">
            My Favorite Creators
          </h2>
          {favorites.total > 0 && (
            <span className="text-small text-charcoal/60">
              {favorites.total} creator{favorites.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <FavoriteCreatorsGrid
          favorites={favorites.items}
          total={favorites.total}
          togglingIds={togglingIds}
          onUnfavorite={handleUnfavorite}
          onViewAll={() => router.push('/favorites')}
        />
      </section>
    </div>
  );
}
