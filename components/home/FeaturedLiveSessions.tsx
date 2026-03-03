import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LiveSessionCard } from '@/components/cards';
import type { Platform, SessionStatus } from '@/types';

/* ─────────────────────────────────────────────────────────────────────
   FeaturedLiveSessions — DESIGN.md §7.1 / §7.3
   Top featured live stream cards displayed prominently on the homepage.
   Shows currently live & upcoming sessions in a responsive grid.
   ───────────────────────────────────────────────────────────────────── */

export interface FeaturedSession {
  _id: string;
  title: string;
  status: SessionStatus;
  platform: Platform;
  externalUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: string;
  creator?: { displayName: string };
}

interface FeaturedLiveSessionsProps {
  sessions: FeaturedSession[];
}

export default function FeaturedLiveSessions({ sessions }: FeaturedLiveSessionsProps) {
  if (sessions.length === 0) return null;

  return (
    <section className="py-6u">
      <div className="mx-auto max-w-container px-3u">
        {/* ── Section header ── */}
        <div className="mb-4u flex items-center justify-between">
          <div>
            <h2 className="text-section-heading text-deep-navy">🔴 Live &amp; Upcoming</h2>
            <p className="mt-1 text-body text-charcoal/60">
              Streams happening now or starting soon
            </p>
          </div>
          <Link
            href="/categories?status=live"
            className="group hidden items-center gap-1 text-body font-medium text-charcoal/70 hover:text-deep-navy sm:inline-flex"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid gap-3u sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <LiveSessionCard
              key={s._id}
              id={s._id}
              title={s.title}
              brandName={s.creator?.displayName}
              status={s.status}
              platform={s.platform}
              externalUrl={s.externalUrl}
              thumbnailUrl={s.thumbnailUrl}
              scheduledAt={s.scheduledAt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
