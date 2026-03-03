'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LiveSessionCard from '@/components/cards/LiveSessionCard';
import type { Platform, SessionStatus } from '@/types/liveSession';

/* ─────────────────────────────────────────────────────────────────────
   PreviousStreams — DESIGN.md §7.4 / TODO §8.4
   Horizontal scrollable thumbnail grid of past streams.
   ───────────────────────────────────────────────────────────────────── */

export interface PreviousSession {
  _id: string;
  title: string;
  platform: Platform;
  status: SessionStatus;
  thumbnailUrl?: string;
  externalUrl?: string;
  scheduledAt?: string;
  brandName?: string;
}

export interface PreviousStreamsProps {
  sessions: PreviousSession[];
  isLoading?: boolean;
}

export default function PreviousStreams({ sessions, isLoading = false }: PreviousStreamsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-container px-3u py-6u">
        <h2 className="mb-3u text-section-heading text-deep-navy">Previous Streams</h2>
        <div className="flex gap-3u overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[280px] flex-shrink-0 animate-pulse rounded-card bg-neutral-gray/40"
            >
              <div className="aspect-video w-full rounded-t-card bg-neutral-gray/60" />
              <div className="space-y-2 p-3u">
                <div className="h-4 w-3/4 rounded bg-neutral-gray/50" />
                <div className="h-3 w-1/2 rounded bg-neutral-gray/40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (sessions.length === 0) {
    return (
      <section className="mx-auto max-w-container px-3u py-6u">
        <h2 className="mb-3u text-section-heading text-deep-navy">Previous Streams</h2>
        <div className="rounded-card border border-neutral-gray/40 bg-neutral-gray/10 p-8u text-center">
          <p className="text-body text-charcoal/50">No previous streams yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-container px-3u py-6u">
      <div className="mb-3u flex items-center justify-between">
        <h2 className="text-section-heading text-deep-navy">Previous Streams</h2>

        {/* Scroll controls (desktop only) */}
        {sessions.length > 3 && (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-gray bg-white text-charcoal transition-all duration-hover hover:bg-neutral-50 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-gray bg-white text-charcoal transition-all duration-hover hover:bg-neutral-50 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Horizontal scrollable grid ── */}
      <div
        ref={scrollRef}
        className="flex gap-3u overflow-x-auto pb-2u scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-gray/40"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {sessions.map((session) => (
          <div key={session._id} className="w-[280px] flex-shrink-0 snap-start">
            <LiveSessionCard
              id={session._id}
              title={session.title}
              status={session.status}
              platform={session.platform}
              thumbnailUrl={session.thumbnailUrl}
              externalUrl={session.externalUrl}
              scheduledAt={session.scheduledAt}
              brandName={session.brandName}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
