'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useCreator, useCreatorSessions, useIsFavorited, useToggleFavorite } from '@/hooks';
import { CreatorHeader, CreatorBio, UpcomingStreams, PreviousStreams } from '@/components/creator';
import Spinner from '@/components/ui/Spinner';
import type { SocialLinks } from '@/types';
import type { UpcomingSession } from '@/components/creator/UpcomingStreams';
import type { PreviousSession } from '@/components/creator/PreviousStreams';

/* ─────────────────────────────────────────────────────────────────────
   Creator / Brand Profile (Client) — DESIGN.md §7.4 / TODO §8.4
   All interactive content: data fetching, favorites, etc.
   ───────────────────────────────────────────────────────────────────── */

interface CreatorPageClientProps {
  creatorId: string;
}

export default function CreatorPageClient({ creatorId }: CreatorPageClientProps) {
  // ── Creator data ──
  const {
    data: creatorData,
    isLoading: creatorLoading,
    isError: creatorError,
  } = useCreator(creatorId);

  const creator = creatorData?.data as Record<string, unknown> | undefined;

  // ── Upcoming (scheduled) sessions ──
  const { data: upcomingData, isLoading: upcomingLoading } = useCreatorSessions(
    creatorId,
    { status: 'scheduled', sortBy: 'scheduledAt', sortOrder: 'asc', limit: 20 },
    { enabled: !!creatorId }
  );

  // ── Previous (ended) sessions ──
  const { data: previousData, isLoading: previousLoading } = useCreatorSessions(
    creatorId,
    { status: 'ended', sortBy: 'startedAt', sortOrder: 'desc', limit: 20 },
    { enabled: !!creatorId }
  );

  // ── Favorite state ──
  const { data: favData } = useIsFavorited(creatorId);
  const isFavorited = favData?.data?.isFavorited ?? false;
  const toggleFavorite = useToggleFavorite(creatorId);

  // ── Derived data ──
  const displayName = (creator?.displayName as string) ?? 'Creator';
  const profileImage = creator?.profileImage as string | undefined;
  const bio = creator?.bio as string | undefined;
  const socialLinks = creator?.socialLinks as SocialLinks | undefined;
  const followerCount = (creator?.followerCount as number) ?? 0;
  const isVerified = (creator?.isVerified as boolean) ?? false;
  const createdAt = creator?.createdAt as string | undefined;

  const categories = (creator?.categories ?? []) as Record<string, unknown>[];
  const categoryName =
    categories.length > 0 ? ((categories[0].name as string | undefined) ?? undefined) : undefined;

  const upcomingSessions: UpcomingSession[] = (
    (upcomingData?.data ?? []) as Record<string, unknown>[]
  ).map((s) => ({
    _id: String(s._id),
    title: String(s.title ?? ''),
    platform: (s.platform as UpcomingSession['platform']) ?? 'other',
    status: (s.status as UpcomingSession['status']) ?? 'scheduled',
    scheduledAt: s.scheduledAt as string | undefined,
    externalUrl: s.externalUrl as string | undefined,
    thumbnailUrl: s.thumbnailUrl as string | undefined,
  }));

  const previousSessions: PreviousSession[] = (
    (previousData?.data ?? []) as Record<string, unknown>[]
  ).map((s) => ({
    _id: String(s._id),
    title: String(s.title ?? ''),
    platform: (s.platform as PreviousSession['platform']) ?? 'other',
    status: (s.status as PreviousSession['status']) ?? 'ended',
    thumbnailUrl: s.thumbnailUrl as string | undefined,
    externalUrl: s.externalUrl as string | undefined,
    scheduledAt: s.scheduledAt as string | undefined,
    brandName: displayName,
  }));

  if (creatorLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Loading creator profile…" />
      </div>
    );
  }

  if (creatorError || !creator) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3u text-center">
        <h1 className="text-section-heading text-deep-navy">Creator Not Found</h1>
        <p className="text-body text-charcoal/70">
          The creator you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/categories"
          className="mt-2u inline-flex items-center gap-1.5 rounded-button bg-neon-green px-4u py-2.5 text-button-text text-deep-navy transition-all duration-button hover:brightness-90"
        >
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CreatorHeader
        displayName={displayName}
        profileImage={profileImage}
        categoryName={categoryName}
        followerCount={followerCount}
        isVerified={isVerified}
        createdAt={createdAt}
        isFavorited={isFavorited}
        isFavoriteLoading={toggleFavorite.isPending}
        onToggleFavorite={() => toggleFavorite.mutate()}
      />

      <div className="mx-auto max-w-container px-3u pt-4u">
        <nav
          className="flex items-center gap-2 text-small text-charcoal/60"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-charcoal">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/categories" className="transition-colors hover:text-charcoal">
            Categories
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="font-medium text-charcoal">{displayName}</span>
        </nav>
      </div>

      <CreatorBio bio={bio} socialLinks={socialLinks} />
      <UpcomingStreams sessions={upcomingSessions} isLoading={upcomingLoading} />
      <PreviousStreams sessions={previousSessions} isLoading={previousLoading} />
    </div>
  );
}
