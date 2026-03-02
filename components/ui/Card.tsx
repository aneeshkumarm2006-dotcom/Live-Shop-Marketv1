'use client';

import React, { type HTMLAttributes } from 'react';

/* ─────────────────────────────────────────────────────
   Card — generic wrapper (DESIGN.md §5.2 – §5.4)
   16 px border‑radius, subtle shadow, hover lift effect.
   ───────────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Disable the hover lift + shadow transition */
  disableHover?: boolean;
  /** Render with zero padding (useful for full‑bleed images) */
  noPadding?: boolean;
}

export default function Card({
  disableHover = false,
  noPadding = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'bg-white rounded-card shadow-card overflow-hidden',
        !disableHover &&
          'transition-all duration-hover hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.02]',
        !noPadding && 'p-3u',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
