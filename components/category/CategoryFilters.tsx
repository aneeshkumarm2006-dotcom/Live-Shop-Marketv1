'use client';

import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   CategoryFilters — DESIGN.md §7.3 / TODO §8.3
   Left: yellow-green "Browse Live Brands" button
   Right: search bar + sort dropdown
   ───────────────────────────────────────────────────────────────────── */

export type SortOption = 'followers' | 'recent' | 'name';

export interface CategoryFiltersProps {
  /** Current search query value */
  search: string;
  /** Called when the search input changes */
  onSearchChange: (value: string) => void;
  /** Current sort value */
  sort: SortOption;
  /** Called when the sort changes */
  onSortChange: (value: SortOption) => void;
  /** Scrolls-to or toggles the live streams section */
  onBrowseLive?: () => void;
  /** Number of live sessions for the badge */
  liveCount?: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'followers', label: 'Most Popular' },
  { value: 'recent', label: 'Newest' },
  { value: 'name', label: 'A – Z' },
];

export default function CategoryFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  onBrowseLive,
  liveCount = 0,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col gap-3u sm:flex-row sm:items-center sm:justify-between">
      {/* ── Browse Live Brands button (DESIGN.md §7.3) ── */}
      <button
        type="button"
        onClick={onBrowseLive}
        className="inline-flex items-center gap-2 rounded-button bg-neon-green px-4u py-2.5 text-button-text text-deep-navy transition-all duration-button hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/50"
      >
        Browse Live Brands
        {liveCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-live-indicator px-1.5 text-[11px] font-bold text-white">
            {liveCount}
          </span>
        )}
      </button>

      {/* ── Search + Sort (right side) ── */}
      <div className="flex items-center gap-2u">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search brands…"
            className="w-full min-w-[200px] rounded-search border border-neutral-gray bg-white py-2.5 pl-4 pr-10 text-body text-charcoal placeholder:text-charcoal/40 transition-colors duration-hover focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/50 sm:w-[260px]"
          />
          <Search
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40"
            aria-hidden
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none rounded-button-secondary border border-neutral-gray bg-white py-2.5 pl-4 pr-10 text-small font-medium text-charcoal transition-colors duration-hover focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/50"
            aria-label="Sort brands"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/50"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
