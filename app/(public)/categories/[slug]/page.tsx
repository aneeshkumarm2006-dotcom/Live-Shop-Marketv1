'use client';

import React, { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useCategory, useSessions, useCreators } from '@/hooks';
import { CategoryHeroBanner, CategoryFilters, LiveStreamsSection } from '@/components/category';
import type { SortOption } from '@/components/category/CategoryFilters';
import type { LiveSessionSummary } from '@/components/category/LiveStreamsSection';
import BrandCard from '@/components/cards/BrandCard';
import Spinner from '@/components/ui/Spinner';

/* ─────────────────────────────────────────────────────────────────────
   Single Category Page — DESIGN.md §7.3 / TODO §8.3
   Hero banner  ·  filter controls  ·  live streams (top 3)  ·  brand grid (5 cols)
   ───────────────────────────────────────────────────────────────────── */

export default function SingleCategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // ── Category meta ──
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useCategory(slug);

  const category = categoryData?.data;
  const catId = (category as Record<string, unknown> | undefined)?._id as string | undefined;
  const catName = ((category as Record<string, unknown> | undefined)?.name as string) ?? slug;
  const catDescription = (category as Record<string, unknown> | undefined)?.description as
    | string
    | undefined;
  const stats = (category as Record<string, unknown> | undefined)?.stats as
    | { liveSessionCount: number; scheduledSessionCount: number; creatorCount: number }
    | undefined;

  // ── Filter state ──
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('followers');

  // ── Live sessions for this category ──
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions(
    {
      categoryId: catId ?? '',
      status: 'live',
      limit: 3,
    },
    { enabled: !!catId }
  );

  const liveSessions: LiveSessionSummary[] =
    (sessionsData?.data as unknown as LiveSessionSummary[]) ?? [];

  // ── Creators / brands in this category ──
  const { data: creatorsData, isLoading: creatorsLoading } = useCreators(
    {
      categoryId: catId ?? '',
      search: search || undefined,
      sort: sort === 'name' ? undefined : sort,
      limit: 20,
    },
    { enabled: !!catId }
  );

  const creators = (creatorsData?.data ?? []) as Record<string, unknown>[];

  // ── Browse Live Brands scroll target ──
  const liveRef = useRef<HTMLDivElement>(null);
  const handleBrowseLive = useCallback(() => {
    liveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ── Loading / error states ──
  if (categoryLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Loading category…" />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3u text-center">
        <h1 className="text-section-heading text-deep-navy">Category Not Found</h1>
        <p className="text-body text-charcoal/70">
          The category you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/categories"
          className="mt-2u inline-flex items-center gap-1.5 rounded-button bg-neon-green px-4u py-2.5 text-button-text text-deep-navy transition-all duration-button hover:brightness-90"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Banner (DESIGN.md §7.3) ── */}
      <CategoryHeroBanner name={catName} slug={slug} description={catDescription} stats={stats} />

      {/* ── Content area ── */}
      <div className="mx-auto max-w-container px-3u py-6u">
        {/* Breadcrumb */}
        <nav
          className="mb-4u flex items-center gap-2 text-small text-charcoal/60"
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
          <span className="font-medium text-charcoal">{catName}</span>
        </nav>

        {/* ── Filter Controls (DESIGN.md §7.3) ── */}
        <CategoryFilters
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          onBrowseLive={handleBrowseLive}
          liveCount={stats?.liveSessionCount}
        />

        {/* ── Live Streams Section (top 3) ── */}
        <div ref={liveRef} className="mt-6u">
          <LiveStreamsSection
            sessions={liveSessions}
            heading="Live Now"
            isLoading={sessionsLoading}
          />
        </div>

        {/* ── Brand Grid (5 columns desktop, DESIGN.md §7.3) ── */}
        <section className="mt-6u">
          <h2 className="mb-3u text-section-heading text-deep-navy">Brands</h2>

          {creatorsLoading ? (
            <div className="grid grid-cols-2 gap-4u sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2u">
                  <div className="aspect-square w-full animate-pulse rounded-card-sm bg-neutral-gray/60" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-gray/40" />
                </div>
              ))}
            </div>
          ) : creators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-body text-charcoal/60">
                {search
                  ? `No brands found matching "${search}"`
                  : 'No brands in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4u sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {creators.map((creator) => (
                <BrandCard
                  key={String(creator._id)}
                  id={String(creator._id)}
                  name={String(creator.displayName ?? '')}
                  profileImage={creator.profileImage as string | undefined}
                  hideFavorite
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
