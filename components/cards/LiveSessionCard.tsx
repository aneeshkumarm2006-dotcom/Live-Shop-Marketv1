'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import type { Platform, SessionStatus } from '@/types/liveSession';

/* ─────────────────────────────────────────────────────────────────────
   LiveSessionCard — DESIGN.md §5.3 / TODO §7.3
   Vertical card: thumbnail → LIVE badge → platform badge → title / brand.
   16:9 thumbnail, orange LIVE pill top-left, platform "Watch on" badges.
   ───────────────────────────────────────────────────────────────────── */

// ─── Platform display names & icon paths ────────────────────────────

const PLATFORM_META: Record<Platform, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: '/icons/instagram.svg' },
  tiktok: { label: 'TikTok', icon: '/icons/tiktok.svg' },
  youtube: { label: 'YouTube', icon: '/icons/youtube.svg' },
  facebook: { label: 'Facebook', icon: '/icons/facebook.svg' },
  other: { label: 'Watch', icon: '' },
};

// ─── Props ──────────────────────────────────────────────────────────

export interface LiveSessionCardProps {
  /** Session id for linking */
  id: string;
  title: string;
  /** Brand / creator display name */
  brandName?: string;
  /** Session status – drives the status badge */
  status: SessionStatus;
  /** Primary streaming platform */
  platform: Platform;
  /** External URL for the stream */
  externalUrl?: string;
  /** Thumbnail image URL (16:9) */
  thumbnailUrl?: string;
  /** ISO date string for scheduled sessions */
  scheduledAt?: string;
  className?: string;
}

export default function LiveSessionCard({
  id,
  title,
  brandName,
  status,
  platform,
  externalUrl,
  thumbnailUrl,
  scheduledAt,
  className = '',
}: LiveSessionCardProps) {
  const meta = PLATFORM_META[platform] ?? PLATFORM_META.other;

  const formattedDate = scheduledAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(scheduledAt))
    : null;

  return (
    <div
      className={[
        'group flex flex-col overflow-hidden rounded-card bg-white shadow-card',
        'transition-all duration-hover',
        'hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.02]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Thumbnail ── */}
      <Link
        href={`/sessions/${id}`}
        className="relative block aspect-video w-full overflow-hidden bg-neutral-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green"
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-hover group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-small text-charcoal/50">
            No thumbnail
          </div>
        )}

        {/* ── Status badge (top-left per DESIGN.md §5.3) ── */}
        <Badge variant={status} className="absolute left-2.5 top-2.5" />
      </Link>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-1.5 p-3u">
        {/* Title */}
        <Link
          href={`/sessions/${id}`}
          className="line-clamp-2 text-card-title text-charcoal hover:underline focus-visible:outline-none focus-visible:underline"
        >
          {title}
        </Link>

        {/* Brand name */}
        {brandName && <span className="text-small text-charcoal/60">{brandName}</span>}

        {/* Scheduled date */}
        {status === 'scheduled' && formattedDate && (
          <span className="text-small text-charcoal/50">{formattedDate}</span>
        )}

        {/* ── Platform badge ("Watch on …") ── */}
        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-button-secondary border border-neutral-gray bg-white px-3 py-1.5 text-small font-semibold text-charcoal transition-colors hover:bg-neutral-50"
          >
            {meta.icon && (
              <Image src={meta.icon} alt={meta.label} width={16} height={16} className="h-4 w-4" />
            )}
            Watch on {meta.label}
          </a>
        )}
      </div>
    </div>
  );
}
