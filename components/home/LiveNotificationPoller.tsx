'use client';

import React from 'react';
import LiveNotificationBanner from '@/components/home/LiveNotificationBanner';
import type { LiveNotificationBannerProps } from '@/components/home/LiveNotificationBanner';
import { useLatestLiveSession } from '@/hooks/useLiveSessions';

/* ─────────────────────────────────────────────────────────────────────
   LiveNotificationPoller — Client component with 30 s polling

   Receives an optional server-side initial notification (from ISR).
   On the client it polls for the latest live session and renders the
   notification banner when one is found.  If the creator ends their
   stream the banner disappears on the next poll cycle.
   ───────────────────────────────────────────────────────────────────── */

interface Props {
  /** Server-rendered live notification (may be null if nothing was live). */
  initialNotification: LiveNotificationBannerProps | null;
}

export default function LiveNotificationPoller({ initialNotification }: Props) {
  const { data: latestLive } = useLatestLiveSession();

  // Build notification from polled data, falling back to server data
  const notification: LiveNotificationBannerProps | null =
    latestLive !== undefined
      ? latestLive
        ? {
            brandName: latestLive.creatorId?.displayName ?? 'A creator',
            platform: latestLive.platform,
            externalUrl: latestLive.externalUrl ?? '',
            sessionId: String(latestLive._id),
          }
        : null // poll returned no live sessions → hide banner
      : initialNotification; // still loading → use server data

  if (!notification) return null;

  return <LiveNotificationBanner {...notification} />;
}
