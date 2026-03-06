'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Platform } from '@/types';

/* ─────────────────────────────────────────────────────────────────────
   LiveNotificationBanner — DESIGN.md §5.7 / §7.1
   Bright yellow-green gradient banner fixed at bottom of viewport.
   Shows when a creator is currently live, with platform "Watch on" links.
   ───────────────────────────────────────────────────────────────────── */

const PLATFORM_META: Record<Platform, { label: string; icon: string }> = {
  instagram: { label: 'Instagram', icon: '/icons/instagram.svg' },
  tiktok: { label: 'TikTok', icon: '/icons/tiktok.svg' },
  youtube: { label: 'YouTube', icon: '/icons/youtube.svg' },
  facebook: { label: 'Facebook', icon: '/icons/facebook.svg' },
  other: { label: 'Watch', icon: '' },
};

export interface LiveNotificationBannerProps {
  /** Creator / brand name */
  brandName: string;
  /** Platform the stream is on */
  platform: Platform;
  /** External URL to the stream */
  externalUrl: string;
  /** Session ID for detail link */
  sessionId?: string;
}

export default function LiveNotificationBanner({
  brandName,
  platform,
  externalUrl,
  sessionId,
}: LiveNotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const meta = PLATFORM_META[platform] ?? PLATFORM_META.other;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="mx-auto max-w-container">
            <div className="mx-3u mb-3u flex items-center gap-3u rounded-2xl bg-gradient-to-r from-neon-green via-[#E8FF5A] to-alert-notification px-4u py-3u shadow-xl">
              {/* Megaphone icon */}
              <Megaphone className="hidden h-8 w-8 shrink-0 text-deep-navy sm:block" />

              {/* Bell with shake animation */}
              <motion.div
                animate={{ rotate: [0, 8, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                className="shrink-0 sm:hidden"
              >
                <Bell className="h-5 w-5 text-deep-navy" />
              </motion.div>

              {/* Message */}
              <p className="flex-1 text-body font-semibold text-deep-navy">
                <span className="font-bold">{brandName}</span> is currently live.{' '}
                <span className="hidden sm:inline">Join their stream now!</span>
              </p>

              {/* Watch on platform button */}
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-button-secondary border border-deep-navy/20 bg-white px-4 py-2 text-small font-semibold text-deep-navy transition-colors hover:bg-deep-navy hover:text-white"
              >
                {meta.icon && (
                  <Image
                    src={meta.icon}
                    alt={meta.label}
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                )}
                Watch on {meta.label}
              </a>

              {/* View details (optional) */}
              {sessionId && (
                <Link
                  href={`/sessions/${sessionId}`}
                  className="hidden text-small font-medium text-deep-navy/70 underline hover:text-deep-navy md:inline"
                >
                  Details
                </Link>
              )}

              {/* Dismiss */}
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss notification"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-deep-navy/50 transition-colors hover:bg-deep-navy/10 hover:text-deep-navy"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
