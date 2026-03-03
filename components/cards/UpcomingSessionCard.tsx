'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { Platform } from '@/types/liveSession';

/* ─────────────────────────────────────────────────────────────────────
   UpcomingSessionCard — DESIGN.md §7.4 / TODO §7.3
   Table-row style card for a brand profile's upcoming streams list.
   Columns: Date · Time · Title · Platform · Actions (Remind Me).
   Also works as a standalone card on smaller screens.
   ───────────────────────────────────────────────────────────────────── */

// ─── Platform display ───────────────────────────────────────────────

const PLATFORM_META: Record<Platform, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: '/icons/instagram.svg' },
  tiktok: { label: 'TikTok', icon: '/icons/tiktok.svg' },
  youtube: { label: 'YouTube', icon: '/icons/youtube.svg' },
  facebook: { label: 'Facebook', icon: '/icons/facebook.svg' },
  other: { label: 'Other', icon: '' },
};

// ─── Props ──────────────────────────────────────────────────────────

export interface UpcomingSessionCardProps {
  /** Session ID */
  id: string;
  title: string;
  platform: Platform;
  /** ISO date string */
  scheduledAt: string;
  /** External stream URL */
  externalUrl?: string;
  /** Callback when "Remind Me" is clicked */
  onRemind?: (sessionId: string) => void;
  /** Whether the remind action is in flight */
  isRemindLoading?: boolean;
  /** Whether the user has already set a reminder */
  isReminded?: boolean;
  className?: string;
}

export default function UpcomingSessionCard({
  id,
  title,
  platform,
  scheduledAt,
  externalUrl,
  onRemind,
  isRemindLoading = false,
  isReminded = false,
  className = '',
}: UpcomingSessionCardProps) {
  const meta = PLATFORM_META[platform] ?? PLATFORM_META.other;
  const date = new Date(scheduledAt);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

  return (
    <div
      className={[
        'group grid grid-cols-1 items-center gap-3 rounded-card bg-white p-3u shadow-card',
        'transition-all duration-hover',
        'hover:shadow-card-hover hover:-translate-y-0.5',
        // Desktop: row layout
        'sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4u',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Date + Time ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3u">
        <span className="text-small font-semibold text-charcoal">{formattedDate}</span>
        <span className="text-small text-charcoal/60">{formattedTime}</span>
      </div>

      {/* ── Title ── */}
      <p className="text-card-title text-charcoal line-clamp-1 sm:min-w-0">{title}</p>

      {/* ── Platform badge ── */}
      <Badge
        variant="platform"
        icon={
          meta.icon ? (
            <Image
              src={meta.icon}
              alt={meta.label}
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          ) : undefined
        }
      >
        {meta.label}
      </Badge>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        {/* Remind Me */}
        <Button
          variant="primary"
          size="sm"
          disabled={isReminded || isRemindLoading}
          isLoading={isRemindLoading}
          onClick={() => onRemind?.(id)}
          aria-label={isReminded ? 'Reminder set' : `Remind me about ${title}`}
        >
          {isReminded ? 'Reminded ✓' : 'Remind Me'}
        </Button>

        {/* Watch link (visible when stream URL exists) */}
        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-button-secondary border border-neutral-gray bg-white px-4 py-1.5 text-sm font-semibold text-charcoal transition-colors hover:bg-neutral-50"
          >
            {meta.icon && (
              <Image
                src={meta.icon}
                alt={meta.label}
                width={14}
                height={14}
                className="h-3.5 w-3.5"
              />
            )}
            Watch
          </a>
        )}
      </div>
    </div>
  );
}
