'use client';

import React, { type HTMLAttributes } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────
   Badge component (DESIGN.md §5.3 / §8.2)
   Variants: live, scheduled, ended, category,
             platform (Instagram / TikTok / QVC …)
   ───────────────────────────────────────────────── */

const variantStyles: Record<string, string> = {
  // ── Status badges ──
  live: 'bg-live-indicator text-white shadow-live-glow',
  scheduled: 'bg-blue-500 text-white',
  ended: 'bg-neutral-gray text-charcoal',

  // ── Category badge ──
  category: 'bg-neon-green/20 text-deep-navy',

  // ── Platform badges (DESIGN.md §5.3) ──
  platform: 'bg-white text-charcoal border border-neutral-gray',
};

export type BadgeVariant = keyof typeof variantStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Platform icon element (e.g. an <Image /> of the logo) */
  icon?: React.ReactNode;
}

export default function Badge({
  variant = 'category',
  icon,
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const isLive = variant === 'live';

  const badgeClasses = [
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-none select-none whitespace-nowrap',
    variantStyles[variant] ?? variantStyles.category,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {isLive && <Play className="h-3 w-3 fill-current" aria-hidden />}
      {icon && !isLive && <span className="flex-shrink-0">{icon}</span>}
      {isLive ? 'LIVE' : children}
    </>
  );

  if (isLive) {
    return (
      <motion.span
        className={badgeClasses}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {content}
      </motion.span>
    );
  }

  return (
    <span className={badgeClasses} {...rest}>
      {content}
    </span>
  );
}
