'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

/* ─────────────────────────────────────────
   Spinner — accessible loading indicator
   ───────────────────────────────────────── */

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
} as const;

export type SpinnerSize = keyof typeof sizeStyles;

export interface SpinnerProps {
  size?: SpinnerSize;
  /** Visually‑hidden label for screen readers */
  label?: string;
  className?: string;
}

export default function Spinner({ size = 'md', label = 'Loading…', className = '' }: SpinnerProps) {
  return (
    <span role="status" className={`inline-flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-neon-green ${sizeStyles[size]}`} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
