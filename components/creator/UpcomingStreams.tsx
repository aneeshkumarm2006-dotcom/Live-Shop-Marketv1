'use client';

import React from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Platform, SessionStatus } from '@/types/liveSession';

/* ─────────────────────────────────────────────────────────────────────
   UpcomingStreams — DESIGN.md §7.4 / TODO §8.4
   Table with columns: Date · Time · Stream Title · Platforms · Actions
   Yellow-green "Remind Me" button per row.
   ───────────────────────────────────────────────────────────────────── */

const PLATFORM_META: Record<Platform, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: '/icons/instagram.svg' },
  tiktok: { label: 'TikTok', icon: '/icons/tiktok.svg' },
  youtube: { label: 'YouTube', icon: '/icons/youtube.svg' },
  facebook: { label: 'Facebook', icon: '/icons/facebook.svg' },
  other: { label: 'Other', icon: '' },
};

export interface UpcomingSession {
  _id: string;
  title: string;
  platform: Platform;
  status: SessionStatus;
  scheduledAt?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
}

export interface UpcomingStreamsProps {
  sessions: UpcomingSession[];
  isLoading?: boolean;
}

export default function UpcomingStreams({ sessions, isLoading = false }: UpcomingStreamsProps) {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-container px-3u py-6u">
        <h2 className="mb-3u text-section-heading text-deep-navy">Upcoming Streams</h2>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-4u rounded-card bg-neutral-gray/30 p-4u"
            >
              <div className="h-5 w-24 rounded bg-neutral-gray/60" />
              <div className="h-5 w-20 rounded bg-neutral-gray/60" />
              <div className="h-5 flex-1 rounded bg-neutral-gray/60" />
              <div className="h-9 w-28 rounded-button bg-neutral-gray/60" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (sessions.length === 0) {
    return (
      <section className="mx-auto max-w-container px-3u py-6u">
        <h2 className="mb-3u text-section-heading text-deep-navy">Upcoming Streams</h2>
        <div className="rounded-card border border-neutral-gray/40 bg-neutral-gray/10 p-8u text-center">
          <p className="text-body text-charcoal/50">No upcoming streams scheduled yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-container px-3u py-6u">
      <h2 className="mb-3u text-section-heading text-deep-navy">Upcoming Streams</h2>

      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-gray/40 text-left text-small font-semibold text-charcoal/60">
              <th className="pb-2u pr-4u">Date</th>
              <th className="pb-2u pr-4u">Time</th>
              <th className="pb-2u pr-4u">Stream Title</th>
              <th className="pb-2u pr-4u">Platform</th>
              <th className="pb-2u text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const date = session.scheduledAt ? new Date(session.scheduledAt) : null;
              const meta = PLATFORM_META[session.platform] ?? PLATFORM_META.other;

              return (
                <tr
                  key={session._id}
                  className="border-b border-neutral-gray/20 transition-colors hover:bg-neutral-gray/5"
                >
                  <td className="py-3u pr-4u text-body text-charcoal">
                    {date
                      ? new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(date)
                      : '—'}
                  </td>
                  <td className="py-3u pr-4u text-body text-charcoal">
                    {date
                      ? new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        }).format(date)
                      : '—'}
                  </td>
                  <td className="py-3u pr-4u text-body font-medium text-charcoal">
                    {session.title}
                  </td>
                  <td className="py-3u pr-4u">
                    <span className="inline-flex items-center gap-1.5 text-small text-charcoal/70">
                      {meta.icon && (
                        <Image
                          src={meta.icon}
                          alt={meta.label}
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                      )}
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-3u text-right">
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <Bell className="h-3.5 w-3.5" aria-hidden />
                      Remind Me
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card layout ── */}
      <div className="flex flex-col gap-3u md:hidden">
        {sessions.map((session) => {
          const date = session.scheduledAt ? new Date(session.scheduledAt) : null;
          const meta = PLATFORM_META[session.platform] ?? PLATFORM_META.other;

          return (
            <div
              key={session._id}
              className="rounded-card border border-neutral-gray/30 bg-white p-3u shadow-card"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-small font-semibold text-charcoal/60">
                  {date
                    ? new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }).format(date)
                    : 'TBD'}
                </span>
                <span className="inline-flex items-center gap-1 text-small text-charcoal/60">
                  {meta.icon && (
                    <Image
                      src={meta.icon}
                      alt={meta.label}
                      width={14}
                      height={14}
                      className="h-3.5 w-3.5"
                    />
                  )}
                  {meta.label}
                </span>
              </div>
              <p className="mb-2u text-card-title text-charcoal">{session.title}</p>
              <Button variant="primary" size="sm" fullWidth className="gap-1.5">
                <Bell className="h-3.5 w-3.5" aria-hidden />
                Remind Me
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
