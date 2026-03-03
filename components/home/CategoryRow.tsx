'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BrandCard } from '@/components/cards';
import { LiveSessionCard } from '@/components/cards';
import type { Platform, SessionStatus } from '@/types';

/* ─────────────────────────────────────────────────────────────────────
   CategoryRow — DESIGN.md §7.1
   Horizontal scrollable row of BrandCard or LiveSessionCard items,
   labelled with category name and navigation arrows.
   Each homepage category section uses one of these rows.
   ───────────────────────────────────────────────────────────────────── */

// ─── Shared item shapes (serializable from server) ──────────────────

export interface CategoryRowCreator {
  _id: string;
  displayName: string;
  profileImage?: string;
}

export interface CategoryRowSession {
  _id: string;
  title: string;
  status: SessionStatus;
  platform: Platform;
  externalUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: string;
  creator?: { displayName: string };
}

export interface CategoryRowProps {
  /** Section heading (e.g. "Fashion") */
  title: string;
  /** Link to full category page */
  href: string;
  /** Creators to display as BrandCards */
  creators?: CategoryRowCreator[];
  /** Sessions to display as LiveSessionCards */
  sessions?: CategoryRowSession[];
  className?: string;
}

export default function CategoryRow({
  title,
  href,
  creators = [],
  sessions = [],
  className = '',
}: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const isEmpty = creators.length === 0 && sessions.length === 0;

  return (
    <section className={`py-4u ${className}`}>
      {/* ── Section header ── */}
      <div className="mx-auto flex max-w-container items-center justify-between px-3u mb-3u">
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-section-heading text-deep-navy hover:underline"
        >
          {title}
          <ChevronRight className="h-6 w-6 text-charcoal/40 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Scroll arrows (desktop) */}
        {!isEmpty && (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-gray text-charcoal/60 transition-colors hover:bg-neutral-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-gray text-charcoal/60 transition-colors hover:bg-neutral-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Horizontal scroll track ── */}
      {isEmpty ? (
        <div className="mx-auto max-w-container px-3u">
          <p className="text-body text-charcoal/50">No items to show yet.</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3u overflow-x-auto scroll-smooth px-3u pb-2 snap-x snap-mandatory scrollbar-hide mx-auto max-w-container"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Live session cards first */}
          {sessions.map((s) => (
            <div key={s._id} className="w-[280px] shrink-0 snap-start sm:w-[300px]">
              <LiveSessionCard
                id={s._id}
                title={s.title}
                brandName={s.creator?.displayName}
                status={s.status}
                platform={s.platform}
                externalUrl={s.externalUrl}
                thumbnailUrl={s.thumbnailUrl}
                scheduledAt={s.scheduledAt}
              />
            </div>
          ))}

          {/* Creator/brand cards */}
          {creators.map((c) => (
            <div key={c._id} className="w-[180px] shrink-0 snap-start sm:w-[200px]">
              <BrandCard
                id={c._id}
                name={c.displayName}
                profileImage={c.profileImage}
                hideFavorite
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
