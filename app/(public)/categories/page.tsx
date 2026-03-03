'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks';
import CategoryCard from '@/components/cards/CategoryCard';
import Spinner from '@/components/ui/Spinner';

/* ─────────────────────────────────────────────────────────────────────
   All Categories Page — DESIGN.md §7.2 / TODO §8.2
   Light gray header with breadcrumb, centered title, 3-column grid
   of full category cards with gradients + illustrations.
   ───────────────────────────────────────────────────────────────────── */

// Placeholder cards to fill gaps for future categories
const PLACEHOLDER_COUNT = 2;

export default function AllCategoriesPage() {
  const { data, isLoading, isError } = useCategories();

  const categories = data?.data ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header / Breadcrumb (DESIGN.md §7.2) ── */}
      <section className="bg-neutral-gray/40 py-6u">
        <div className="mx-auto max-w-container px-3u">
          {/* Breadcrumb */}
          <nav
            className="mb-3u flex items-center gap-2 text-small text-charcoal/60"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-charcoal">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-charcoal font-medium">All Categories</span>
          </nav>

          {/* Title */}
          <h1 className="text-center text-page-title text-deep-navy">All Categories</h1>
          <p className="mt-2u text-center text-body text-charcoal/70">
            Browse live shopping streams across every category
          </p>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="mx-auto max-w-container px-3u py-8u">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" label="Loading categories…" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-body text-charcoal/70">
              Unable to load categories. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-4u sm:grid-cols-2 lg:grid-cols-3">
            {/* Real category cards */}
            {categories.map((cat) => (
              <CategoryCard
                key={String(
                  (cat as Record<string, unknown>)._id ?? (cat as Record<string, unknown>).slug
                )}
                name={String((cat as Record<string, unknown>).name ?? '')}
                slug={String((cat as Record<string, unknown>).slug ?? '')}
                description={(cat as Record<string, unknown>).description as string | undefined}
                sessionCount={
                  typeof (cat as Record<string, unknown>).sessionCount === 'number'
                    ? ((cat as Record<string, unknown>).sessionCount as number)
                    : undefined
                }
              />
            ))}

            {/* Gray placeholder cards for future categories (DESIGN.md §7.2) */}
            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex aspect-[3/2] items-center justify-center rounded-card bg-neutral-gray/60"
              >
                <span className="text-body text-charcoal/40">Coming Soon</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
