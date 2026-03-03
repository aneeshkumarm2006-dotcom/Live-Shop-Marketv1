'use client';

import React from 'react';
import LiveSessionCard from '@/components/cards/LiveSessionCard';
import type { Platform, SessionStatus } from '@/types';

/* ─────────────────────────────────────────────────────────────────────
   LiveStreamsSection — DESIGN.md §7.3 / TODO §8.3
   Prominent display of live-now sessions (up to 3 cards).
   ───────────────────────────────────────────────────────────────────── */

export interface LiveSessionSummary {
  _id: string;
  title: string;
  status: SessionStatus;
  platform: Platform;
  externalUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: string;
  creatorId?:
    | {
        _id: string;
        displayName: string;
      }
    | string;
}

export interface LiveStreamsSectionProps {
  /** Live (or live + upcoming) session data */
  sessions: LiveSessionSummary[];
  /** Section heading text */
  heading?: string;
  /** Whether data is still loading */
  isLoading?: boolean;
}

export default function LiveStreamsSection({
  sessions,
  heading = 'Live Now',
  isLoading = false,
}: LiveStreamsSectionProps) {
  if (!isLoading && sessions.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3u text-section-heading text-deep-navy">{heading}</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4u sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-card bg-neutral-gray/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4u sm:grid-cols-2 lg:grid-cols-3">
          {sessions.slice(0, 3).map((session) => {
            const brandName =
              typeof session.creatorId === 'object' && session.creatorId
                ? session.creatorId.displayName
                : undefined;

            return (
              <LiveSessionCard
                key={session._id}
                id={session._id}
                title={session.title}
                brandName={brandName}
                status={session.status}
                platform={session.platform}
                externalUrl={session.externalUrl}
                thumbnailUrl={session.thumbnailUrl}
                scheduledAt={session.scheduledAt}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
