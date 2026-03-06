'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/* ─── Variant × Size design tokens (DESIGN.md §5.5) ─── */

const variantStyles = {
  primary:
    'bg-neon-green text-deep-navy hover:brightness-90 focus-visible:ring-neon-green/50 rounded-button',
  secondary:
    'bg-white text-charcoal border border-neutral-gray hover:bg-neutral-50 focus-visible:ring-neutral-gray/50 rounded-button-secondary',
  ghost:
    'bg-transparent text-charcoal hover:bg-neutral-100 focus-visible:ring-neutral-gray/50 rounded-button-secondary',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/50 rounded-button',
} as const;

const sizeStyles = {
  sm: 'px-4 py-1.5 text-sm font-semibold',
  md: 'px-6 py-2.5 text-button-text',
  lg: 'px-8 py-3 text-button-text',
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  /** Render the button as a full‑width block element */
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className={[
          'inline-flex items-center justify-center gap-2 font-semibold',
          'transition-all duration-button select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
