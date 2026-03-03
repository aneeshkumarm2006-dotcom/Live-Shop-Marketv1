'use client';

import LiveNotificationBanner from '@/components/home/LiveNotificationBanner';
import type { LiveNotificationBannerProps } from '@/components/home/LiveNotificationBanner';

/* ─────────────────────────────────────────────────────────────────────
   HomeLiveNotification — thin client wrapper
   Receives serialisable props from the Server Component homepage and
   renders the interactive LiveNotificationBanner.
   ───────────────────────────────────────────────────────────────────── */

interface Props {
  notification: LiveNotificationBannerProps;
}

export default function HomeLiveNotification({ notification }: Props) {
  return <LiveNotificationBanner {...notification} />;
}
