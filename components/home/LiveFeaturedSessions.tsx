'use client';

import React from 'react';
import FeaturedLiveSessions from '@/components/home/FeaturedLiveSessions';
import type { FeaturedSession } from '@/components/home/FeaturedLiveSessions';
import { useLiveSessions, type LiveSessionSummary } from '@/hooks/useLiveSessions';

/* ─────────────────────────────────────────────────────────────────────
   LiveFeaturedSessions — Client wrapper with 30 s polling

   Receives server-rendered sessions as `initialSessions` — these are
   shown immediately.  After hydration React Query polls the API every
   30 s for fresh live/scheduled data and swaps the list transparently.
   ───────────────────────────────────────────────────────────────────── */

interface Props {
  /** Server-fetched sessions used for the initial render (SSR / ISR). */
  initialSessions: FeaturedSession[];
}

/** Map API response shape → FeaturedSession props. */
function toFeaturedSession(s: LiveSessionSummary): FeaturedSession {
  return {
    _id: String(s._id),
    title: s.title,
    status: s.status,
    platform: s.platform,
    externalUrl: s.externalUrl ?? undefined,
    thumbnailUrl: s.thumbnailUrl ?? undefined,
    scheduledAt: s.scheduledAt ?? undefined,
    creator: s.creatorId ? { displayName: s.creatorId.displayName } : undefined,
  };
}

export default function LiveFeaturedSessions({ initialSessions }: Props) {
  const { data: liveSessions } = useLiveSessions({
    limit: 6,
    includeScheduled: true,
  });

  // Use polled data once available; fall back to SSR payload
  const sessions: FeaturedSession[] = liveSessions
    ? liveSessions.slice(0, 6).map(toFeaturedSession)
    : initialSessions;

  return <FeaturedLiveSessions sessions={sessions} />;
}
