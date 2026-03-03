'use client';

import React from 'react';
import { CalendarClock } from 'lucide-react';
import UpcomingSessionCard from '@/components/cards/UpcomingSessionCard';
import type { BuyerDashboardSession } from '@/hooks/useBuyerDashboard';
import type { Platform } from '@/types/liveSession';

/* ─────────────────────────────────────────────────────
   UpcomingFavoriteSessions — TODO §8.7 / PRD §6.1.8
   List of upcoming / live sessions from favorited creators.
   ───────────────────────────────────────────────────── */

export interface UpcomingFavoriteSessionsProps {
  sessions: BuyerDashboardSession[];
}

export default function UpcomingFavoriteSessions({ sessions }: UpcomingFavoriteSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card bg-white p-10 shadow-card text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-gray/30 mb-4">
          <CalendarClock className="h-8 w-8 text-charcoal/40" />
        </div>
        <h3 className="text-card-title font-semibold text-deep-navy mb-2">No upcoming sessions</h3>
        <p className="text-body text-charcoal/60 max-w-sm">
          When your favorite creators schedule live sessions, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  // Separate live and scheduled sessions
  const liveSessions = sessions.filter((s) => s.status === 'live');
  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled');

  return (
    <div className="flex flex-col gap-4">
      {/* Live now section */}
      {liveSessions.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-small font-semibold uppercase tracking-wider text-live-indicator">
            🔴 Live Now
          </h3>
          {liveSessions.map((session) => (
            <SessionRow key={session._id} session={session} />
          ))}
        </div>
      )}

      {/* Scheduled section */}
      {scheduledSessions.length > 0 && (
        <div className="flex flex-col gap-2">
          {liveSessions.length > 0 && (
            <h3 className="text-small font-semibold uppercase tracking-wider text-charcoal/60 mt-2">
              Coming Up
            </h3>
          )}
          {scheduledSessions.map((session) => (
            <SessionRow key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Individual session row with creator label ─────────────────────── */

function SessionRow({ session }: { session: BuyerDashboardSession }) {
  const creatorName = session.creatorId?.displayName ?? 'Unknown Creator';

  return (
    <div className="flex flex-col gap-1">
      {/* Creator attribution */}
      <p className="text-small text-charcoal/60 pl-1">
        by <span className="font-medium text-charcoal">{creatorName}</span>
      </p>
      <UpcomingSessionCard
        id={session._id}
        title={session.title}
        platform={session.platform as Platform}
        scheduledAt={session.scheduledAt ?? session.startedAt ?? session.createdAt}
        externalUrl={session.externalUrl}
      />
    </div>
  );
}
